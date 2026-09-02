export type OAuthStatus =
  | "idle"
  | "checking"
  | "redirecting"
  | "offline"
  | "cancelled"
  | "expired"
  | "error"
  | "authenticated";

export function oauthStatusFromLocation(search: string): OAuthStatus | null {
  const value = new URLSearchParams(search).get("oauth_error");
  if (value === "cancelled" || value === "expired" || value === "error")
    return value;
  return null;
}

export function classifyOAuthFailure(input: {
  online: boolean;
  code?: string | null;
  reason?: string | null;
}): Exclude<
  OAuthStatus,
  "idle" | "checking" | "redirecting" | "authenticated"
> {
  if (!input.online) return "offline";

  const code = input.code?.toUpperCase();
  const reason = input.reason?.toLowerCase();

  if (
    code === "UNAUTHORIZED" ||
    code === "INVALID_OAUTH_STATE" ||
    code === "EXPIRED"
  ) {
    return "expired";
  }

  if (
    reason === "access_denied" ||
    reason === "cancelled" ||
    reason === "canceled"
  ) {
    return "cancelled";
  }

  return "error";
}

export function classifyOAuthCallback(input: {
  error?: string | null;
  description?: string | null;
}): "cancelled" | "error" {
  const error = input.error?.toLowerCase();
  const description = input.description?.toLowerCase();
  if (
    error === "access_denied" ||
    error === "cancelled" ||
    error === "canceled" ||
    description?.includes("cancel")
  ) {
    return "cancelled";
  }
  return "error";
}

export function oauthStatusMessage(status: OAuthStatus): string | null {
  switch (status) {
    case "checking":
      return "Checking your EZROME session…";
    case "redirecting":
      return "Opening secure sign-in…";
    case "offline":
      return "You appear to be offline. Reconnect and try again.";
    case "cancelled":
      return "Sign-in was cancelled. You can try again whenever you’re ready.";
    case "expired":
      return "This sign-in session expired. Please try again.";
    case "error":
      return "EZROME could not complete sign-in. Please try again.";
    case "authenticated":
      return "Signed in successfully.";
    default:
      return null;
  }
}
