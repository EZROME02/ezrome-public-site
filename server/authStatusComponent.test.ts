import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AuthStatusMessage } from "@/components/AuthStatusMessage";
import { classifyOAuthCallback, type OAuthStatus } from "@shared/oauthStatus";

function renderStatus(status: OAuthStatus) {
  return renderToStaticMarkup(
    createElement(AuthStatusMessage, { status, onRetry: vi.fn() })
  );
}

describe("rendered OAuth status states", () => {
  it.each([
    ["checking", "Checking your EZROME session…"],
    ["redirecting", "Opening secure sign-in…"],
    ["offline", "You appear to be offline. Reconnect and try again."],
    ["cancelled", "Sign-in was cancelled."],
    ["expired", "This sign-in session expired."],
    ["error", "EZROME could not complete sign-in."],
  ] as const)("renders %s with safe user-facing copy", (status, message) => {
    const markup = renderStatus(status);
    expect(markup).toContain(message);
    expect(markup).toContain('role="status"');
    if (["offline", "cancelled", "expired", "error"].includes(status)) {
      expect(markup).toContain("Try again");
    } else {
      expect(markup).not.toContain("Try again");
    }
  });

  it("renders the callback cancellation result as a retryable cancelled state", () => {
    const status = classifyOAuthCallback({ error: "access_denied" });
    const markup = renderStatus(status);
    expect(markup).toContain("Sign-in was cancelled");
    expect(markup).toContain("Try again");
  });

  it("does not render idle or authenticated status noise", () => {
    expect(
      renderToStaticMarkup(createElement(AuthStatusMessage, { status: "idle" }))
    ).toBe("");
    expect(
      renderToStaticMarkup(
        createElement(AuthStatusMessage, { status: "authenticated" })
      )
    ).toBe("");
  });
});
