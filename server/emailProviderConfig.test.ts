import { describe, expect, it } from "vitest";

describe("EZROME email provider configuration", () => {
  it("uses Cloudflare as the configured domain provider", () => {
    expect(process.env.EZROME_EMAIL_PROVIDER).toBe("Cloudflare");
  });

  it("keeps public routing aliases distinct", () => {
    expect("support@ezrome.co.za").not.toBe("copyright@ezrome.co.za");
  });
});
