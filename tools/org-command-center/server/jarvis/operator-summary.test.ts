import { describe, expect, it } from "vitest";
import {
  collectOpenQuestions,
  extractDecisions,
  extractOperatorSummary,
  formatOperatorSummarySpoken,
  humanizeBlockers,
} from "./operator-summary";

const SAMPLE = `---
status: pending_review
position: cfo
---

# Deliverable

## In plain English
We sized a seasonal lemonade booth for cash-only events.
Startup cash need is roughly five hundred to twenty-five hundred dollars.
Pricing is still an open question for the operator.

## What we found
- Mid COGS about $1.30 per cup
- Break-even near 61 cups at $5

## Next steps
1. Operator names geography and first events.
2. CFO locks a price band in Phase 4 once geography is known.
3. Do not mark Phase 0 complete until CEO merge finishes.

## Model audit
| Seat | model |
`;

describe("extractOperatorSummary", () => {
  it("pulls plain English and next steps", () => {
    const s = extractOperatorSummary(SAMPLE);
    expect(s.plainEnglish.join(" ")).toMatch(/lemonade booth/i);
    expect(s.plainEnglish.join(" ")).not.toMatch(/Model audit/i);
    expect(s.nextSteps[0]).toMatch(/geography/i);
    expect(s.nextSteps).toHaveLength(3);
  });

  it("returns empty when sections missing", () => {
    const s = extractOperatorSummary("# No sections\n\nJust prose.");
    expect(s.plainEnglish).toEqual([]);
    expect(s.nextSteps).toEqual([]);
  });
});

describe("extractDecisions and collectOpenQuestions", () => {
  it("extracts decisions and merges blocking asks", () => {
    const md = `## Decisions\n- Ship cash-only\n\n## Next steps\n1. Operator picks geo.\n2. Blocking question: weekend or weekday?\n`;
    expect(extractDecisions(md)).toContain("Ship cash-only");
    const next = extractOperatorSummary(md).nextSteps;
    expect(collectOpenQuestions(["Which geography?"], next)).toEqual(
      expect.arrayContaining([
        "Which geography?",
        expect.stringMatching(/weekend or weekday/i),
      ]),
    );
  });
});

describe("formatOperatorSummarySpoken", () => {
  it("speaks plain English then next step without markdown", () => {
    const spoken = formatOperatorSummarySpoken(extractOperatorSummary(SAMPLE));
    expect(spoken).toMatch(/lemonade booth/i);
    expect(spoken).toMatch(/Next:/i);
    expect(spoken).not.toMatch(/\*\*|##|`/);
    expect(spoken.length).toBeLessThan(500);
  });

  it("returns null when nothing useful", () => {
    expect(formatOperatorSummarySpoken(extractOperatorSummary("# x"))).toBeNull();
  });
});

describe("collectOpenQuestions filters process noise", () => {
  it("drops none-asks and strips markdown; keeps real operator questions", () => {
    const qs = collectOpenQuestions(
      [
        "Peer help needed: **none**",
        "Clarification needed: **none** for merge — operator answers on Q1 remain valuable",
        "**C-suite ask:** Confirm GO on creative redo",
        "Which geography should we prioritize?",
      ],
      [],
    );
    expect(qs.every((q) => !/\*\*/.test(q))).toBe(true);
    expect(qs.some((q) => /Peer help needed/i.test(q))).toBe(false);
    expect(qs.some((q) => /Clarification needed:\s*\**none/i.test(q))).toBe(false);
    expect(qs).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/Confirm GO on creative redo/i),
        expect.stringMatching(/Which geography/i),
      ]),
    );
  });

  it("rewrites peer-help and clarification asks into plain operator English", () => {
    const qs = collectOpenQuestions(
      [
        "Peer help needed: CTO for GLB optimize pipeline, license diligence sign-off, and HeroIsland perf gate before Phase 9 merge — not a block on design merge",
        "Clarification needed: Operator commercial 3D asset budget cap + undocked-tail hard yes (CEO assumed yes) before purchase — see HANDOFFS/22-ceo-operator-feedback-3d-brand.md §8",
        "Peer help needed: copy-chief for chapter body alignment to Phase 14 (done as 14r)",
      ],
      [],
    );
    expect(qs.every((q) => !/peer help needed|clarification needed|HANDOFFS\//i.test(q))).toBe(
      true,
    );
    expect(qs.some((q) => /budget|3D|purchase/i.test(q))).toBe(true);
    expect(qs.some((q) => /CTO|engineering|3D|license|performance/i.test(q))).toBe(true);
    expect(qs.every((q) => !/\(done as/i.test(q))).toBe(true);
  });
});

describe("buildSeatBusinessBrief humanizes jargon decisions", () => {
  it("softens technical decision lines and fills empty whatHappened", async () => {
    const { buildSeatBusinessBrief } = await import("./operator-summary");
    const brief = buildSeatBusinessBrief({
      operatorSummary: { plainEnglish: [], findings: [], nextSteps: [] },
      decisions: [
        "Default home = photography documentary chapters (not box-dog WebGL).",
        "WebGL ScrollControls only when licensed GLB + gate pass.",
        "No purple/cream; Fraunces/Manrope per 11-R.",
      ],
      openQuestions: [
        "What is your budget cap for commercial 3D assets before we buy anything?",
      ],
      blockers: [
        "Patch risk: Phase 9 engineer may copy v1 apps/blacksage-kennels file tree — §Anti-patterns forbid; new project required.",
        "Form backend: blocks public launch; UI spec complete for staging.",
      ],
    });
    expect(brief.whatHappened.length).toBeGreaterThan(0);
    expect(brief.whatHappened.join(" ")).not.toMatch(/No plain-language/i);
    expect(brief.whyItMatters.every((l) => !/\b11-R\b|ScrollControls|box-dog/i.test(l))).toBe(
      true,
    );
    expect(brief.whyItMatters.some((l) => /photography|documentary|home/i.test(l))).toBe(true);
    expect(brief.whatsStuck.every((l) => !/apps\/|§Anti-patterns|Phase 9|PlaceholderSlot/i.test(l))).toBe(
      true,
    );
    expect(brief.whatsStuck.some((l) => /form|launch|backend/i.test(l))).toBe(true);
    expect(brief.whatsStuck.some((l) => /new site project|previous codebase/i.test(l))).toBe(true);
  });
});

describe("humanizeBlockers", () => {
  it("strips tables and codes into short plain lines", () => {
    const lines = humanizeBlockers([
      "**12-month success criteria** remain assumption-only until operator answers Q4 — may shift strategy.",
      "| Risk | Severity | Mitigation |",
      "|------|----------|------------|",
      "| Creative team patches v1 | High | SD7 |",
      "W1 (no program evidence) remains binding — D2 succeeds only with operator content",
    ]);
    expect(lines.every((l) => !/^\|/.test(l))).toBe(true);
    expect(lines.every((l) => !/\*\*/.test(l))).toBe(true);
    expect(lines[0]).toMatch(/success criteria|assumption/i);
    expect(lines.length).toBeGreaterThan(0);
    expect(lines.length).toBeLessThanOrEqual(4);
  });
});
