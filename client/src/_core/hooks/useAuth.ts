import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  classifyOAuthFailure,
  oauthStatusFromLocation,
  oauthStatusMessage,
  type OAuthStatus,
} from "@shared/oauthStatus";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo, useState } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

function readOAuthCallbackStatus(): OAuthStatus | null {
  if (typeof window === "undefined") return null;
  return oauthStatusFromLocation(window.location.search);
}

function readPendingLogin() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("ezrome.oauth.pending");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { startedAt?: unknown };
    return typeof parsed.startedAt === "number" ? parsed.startedAt : null;
  } catch {
    return null;
  }
}

function clearPendingLogin() {
  try {
    sessionStorage.removeItem("ezrome.oauth.pending");
  } catch {
    // Storage can be unavailable in restrictive browser modes.
  }
}

function savePendingLogin(returnPath: string) {
  try {
    sessionStorage.setItem(
      "ezrome.oauth.pending",
      JSON.stringify({ startedAt: Date.now(), returnPath })
    );
  } catch {
    // The OAuth cookie and server-side state remain the source of truth.
  }
}

export function useAuth(options?: UseAuthOptions) {
  // Login is started via beginLogin() in an event handler or effect, only when
  // we actually navigate. startLogin() mints a one-time nonce and writes the
  // state cookie, so it must never run during render.
  const { redirectOnUnauthenticated = false, redirectPath } = options ?? {};
  const utils = trpc.useUtils();
  const [loginStatus, setLoginStatus] = useState<OAuthStatus>("checking");
  const [callbackStatus, setCallbackStatus] = useState<OAuthStatus | null>(() =>
    readOAuthCallbackStatus()
  );

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  const beginLogin = useCallback(() => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setLoginStatus("offline");
      return;
    }

    if (typeof window === "undefined") return;
    savePendingLogin(window.location.pathname + window.location.search);
    setCallbackStatus(null);
    setLoginStatus("redirecting");
    startLogin();
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "UNAUTHORIZED"
      ) {
        return;
      }
      throw error;
    } finally {
      try {
        sessionStorage.removeItem("manus-cookie");
      } catch {
        // Storage can be unavailable in restrictive browser modes.
      }
      clearPendingLogin();
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
    }
  }, [logoutMutation, utils]);

  const state = useMemo(() => {
    try {
      localStorage.setItem(
        "manus-runtime-user-info",
        JSON.stringify(meQuery.data)
      );
    } catch {
      // A blocked storage surface must not prevent the app from rendering.
    }

    return {
      user: meQuery.data ?? null,
      loading: meQuery.isLoading || logoutMutation.isPending,
      error: meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: Boolean(meQuery.data),
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
  ]);

  useEffect(() => {
    if (typeof window === "undefined" || !callbackStatus) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("oauth_error");
    window.history.replaceState(
      {},
      "",
      `${url.pathname}${url.search}${url.hash}`
    );
  }, [callbackStatus]);

  useEffect(() => {
    const onOnline = () => {
      setLoginStatus(current => (current === "offline" ? "idle" : current));
    };
    const onOffline = () => setLoginStatus("offline");

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    if (meQuery.isLoading || logoutMutation.isPending) {
      setLoginStatus("checking");
      return;
    }

    if (state.user) {
      clearPendingLogin();
      setLoginStatus("authenticated");
      return;
    }

    if (meQuery.error) {
      const code =
        meQuery.error instanceof TRPCClientError
          ? String(meQuery.error.data?.code ?? "")
          : "";
      const pendingAge = readPendingLogin();
      const expired =
        pendingAge !== null && Date.now() - pendingAge > 10 * 60 * 1000;
      setLoginStatus(
        expired
          ? "expired"
          : classifyOAuthFailure({
              online: typeof navigator === "undefined" || navigator.onLine,
              code,
            })
      );
      return;
    }

    if (callbackStatus) {
      setLoginStatus(callbackStatus);
      return;
    }

    setLoginStatus("idle");
  }, [
    callbackStatus,
    logoutMutation.isPending,
    meQuery.error,
    meQuery.isLoading,
    state.user,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading || logoutMutation.isPending) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (redirectPath && window.location.pathname === redirectPath) return;

    if (redirectPath) {
      setLoginStatus("redirecting");
      window.location.href = redirectPath;
    } else {
      beginLogin();
    }
  }, [
    beginLogin,
    redirectOnUnauthenticated,
    redirectPath,
    logoutMutation.isPending,
    meQuery.isLoading,
    state.user,
    callbackStatus,
  ]);

  return {
    ...state,
    loginStatus,
    loginMessage: oauthStatusMessage(loginStatus),
    beginLogin,
    retryLogin: beginLogin,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
