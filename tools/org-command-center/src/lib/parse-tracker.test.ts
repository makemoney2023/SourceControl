import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseTracker, patchTrackerPhaseStatus, seedPositionsRow } from "./parse-tracker";

const dir = dirname(fileURLToPath(import.meta.url));
const sample = readFileSync(join(dir, "fixtures/sample-tracker.md"), "utf8");

describe("parseTracker", () => {
  it("reads meta and phase rows", () => {
    const t = parseTracker(sample);
    expect(t.idea).toBe("Test Widget");
    expect(t.currentPhase).toBe("2");
    expect(t.phases).toHaveLength(4);
    expect(t.phases[2]).toMatchObject({
      phase: "2",
      name: "Market",
      status: "🔄",
      artifact: "02-evidence-base.md",
    });
  });

  it("lists assignable phases (pending or in progress)", () => {
    const t = parseTracker(sample);
    const assignable = t.phases.filter((p) => p.status === "⬜" || p.status === "🔄");
    expect(assignable.map((p) => p.phase)).toEqual(["2", "3"]);
  });
});

describe("patchTrackerPhaseStatus", () => {
  it("sets a phase to in progress", () => {
    const next = patchTrackerPhaseStatus(sample, "3", "🔄");
    const t = parseTracker(next);
    expect(t.phases.find((p) => p.phase === "3")?.status).toBe("🔄");
    expect(next).toContain("**Current phase:** 3");
  });
});

describe("seedPositionsRow", () => {
  it("fills the positions table for a phase", () => {
    const next = seedPositionsRow(sample, {
      phase: "2",
      manager: "head-of-research",
      icsSpawned: "",
      handoffDir: "HANDOFFS/",
      csuiteVerdict: "",
      reviewer: "ceo-strategist",
      managerLlmTier: "strong-general",
    });
    expect(next).toContain("| 2 | head-of-research |");
    expect(next).toContain("| strong-general |");
  });
});
