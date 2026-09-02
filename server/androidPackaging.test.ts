import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("Android packaging handoff", () => {
  it("keeps the Capacitor configuration aligned with the EZROME web build", () => {
    const config = read("capacitor.config.ts");
    expect(config).toContain('appId: "com.ezrome.app"');
    expect(config).toContain('appName: "EZROME"');
    expect(config).toContain('webDir: "dist/public"');
    expect(config).toContain("CAPACITOR_SERVER_URL");
    expect(config).toContain("https://ezromepub-f3hzkejz.manus.space");
    expect(config).toContain("cleartext: false");
  });

  it("provides safe packaging commands without signing material", () => {
    const packageJson = read("package.json");
    const gitignore = read(".gitignore");
    expect(packageJson).toContain(
      '"cap:sync": "pnpm build:frontend && cap sync android"'
    );
    expect(packageJson).toContain('"cap:build:android": "cap build android"');
    expect(gitignore).toContain("*.jks");
    expect(gitignore).toContain("*.keystore");
    expect(gitignore).toContain("google-services.json");
  });

  it("documents the Android origin requirement", () => {
    const handoff = read("docs/ezrome-capacitor-android-handoff.md");
    expect(handoff).toContain("CAPACITOR_SERVER_URL");
    expect(handoff).toContain("`/api/trpc`");
    expect(handoff).toContain("HTTPS");
  });

  it("documents owner-controlled Play release boundaries", () => {
    const handoff = read("docs/ezrome-capacitor-android-handoff.md");
    expect(handoff).toContain("does not create a Play Console app");
    expect(handoff).toContain("com.ezrome.app");
    expect(handoff).toContain("free-first");
    expect(handoff).toContain("Private keys and recovery material");
  });
});
