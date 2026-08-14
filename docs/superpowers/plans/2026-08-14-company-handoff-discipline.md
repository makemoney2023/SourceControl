# Company Handoff Discipline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop seats from restating the same product story and re-asking locked questions; then raise the bar so the operator reviews a client-usable artifact, not a 100-line memo.

**Architecture:** Two waves on the same OCC acceptance gate. Wave 1 (Tasks 1–10) is hygiene: decision register, delta briefs, pack allowlist, classification skips. Wave 2 (Tasks 11–19) is agency quality: artifact scorecards, pack procedure headings, design-before-build, inbox points at the real file, blocked-if-reference-missing, model-tier hard fail, revise-from-redlines. Do not add an LLM judge.

**Tech Stack:** TypeScript, Vitest, existing OCC parsers (`parse-md-table`, `parse-handoff`, `evaluateRunAcceptance`), org markdown templates.

## Global Constraints

- TDD: failing Vitest first, then minimal implementation, then pass.
- Do not invent a second acceptance system. Extend `evaluateRunAcceptance`.
- Do not require migrating every existing `MEMORY/decisions.md` on day one. Parser must accept the new Locked/Open/Blocked tables and treat the legacy `Date | Decision | Rationale` table as locked-only with empty `asked_as` (no re-ask fail until `asked_as` is filled).
- Jaccard echo threshold is **0.35**. Re-ask match is substring of locked `asked_as` tokens against Next steps + Asks + Operator brief.
- Pack allowlist is the `## Skill packs` table in `skills/org/positions/<slug>/SKILL.md`. HANDOFF-TEMPLATE.md is always allowed.
- Classification match is case-insensitive `/internal/` on tracker `Classification` (covers `Internal`, `internal-first`, `Internal (+ SaaS-optional)`).
- No git commit unless the operator asks. Plan steps that say Commit become “stop and report; do not commit.”
- Do not change Sieger app code in this plan. Company system only.
- Wave 2 quality is structural (required headings, artifact path on disk, register blocks, model pin). It is not taste. Do not add an LLM-as-judge.
- New acceptance codes stay stable: `quality_scorecard`, `quality_fail:<id>`, `pack_procedure:<slug>`, `design_before_build`, `inbox_not_artifact`, `reference_blocked:<id>`, `model_tier`.
- Agency beats (document in Task 18): brief → concept approval → craft → editor cut → Layer B from design brief → verifier on the real path → operator redlines the artifact → same seat revises → C-suite.

## Approaches considered

1. **Template-only** — rewrite HEARTBEAT and HANDOFF-TEMPLATE. Rejected: Sieger seats already followed the template and still echoed.
2. **LLM judge on every handoff** — extra frontier call per seat. Rejected: slow, spendy, non-deterministic.
3. **OCC acceptance + slim packets (this plan)** — deterministic, already wired to `completed_with_gaps`, cheap.

---

## File map

| File | Responsibility |
|------|----------------|
| `tools/org-command-center/src/lib/decision-register.ts` | Parse `MEMORY/decisions.md` into locked/open/blocked |
| `tools/org-command-center/src/lib/handoff-discipline.ts` | Re-ask, brief Jaccard, pack allowlist checks |
| `tools/org-command-center/src/lib/parse-position-packs.ts` | Read seat SKILL.md pack table |
| `tools/org-command-center/src/lib/classification-skips.ts` | Which ICs/phases to drop for a classification |
| `skills/org/CLASSIFICATION-SKIPS.md` | Human-editable skip table |
| `tools/org-command-center/src/lib/parse-handoff.ts` | Add `operatorBrief`, `packsUsed`, `nextSteps` |
| `tools/org-command-center/src/lib/types.ts` | Extend `HandoffRecord` |
| `tools/org-command-center/server/jarvis/run-acceptance.ts` | Call discipline checks |
| `tools/org-command-center/server/sources/context-reads.ts` | Always prepend `MEMORY/decisions.md` when present |
| `tools/org-command-center/server/spawn.ts` | Acceptance lines + “delta only / do not re-ask locked” |
| `tools/org-command-center/server/queue-validated-dispatch.ts` | Filter `preferred_ic` / document skip ICs |
| `tools/org-command-center/server/jarvis/dispatch-for.ts` | Apply classification skips when building packets |
| `skills/org/HANDOFF-TEMPLATE.md` | Delta brief + one new question + register ids |
| `skills/org/MANAGER-BRIEF-TEMPLATE.md` | Same |
| `skills/org/CSUITE-REVIEW-TEMPLATE.md` | Required `## New risk or disagreement` |
| `skills/org/templates/HEARTBEAT.md` | Read register; return delta |
| `skills/org/orchestrator/SKILL.md` + `HEARTBEAT.md` | Stay dispatcher after shippable MVP |
| `skills/org/COLLABORATION.md` | Merge-gate bullets for echo / re-ask / packs |
| `templates/org/MEMORY/decisions.md` | Canonical register template |
| `skills/org/ARTIFACT-QUALITY.md` | Per-phase structural quality scorecard |
| `skills/org/PACK-PROCEDURES.md` | Pack path → required headings / files |
| `tools/org-command-center/src/lib/artifact-quality.ts` | Scorecard parser + check |
| `tools/org-command-center/src/lib/pack-procedures.ts` | Procedure map parser + check |
| `skills/org/examples/handoff-good.md` | Few-shot delta brief |
| `skills/org/examples/handoff-bad.md` | Few-shot echo brief (must fail) |
| `tools/org-command-center/src/lib/redlines.ts` | Parse / format C-suite redlines |
| `tools/org-command-center/src/jarvis/model-quality.ts` | Fallback on creative/frontier is now a hard fail |

---

### Task 1: Decision register parser

**Files:**
- Create: `tools/org-command-center/src/lib/decision-register.ts`
- Create: `tools/org-command-center/src/lib/decision-register.test.ts`
- Test: `tools/org-command-center/src/lib/decision-register.test.ts`

**Interfaces:**
- Consumes: markdown string; `parseMarkdownTable` / `tableAsObjects`
- Produces:

```ts
export type DecisionStatus = "locked" | "open" | "blocked";

export type DecisionItem = {
  id: string;
  text: string;
  askedAs: string[];
  status: DecisionStatus;
  owner: string;
};

export type DecisionRegister = {
  locked: DecisionItem[];
  open: DecisionItem[];
  blocked: DecisionItem[];
  all: DecisionItem[];
};

export function parseDecisionRegister(md: string): DecisionRegister;
export function findLockedReasks(register: DecisionRegister, haystack: string): string[];
```

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import {
  findLockedReasks,
  parseDecisionRegister,
} from "./decision-register";

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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd tools/org-command-center && npx vitest run src/lib/decision-register.test.ts`
Expected: FAIL — `Cannot find module './decision-register'`

- [ ] **Step 3: Write minimal implementation**

```ts
import { parseMarkdownTable, tableAsObjects } from "./parse-md-table";

export type DecisionStatus = "locked" | "open" | "blocked";

export type DecisionItem = {
  id: string;
  text: string;
  askedAs: string[];
  status: DecisionStatus;
  owner: string;
};

export type DecisionRegister = {
  locked: DecisionItem[];
  open: DecisionItem[];
  blocked: DecisionItem[];
  all: DecisionItem[];
};

function splitAskedAs(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function fromModern(md: string, heading: string, status: DecisionStatus): DecisionItem[] {
  const rows = tableAsObjects(parseMarkdownTable(md, heading));
  return rows
    .filter((r) => r.id || r.Id)
    .map((r) => ({
      id: (r.id ?? r.Id ?? "").trim(),
      text: (r.decision ?? r.question ?? r.Decision ?? "").trim(),
      askedAs: splitAskedAs(r.asked_as ?? r["asked_as"] ?? ""),
      status,
      owner: (r.owner ?? r.blocked_by ?? "").trim(),
    }));
}

function fromLegacy(md: string): DecisionItem[] {
  if (md.includes("## Locked")) return [];
  const rows = tableAsObjects(parseMarkdownTable(md, "# Decisions"));
  return rows
    .filter((r) => r.Decision)
    .map((r, i) => ({
      id: `legacy-${i + 1}`,
      text: r.Decision,
      askedAs: [],
      status: "locked" as const,
      owner: "",
    }));
}

export function parseDecisionRegister(md: string): DecisionRegister {
  const locked = [
    ...fromModern(md, "## Locked", "locked"),
    ...fromLegacy(md),
  ];
  const open = fromModern(md, "## Open", "open");
  const blocked = fromModern(md, "## Blocked", "blocked");
  return { locked, open, blocked, all: [...locked, ...open, ...blocked] };
}

export function findLockedReasks(
  register: DecisionRegister,
  haystack: string,
): string[] {
  const lower = haystack.toLowerCase();
  const hits: string[] = [];
  for (const item of register.locked) {
    if (item.askedAs.some((token) => token.length >= 4 && lower.includes(token))) {
      hits.push(item.id);
    }
  }
  return hits;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd tools/org-command-center && npx vitest run src/lib/decision-register.test.ts`
Expected: PASS

- [ ] **Step 5: Do not commit** — report Task 1 done.

---

### Task 2: Brief overlap + pack allowlist

**Files:**
- Create: `tools/org-command-center/src/lib/handoff-discipline.ts`
- Create: `tools/org-command-center/src/lib/handoff-discipline.test.ts`
- Create: `tools/org-command-center/src/lib/parse-position-packs.ts`
- Create: `tools/org-command-center/src/lib/parse-position-packs.test.ts`

**Interfaces:**
- Consumes: operator-brief strings; pack paths; SKILL.md text
- Produces:

```ts
export const BRIEF_ECHO_THRESHOLD = 0.35;
export function tokenizeBrief(text: string): Set<string>;
export function briefJaccard(a: string, b: string): number;
export function findBriefEcho(
  candidate: string,
  others: { filename: string; brief: string }[],
  threshold?: number,
): string | null;

export function parsePositionPacks(skillMd: string): string[];
export function packsNotAllowed(
  used: string[],
  allowed: string[],
  alwaysAllowed?: string[],
): string[];
```

- [ ] **Step 1: Write the failing tests**

```ts
// handoff-discipline.test.ts
import { describe, expect, it } from "vitest";
import { BRIEF_ECHO_THRESHOLD, briefJaccard, findBriefEcho } from "./handoff-discipline";

const PM = `We drafted the product requirements slice for Sieger Show Secretary—the software that turns a judge's spoken ringside critique into an approved PDF emailed to the dog owner. The PRD honors every lock you already set: multi-show with login, four selectable rulebooks.`;
const HOP = `We completed the product requirements document for Sieger Show Secretary—the software that captures a judge’s spoken critique outdoors, turns it into a draft PDF the show secretary can edit and approve. Every lock you set in Phase 0 is in the PRD: multi-show with login, four selectable rulebooks.`;
const DELTA = `Merged 47 acceptance criteria onto PM stories US-001–US-021. Remapped BA ACs. Three register items still open: O2, B1, B3.`;

describe("briefJaccard", () => {
  it("scores the Sieger PM/HoP echo above the threshold", () => {
    expect(briefJaccard(PM, HOP)).toBeGreaterThan(BRIEF_ECHO_THRESHOLD);
  });

  it("scores a delta brief below the threshold against the product story", () => {
    expect(briefJaccard(HOP, DELTA)).toBeLessThan(BRIEF_ECHO_THRESHOLD);
  });
});

describe("findBriefEcho", () => {
  it("returns the other filename when overlap exceeds threshold", () => {
    expect(
      findBriefEcho(HOP, [{ filename: "5-product-manager.md", brief: PM }]),
    ).toBe("5-product-manager.md");
  });

  it("returns null when the candidate is a delta", () => {
    expect(
      findBriefEcho(DELTA, [{ filename: "5-product-manager.md", brief: PM }]),
    ).toBeNull();
  });
});
```

```ts
// parse-position-packs.test.ts
import { describe, expect, it } from "vitest";
import { parsePositionPacks } from "./parse-position-packs";
import { packsNotAllowed } from "./handoff-discipline";

const PM_SKILL = `# Product Manager

## Skill packs
| Pack path | Use for |
|-----------|---------|
| \`skills/community/awesome-claude-corporate-skills/09-product-management/feature-spec/\` | Feature specs |
| \`skills/community/business-analysis-skills/skills/moscow-prioritisation/\` | MoSCoW |

## Inputs
- x
`;

describe("parsePositionPacks", () => {
  it("reads the Skill packs table only", () => {
    expect(parsePositionPacks(PM_SKILL)).toEqual([
      "skills/community/awesome-claude-corporate-skills/09-product-management/feature-spec/",
      "skills/community/business-analysis-skills/skills/moscow-prioritisation/",
    ]);
  });
});

describe("packsNotAllowed", () => {
  it("flags prd-writer when PM allowlist is feature-spec/moscow", () => {
    const used = [
      "skills/community/awesome-claude-corporate-skills/09-product-management/prd-writer/SKILL.md",
    ];
    expect(packsNotAllowed(used, parsePositionPacks(PM_SKILL))).toEqual([
      "skills/community/awesome-claude-corporate-skills/09-product-management/prd-writer/SKILL.md",
    ]);
  });

  it("allows HANDOFF-TEMPLATE even when not on the seat list", () => {
    expect(
      packsNotAllowed(
        ["skills/org/HANDOFF-TEMPLATE.md"],
        parsePositionPacks(PM_SKILL),
      ),
    ).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd tools/org-command-center && npx vitest run src/lib/handoff-discipline.test.ts src/lib/parse-position-packs.test.ts`
Expected: FAIL — modules missing

- [ ] **Step 3: Write minimal implementation**

`parse-position-packs.ts`:

```ts
import { parseMarkdownTable, tableAsObjects } from "./parse-md-table";

export function parsePositionPacks(skillMd: string): string[] {
  const rows = tableAsObjects(parseMarkdownTable(skillMd, "## Skill packs"));
  return rows
    .map((r) => (r["Pack path"] ?? r.Pack ?? "").replace(/`/g, "").trim())
    .filter(Boolean);
}
```

`handoff-discipline.ts`:

```ts
export const BRIEF_ECHO_THRESHOLD = 0.35;

const ALWAYS_ALLOWED = [
  "skills/org/HANDOFF-TEMPLATE.md",
  "skills/org/MANAGER-BRIEF-TEMPLATE.md",
  "skills/org/CSUITE-REVIEW-TEMPLATE.md",
  "skills/org/COLLABORATION.md",
];

export function tokenizeBrief(text: string): Set<string> {
  return new Set(text.toLowerCase().match(/[a-z0-9-]{4,}/g) ?? []);
}

export function briefJaccard(a: string, b: string): number {
  const A = tokenizeBrief(a);
  const B = tokenizeBrief(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter += 1;
  return inter / new Set([...A, ...B]).size;
}

export function findBriefEcho(
  candidate: string,
  others: { filename: string; brief: string }[],
  threshold = BRIEF_ECHO_THRESHOLD,
): string | null {
  for (const other of others) {
    if (briefJaccard(candidate, other.brief) > threshold) return other.filename;
  }
  return null;
}

function packKey(p: string): string {
  return p.replace(/\/SKILL\.md$/i, "").replace(/\/+$/, "").toLowerCase();
}

export function packsNotAllowed(
  used: string[],
  allowed: string[],
  alwaysAllowed = ALWAYS_ALLOWED,
): string[] {
  const ok = new Set([...allowed, ...alwaysAllowed].map(packKey));
  return used.filter((p) => {
    const key = packKey(p);
    if (ok.has(key)) return false;
    for (const a of ok) {
      if (key.startsWith(a) || a.startsWith(key)) return false;
    }
    return true;
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd tools/org-command-center && npx vitest run src/lib/handoff-discipline.test.ts src/lib/parse-position-packs.test.ts`
Expected: PASS

- [ ] **Step 5: Do not commit** — report Task 2 done.

---

### Task 3: Parse operator brief, packs used, next steps on HandoffRecord

**Files:**
- Modify: `tools/org-command-center/src/lib/types.ts` (`HandoffRecord`)
- Modify: `tools/org-command-center/src/lib/parse-handoff.ts`
- Modify: `tools/org-command-center/src/lib/parse-handoff.test.ts`
- Modify: any fixture that constructs `HandoffRecord` literals if TypeScript breaks

**Interfaces:**
- Consumes: existing `parseHandoff`
- Produces: `operatorBrief: string`, `nextSteps: string`, `packsUsed: string[]` on `HandoffRecord`

- [ ] **Step 1: Write the failing test** (append to `parse-handoff.test.ts`)

```ts
  it("extracts operator brief, next steps, and packs used", () => {
    const h = parseHandoff(
      "5-product-manager.md",
      `---
phase: "5"
position: product-manager
---
# Handoff

## Operator brief (plain English)
We drafted the PRD slice.

## Next steps
1. Head of Product — merge.
2. Operator — name first-show rulebook.

## Packs used
| Pack | Decision tied to pack |
|------|------------------------|
| \`skills/community/awesome-claude-corporate-skills/09-product-management/prd-writer/SKILL.md\` | Structured PRD |
`,
    );
    expect(h.operatorBrief).toMatch(/PRD slice/);
    expect(h.nextSteps).toMatch(/rulebook/);
    expect(h.packsUsed).toEqual([
      "skills/community/awesome-claude-corporate-skills/09-product-management/prd-writer/SKILL.md",
    ]);
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd tools/org-command-center && npx vitest run src/lib/parse-handoff.test.ts`
Expected: FAIL — `operatorBrief` undefined

- [ ] **Step 3: Write minimal implementation**

Add to `HandoffRecord` in `types.ts`:

```ts
  operatorBrief: string;
  nextSteps: string;
  packsUsed: string[];
```

Add helpers in `parse-handoff.ts` (next to `sectionBullets`):

```ts
function sectionText(body: string, headingRe: RegExp): string {
  const m = body.match(headingRe);
  if (!m || m.index === undefined) return "";
  const from = body.slice(m.index + m[0].length);
  const next = from.search(/\n## /);
  return (next === -1 ? from : from.slice(0, next)).trim();
}
```

In `parseHandoff` return object, add:

```ts
    operatorBrief: sectionText(
      body,
      /## (?:Operator brief \(plain English\)|In plain English)[^\n]*\n/i,
    ),
    nextSteps: sectionText(body, /## Next steps[^\n]*\n/i),
    packsUsed: tableAsObjects(parseMarkdownTable(body, "## Packs used"))
      .map((r) => (r.Pack ?? r.pack ?? "").replace(/`/g, "").trim())
      .filter(Boolean),
```

If other test files construct `HandoffRecord` objects, add `operatorBrief: ""`, `nextSteps: ""`, `packsUsed: []`.

- [ ] **Step 4: Run tests**

Run: `cd tools/org-command-center && npx vitest run src/lib/parse-handoff.test.ts src/lib/parse-handoff.test.ts src/jarvis/`
Expected: PASS (fix fixture literals if tsc/vitest complains)

- [ ] **Step 5: Do not commit**

---

### Task 4: Wire discipline into `evaluateRunAcceptance`

**Files:**
- Modify: `tools/org-command-center/server/jarvis/run-acceptance.ts`
- Modify: `tools/org-command-center/server/jarvis/run-acceptance.test.ts`
- Modify: `tools/org-command-center/server/paths.ts` only if a `memoryFile()` helper is missing — prefer `join(memoryRel(repoRoot), "decisions.md")`

**Interfaces:**
- Consumes: `parseDecisionRegister`, `findLockedReasks`, `findBriefEcho`, `parsePositionPacks`, `packsNotAllowed`, `loadHandoffs`
- Produces: new `missing` codes:
  - `reask:<id>`
  - `brief_echo:<filename>`
  - `pack_not_allowed:<basename>`
  - `packs_used_missing` (IC/manager only, skip if body is a skip stub under 20 lines)

Acceptance still returns `{ ok, missing, checkedAt }`. Discipline runs whenever the phase handoff for `packet.position` exists. If `MEMORY/decisions.md` is absent, skip re-ask (do not fail). If the seat SKILL.md is absent, skip pack audit.

- [ ] **Step 1: Write the failing tests** (append to `run-acceptance.test.ts`)

Reuse `tempRepo`, `writeHandoff`, `writeInbox`, `basePacket` already in that file. Add:

```ts
  it("missing reask:O1 when handoff re-asks a locked register item", () => {
    const root = tempRepo();
    writeInbox(root, "5-hop.md", {
      status: "pending_review",
      position: "head-of-product",
      phase: "5",
      goal: "PRD",
      runId: "run-5",
    });
    mkdirSync(join(root, "docs/projects/passive-grid/MEMORY"), { recursive: true });
    writeFileSync(
      join(root, "docs/projects/passive-grid/MEMORY/decisions.md"),
      `# Decisions
## Locked
| id | decision | asked_as |
| O1 | First-show rulebook = ADRK | which rulebook, first-show rulebook |
`,
    );
    writeHandoff(
      root,
      "5-manager-head-of-product.md",
      `---
phase: "5"
position: head-of-product
status: done
---
## Operator brief (plain English)
Merged the PRD.

## Next steps
1. Operator — which rulebook governs the first deployment?
`,
    );

    const result = evaluateRunAcceptance(root, {
      runId: "run-5",
      packet: {
        ...basePacket,
        phase: "5",
        position: "head-of-product",
        goal: "PRD",
        preferred_ic: undefined,
        require_ic_handoff: false,
        require_inbox: true,
      },
    });
    expect(result.ok).toBe(false);
    expect(result.missing).toContain("reask:O1");
  });

  it("missing brief_echo when manager brief copies the IC operator brief", () => {
    const root = tempRepo();
    writeInbox(root, "5-hop.md", {
      status: "pending_review",
      position: "head-of-product",
      phase: "5",
      goal: "PRD",
      runId: "run-5b",
    });
    const story =
      "We finished the product requirements for Sieger Show Secretary the software that turns a judge spoken ringside critique into an approved PDF emailed to the dog owner with multi-show login and four selectable rulebooks.";
    writeHandoff(
      root,
      "5-product-manager.md",
      `---
phase: "5"
position: product-manager
status: done
---
## Operator brief (plain English)
${story}
`,
    );
    writeHandoff(
      root,
      "5-manager-head-of-product.md",
      `---
phase: "5"
position: head-of-product
status: done
---
## Operator brief (plain English)
${story}
`,
    );

    const result = evaluateRunAcceptance(root, {
      runId: "run-5b",
      packet: {
        ...basePacket,
        phase: "5",
        position: "head-of-product",
        goal: "PRD",
        preferred_ic: undefined,
        require_ic_handoff: false,
        require_inbox: true,
      },
    });
    expect(result.ok).toBe(false);
    expect(result.missing.some((m) => m.startsWith("brief_echo:"))).toBe(true);
  });
```

For pack audit, seed `skills/org/positions/product-manager/SKILL.md` in the temp repo with the real feature-spec/moscow table, write `5-product-manager.md` citing `prd-writer`, and expect `pack_not_allowed:prd-writer` (or the full path — pick one and keep it stable: use the last path segment after stripping `/SKILL.md`, so `prd-writer`).

- [ ] **Step 2: Run test to verify it fails**

Run: `cd tools/org-command-center && npx vitest run server/jarvis/run-acceptance.test.ts`
Expected: FAIL — `reask:O1` not in missing

- [ ] **Step 3: Write minimal implementation**

In `evaluateRunAcceptance`, after existing checks, always `loadHandoffs` (not only when production/verifier required). Then:

```ts
  const phaseHandoffs = loadHandoffs(repoRoot).filter(
    (h) => String(h.phase) === String(args.packet.phase),
  );
  const primary =
    phaseHandoffs.find((h) => h.position === args.packet.position) ??
    phaseHandoffs.find((h) => h.kind === "manager");

  if (primary) {
    const decisionsRel = `${memoryRel(repoRoot)}/decisions.md`;
    if (existsSync(join(repoRoot, decisionsRel))) {
      const register = parseDecisionRegister(
        readFileSync(join(repoRoot, decisionsRel), "utf8"),
      );
      const haystack = `${primary.operatorBrief}\n${primary.nextSteps}\n${primary.asks.join("\n")}`;
      for (const id of findLockedReasks(register, haystack)) {
        missing.push(`reask:${id}`);
      }
    }

    const echo = findBriefEcho(
      primary.operatorBrief,
      phaseHandoffs
        .filter((h) => h.filename !== primary.filename && h.operatorBrief)
        .map((h) => ({ filename: h.filename, brief: h.operatorBrief })),
    );
    if (echo) missing.push(`brief_echo:${echo}`);

    const skillPath = join(
      repoRoot,
      "skills/org/positions",
      primary.position,
      "SKILL.md",
    );
    if (existsSync(skillPath) && primary.kind !== "csuite") {
      if (!primary.packsUsed.length && primary.body.split("\n").length > 20) {
        missing.push("packs_used_missing");
      }
      const notAllowed = packsNotAllowed(
        primary.packsUsed,
        parsePositionPacks(readFileSync(skillPath, "utf8")),
      );
      for (const p of notAllowed) {
        const slug = p.replace(/\/SKILL\.md$/i, "").split("/").filter(Boolean).pop();
        missing.push(`pack_not_allowed:${slug}`);
      }
    }
  }
```

Import `memoryRel` from `../paths`. Confirm `memoryRel` exists; if not, use the same pattern as `context-reads.ts`.

- [ ] **Step 4: Run tests**

Run: `cd tools/org-command-center && npx vitest run server/jarvis/run-acceptance.test.ts`
Expected: PASS. Existing tests still pass (no decisions.md in those fixtures → re-ask skipped).

- [ ] **Step 5: Do not commit**

---

### Task 5: C-suite must add a new risk; verifier needs a happy-path spec

**Files:**
- Modify: `tools/org-command-center/src/lib/parse-handoff.ts` (optional `newRisk` section text — can scan `body` in acceptance instead)
- Modify: `tools/org-command-center/server/jarvis/run-acceptance.ts`
- Modify: `tools/org-command-center/server/jarvis/run-acceptance.test.ts`
- Modify: `skills/org/CSUITE-REVIEW-TEMPLATE.md`
- Modify: `skills/org/HANDOFF-TEMPLATE.md` (verifier frontmatter)

**Interfaces:**
- C-suite review missing `csuite_no_new_risk` when `## New risk or disagreement` is missing or only `none` / `n/a`.
- Shippable verifier missing `happy_path_spec` when `happy_path_spec` is empty or the file is not on disk; missing `happy_path_status` when not `pass`.

- [ ] **Step 1: Write the failing tests**

```ts
  it("missing csuite_no_new_risk when review has no new-risk section", () => {
    // write 3-csuite-review.md with operator brief + scorecard, no New risk section
    // packet phase 3, position ceo-strategist
    // expect missing to contain csuite_no_new_risk
  });

  it("missing happy_path_spec when verifier pass has no spec path", () => {
    // existing shippable fixture from this file (phase 9 / design_brief tests)
    // add verifier with verdict pass but no happy_path_spec
    // expect happy_path_spec
  });
```

Fill the comments with the same `writeHandoff` / `writeInbox` style as the existing `design_brief_path` test around line 277 of `run-acceptance.test.ts`.

- [ ] **Step 2: Run tests — expect FAIL**

- [ ] **Step 3: Implement**

C-suite check (when a `*-csuite-review.md` exists for the packet phase):

```ts
function csuiteNewRiskMissing(body: string): boolean {
  const m = body.match(/## New risk or disagreement\s*\n([\s\S]*?)(?=\n## |\s*$)/i);
  if (!m) return true;
  const text = m[1].replace(/^[-*]\s*/, "").trim().toLowerCase();
  return !text || text === "none" || text === "n/a" || text === "…";
}
```

Verifier check (inside `verifierMissing` or after it, only when `requireVerifier`):

```ts
  const spec = String(data.happy_path_spec ?? "").trim(); // parse in parseHandoff
  const status = String(data.happy_path_status ?? "").trim().toLowerCase();
  if (!spec) return "happy_path_spec";
  if (!existsSync(join(repoRoot, spec))) return `happy_path_spec:${spec}`;
  if (status !== "pass") return "happy_path_status";
```

Add `happyPathSpec` and `happyPathStatus` to `HandoffRecord`.

Template additions:

CSUITE-REVIEW-TEMPLATE — after What we found:

```markdown
## New risk or disagreement
- One risk or disagreement that is **not** a rewrite of the manager brief. Required. “None” fails acceptance.
```

HANDOFF-TEMPLATE verifier YAML:

```yaml
happy_path_status: pass | fail | skipped
happy_path_spec: "apps/<venture>/e2e/happy-path.spec.ts"
```

- [ ] **Step 4: Run `npx vitest run server/jarvis/run-acceptance.test.ts src/lib/parse-handoff.test.ts`** — PASS

- [ ] **Step 5: Do not commit**

---

### Task 6: Classification-aware IC / phase skips

**Files:**
- Create: `skills/org/CLASSIFICATION-SKIPS.md`
- Create: `tools/org-command-center/src/lib/classification-skips.ts`
- Create: `tools/org-command-center/src/lib/classification-skips.test.ts`
- Modify: `tools/org-command-center/src/lib/parse-registry.ts` only if you prefer embedding the table in ORG-REGISTRY — **do not**. Keep a separate file.
- Modify: `tools/org-command-center/server/jarvis/dispatch-for.ts` — when building a packet, if `preferred_ic` is in the skip list for the tracker classification, throw `JarvisExecError` with `skipped_ic`.
- Modify: `tools/org-command-center/server/jarvis/dispatch-for.ts` tests (or add `dispatch-for` coverage in a new test if none exists for preferred_ic).
- Modify: `skills/org/ORG-REGISTRY.md` — one line under the phase table: “Classification may drop ICs/phases — see CLASSIFICATION-SKIPS.md.”
- Modify: `skills/org/orchestrator/SKILL.md` — do not queue skipped phases unless the operator waives.

**Interfaces:**

```ts
export type ClassificationSkips = {
  skipIcs: string[];
  skipPhases: string[];
};

export function parseClassificationSkips(md: string): {
  rows: { match: RegExp; skipIcs: string[]; skipPhases: string[] }[];
};

export function resolveClassificationSkips(
  classification: string,
  md: string,
): ClassificationSkips;
```

`CLASSIFICATION-SKIPS.md` content:

```markdown
# Classification → skipped ICs and phases

Match is case-insensitive substring against tracker **Classification**.

| Match | Skip ICs | Skip phases |
|-------|----------|-------------|
| internal | seo-manager, pr-manager | 7, 13, 16, 18, 19 |
```

Meaning for Sieger-class work: Phase 2 still runs MRA + CIA; SEO is not spawned. Phase 6 still runs PMM + content-strategist; PR is not spawned. Phases 7/13/16/18/19 are not queued unless the operator writes a waiver in the register (`waiver: run phase 7`).

- [ ] **Step 1: Failing tests for `resolveClassificationSkips("Internal (+ SaaS-optional)", md)` → skipIcs includes `seo-manager` and `pr-manager`; skipPhases includes `"7"`.**

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement parser + `dispatch-for.ts` guard:**

```ts
  const skips = resolveClassificationSkips(
    tracker.classification,
    readFileSync(join(repoRoot, "skills/org/CLASSIFICATION-SKIPS.md"), "utf8"),
  );
  if (preferred_ic && skips.skipIcs.includes(preferred_ic)) {
    throw new JarvisExecError(
      `${preferred_ic} skipped for classification ${tracker.classification}`,
      "skipped_ic",
    );
  }
  if (skips.skipPhases.includes(phase)) {
    throw new JarvisExecError(
      `phase ${phase} skipped for classification ${tracker.classification}`,
      "skipped_phase",
    );
  }
```

If `CLASSIFICATION-SKIPS.md` is missing in a temp test repo, treat as no skips (do not break existing dispatch tests). Use `existsSync`.

- [ ] **Step 4: Run classification-skips tests + existing dispatch/queue tests — PASS**

- [ ] **Step 5: Do not commit**

---

### Task 7: Slim packets and spawn prompt

**Files:**
- Modify: `tools/org-command-center/server/sources/context-reads.ts`
- Modify: `tools/org-command-center/server/sources/context-reads.test.ts`
- Modify: `tools/org-command-center/server/spawn.ts` (`buildManagerPrompt` acceptance lines)
- Modify: `tools/org-command-center/server/spawn.test.ts` if it snapshots the prompt
- Modify: `tools/org-command-center/server/queue-validated-dispatch.ts` — append constraint strings (do not dump lock text into `goal`)

**Interfaces:**
- `appendVentureContextReads` prepends `MEMORY/decisions.md` when the file exists, immediately after `context.md`.
- Every queued packet gets these constraints if not already present:

```
- Read MEMORY/decisions.md. Do not restate locked decisions in the operator brief.
- Do not re-ask locked ids. At most one new Open question, and only if it is not already on the register.
- Operator brief is a delta: what this seat uniquely produced. Product one-liners fail acceptance (brief_echo).
- Packs used must be rows from your position SKILL.md Skill packs table.
```

- [ ] **Step 1: Failing test in `context-reads.test.ts`**

```ts
  it("prepends MEMORY/decisions.md when present", () => {
    root = seedWithContextOnly();
    writeFileSync(
      join(root, "docs/projects/a/MEMORY/decisions.md"),
      "# Decisions\n",
      "utf8",
    );
    const out = appendVentureContextReads(root, []);
    expect(out[0]).toMatch(/MEMORY\/context\.md$/);
    expect(out[1]).toMatch(/MEMORY\/decisions\.md$/);
  });
```

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement** — in `appendVentureContextReads`, after context.md:

```ts
  const decisionsRel = `${memoryRel(repoRoot)}/decisions.md`;
  if (existsSync(join(repoRoot, decisionsRel))) {
    prefix.push(decisionsRel);
  }
```

In `queueValidatedDispatch`, after `must_read` merge:

```ts
  const discipline = [
    "Read MEMORY/decisions.md. Do not restate locked decisions in the operator brief.",
    "Do not re-ask locked ids. At most one new Open question, and only if it is not already on the register.",
    "Operator brief is a delta: what this seat uniquely produced.",
    "Packs used must be rows from your position SKILL.md Skill packs table.",
  ];
  body.constraints = mergeUniqueStrings(body.constraints, discipline);
```

Add `mergeUniqueStrings` locally (same pattern as `mergeUniquePaths`).

In `spawn.ts` `acceptanceLines`, push:

```
- discipline: operator brief must be a delta; do not re-ask locked register ids; packs used must match your SKILL.md.
- After a shippable MVP exists, do not implement product bugs or design in this orchestrator/manager session — queue the phase owner (cto / creative-director).
```

- [ ] **Step 4: Run `npx vitest run server/sources/context-reads.test.ts server/queue-validated-dispatch.test.ts server/spawn.test.ts`** — PASS

- [ ] **Step 5: Do not commit**

---

### Task 8: Templates, HEARTBEAT, orchestrator stay-in-role

**Files:**
- Modify: `skills/org/HANDOFF-TEMPLATE.md`
- Modify: `skills/org/MANAGER-BRIEF-TEMPLATE.md` (same operator-brief rules)
- Modify: `skills/org/CSUITE-REVIEW-TEMPLATE.md` (already touched in Task 5 — finish merge-gate bullets)
- Modify: `skills/org/COLLABORATION.md` (Operator brief section)
- Modify: `skills/org/templates/HEARTBEAT.md`
- Modify: `skills/org/orchestrator/SKILL.md`
- Modify: `skills/org/orchestrator/HEARTBEAT.md`
- Modify: `skills/org/positions/product-manager/HEARTBEAT.md` as the pattern; do **not** edit every seat HEARTBEAT — add one line to the shared template and orchestrator only, plus a note in COLLABORATION that managers reject echo.
- Create: `templates/org/MEMORY/decisions.md`

No OCC test for prose. Verification: grep the new headings exist.

- [ ] **Step 1: Write `templates/org/MEMORY/decisions.md`**

```markdown
# Decisions

Canonical operator register. Seats read this; they do not retell it.

## Locked
| id | decision | asked_as |
|----|----------|----------|
| | | |

## Open
| id | question | owner |
|----|----------|-------|
| | | |

## Blocked
| id | question | blocked_by |
|----|----------|------------|
| | | |
```

- [ ] **Step 2: Change HANDOFF-TEMPLATE operator brief to**

```markdown
## Operator brief (plain English)
3–5 sentences that are a **delta**: what this seat uniquely produced, one decision, whether work can continue.
Do **not** restate the product one-liner or locked register rows.
Do **not** re-ask a Locked id. At most one new Open question, and only if it is absent from MEMORY/decisions.md.
```

Add merge-gate items 10–12:

```
10. Operator brief Jaccard vs any other same-phase handoff is ≤ 0.35 (OCC: `brief_echo`).
11. Next steps / Asks do not contain Locked `asked_as` tokens (OCC: `reask:<id>`).
12. Packs used ⊆ position SKILL.md Skill packs table (+ handoff templates).
```

- [ ] **Step 3: HEARTBEAT template — insert after Packet**

```
2b. **Register** — Read MEMORY/decisions.md. Locked items are facts, not your findings.
2c. **Return** — Operator brief is a delta. One new ask max. Then stop.
```

Orchestrator SKILL.md Hard rules — add:

```
8. **Stay dispatcher after shippable** — Once Phase 9 (or any shippable) has a Layer B app, bugs, PDF alignment, and design passes are new packets to `cto` or `creative-director`. The orchestrator session does not implement them.
9. **Classification skips** — Honor CLASSIFICATION-SKIPS.md. Do not spawn skipped ICs or queue skipped phases without an operator waiver on the register.
```

Orchestrator HEARTBEAT — add matching items 11–12.

- [ ] **Step 4: Grep verification**

Run:

```bash
rg -n "brief_echo|asked_as|Stay dispatcher|CLASSIFICATION-SKIPS" \
  skills/org/HANDOFF-TEMPLATE.md \
  skills/org/orchestrator/SKILL.md \
  skills/org/templates/HEARTBEAT.md \
  skills/org/CLASSIFICATION-SKIPS.md
```

Expected: each file hits.

- [ ] **Step 5: Do not commit**

---

### Task 9: Upgrade Sieger register format (data only, no app)

**Files:**
- Modify: `docs/orgs/velocity-agency/customers/blacksage-kennels/initiatives/sieger-show-secretary/MEMORY/decisions.md`
- Mirror if vault copy is a separate file (not a symlink): `memorybank/org/velocity-agency/blacksage-kennels/sieger-show-secretary/MEMORY/decisions.md`

Keep every existing decision. Add `asked_as` so the new gate would have caught the Sieger echo.

- [ ] **Step 1: Rewrite Sieger `decisions.md` to Locked/Open/Blocked** using the current rows:

Locked (examples — keep the rest of the current table as locked rows):

| id | decision | asked_as |
|----|----------|----------|
| C1 | Classification = Internal (+ SaaS-optional) | |
| O1 | First-show rulebook = ADRK | which rulebook, first-show rulebook, ADRK / USRC |
| B3 | Free tier / no budget | vendor spend, LeMUR, Resend 100 |
| L-multi | Multi-show + Supabase Auth | |
| L-resend | Owner email via Resend | |
| L-offline | Record-only offline | |
| L-skip78 | Skip phases 7–8; Phase 9 waiver | |
| L-adrk-tnrk | TNRK 2026 PDF pack is fillable-form authority | |
| L-showdesk | Design territory = Show Desk | |

Open:

| id | question | owner |
|----|----------|-------|
| O2 | Gold approved ADRK critique PDF | operator |
| B1 | First-show entry count + same-day vs staggered email | operator |
| O4 | First show date / venue | operator |

- [ ] **Step 2: Confirm parser**

Run a one-off in Vitest or `npx tsx -e` that reads the Sieger file and `findLockedReasks` on the Phase 5 PM next-steps paragraph returns `O1` and `B3` and does **not** return `O2`.

- [ ] **Step 3: Do not commit**

---

### Task 10: Wave 1 OCC test pass + graphify

**Files:** none new

- [ ] **Step 1: Run** `cd tools/org-command-center && npm test`
Expected: PASS. If a `HandoffRecord` fixture breaks, add the three new fields as empty defaults.

- [ ] **Step 2: Run** `graphify update tools/org-command-center` from repo root (AST-only).

- [ ] **Step 3: Report** — list Wave 1 `missing` codes (`reask:`, `brief_echo:`, `pack_not_allowed:`). Wave 2 codes land in Task 19.

---

### Task 11: Artifact quality scorecard (structural)

**Files:**
- Create: `skills/org/ARTIFACT-QUALITY.md`
- Create: `tools/org-command-center/src/lib/artifact-quality.ts`
- Create: `tools/org-command-center/src/lib/artifact-quality.test.ts`
- Modify: `tools/org-command-center/server/jarvis/run-acceptance.ts`
- Modify: `tools/org-command-center/server/jarvis/run-acceptance.test.ts`

**Interfaces:**

```ts
export type QualityCheck = {
  id: string;
  phase: string;
  artifactRel: string; // repo-relative, may start with business-idea/
  headingIncludes: string[]; // each must appear as a markdown heading or bold label
};

export function parseArtifactQuality(md: string): QualityCheck[];
export function qualityFailures(
  checks: QualityCheck[],
  phase: string,
  readArtifact: (rel: string) => string | null,
): string[];
```

`ARTIFACT-QUALITY.md` starter (only phases that failed as memos on Sieger — do not catalog all 22):

```markdown
# Artifact quality (structural)

v1 checks that the leased artifact has the headings a named audience needs. Not taste.

| id | phase | artifact | must_contain_headings |
|----|-------|----------|------------------------|
| q5-prd | 5 | 05-prd.md | Personas, MoSCoW, User stories, NOT doing |
| q6-gtm | 6 | 06-gtm-plan.md | Enablement, Claims discipline, Measurement |
| q3-strategy | 3 | 03-strategy.md | Recommended path, NOT doing, Operator gates |
| q9-build | 9 | 09-build-log.md | PRD traceability, Demo path, Honest gaps |
```

`qualityFailures` returns `quality_fail:q5-prd` when the file is missing a listed heading (case-insensitive). If the artifact file is absent, return `quality_scorecard` once.

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, it } from "vitest";
import { parseArtifactQuality, qualityFailures } from "./artifact-quality";

const MD = `# Artifact quality
| id | phase | artifact | must_contain_headings |
| q5-prd | 5 | 05-prd.md | Personas, MoSCoW, User stories |
`;

describe("qualityFailures", () => {
  it("fails when MoSCoW heading is missing", () => {
    const checks = parseArtifactQuality(MD);
    const missing = qualityFailures(checks, "5", () => "# PRD\n## Personas\n## User stories\n");
    expect(missing).toEqual(["quality_fail:q5-prd"]);
  });

  it("passes when all headings exist", () => {
    const checks = parseArtifactQuality(MD);
    const missing = qualityFailures(
      checks,
      "5",
      () => "# PRD\n## Personas\n## MoSCoW\n## User stories\n",
    );
    expect(missing).toEqual([]);
  });

  it("returns quality_scorecard when the artifact file is missing", () => {
    const checks = parseArtifactQuality(MD);
    expect(qualityFailures(checks, "5", () => null)).toEqual(["quality_scorecard"]);
  });

  it("ignores other phases", () => {
    const checks = parseArtifactQuality(MD);
    expect(qualityFailures(checks, "2", () => null)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run** `cd tools/org-command-center && npx vitest run src/lib/artifact-quality.test.ts` — FAIL

- [ ] **Step 3: Implement parser** using `parseMarkdownTable` / `tableAsObjects`. Heading match: artifact body has `## <name>` or `** <name> **` case-insensitive.

Wire into `evaluateRunAcceptance` when `skills/org/ARTIFACT-QUALITY.md` exists and the packet phase has rows. Resolve artifact path as `businessIdeaFile(repoRoot, artifactRel)`. Skip if the file is missing **and** the manager handoff `production_status` / `status` is `blocked` or `needs_input`.

- [ ] **Step 4: Acceptance test** — temp repo with `05-prd.md` missing MoSCoW, phase 5 packet, expect `quality_fail:q5-prd`.

- [ ] **Step 5: Do not commit**

---

### Task 12: Pack procedure map

**Files:**
- Create: `skills/org/PACK-PROCEDURES.md`
- Create: `tools/org-command-center/src/lib/pack-procedures.ts`
- Create: `tools/org-command-center/src/lib/pack-procedures.test.ts`
- Modify: `run-acceptance.ts` + test

**Interfaces:**

```ts
export type PackProcedure = {
  packKey: string; // normalized path without /SKILL.md
  requiredHeadings: string[];
};

export function parsePackProcedures(md: string): PackProcedure[];
export function procedureFailures(
  usedPacks: string[],
  procedures: PackProcedure[],
  artifactBodies: string[],
): string[];
```

`PACK-PROCEDURES.md` — only packs that were name-dropped or skipped on Sieger:

```markdown
# Pack procedures

If a handoff lists the pack, the leased artifacts (concatenated) must contain these headings.

| pack | required_headings |
|------|-------------------|
| skills/community/awesome-claude-corporate-skills/09-product-management/feature-spec | User stories, Functional requirements |
| skills/community/business-analysis-skills/skills/moscow-prioritisation | MoSCoW |
| skills/community/awesome-claude-corporate-skills/09-product-management/prd-writer | Executive summary, MoSCoW |
| skills/community/marketingskills/content-strategy | Enablement, Claims |
```

`procedureFailures` returns `pack_procedure:feature-spec` (last path segment) when a used pack is in the map and no artifact body has every required heading.

- [ ] **Step 1: Failing test** — used `.../feature-spec/` + body without `User stories` → `pack_procedure:feature-spec`. Body with both headings → `[]`. Pack not in the map → `[]`.

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement.** In acceptance, concat `primary` artifacts that exist on disk plus the phase quality artifact. If `PACK-PROCEDURES.md` is missing, skip.

- [ ] **Step 4: Acceptance test** — PM handoff cites feature-spec, `05-prd.md` has no User stories → `pack_procedure:feature-spec`.

- [ ] **Step 5: Do not commit**

---

### Task 13: Design-before-Phase-9 refuse + reference blocks

**Files:**
- Modify: `tools/org-command-center/src/lib/decision-register.ts` — parse optional `blocks_seats` on Open rows
- Modify: `tools/org-command-center/src/lib/decision-register.test.ts`
- Modify: `tools/org-command-center/server/jarvis/dispatch-for.ts`
- Modify: `tools/org-command-center/server/jarvis/dispatch-for.test.ts`
- Modify: `run-acceptance.ts` + test
- Modify: Task 9 Sieger register — add `blocks_seats` on O2: `product-manager, tech-lead, brand-designer`

**Interfaces:**
- `DecisionItem.blocksSeats: string[]`
- `findReferenceBlocks(register, position, status): string[]` — if status is `done` or `ready_to_merge` and position is in an Open item’s `blocks_seats`, return that id.

Dispatch rule for phase `9` (and `9B` no): if tracker classification is set and `DESIGN_LED_PRODUCTION_PHASES` has `9`, require either:
1. a file matching `**/design/*-design-brief.md` or `11-brand/MASTER.md` or `HANDOFFS/11-creative-director.md` under the venture business-idea, **or**
2. a Locked register id whose text matches `/design.?before.?build|skip design|waiver.*phase 9/i`

Else throw `JarvisExecError(..., "design_before_build")`. If `CLASSIFICATION-SKIPS` / decisions file missing in unit tests, skip this guard when `MEMORY/decisions.md` is absent (existing tests).

- [ ] **Step 1: Failing tests**

```ts
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
```

Dispatch test: phase 9 packet, no design brief, no waiver → throws `design_before_build`. Same with Locked waiver row → does not throw.

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement.** Acceptance pushes `reference_blocked:O2` when `findReferenceBlocks` hits. Dispatch pushes the design-before-build guard **before** enqueue.

- [ ] **Step 4: Tests pass**

- [ ] **Step 5: Do not commit**

---

### Task 14: Inbox points at the client artifact

**Files:**
- Modify: `tools/org-command-center/server/jarvis/review-inbox.ts` — parse `artifact_path` from inbox frontmatter
- Modify: `tools/org-command-center/server/jarvis/run-acceptance.ts`
- Modify: `tools/org-command-center/server/jarvis/run-acceptance.test.ts`
- Modify: `tools/org-command-center/src/lib/operator-summary.ts` (`OPERATOR_DELIVERABLE_FORMAT`)
- Modify: `tools/org-command-center/server/spawn.ts` — require `artifact_path` in inbox frontmatter list

**Interfaces:**
- Inbox YAML must include `artifact_path: docs/.../05-prd.md` (or Layer B path).
- `artifact_path` must exist on disk.
- `artifact_path` must not end with `HANDOFFS/` or equal the inbox filename.
- Missing / self-referential → `inbox_not_artifact`.
- Phase 6 extra: if classification matches `/internal/` and no `06-enablement/` file exists and `artifact_path` is only `06-gtm-plan.md`, still pass Wave 2 v1 (GTM plan is the artifact). Optional later: require `06-enablement/steward-card.md` — **do not** add that in v1 unless `ARTIFACT-QUALITY` gains a `q6-card` row. Add `q6-card` only as a commented example in ARTIFACT-QUALITY.md.

- [ ] **Step 1: Failing acceptance test** — `require_inbox: true`, inbox without `artifact_path` → `inbox_not_artifact`. Inbox with `artifact_path` pointing at a real `05-prd.md` → no that code.

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement.** Extend `hasMatchingInbox` or add a sibling check after inbox exists. Update `OPERATOR_DELIVERABLE_FORMAT` with:

```
### Client artifact
- Frontmatter artifact_path must point at the file the operator should open (PRD, app README, PDF, pocket card) — not this inbox memo and not the handoff.
```

- [ ] **Step 4: Tests pass** including existing inbox tests (add `artifact_path` to those fixtures that set `require_inbox: true`, or only enforce when `artifact_path` is present **or** phase is in `{3,5,6,9,11}`). **Enforce only for phases 3, 5, 6, 9, 11** so older inbox tests and Phase 0 peers do not break.

- [ ] **Step 5: Do not commit**

---

### Task 15: Few-shot examples, page limits, editor cut

**Files:**
- Create: `skills/org/examples/handoff-good.md`
- Create: `skills/org/examples/handoff-bad.md`
- Modify: `skills/org/HANDOFF-TEMPLATE.md`
- Modify: `skills/org/MANAGER-BRIEF-TEMPLATE.md`
- Modify: `skills/org/templates/HEARTBEAT.md`
- Modify: `tools/org-command-center/server/sources/context-reads.ts` — prepend the two example paths when they exist (repo-root relative).
- Modify: `context-reads.test.ts`

**Interfaces:**
- Good example: 4-sentence delta, one Next step, no product one-liner, packs table with feature-spec.
- Bad example: Sieger-style spoken-critique elevator pitch + re-ask rulebook. Header comment: `<!-- EXPECT: brief_echo + reask:O1 -->`
- Template: operator brief max **5 sentences**. Manager brief **What we found** max **5 bullets**. HEARTBEAT: “Merge cuts; do not concatenate IC briefs.”
- `appendVentureContextReads` adds `skills/org/examples/handoff-good.md` then `handoff-bad.md` after decisions.md.

- [ ] **Step 1: Failing test** — after writing the example files, `appendVentureContextReads` on a repo that has them includes both paths in order.

- [ ] **Step 2: Run — FAIL** (paths not prepended)

- [ ] **Step 3: Implement prepend.** Write the two example files. Do not run Jaccard in this task; Task 2 already covers the algorithm. Optionally add a test that `briefJaccard(good, bad) < 0.35` using the real files.

- [ ] **Step 4: Tests pass**

- [ ] **Step 5: Do not commit**

---

### Task 16: Model-tier hard fail

**Files:**
- Modify: `tools/org-command-center/src/jarvis/model-quality.ts` — treat `fallback_applied` true on `creative-language` / `frontier-reasoning` as `ok: false`
- Create or modify: `tools/org-command-center/src/jarvis/model-quality.test.ts` (create if missing)
- Modify: `run-acceptance.ts` — call `assessHandoffModelQuality` for the primary handoff vs MODEL-REGISTRY
- Modify: `run-acceptance.test.ts`

**Interfaces:**
- Missing code `model_tier` when `assessHandoffModelQuality(...).ok === false`.
- Load expected from `parseModelRegistry` + `primary.position`.
- If MODEL-REGISTRY.md is absent in the temp repo, skip (do not break existing tests). Copy the fixture `src/lib/fixtures/sample-model-registry.md` into temp repos that need the check.

- [ ] **Step 1: Failing tests**

```ts
  it("fails when handoff tier does not match registry", () => {
    expect(
      assessHandoffModelQuality(
        { llmTier: "fast-ops", generationProfile: "none", fallbackApplied: "false" } as HandoffRecord,
        { llmTier: "creative-language", generationProfile: "none" },
        "6",
      ).ok,
    ).toBe(false);
  });

  it("fails when creative-language seat set fallback_applied true", () => {
    expect(
      assessHandoffModelQuality(
        { llmTier: "creative-language", generationProfile: "none", fallbackApplied: "true" } as HandoffRecord,
        { llmTier: "creative-language", generationProfile: "none" },
        "6",
      ).ok,
    ).toBe(false);
  });
```

Use a partial object only if tests already cast; otherwise pass a full `HandoffRecord` test helper.

- [ ] **Step 2: Run — FAIL** (fallback currently returns ok)

- [ ] **Step 3: Implement.** Change fallback branch to `ok: false, detail: "fallback_applied"` when expected.llmTier is `creative-language` or `frontier-reasoning`. Wire acceptance.

- [ ] **Step 4: Tests pass**

- [ ] **Step 5: Do not commit**

---

### Task 17: Revise-from-redlines re-wake

**Files:**
- Create: `tools/org-command-center/src/lib/redlines.ts`
- Create: `tools/org-command-center/src/lib/redlines.test.ts`
- Modify: `tools/org-command-center/src/lib/parse-handoff.ts` — parse `## Redlines` table
- Modify: `tools/org-command-center/src/lib/types.ts` — `redlines: { path: string; comment: string }[]`
- Modify: `tools/org-command-center/server/spawn.ts` — `buildRewakePrompt` includes formatted redlines when the latest csuite/manager handoff for the packet phase has `verdict: revise` and a Redlines table
- Modify: `tools/org-command-center/server/spawn.test.ts`
- Modify: `skills/org/CSUITE-REVIEW-TEMPLATE.md` — required Redlines table when verdict is revise

**Interfaces:**

```ts
export type Redline = { path: string; comment: string };

export function parseRedlines(body: string): Redline[];
export function formatRedlineInstruction(redlines: Redline[]): string;
```

Redlines table:

```markdown
## Redlines
| path | comment |
|------|---------|
| 05-prd.md#US-014 | Acceptance does not mention offline queue flush |
```

`formatRedlineInstruction` returns:

```
## Redlines (do not restart)
Revise only these leased paths. Leave everything else.
- `05-prd.md#US-014`: Acceptance does not mention offline queue flush
```

`buildRewakePrompt`: if `instruction` is empty, load `HANDOFFS/<phase>-csuite-review.md` from the venture; if verdict is revise, append `formatRedlineInstruction`. If no redlines on a revise verdict, still append `"C-suite verdict is revise but Redlines table is empty — ask orchestrator for section comments."`

- [ ] **Step 1: Failing unit tests** for parse + format. Failing spawn test: temp repo with revise + redlines table → prompt contains `05-prd.md#US-014`.

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement**

- [ ] **Step 4: Tests pass**

- [ ] **Step 5: Do not commit**

---

### Task 18: Orchestrator + C-suite + production-artifacts copy for the new flow

**Files:**
- Modify: `skills/org/orchestrator/SKILL.md` — add the 8-beat flow (brief → concept → craft → edit → produce → verify → client review → revise/ship)
- Modify: `skills/org/orchestrator/HEARTBEAT.md`
- Modify: `skills/org/packs/production-artifacts/SKILL.md` — Office QA: existence is not enough when `ARTIFACT-QUALITY.md` has a row for that phase; design-before-Phase-9 is a dispatch refuse
- Modify: `skills/org/CSUITE-REVIEW-TEMPLATE.md` — scorecard rows: Artifact quality? Pack procedure? Client artifact path? Model tier?
- Modify: `skills/org/COLLABORATION.md` — manager merge is an edit pass
- Modify: `skills/org/HANDOFF-TEMPLATE.md` merge gate items 13–16 for the new codes

No new runtime. Grep verification.

- [ ] **Step 1: Edit the files.** Orchestrator hard rule 10:

```
10. **Agency beats** — Do not mark a phase ready for C-suite until the inbox artifact_path is the file a client would open, quality scorecard passes, and Open register items that block this seat are not marked done.
```

- [ ] **Step 2: Grep**

```bash
rg -n "artifact_path|quality_fail|design_before_build|Redlines|Agency beats" \
  skills/org/orchestrator/SKILL.md \
  skills/org/CSUITE-REVIEW-TEMPLATE.md \
  skills/org/HANDOFF-TEMPLATE.md \
  skills/org/packs/production-artifacts/SKILL.md
```

Expected: each file hits at least one.

- [ ] **Step 3: Do not commit**

---

### Task 19: Full OCC test pass + graphify (both waves)

**Files:** none new

- [ ] **Step 1: Run** `cd tools/org-command-center && npm test`
Expected: PASS. Update `HandoffRecord` fixtures with `redlines: []` if needed. Phase 0 inbox tests must not require `artifact_path`.

- [ ] **Step 2: Run** `graphify update tools/org-command-center` from repo root (AST-only).

- [ ] **Step 3: Report** the full missing-code list:

Wave 1: `reask:`, `brief_echo:`, `pack_not_allowed:`, `packs_used_missing`, `csuite_no_new_risk`, `happy_path_spec`, `happy_path_status`

Wave 2: `quality_scorecard`, `quality_fail:`, `pack_procedure:`, `design_before_build`, `inbox_not_artifact`, `reference_blocked:`, `model_tier`

---

## Self-review

**Spec coverage (hygiene):**
1. Decision register + ban re-asks → Tasks 1, 4, 7, 9
2. Delta-only operator brief → Tasks 2, 3, 4, 8, 15
3. Pack allowlist → Tasks 2, 4, 8
4. Classification-aware skip → Task 6
5. C-suite must add a risk → Task 5
6. Stay the orchestrator after build → Tasks 7–8, 18
7. Verifier happy-path spec → Task 5

**Spec coverage (agency quality):**
8. Artifact quality scorecard → Task 11
9. Pack procedure → Task 12
10. Design before build → Task 13
11. Inbox = client artifact → Task 14
12. Few-shot + editor cut → Task 15
13. Model-tier hard fail → Task 16
14. Revise from redlines → Task 17
15. Blocked if gold reference missing → Task 13
16. Flow copy in orchestrator / production-artifacts → Task 18

**Out of scope (do not sneak in):** rewriting Sieger handoffs; raising Sieger Playwright coverage; LLM-as-judge; migrating every venture’s legacy `decisions.md`; requiring a steward pocket card in v1; deep slide/content QA of pptx.

**Placeholder scan:** none.

**Type consistency:** Wave 1 codes unchanged. Wave 2 codes listed in Task 19. `DecisionItem.blocksSeats` added in Task 13. `Redline` in Task 17. `BRIEF_ECHO_THRESHOLD = 0.35` unchanged.
