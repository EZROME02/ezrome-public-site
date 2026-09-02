// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthStatusMessage } from "@/components/AuthStatusMessage";
import { useAuth } from "@/_core/hooks/useAuth";

const startLogin = vi.fn();
const meQuery = {
  data: null,
  error: null,
  isLoading: false,
  refetch: vi.fn(),
};
const logoutMutation = {
  error: null,
  isPending: false,
  mutateAsync: vi.fn(),
};

vi.mock("@/const", () => ({
  startLogin: (...args: unknown[]) => startLogin(...args),
}));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({
      auth: {
        me: {
          setData: vi.fn(),
          invalidate: vi.fn(),
        },
      },
    }),
    auth: {
      me: { useQuery: () => meQuery },
      logout: { useMutation: () => logoutMutation },
    },
  },
}));

function AuthProbe({ children }: { children?: ReactNode }) {
  const auth = useAuth();
  return createElement(
    "main",
    null,
    children,
    createElement(AuthStatusMessage, {
      status: auth.loginStatus,
      onRetry: auth.retryLogin,
    })
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  window.history.replaceState({}, "", "/");
});

describe("mounted OAuth callback UI", () => {
  it.each([
    ["cancelled", "Sign-in was cancelled."],
    ["expired", "This sign-in session expired."],
    ["error", "EZROME could not complete sign-in."],
  ] as const)(
    "renders %s from the real callback query and exposes retry",
    async (value, message) => {
      window.history.replaceState({}, "", `/?oauth_error=${value}`);
      render(createElement(AuthProbe));

      await waitFor(() => {
        expect(screen.getByRole("status").textContent).toContain(message);
      });
      const retry = screen.getByRole("button", { name: "Try again" });
      fireEvent.click(retry);
      expect(startLogin).toHaveBeenCalledTimes(1);
      expect(window.location.search).toBe("");
    }
  );
});
