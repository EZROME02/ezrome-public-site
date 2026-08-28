import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/SystemsBuildLabPage.tsx"),
  "utf8"
);
const styleSource = readFileSync(
  resolve(process.cwd(), "client/src/hub.css"),
  "utf8"
);

const principles = [
  "Understand the problem first",
  "Break big problems into small problems",
  "Input → process → output",
  "Use variables to store information",
  "Use conditions to make decisions",
  "Use loops for repetition",
  "Use functions to organize code",
  "Keep code simple",
  "Do not repeat yourself",
  "Expect errors",
  "Test your code",
  "Write code humans can understand",
];

describe("Principles of Coding lesson", () => {
  it("includes the complete lesson principles and learning sequence", () => {
    for (const principle of principles) expect(pageSource).toContain(principle);
    expect(pageSource).toContain("const codingSequence");
    expect(pageSource).toContain("Git and GitHub");
    expect(pageSource).toContain("AI integration");
  });

  it("connects the lesson to an interactive Build Lab practice surface", () => {
    expect(pageSource).toContain("codingPrinciple");
    expect(pageSource).toContain("Next principle");
    expect(pageSource).toContain("Problem → understand → break down");
    expect(pageSource).toContain("Input → process → output");
    expect(pageSource).toContain("coding-principles-module");
  });

  it("provides responsive and reduced-motion styles", () => {
    expect(styleSource).toContain(".coding-principles-grid");
    expect(styleSource).toContain(".coding-cycle-flow");
    expect(styleSource).toContain("prefers-reduced-motion:reduce");
  });
});
