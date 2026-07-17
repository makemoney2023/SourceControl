import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolveRepoEnvLocal } from "./env-path.js";

describe("resolveRepoEnvLocal", () => {
  it("points at ClaudeSkills root .env.local", () => {
    const path = resolveRepoEnvLocal();
    expect(path.endsWith(".env.local")).toBe(true);
    expect(path).toMatch(/ClaudeSkills\/\.env\.local$/);
    // File may be gitignored but should exist in this workspace.
    expect(existsSync(path)).toBe(true);
  });
});
