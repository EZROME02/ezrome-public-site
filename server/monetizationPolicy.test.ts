import { describe, expect, it } from "vitest";
import { DIGITAL_EZROME_PRODUCTS, NON_DIGITAL_EZROME_OFFERINGS, isDigitalEzromeProduct } from "@shared/monetization";

describe("EZROME monetization policy", () => {
  it("classifies all in-app digital products for Google Play Billing", () => {
    expect(DIGITAL_EZROME_PRODUCTS.length).toBe(4);
    expect(DIGITAL_EZROME_PRODUCTS.every((product) => product.billing === "google_play_billing")).toBe(true);
    expect(isDigitalEzromeProduct("signal_plus")).toBe(true);
    expect(isDigitalEzromeProduct("merchandise")).toBe(false);
  });

  it("keeps non-digital offerings outside digital entitlements", () => {
    expect(NON_DIGITAL_EZROME_OFFERINGS).toContain("live_events");
    expect(NON_DIGITAL_EZROME_OFFERINGS).toContain("consulting");
    expect(NON_DIGITAL_EZROME_OFFERINGS.some((id) => isDigitalEzromeProduct(id))).toBe(false);
  });
});
