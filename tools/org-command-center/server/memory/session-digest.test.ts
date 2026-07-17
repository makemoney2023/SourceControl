import { describe, expect, it } from "vitest";
import { buildSessionDigestMarkdown } from "./session-digest";

describe("buildSessionDigestMarkdown", () => {
  it("includes venture, mission, runs, notes, and operator summary", () => {
    const at = new Date("2026-07-17T18:30:00.000Z");
    const md = buildSessionDigestMarkdown({
      ventureName: "Passive Grid",
      slug: "passive-grid",
      at,
      operatorSummary: "Wrapped evidence review.",
      missionLine: "Phase 2 — finish evidence base",
      runLines: ["run abc completed seat=head-of-research acceptance ok"],
      noteLines: ["MOF-303 is lead sorbent"],
    });

    expect(md).toMatch(/Passive Grid/i);
    expect(md).toMatch(/passive-grid/);
    expect(md).toMatch(/Wrapped evidence review/);
    expect(md).toMatch(/Phase 2/);
    expect(md).toMatch(/run abc completed/);
    expect(md).toMatch(/MOF-303/);
    expect(md).toMatch(/2026-07-17/);
  });

  it("omits empty sections gracefully", () => {
    const md = buildSessionDigestMarkdown({
      ventureName: "Alpha",
      slug: "a",
      at: new Date("2026-07-17T12:00:00.000Z"),
      missionLine: "Phase 1 — intake",
      runLines: [],
      noteLines: [],
    });

    expect(md).toMatch(/Phase 1/);
    expect(md).not.toMatch(/undefined/);
  });
});
