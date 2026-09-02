import { describe, expect, it } from "vitest";
import {
  classifyOAuthCallback,
  classifyOAuthFailure,
  oauthStatusFromLocation,
  oauthStatusMessage,
} from "@shared/oauthStatus";

describe("OAuth status handling", () => {
  it("prioritizes offline state over provider errors", () => {
    expect(classifyOAuthFailure({ online: false, code: "UNAUTHORIZED" })).toBe(
      "offline"
    );
  });

  it("classifies expired and invalid state responses safely", () => {
    expect(classifyOAuthFailure({ online: true, code: "UNAUTHORIZED" })).toBe(
      "expired"
    );
    expect(
      classifyOAuthFailure({ online: true, code: "INVALID_OAUTH_STATE" })
    ).toBe("expired");
  });

  it("classifies provider cancellation without exposing provider details", () => {
    expect(
      classifyOAuthFailure({ online: true, reason: "access_denied" })
    ).toBe("cancelled");
    expect(oauthStatusMessage("cancelled")).toContain("Sign-in was cancelled");
  });

  it("falls back to a generic server message", () => {
    expect(
      classifyOAuthFailure({
        online: true,
        code: "INTERNAL_SERVER_ERROR",
        reason: "token_secret=do-not-show",
      })
    ).toBe("error");
    expect(oauthStatusMessage("error")).toBe(
      "EZROME could not complete sign-in. Please try again."
    );
  });

  it.each([
    ["cancelled", "Sign-in was cancelled."],
    ["expired", "This sign-in session expired."],
    ["error", "EZROME could not complete sign-in."],
  ] as const)(
    "maps callback query %s to rendered-safe status copy",
    (value, message) => {
      const status = oauthStatusFromLocation(`?oauth_error=${value}`);
      expect(status).toBe(value);
      expect(oauthStatusMessage(status!)).toContain(message);
    }
  );

  it("ignores unknown callback query values", () => {
    expect(oauthStatusFromLocation("?oauth_error=provider_token")).toBeNull();
  });

  it("maps the actual OAuth callback cancellation signal", () => {
    expect(classifyOAuthCallback({ error: "access_denied" })).toBe("cancelled");
    expect(
      classifyOAuthCallback({ description: "The user cancelled sign-in" })
    ).toBe("cancelled");
    expect(classifyOAuthCallback({ error: "server_error" })).toBe("error");
  });

  it("provides an accessible status message for redirecting", () => {
    expect(oauthStatusMessage("redirecting")).toBe("Opening secure sign-in…");
  });
});
