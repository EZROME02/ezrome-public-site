import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("Android disconnection recovery", () => {
  it("loads the Capacitor wrapper from an HTTPS server origin", () => {
    const config = read("capacitor.config.ts");
    expect(config).toContain("CAPACITOR_SERVER_URL");
    expect(config).toContain('androidScheme: "https"');
    expect(config).toContain("cleartext: false");
  });

  it("keeps the top-level connection fallback actionable and non-sensitive", () => {
    const boundary = read("client/src/components/ErrorBoundary.tsx");
    expect(boundary).toContain("EZROME lost its connection to the server");
    expect(boundary).toContain("Reconnect to the internet and try again");
    expect(boundary).toContain("Try again");
    expect(boundary).not.toContain("{this.state.error?.stack}");
  });
});
