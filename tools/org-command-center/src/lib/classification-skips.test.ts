import { describe, expect, it } from "vitest";
import {
  parseClassificationSkips,
  resolveClassificationSkips,
} from "./classification-skips";

const SKIPS_MD = `# Classification → skipped ICs and phases

Match is case-insensitive substring against tracker **Classification**.

| Match | Skip ICs | Skip phases |
|-------|----------|-------------|
| internal | seo-manager, pr-manager | 7, 13, 16, 18, 19 |
`;

describe("resolveClassificationSkips", () => {
  it('resolves Internal (+ SaaS-optional) to seo-manager, pr-manager, and phase 7', () => {
    const skips = resolveClassificationSkips("Internal (+ SaaS-optional)", SKIPS_MD);
    expect(skips.skipIcs).toContain("seo-manager");
    expect(skips.skipIcs).toContain("pr-manager");
    expect(skips.skipPhases).toContain("7");
  });

  it("matches Internal and internal-first case-insensitively", () => {
    expect(resolveClassificationSkips("Internal", SKIPS_MD).skipIcs).toContain("seo-manager");
    expect(resolveClassificationSkips("internal-first", SKIPS_MD).skipPhases).toContain("13");
  });

  it("returns empty skips when classification does not match", () => {
    const skips = resolveClassificationSkips("Software", SKIPS_MD);
    expect(skips.skipIcs).toEqual([]);
    expect(skips.skipPhases).toEqual([]);
  });
});

describe("parseClassificationSkips", () => {
  it("parses match as a case-insensitive substring regex", () => {
    const { rows } = parseClassificationSkips(SKIPS_MD);
    expect(rows).toHaveLength(1);
    expect(rows[0].match.test("Internal (+ SaaS-optional)")).toBe(true);
    expect(rows[0].skipIcs).toEqual(["seo-manager", "pr-manager"]);
    expect(rows[0].skipPhases).toEqual(["7", "13", "16", "18", "19"]);
  });
});
