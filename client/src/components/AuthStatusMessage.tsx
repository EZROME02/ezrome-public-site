import React from "react";
import { oauthStatusMessage, type OAuthStatus } from "@shared/oauthStatus";

type AuthStatusMessageProps = {
  status: OAuthStatus;
  id?: string;
  onRetry?: () => void;
  className?: string;
};

const retryableStatuses = new Set<OAuthStatus>([
  "offline",
  "cancelled",
  "expired",
  "error",
]);

export function AuthStatusMessage({
  status,
  id,
  onRetry,
  className = "auth-status",
}: AuthStatusMessageProps) {
  const message = oauthStatusMessage(status);
  if (!message || status === "idle" || status === "authenticated") return null;

  return (
    <div
      id={id}
      className={className}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span>{message}</span>
      {onRetry && retryableStatuses.has(status) ? (
        <button type="button" onClick={onRetry} className="auth-retry">
          Try again
        </button>
      ) : null}
    </div>
  );
}
