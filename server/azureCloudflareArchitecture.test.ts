import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");

function readProjectFile(relativePath: string) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

describe("Azure and Cloudflare deployment scaffolding", () => {
  it("keeps Azure SPA routing compatible with client-side EZROME routes", () => {
    const config = JSON.parse(
      readProjectFile("client/public/staticwebapp.config.json")
    );

    expect(config.navigationFallback.rewrite).toBe("/index.html");
    expect(config.navigationFallback.exclude).toContain("/api/*");
    expect(config.responseOverrides["404"].rewrite).toBe("/index.html");
  });

  it("includes CI and token-gated Azure frontend deployment workflows", () => {
    const ci = readProjectFile(".github/workflows/ci.yml");
    const deployment = readProjectFile(
      ".github/workflows/azure-static-web-apps.yml"
    );
    const apiDeployment = readProjectFile(
      ".github/workflows/azure-api-container-app.yml"
    );

    expect(ci).toContain("pnpm test");
    expect(ci).toContain("pnpm check");
    expect(ci).toContain("pnpm build");
    expect(deployment).toContain("pnpm build:frontend");
    expect(deployment).toContain("AZURE_STATIC_WEB_APPS_API_TOKEN");
    expect(deployment).toContain("skip_app_build: true");
    expect(apiDeployment).toContain("deploy/azure/api/Dockerfile");
    expect(apiDeployment).toContain("az acr login");
    expect(apiDeployment).toContain("az containerapp update");
    expect(apiDeployment).toContain("AZURE_CONTAINER_APP_NAME");
  });

  it("does not contain real secret values in deployment scaffolding", () => {
    const deploymentFiles = [
      readProjectFile("docs/ezrome-azure-cloudflare-architecture.md"),
      readProjectFile(".github/workflows/ci.yml"),
      readProjectFile(".github/workflows/azure-static-web-apps.yml"),
    ].join("\n");

    expect(deploymentFiles).not.toMatch(
      /(sk_live_|sk_test_|mysql:\/\/[^\s]+:[^\s]+@)/i
    );
  });

  it("exposes a dedicated frontend build command", () => {
    const packageJson = JSON.parse(readProjectFile("package.json"));
    expect(packageJson.scripts["build:frontend"]).toBe("vite build");
  });
});
