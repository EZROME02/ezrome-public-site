import { describe, expect, it } from "vitest";
import { assertOfflineEligible } from "./offlinePolicy";

describe("assertOfflineEligible", () => {
  it("allows an authenticated user to save published public media", () => {
    expect(assertOfflineEligible({ authenticated: true, downloadable: 1, status: "published", visibility: "public" })).toBe(true);
  });

  it("rejects private or creator-disabled media", () => {
    expect(() => assertOfflineEligible({ authenticated: true, downloadable: 0, status: "published", visibility: "public" })).toThrow("not available");
    expect(() => assertOfflineEligible({ authenticated: true, downloadable: 1, status: "processing", visibility: "public" })).toThrow("not available");
    expect(() => assertOfflineEligible({ authenticated: true, downloadable: 1, status: "published", visibility: "unlisted" })).toThrow("not available");
  });

  it("requires authentication", () => {
    expect(() => assertOfflineEligible({ authenticated: false, downloadable: 1, status: "published", visibility: "public" })).toThrow("Sign in");
  });
});
