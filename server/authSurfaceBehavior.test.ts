// @vitest-environment jsdom
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("mounted protected auth surfaces", () => {
  it.each([
    ["checking", "Checking your EZROME session…", false],
    ["redirecting", "Opening secure sign-in…", false],
    ["offline", "You appear to be offline. Reconnect and try again.", true],
    ["cancelled", "Sign-in was cancelled.", true],
    ["expired", "This sign-in session expired.", true],
    ["error", "EZROME could not complete sign-in.", true],
  ] as const)(
    "renders %s in DashboardLayout with the correct retry affordance",
    (loginStatus, message, canRetry) => {
      const beginLogin = vi.fn();
      mockedUseAuth.mockReturnValue({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        loginStatus,
        loginMessage: message,
        beginLogin,
        retryLogin: beginLogin,
        refresh: vi.fn(),
        logout: vi.fn(),
      });

      render(
        createElement(
          DashboardLayout,
          null,
          createElement("div", null, "protected content")
        )
      );

      expect(screen.getByRole("status").textContent).toContain(message);
      const retry = screen.queryByRole("button", { name: "Try again" });
      expect(Boolean(retry)).toBe(canRetry);
      if (retry) fireEvent.click(retry);
      expect(beginLogin).toHaveBeenCalledTimes(canRetry ? 1 : 0);
    }
  );
});
