import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  findLockedReasks,
  findReferenceBlocks,
  parseDecisionRegister,
} from "./decision-register";

const SIEGER_DECISIONS = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../../docs/orgs/velocity-agency/customers/blacksage-kennels/initiatives/sieger-show-secretary/MEMORY/decisions.md",
);

const PHASE5_PM_NEXT_STEPS = `1. **Head of Product** — merge \`.agents/5-pm-prd-slice.md\` with BA AC into \`05-prd.md\`; write manager brief; return for C-suite gate.
2. **Operator** — name first-show **rulebook** (ADRK / USRC / RKNA / other) and supply **gold-standard approved critique PDF** for that rulebook.
3. **Operator** — share **entry count**, **show days**, and **same-day vs staggered email** expectation so Resend capacity can be planned.
4. **Operator + agency** — decide **vendor spend policy** if AssemblyAI LeMUR (paid account) or Resend upgrade needed under free-tier lock.
5. **Blocking questions:** Which rulebook governs the first deployment? Can you supply the approved gold PDF? What entry count should we plan for? Is small vendor spend allowed if free tier breaks?`;

const MODERN = `# Decisions

## Locked
| id | decision | asked_as |
|----|----------|----------|
| O1 | First-show rulebook = ADRK | rulebook, first-show rulebook, which rulebook |
| B3 | Free tier / no budget | vendor spend, LeMUR, Resend 100 |

## Open
| id | question | owner |
|----|----------|-------|
| O2 | Gold approved ADRK critique PDF | operator |

## Blocked
| id | question | blocked_by |
|----|----------|------------|
| SM5 | Narrative freeze | O2 |
`;

const LEGACY = `# Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-08-13 | First-show rulebook = ADRK | Operator |
`;

describe("parseDecisionRegister", () => {
  it("parses locked/open/blocked tables", () => {
    const reg = parseDecisionRegister(MODERN);
    expect(reg.locked.map((d) => d.id)).toEqual(["O1", "B3"]);
    expect(reg.open[0]).toMatchObject({ id: "O2", owner: "operator" });
    expect(reg.locked[0].askedAs).toContain("which rulebook");
  });

  it("treats legacy Date/Decision/Rationale rows as locked with empty askedAs", () => {
    const reg = parseDecisionRegister(LEGACY);
    expect(reg.locked).toHaveLength(1);
    expect(reg.locked[0].askedAs).toEqual([]);
    expect(reg.locked[0].text).toMatch(/ADRK/);
  });
});

describe("findLockedReasks", () => {
  it("returns locked ids whose asked_as tokens appear in the haystack", () => {
    const reg = parseDecisionRegister(MODERN);
    expect(
      findLockedReasks(reg, "Operator — name first-show rulebook (ADRK / USRC)"),
    ).toEqual(["O1"]);
  });

  it("does not flag open items", () => {
    const reg = parseDecisionRegister(MODERN);
    expect(findLockedReasks(reg, "supply gold approved critique PDF")).toEqual([]);
  });

  it("does not flag legacy locked rows with empty askedAs", () => {
    const reg = parseDecisionRegister(LEGACY);
    expect(findLockedReasks(reg, "which rulebook for first show?")).toEqual([]);
  });

  it("flags O1 and B3 on the Phase 5 PM next-steps echo, not open O2", () => {
    const reg = parseDecisionRegister(readFileSync(SIEGER_DECISIONS, "utf8"));
    const hits = findLockedReasks(reg, PHASE5_PM_NEXT_STEPS);
    expect(hits).toEqual(["B3", "O1"]);
    expect(hits).not.toContain("O2");
  });
});

describe("findReferenceBlocks", () => {
  it("findReferenceBlocks flags PM done while O2 blocks product-manager", () => {
    const reg = parseDecisionRegister(`# Decisions
## Open
| id | question | owner | blocks_seats |
| O2 | Gold PDF | operator | product-manager, tech-lead |
`);
    expect(findReferenceBlocks(reg, "product-manager", "done")).toEqual(["O2"]);
    expect(findReferenceBlocks(reg, "product-manager", "needs_input")).toEqual([]);
    expect(findReferenceBlocks(reg, "cfo", "done")).toEqual([]);
  });
});
