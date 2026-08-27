# EZROME Azure–Cloudflare Architecture

## Purpose

This document defines the recommended production architecture for EZROME. It separates the public edge layer from the application and data layers so the project can use Cloudflare for domain security and routing while Azure runs the application workloads.

The current EZROME release candidate remains hosted in the managed Manus environment. This document is an implementation blueprint for a future Azure deployment and does not claim that Azure resources, DNS records, or production database migrations have already been completed.

## Target architecture

```text
                                   INTERNET
                                       │
                                       ▼
                              ezrome.co.za
                                       │
                                       ▼
                         CLOUDFLARE EDGE NETWORK
              DNS • TLS • CDN • WAF • DDoS protection
                   Email Routing • rate limits • redirects
                                       │
                                       ▼
                         AZURE EZROME SUBSCRIPTION
                                       │
                                       ▼
                         EZROME RESOURCE GROUP
                                       │
                 ┌─────────────────────┼─────────────────────┐
                 │                     │                     │
                 ▼                     ▼                     ▼
       Azure Static Web Apps   Azure Container Apps     Azure Database
          React / Vite UI       Express / tRPC API       for MySQL
          Portfolio + Hub        OAuth + moderation      Drizzle schema
                 │                     │                     │
                 └─────────────────────┼─────────────────────┘
                                       │
                                       ▼
                             Azure Blob Storage
                         videos • thumbnails • media
                                       │
                                       ▼
                              Azure Monitor / App Insights
                                       ▲
                                       │
                 GitHub Actions ──────┴──────► Azure deployments
```

## Service ownership

| Layer                  | Recommended service                    | EZROME responsibility                                                                                                   |
| ---------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Domain and edge        | Cloudflare                             | Authoritative DNS, TLS, caching, WAF, DDoS controls, rate limits, and redirects                                         |
| Email aliases          | Cloudflare Email Routing               | Route `support@ezrome.co.za` and `copyright@ezrome.co.za` to a monitored inbox                                          |
| Frontend               | Azure Static Web Apps                  | Serve the React/Vite build and public routes                                                                            |
| API                    | Azure Container Apps                   | Run the existing Express/tRPC server with authentication, moderation, newsroom, creator, and entitlement procedures     |
| Serverless alternative | Azure Functions                        | Use only after an intentional API refactor into HTTP-triggered functions                                                |
| Database               | Azure Database for MySQL               | Maintain the Drizzle/MySQL source of truth for users, media metadata, reports, entitlements, and deletion requests      |
| Media                  | Azure Blob Storage                     | Store videos and thumbnails separately from the relational database; use signed access and creator download permissions |
| Monitoring             | Azure Monitor and Application Insights | Observe API errors, latency, availability, and deployment health                                                        |
| Source and CI/CD       | Private GitHub and GitHub Actions      | Run checks and deploy approved builds without storing secrets in the repository                                         |

## Why the API should not be moved to Functions immediately

The current application uses a full Express server with tRPC, authentication middleware, database helpers, and storage operations. Azure Static Web Apps can integrate with HTTP-triggered Azure Functions, but converting the existing server into functions is a separate architectural change. Azure Container Apps preserves the current server boundary and reduces migration risk. Functions may be evaluated later for isolated jobs or deliberately redesigned endpoints.

## Cloudflare configuration boundary

Cloudflare should remain the public front door. The first configuration should contain the following logical records, with actual targets filled in only after the Azure resources exist:

| Record      | Purpose                           | Initial state                                                         |
| ----------- | --------------------------------- | --------------------------------------------------------------------- |
| `@`         | Root domain for EZROME            | Point to the approved Azure frontend origin during cutover            |
| `www`       | Canonical web alias               | Redirect to the selected canonical domain                             |
| `api`       | Optional separate API hostname    | Point to the approved Azure API origin if a separate hostname is used |
| MX records  | Email Routing                     | Created by Cloudflare Email Routing after destination verification    |
| TXT records | SPF/DKIM/verification as required | Add only from the active email and Azure providers                    |

Do not proxy large media uploads through the application API when direct signed object-storage transfers are available. The API should authorize the transfer; the client should upload or download from object storage using short-lived, rights-controlled URLs.

## Required secret names

Secrets belong in Azure application settings, GitHub Actions secrets, or the managed secret store. They must never be committed to GitHub, included in client-side JavaScript, or placed in documentation with real values.

| Secret or setting                 | Used by        | Notes                                                              |
| --------------------------------- | -------------- | ------------------------------------------------------------------ |
| `DATABASE_URL`                    | API            | Azure Database for MySQL connection string with TLS enabled        |
| `JWT_SECRET`                      | API            | Session signing secret; generate and store outside Git             |
| `OAUTH_SERVER_URL`                | API            | Manus OAuth server endpoint if Manus authentication remains active |
| `VITE_APP_ID`                     | Frontend/API   | OAuth application identifier where required                        |
| `BUILT_IN_FORGE_API_URL`          | API            | Managed AI/storage integrations where retained                     |
| `BUILT_IN_FORGE_API_KEY`          | API            | Server-side only; never expose to the browser                      |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | GitHub Actions | Deployment token stored as a GitHub Actions secret                 |
| `AZURE_CLIENT_ID`                 | GitHub Actions | Federated identity or service-principal identifier if used         |
| `AZURE_TENANT_ID`                 | GitHub Actions | Azure tenant identifier if used                                    |
| `AZURE_SUBSCRIPTION_ID`           | GitHub Actions | Azure subscription identifier if used                              |
| `AZURE_RESOURCE_GROUP`            | GitHub Actions | Resource group containing the API Container App                    |
| `AZURE_CONTAINER_APP_NAME`        | GitHub Actions | Azure Container App resource name                                  |
| `AZURE_CONTAINER_REGISTRY`        | GitHub Actions | Azure Container Registry name without `.azurecr.io`                |

## API deployment scaffolding

The repository includes `deploy/azure/api/Dockerfile`, which builds the current full-stack application and starts `dist/index.js` with `NODE_ENV=production`. The workflow `.github/workflows/azure-api-container-app.yml` builds and pushes an image to Azure Container Registry, then updates the selected Azure Container App. The workflow is deliberately token-gated: it skips deployment until the owner configures the required GitHub Actions secrets and creates the Azure resources.

The API Container App must be configured with the runtime secrets listed above, including `DATABASE_URL`, `JWT_SECRET`, OAuth settings, storage settings, and any retained managed-AI integration settings. The workflow does not write secrets to the repository and does not create the database, resource group, registry, or Container App automatically.

## Migration sequence

1. Create the Azure resource group and record its region, tags, owner, and environment name.
2. Create the Static Web App, API hosting service, database, storage account, and monitoring resources in a non-production or staging environment first.
3. Configure application settings and secrets through Azure or GitHub secret management. Do not copy the managed project’s hidden environment values into source control.
4. Deploy the frontend and API from the private GitHub repository.
5. Test OAuth, account deletion, reporting, moderation, creator uploads, signed downloads, offline-library states, newsroom approval, and entitlement behavior on the Azure staging hostname.
6. Back up or export the current database according to the chosen migration procedure before any production data move. Do not run destructive schema operations against production without a reviewed backup and migration plan.
7. Verify Cloudflare DNS, TLS, email routing, WAF, rate limits, and origin health while the public domain still points to the existing deployment.
8. Change the Cloudflare web record to the Azure staging-approved origin during a controlled production cutover.
9. Monitor the cutover and retain the current Manus deployment as the rollback reference until Azure has passed the agreed observation period.

## Owner-controlled gates

The following actions require the EZROME owner to use the Azure and Cloudflare dashboards or provide an authorized connector. They are intentionally not performed by this repository change:

| Gate                 | Owner action                                                            |
| -------------------- | ----------------------------------------------------------------------- |
| Azure ownership      | Confirm the Azure subscription and billing owner                        |
| Cloudflare ownership | Confirm `ezrome.co.za` is active in the correct Cloudflare account      |
| DNS cutover          | Approve the exact origin targets and TTLs before changing records       |
| Email routing        | Verify the destination inbox and activate the support/copyright aliases |
| Database migration   | Approve backup, migration, and rollback procedures                      |
| Android release      | Configure Play Console, package identity, signing, and closed testing   |

## References

[1]: https://learn.microsoft.com/en-us/azure/static-web-apps/overview Microsoft Learn, “What is Azure Static Web Apps?”

[2]: https://learn.microsoft.com/en-us/azure/static-web-apps/add-api Microsoft Learn, “Add an API to Azure Static Web Apps with Azure Functions”

[3]: https://developers.cloudflare.com/rules/origin-rules/ Cloudflare Developers, “Origin Rules”

[4]: https://www.cloudflare.com/products/email-routing/ Cloudflare, “Email Routing”
