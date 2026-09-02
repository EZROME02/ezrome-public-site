import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("OAuth flow integration wiring", () => {
  it("returns provider failures through safe callback status codes", () => {
    const callback = read("server/_core/oauth.ts");
    expect(callback).toContain('getQueryParam(req, "error")');
    expect(callback).toContain('safeAuthRedirect(res, "expired")');
    expect(callback).toContain("classifyOAuthCallback");
    expect(callback).toContain('safeAuthRedirect(res, "error")');
    expect(callback).not.toContain("console.error(providerErrorDescription");
    expect(callback).toContain('safeAuthRedirect(res, "error")');
  });

  it("consumes the callback status and clears it from the URL", () => {
    const auth = read("client/src/_core/hooks/useAuth.ts");
    expect(auth).toContain("oauthStatusFromLocation(window.location.search)");
    expect(auth).toContain('delete("oauth_error")');
    expect(auth).toContain("setCallbackStatus(null)");
    expect(auth).toContain("retryLogin: beginLogin");
  });

  it("uses shared login status at every user-facing entry point", () => {
    const hub = read("client/src/components/HubShell.tsx");
    const dashboard = read("client/src/components/DashboardLayout.tsx");
    const pages = read("client/src/pages/HubPages.tsx");
    const offline = read("client/src/components/OfflineSaveControl.tsx");
    expect(hub).toContain("loginMessage");
    expect(dashboard).toContain("loginMessage");
    expect(pages).toContain("beginLogin");
    expect(offline).toContain("beginLogin");
    expect(dashboard).not.toContain("startLogin");
    expect(pages).not.toContain("startLogin");
    expect(offline).not.toContain("startLogin");
  });
});
