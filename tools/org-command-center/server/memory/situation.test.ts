import { describe, expect, it } from "vitest";
import { composeMemoryBrief, speakMemoryBrief } from "./situation";

describe("composeMemoryBrief", () => {
  it("uses mission when MEMORY is empty and marks memoryThin", () => {
    const brief = composeMemoryBrief({
      recentSessionLines: [],
      decisionLines: [],
      preferenceLines: [],
      mission: {
        idea: "Passive Grid",
        currentPhase: "2",
        currentPhaseName: "Evidence",
        nextAction: "finish evidence base",
        blockerCount: 1,
      },
      recentRunLines: [],
    });
    expect(brief.memoryThin).toBe(true);
    expect(brief.next[0]).toMatch(/evidence/i);
    expect(brief.suggestion.length).toBeGreaterThan(0);
    expect(brief.done.length).toBeLessThanOrEqual(5);
  });

  it("prefers session lines for done and caps arrays at 5", () => {
    const brief = composeMemoryBrief({
      recentSessionLines: Array.from({ length: 8 }, (_, i) => `Did thing ${i}`),
      decisionLines: ["MOF-303 is lead sorbent"],
      preferenceLines: [],
      mission: {
        idea: "Passive Grid",
        currentPhase: "2",
        nextAction: "finish evidence",
        blockerCount: 0,
      },
      recentRunLines: ["run_1 acceptance gap: missing inbox"],
    });
    expect(brief.done).toHaveLength(5);
    expect(brief.blockers.some((b) => /inbox/i.test(b))).toBe(true);
    expect(brief.sources.length).toBeGreaterThan(0);
  });

  it("speakMemoryBrief is one short plain sentence", () => {
    const spoken = speakMemoryBrief({
      done: ["Intake done"],
      next: ["Finish Phase 2"],
      blockers: ["Missing TEBS cites"],
      suggestion: "Queue head-of-research on TEBS.",
      sources: ["MEMORY/sessions/x.md"],
      memoryThin: false,
    });
    expect(spoken).not.toMatch(/[*`#]/);
    expect(spoken.split(/(?<=[.!?])\s+/).length).toBeLessThanOrEqual(3);
  });

  it("uses noteLines for done when sessions are empty", () => {
    const brief = composeMemoryBrief({
      recentSessionLines: [],
      decisionLines: [],
      preferenceLines: [],
      noteLines: ["MOF-303 is lead sorbent", "Prefer desert field tests"],
      mission: {
        idea: "Passive Grid",
        currentPhase: "2",
        nextAction: "finish evidence",
        blockerCount: 0,
      },
      recentRunLines: [],
    });
    expect(brief.memoryThin).toBe(false);
    expect(brief.done.some((d) => /MOF-303|desert/i.test(d))).toBe(true);
    expect(brief.sources).toContain("MEMORY/notes");
  });
});
