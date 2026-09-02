# EZROME Social & Media Hub

EZROME is a viewing-first social and media platform built around culture, short-form video, football intelligence, community conversation, creator work, and practical AI assistance. The product uses a distinctive **navy, cyan, and electric-violet “Signal Commons” visual language** rather than copying YouTube or TikTok directly.

The repository contains the public EZROME web application, its authenticated full-stack foundation, offline-aware viewing experience, Capacitor Android packaging path, educational Build Lab, cloud deployment scaffolding, policy resources, and release handoff documentation.

> **Current release status:** EZROME is in release-candidate preparation. The web application and Android packaging path are implemented, but legal publication, signing credentials, Play Console submission, closed testing, live billing configuration, and production cloud resource activation remain owner-controlled launch gates.

## Product lanes

| Lane          | Purpose                               | Current experience                                                                                                                                                    |
| ------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Watch**     | Long-form and curated video discovery | Viewing-first cards, creator/source context, sharing, reporting, and watch actions                                                                                    |
| **Shorts**    | Vertical short-form viewing           | Scroll-snap feed, muted autoplay, intersection-based playback, mute controls, share, report, watch later, and rights-controlled offline saving                        |
| **Football**  | Football intelligence and opinion     | A dedicated lane for analysis, news context, and creator-led football discussion                                                                                      |
| **Community** | Conversation and participation        | Posts, comments, reactions, polls, reporting, and moderation-oriented states                                                                                          |
| **Explore**   | Cross-platform discovery              | Search, category filters, content cards, and watch-later controls                                                                                                     |
| **Library**   | Personal viewing queue                | Device-local Watch Later and limited offline-aware playback states                                                                                                    |
| **Build Lab** | Technical learning                    | Operating systems, GUIs, application programs, language systems, translators, data representation, Azure fundamentals, IaaS/PaaS/SaaS, SDLC, and Principles of Coding |
| **EZROME AI** | Assisted creation and understanding   | Product surface reserved for source-aware assistance, summaries, ideation, and creator workflows                                                                      |

EZROME is designed for a **human-in-the-loop** operating model. Automated or agent-assisted workflows may research, score, summarize, or prepare material, but publishing, policy-sensitive actions, and platform-level decisions require appropriate approval and rights checks.

## Core capabilities

### Authentication and accounts

EZROME uses the project’s Manus OAuth integration for sign-in and server-managed sessions. The authentication flow includes explicit checking, secure redirecting, offline, cancellation, expiry, and generic server-error states. User-facing entry points share accessible status messaging and duplicate-click-safe retry behavior. The OAuth callback is handled at `/api/oauth/callback` and returns safe status codes to the application without exposing provider secrets.

### Video, creator, and community foundation

The full-stack foundation includes user accounts, creator-facing surfaces, channel identity, database-backed application data, managed media-storage helpers, report states, moderation-oriented controls, creator download permissions, and account-deletion flow scaffolding. Rights-sensitive actions are deliberately represented as states rather than assumed permissions.

### Offline-aware viewing

Offline behavior is intentionally limited. A user can save eligible content to a device-local Watch Later/offline library when the creator and storage policy permit it. The application does not imply that every internet video is downloadable, and it does not bypass source rights, creator controls, authentication, or server-signed access boundaries. Online-only actions such as publishing, social mutations, fresh discovery, and server-backed account operations remain unavailable or restricted when connectivity is absent.

### Premium and monetization boundaries

The interface separates digital EZROME functionality from off-platform goods and services. The current product includes non-charging premium tier selection and entitlement-state UX, but a production Android release still requires the owner to configure the final Google Play billing catalog, products, prices, regions, trials, and entitlement verification. Stripe is not required for the free-first Android V1 path and should not be used to bypass Google Play Billing for digital functionality distributed through Google Play.

## Technical architecture

EZROME is a full-stack TypeScript application with a React frontend, an Express server, tRPC contracts, Drizzle ORM, MySQL-compatible persistence, S3-compatible managed storage, and a Capacitor Android wrapper.

```text
Browser / Capacitor Android shell
              │
              ▼
        React 19 + Vite
              │
              ▼
        tRPC client (/api/trpc)
              │
              ▼
     Express 4 + tRPC 11 server
              │
        ┌─────┴─────────┐
        ▼               ▼
   Drizzle ORM      S3 storage helpers
        │
        ▼
   MySQL / TiDB database

OAuth callback: /api/oauth/callback
Android package: com.ezrome.app
```

### Main technologies

| Area                   | Technology                                                                                               |
| ---------------------- | -------------------------------------------------------------------------------------------------------- |
| Frontend               | React 19, Vite 7, TypeScript, Tailwind CSS 4                                                             |
| UI system              | shadcn-style components, Radix UI primitives, Lucide icons                                               |
| Routing                | Wouter                                                                                                   |
| Server                 | Express 4, tRPC 11, SuperJSON                                                                            |
| Data layer             | Drizzle ORM, MySQL-compatible database, generated SQL migrations                                         |
| Storage                | S3-compatible storage helpers and signed-access boundaries                                               |
| Authentication         | Manus OAuth and server-managed session context                                                           |
| Mobile                 | Capacitor Android, application ID `com.ezrome.app`                                                       |
| Testing                | Vitest, React Testing Library, jsdom for mounted auth behavior                                           |
| Build                  | Vite frontend build and esbuild server bundle                                                            |
| Deployment scaffolding | GitHub Actions, Azure Static Web Apps, Azure Container Apps, Cloudflare edge/email-routing documentation |

## Repository layout

```text
client/
  public/                 Small root-served configuration assets only
  src/
    _core/                Frontend framework and auth hooks
    components/           Reusable UI and layout components
    components/ui/        Radix/shadcn-style primitives
    contexts/             React contexts such as theme state
    hooks/                Shared browser hooks
    lib/                  tRPC client and frontend utilities
    pages/                Page-level EZROME experiences
    App.tsx               Route and application-shell wiring
    index.css             Global tokens, theme, and hub styling

server/
  _core/                  Framework plumbing, OAuth, context, and server startup
  db.ts                   Database helpers
  routers.ts              tRPC procedures and backend contracts
  storage.ts              Managed storage integration
  *.test.ts               Vitest contract and behavior coverage

drizzle/
  schema.ts               Database schema
  relations.ts            Drizzle relations
  *.sql                   Generated migration files

shared/
  *.ts                    Shared types, constants, OAuth status, and policy logic

docs/
  *.md                    Android, Azure, Cloudflare, policy, release, and Wikipedia handoffs

android/
  Capacitor Android project generated from the web build

.github/workflows/
  Deployment-safe GitHub Actions scaffolding without committed secrets

capacitor.config.ts       Android wrapper configuration
vite.config.ts            Vite configuration
vitest.config.ts          Vitest configuration
package.json              Scripts and dependencies
pnpm-lock.yaml            Reproducible dependency lockfile
todo.md                   Project implementation and launch checklist
```

Large media assets must not be committed to `client/public` or `client/src/assets`. Use the project’s managed storage workflow for runtime media and keep static deployment assets small.

## Prerequisites

Install the following before running EZROME locally:

| Requirement                                                   | Purpose                                                 |
| ------------------------------------------------------------- | ------------------------------------------------------- |
| Node.js 22 or a compatible current LTS release                | JavaScript and TypeScript runtime                       |
| pnpm 10                                                       | Dependency installation and project scripts             |
| Git                                                           | Repository management                                   |
| MySQL/TiDB-compatible database                                | Local server persistence when backend data is exercised |
| Android Studio and Android SDK                                | Required only for Capacitor Android builds              |
| Java/JDK compatible with the installed Android Gradle tooling | Required only for Android builds                        |

The repository uses `pnpm-lock.yaml`; use pnpm rather than mixing package managers.

## Local setup

### 1. Clone the repository

```bash
git clone https://github.com/EZROME02/ezrome-public-site.git
cd ezrome-public-site
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Do not commit `.env` files, OAuth secrets, database credentials, S3 credentials, signing keys, or Play Console service-account files. The managed project injects the required environment values through its deployment settings. For a local environment, create a private `.env` file using the names expected by `server/_core/env.ts` and the project’s deployment handoffs.

The main categories are:

| Category       | Examples of required values                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------- |
| Database       | `DATABASE_URL`                                                                                                   |
| Authentication | `JWT_SECRET`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`                                         |
| Owner metadata | `OWNER_OPEN_ID`, `OWNER_NAME`                                                                                    |
| Built-in APIs  | `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY` |
| Storage        | The managed storage configuration used by the server storage helpers                                             |
| Optional email | `EZROME_EMAIL_PROVIDER` and provider-specific configuration when activated                                       |

Use the project’s secret-management interface for development and production values where available. Never paste secrets into source files or commit them to GitHub.

### 4. Start the development server

```bash
pnpm dev
```

The development server starts the TypeScript server with Vite integration. Open the URL printed in the terminal. The managed preview normally uses port `3000`, but application code must not hardcode a deployment port.

### 5. Run the production build locally

```bash
pnpm build
pnpm start
```

The build creates the frontend output under `dist/public` and bundles the server into `dist/index.js`. The production process is started with `pnpm start`.

## Common commands

| Command                  | Purpose                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| `pnpm dev`               | Run the development server with TypeScript watch mode                                            |
| `pnpm test`              | Run the complete Vitest suite                                                                    |
| `pnpm check`             | Run TypeScript without emitting files                                                            |
| `pnpm build`             | Build the frontend and server bundle                                                             |
| `pnpm build:frontend`    | Build only the frontend                                                                          |
| `pnpm format`            | Format repository files with Prettier                                                            |
| `pnpm cap:sync`          | Build the frontend and synchronize Capacitor Android assets                                      |
| `pnpm cap:open:android`  | Open the Android project in Android Studio                                                       |
| `pnpm cap:build:android` | Build the Android project through Capacitor                                                      |
| `pnpm db:push`           | Generate and apply database migrations; use cautiously and follow the project migration workflow |

For a normal change, run at least:

```bash
pnpm test
pnpm check
pnpm build
pnpm exec prettier --check .
git diff --check
```

## Testing strategy

The repository uses Vitest for backend contracts, policy logic, packaging checks, offline safeguards, OAuth behavior, video validation, and viewing-first behavior. The authentication flow also has jsdom-mounted tests that render `DashboardLayout` and the real `useAuth` hook behavior for callback query states.

The release-candidate baseline has been verified with **16 test files and 59 passing tests**, plus TypeScript, production build, formatting, and Git diff checks. A successful local run should report the same broad categories, although test counts may increase as the project evolves.

When adding a feature, add or update a focused test before delivery. For database-backed work, keep the Drizzle schema, generated SQL, deployed database, helper functions, tRPC procedure, and UI contract synchronized.

## Authentication flow

The supported flow is:

1. The user selects a sign-in entry point.
2. `useAuth()` checks connectivity and prevents duplicate login attempts.
3. A pending login marker is written to session storage without storing credentials.
4. The OAuth provider handles authentication and returns to `/api/oauth/callback`.
5. The server classifies provider failures into safe states such as cancelled, expired, or generic error.
6. The frontend renders accessible status messaging and offers retry only for retryable states.
7. The callback query is cleared from the browser URL after it is consumed.

Do not manipulate session cookies directly in frontend code. Use `useAuth()`, the tRPC auth procedures, and the server context. Do not call login during render; initiate it from an event handler or controlled effect.

## Database and storage development

Database changes follow a schema-first workflow:

1. Update `drizzle/schema.ts` and relations when necessary.
2. Generate migration SQL with Drizzle Kit.
3. Review the generated SQL carefully.
4. Apply migrations through the managed database workflow.
5. Add raw-result helpers in `server/db.ts`.
6. Add typed tRPC procedures in `server/routers.ts`.
7. Connect the UI through `trpc.*.useQuery()` or `trpc.*.useMutation()`.
8. Add Vitest coverage for success, empty, permission, and failure states.

Avoid destructive SQL unless the migration has been reviewed and the data impact is understood. Use S3-compatible managed storage for file bytes and keep authorization/metadata in the database when needed. Creator download permissions and signed offline access must remain enforced server-side.

## Android packaging

The Capacitor Android wrapper is configured with:

```text
Application ID: com.ezrome.app
App name: EZROME
Web output: dist/public
Android scheme: HTTPS
```

A local packaging cycle is:

```bash
pnpm cap:sync
pnpm cap:open:android
```

From Android Studio, verify the application ID, app label, launcher icon, network behavior, OAuth return path, and release build configuration. For a signed Android App Bundle, create or use your own signing keystore, keep the keystore credentials outside the repository, configure a release signing variant, build the `.aab`, and upload it to a Play Console closed-testing track.

Never send the private signing key, keystore password, Play Console service-account JSON, or OAuth secrets through chat. The detailed owner handoff is in [`docs/ezrome-capacitor-android-handoff.md`](docs/ezrome-capacitor-android-handoff.md).

## Deployment scaffolding

The repository includes deployment-safe scaffolding for an Azure and Cloudflare architecture:

```text
Cloudflare DNS and edge
          │
          ▼
Azure Static Web Apps ─── React/Vite frontend
          │
          ▼
Azure Container Apps or planned API target ─── Express/tRPC backend
          │
          ├── MySQL/TiDB-compatible database
          ├── S3-compatible managed storage
          └── Monitoring and operational controls
```

GitHub Actions workflows are designed to consume repository secrets rather than commit credentials. The deployment files are scaffolding and handoff material; they do not prove that live Azure resources, Cloudflare DNS, email routing, databases, monitoring, or production billing have been activated.

Deployment may be affected by account or regional quota limits. If a cloud deployment reports a service quota failure, review the target region, existing service count, subscription quota, and the project’s owner runbook before retrying. Do not create duplicate infrastructure blindly.

Relevant documentation includes:

- [`docs/ezrome-azure-cloudflare-runbook.md`](docs/ezrome-azure-cloudflare-runbook.md)
- [`docs/ezrome-azure-cloudflare-architecture.md`](docs/ezrome-azure-cloudflare-architecture.md)
- [`docs/ezrome-capacitor-android-handoff.md`](docs/ezrome-capacitor-android-handoff.md)
- [`docs/wikipedia-publication-handoff.md`](docs/wikipedia-publication-handoff.md)

## Security and content-safety boundaries

EZROME must not expose secrets, private repository content, personal data, signing credentials, or unsupported product claims. User-generated video, comments, reports, and community content require moderation, rights, and account-governance controls. Do not fabricate reviews, ratings, testimonials, or social proof.

The project’s working policies cover privacy, terms, community guidelines, copyright/reporting, account deletion, and support. These documents remain working drafts until the owner completes final legal review and publishes the real public URLs. The intended platform addresses are `support@ezrome.co.za` and `copyright@ezrome.co.za`, subject to Cloudflare/email-routing activation.

## Release checklist

The repository is release-candidate ready from a code and packaging-handoff perspective. The following owner-controlled items must be completed before representing EZROME as a finished Google Play release:

| Gate             | Owner action                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Legal resources  | Publish final privacy policy, terms, community guidelines, copyright/reporting policy, and account-deletion resource                                    |
| Contact channels | Activate Cloudflare Email Routing or another provider for support and copyright/reporting inboxes                                                       |
| Android identity | Confirm `com.ezrome.app`, app name, icons, signing ownership, and Play Console account                                                                  |
| Signed build     | Build and protect the production keystore; generate the signed Android App Bundle                                                                       |
| Play Console     | Complete store listing, data safety, content declarations, app access, target audience, and closed testing                                              |
| Billing          | Configure digital products, prices, regions, trials, and entitlement verification if premium features launch in V1                                      |
| Testing          | Add owner-controlled closed-test users and real Android devices; verify OAuth, offline states, media playback, reporting, deletion, and update behavior |
| Cloud services   | Activate and smoke-test the chosen Azure, database, storage, monitoring, Cloudflare DNS, and email-routing resources                                    |

## GitHub workflow

The canonical public repository is [EZROME02/ezrome-public-site](https://github.com/EZROME02/ezrome-public-site). Use feature branches for substantial changes, keep secrets out of commits, run the verification commands locally, and open a pull request or otherwise review the diff before merging into `main`.

A safe local workflow is:

```bash
git checkout -b feature/short-description
# make changes
pnpm test
pnpm check
pnpm build
pnpm exec prettier --check .
git diff --check
git status --short
git add <reviewed-files>
git commit -m "Describe the change"
git push -u origin feature/short-description
```

## Contribution and ownership

EZROME is founder-controlled product work. Public repository visibility does not transfer ownership of the project, brand, code, original assets, or domain. Keep third-party assets licensed, document provenance, and preserve copyright/reporting paths. Contributions should be reviewed for security, rights, accessibility, privacy, and Google Play compatibility before release.

Wikipedia publication is a separate editorial process. A public GitHub repository alone does not establish Wikipedia notability. Any future article must be based on substantial independent reliable coverage, written neutrally, disclose the owner’s conflict of interest, and be submitted for human review rather than automatically self-published.

## License and third-party notices

No project license should be assumed unless one is explicitly added to the repository. Review the dependency licenses and asset rights before distributing the web or Android application. Add a project license and third-party notices when the owner has made the corresponding legal decision.

## Support and project resources

- Public repository: <https://github.com/EZROME02/ezrome-public-site>
- Public web deployment: <https://ezromepub-f3hzkejz.manus.space>
- General support: `support@ezrome.co.za` once email routing is active
- Copyright and reporting: `copyright@ezrome.co.za` once email routing is active
- Project checklist: [`todo.md`](todo.md)
- Architecture and launch handoffs: [`docs/`](docs/)
