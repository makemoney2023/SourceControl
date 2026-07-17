# Seat Reports + Company Operator Gaps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace manual “File report” with a derived **Seat Report** for every digital worker, then close operator gaps: actionable next steps (human vs agent), live runs, escalations, scorecards/artifacts, voice/company digest, pin freshness, HEARTBEAT, parallel tracks, csuite draft, seat spend, handoff alerts, and model-routing quality signals.

**Architecture:** Pure `buildSeatReport` / `buildCompanyDigest` over FS truth. Situation Room is read-first with deep-links into Assign / Play / Runs / handoff paths. Writes stay explicit (Pin snapshot, Draft csuite review, alert ack). No Paperclip.

**Tech Stack:** TypeScript, Vitest, Hono, React Situation Room, `HANDOFFS/`, `DISPATCH/`, `BRIEFINGS/`, `skills/org/ESCALATION.md` + templates.

## Global Constraints

- FS/markdown remains source of truth.
- TDD on every builder and parser change.
- Touch only `tools/org-command-center/`, `docs/superpowers/specs/`, `docs/projects/<active>/business-idea/HANDOFFS/` (generated drafts only), and this plan.
- Do not break Assign / Play / Cancel / Rewake / routines / spend ledger.
- Seat Report works for **any** roster slug (CEO, managers, ICs).
- Mac / zsh; `npm test` + `npm run build` after each wave.

## Waves

| Wave | Tasks | Outcome |
|------|-------|---------|
| **A — Seat Report core** | 1–6 | Derived report + API + UI for all seats |
| **B — Operator fidelity** | 7–10 | Actions, voice, digest, pin/HEARTBEAT/parallel/freshness |
| **C — Company gaps** | 11–14 | Csuite draft, seat spend UI, handoff alerts, model-quality |

---

## Design lock

### Seat Report fields

| Field | Source |
|-------|--------|
| identity / role | ORG-REGISTRY (`ceo` if `ceo-strategist`, else manager/ic) |
| pulse + freshness | latest handoff + latest run `started_at`/`finished_at` |
| own / downward / upward | HANDOFFS + roster `reportsTo` |
| asks / blockers | handoff sections |
| escalations[] | manager `recommendation: escalate` + tags → `ESCALATION.md` secondary |
| liveRuns[] | `DISPATCH/runs` for slug (in-flight + last error) |
| liveTasks[] | `buildTasks` filtered |
| artifacts[] | handoff artifact paths + `existsSync` |
| scorecard | phase owner scorecard string + hard-gate flag |
| heartbeat | whether `skills/org/positions/<slug>/HEARTBEAT.md` exists; optional checked items later |
| spend | `spend.json` `bySeat[slug]` (already recorded) |
| modelQuality[] | handoff `llm_tier`/`generation_profile` vs MODEL-REGISTRY expectations |
| nextActions[] | each has `actor: "human" \| "agent"`, `kind`, optional `cta` |
| pinnedBriefing | optional; include `stale` if pinned `updated_at` < latest handoff/run |

### Next-action `actor`

| actor | Meaning |
|-------|---------|
| `human` | Operator must decide / click (Assign, approve gate, unblock policy) |
| `agent` | Digital worker should be spawned / rewaked / continue |

### CTA kinds (UI deep-links)

`run_next` · `assign` · `open_runs` · `rewake` · `open_handoff` · `draft_csuite` · `open_report` · `none`

### Former “out of scope” — now in Wave C

1. Auto-draft `HANDOFFS/<phase>-csuite-review.md` from report (verdict blank; scorecard prefilled)
2. Surface per-seat spend (ledger already exists)
3. Alerts when IC/manager handoff appears or status→blocked/escalate
4. Model-routing quality flags on seat report (wrong tier / missing profile for gen phases)

### Non-goals (still)

- Replacing HANDOFF / MANAGER / CSUITE templates wholesale
- Paperclip / Postgres
- Auto-`approve` without human or ceo-strategist run
- Silent overwrite of richer agent standups (Pin must warn if stale/newer exists)

---

## File map

| Path | Responsibility |
|------|----------------|
| `docs/superpowers/specs/2026-07-16-org-command-center-design.md` | v3.3 (+ company operator gaps) |
| `tools/org-command-center/src/lib/parse-handoff.ts` | asks, blockers, escalation tags, recommendation |
| `tools/org-command-center/src/lib/types.ts` | HandoffRecord extensions |
| `tools/org-command-center/src/jarvis/escalation.ts` | tag → secondary reviewer map |
| `tools/org-command-center/src/jarvis/seat-report.ts` | `buildSeatReport` |
| `tools/org-command-center/src/jarvis/company-digest.ts` | company rollup |
| `tools/org-command-center/src/jarvis/artifact-check.ts` | path existence |
| `tools/org-command-center/src/jarvis/model-quality.ts` | tier/profile checks |
| `tools/org-command-center/src/jarvis/csuite-draft.ts` | render draft review md |
| `tools/org-command-center/src/jarvis/alerts.ts` | handoff alert diff |
| `tools/org-command-center/server/api.ts` | seat-report, digest, draft, alerts |
| `tools/org-command-center/server/chat.ts` | tools |
| `tools/org-command-center/src/api/client.ts` | fetch helpers |
| `tools/org-command-center/src/jarvis/SituationRoom.tsx` | Report UI, CTAs, digest, alerts chip |
| `tools/org-command-center/README.md` | operator docs |

---

# Wave A — Seat Report core

### Task 1: Spec v3.3

**Files:**
- Modify: `docs/superpowers/specs/2026-07-16-org-command-center-design.md`
- Modify: `tools/org-command-center/README.md`

- [ ] **Step 1: Append v3.3** (full text)

```markdown
## Seat reports + company operator gaps (v3.3)

**Status:** Active  
**Plan:** `docs/superpowers/plans/2026-07-16-seat-reports.md`

### Problem

“File report” was a manual standup form. Operators need a derived view of what every digital worker reported, what the runbook requires next, and which actions are human vs agent.

### Seat Report

`GET /api/seat-report/:slug` for any roster slug. Fields: identity, role, freshness, own/downward handoffs, asks/blockers, escalations (ESCALATION.md), liveRuns, liveTasks, artifact existence, scorecard/hard-gate, HEARTBEAT presence, seat spend, modelQuality, nextActions (`actor` + `cta`), pinnedBriefing with stale flag.

### Company digest

`GET /api/company-digest` — blocked/escalate seats, awaiting csuite, queue depth, parallel tracks (phase ≥ 10), unread handoff alerts.

### Writes (explicit)

| Action | Effect |
|--------|--------|
| Pin snapshot | `BRIEFINGS/<slug>-standup.md` from derived report; refuse silent overwrite if disk newer without confirm |
| Draft csuite review | Create/update draft `HANDOFFS/<phase>-csuite-review.md` (verdict unset) |
| Ack alert | Mark handoff alert seen in `DISPATCH/alerts.json` |

### Voice

`POST /api/voice/brief` accepts `{ mode: "mission" \| "seat" \| "digest", slug? }`. Default seat = `ceo-strategist` when mode=seat.

### Non-goals

No Paperclip; no auto-approve; templates remain canonical.
```

- [ ] **Step 2: README rows**

```markdown
| Seat Report | Derived status + human/agent next actions for any worker |
| Company digest | Blocked/escalate/awaiting-csuite rollup + handoff alerts |
```

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-07-16-org-command-center-design.md \
  docs/superpowers/plans/2026-07-16-seat-reports.md \
  tools/org-command-center/README.md
git commit -m "$(cat <<'EOF'
docs: seat reports v3.3 — derived reports and company operator gaps

EOF
)"
```

---

### Task 2: Parse handoff asks, blockers, escalations (TDD)

**Files:**
- Modify: `tools/org-command-center/src/lib/types.ts`
- Modify: `tools/org-command-center/src/lib/parse-handoff.ts`
- Modify: `tools/org-command-center/src/lib/parse-handoff.test.ts`
- Create: `tools/org-command-center/src/jarvis/escalation.ts`
- Create: `tools/org-command-center/src/jarvis/escalation.test.ts`

**Interfaces:**
- Produces on `HandoffRecord`: `asks: string[]`, `blockers: string[]`, `recommendation: string`, `escalationTags: string[]`
- Produces: `resolveEscalationSecondaries(tags: string[]): string[]`

- [ ] **Step 1: Extend `HandoffRecord`**

```ts
asks: string[];
blockers: string[];
recommendation: string;
escalationTags: string[];
```

- [ ] **Step 2: Failing tests**

```ts
// parse-handoff.test.ts
it("extracts asks, blockers, recommendation, escalation tags", () => {
  const h = parseHandoff(
    "2-manager-head-of-research.md",
    `---
phase: "2"
position: "head-of-research"
reports_to: "ceo-strategist"
status: ready_for_csuite
recommendation: escalate
escalation_tags: [evidence, spend]
---
# Brief
## Asks for manager (\`ask_manager\`)
- Need ICP definition
## Risks / blockers
- Pricing gap
`,
  );
  expect(h.recommendation).toBe("escalate");
  expect(h.escalationTags).toEqual(["evidence", "spend"]);
  expect(h.asks[0]).toMatch(/ICP/);
  expect(h.blockers[0]).toMatch(/Pricing/);
});

// escalation.test.ts
import { resolveEscalationSecondaries } from "./escalation";
it("maps tags to secondaries", () => {
  expect(resolveEscalationSecondaries(["legal", "brand"])).toEqual([
    "coo",
    "creative-director",
  ]);
  expect(resolveEscalationSecondaries(["spend"])).toEqual(["cfo"]);
});
```

- [ ] **Step 3: Run — FAIL**

```bash
cd tools/org-command-center && npm test -- src/lib/parse-handoff.test.ts src/jarvis/escalation.test.ts
```

- [ ] **Step 4: Implement**

`parse-handoff.ts` — section bullet helper (same as prior plan); frontmatter:

```ts
recommendation: String(data.recommendation ?? data.verdict_for_manager ?? ""),
escalationTags: Array.isArray(data.escalation_tags)
  ? data.escalation_tags.map(String)
  : String(data.escalation_tags ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
```

`escalation.ts`:

```ts
const MAP: Record<string, string> = {
  legal: "coo",
  brand: "creative-director",
  spend: "cfo",
  scope: "head-of-product",
  evidence: "head-of-research",
};

export function resolveEscalationSecondaries(tags: string[]): string[] {
  const out: string[] = [];
  for (const t of tags) {
    const s = MAP[t.toLowerCase()];
    if (s && !out.includes(s)) out.push(s);
  }
  return out;
}
```

Update fixtures/constructors to include new fields.

- [ ] **Step 5: PASS + commit**

```bash
cd tools/org-command-center && npm test -- src/lib/parse-handoff.test.ts src/jarvis/escalation.test.ts
git add tools/org-command-center/src/lib/types.ts \
  tools/org-command-center/src/lib/parse-handoff.ts \
  tools/org-command-center/src/lib/parse-handoff.test.ts \
  tools/org-command-center/src/jarvis/escalation.ts \
  tools/org-command-center/src/jarvis/escalation.test.ts
git commit -m "$(cat <<'EOF'
feat(occ): parse handoff asks, blockers, and escalation tags

EOF
)"
```

---

### Task 3: `buildSeatReport` (TDD) — enriched

**Files:**
- Create: `tools/org-command-center/src/jarvis/seat-report.ts`
- Create: `tools/org-command-center/src/jarvis/seat-report.test.ts`
- Create: `tools/org-command-center/src/jarvis/artifact-check.ts`
- Create: `tools/org-command-center/src/jarvis/artifact-check.test.ts`

**Interfaces:**

```ts
export type SeatRole = "ceo" | "manager" | "ic";
export type ActionActor = "human" | "agent";
export type ActionCta =
  | "run_next"
  | "assign"
  | "open_runs"
  | "rewake"
  | "open_handoff"
  | "draft_csuite"
  | "open_report"
  | "none";

export interface SeatNextAction {
  id: string;
  priority: number;
  label: string;
  actor: ActionActor;
  kind: string;
  cta: ActionCta;
  phase?: string;
  relatedSlug?: string;
  handoffFilename?: string;
  runId?: string;
}

export interface SeatEscalation {
  phase: string;
  fromSlug: string;
  tags: string[];
  secondaries: string[];
}

export interface SeatLiveRun {
  runId: string;
  status: string;
  phase: string;
  error?: string;
  started_at: string;
  finished_at?: string;
  cost_usd?: number;
}

export interface SeatArtifactCheck {
  path: string;
  exists: boolean;
  fromHandoff: string;
}

export interface SeatReport {
  slug: string;
  title: string;
  role: SeatRole;
  dept: string;
  reportsTo: string;
  pulse: string;
  summary: string;
  lastActivityAt: string | null;
  relevantPhases: string[];
  hardGate: boolean;
  scorecard: string;
  heartbeatPath: string | null;
  spend: { tokens: number; cost_usd: number } | null;
  ownHandoffs: Array<{ filename: string; phase: string; status: string; verdict: string }>;
  downward: Array<{
    slug: string;
    title: string;
    latestStatus: string;
    asks: string[];
    blockers: string[];
  }>;
  escalations: SeatEscalation[];
  upwardAsks: string[];
  upwardBlockers: string[];
  liveRuns: SeatLiveRun[];
  liveTasks: Array<{ id: string; title: string; status: string }>;
  artifacts: SeatArtifactCheck[];
  modelQuality: Array<{ filename: string; ok: boolean; detail: string }>; // stub empty until Task 14
  nextActions: SeatNextAction[];
  pinnedBriefing: {
    status: string;
    progress: string;
    updatedAt: string;
    stale: boolean;
  } | null;
}
```

- [ ] **Step 1: Artifact helper test + impl**

```ts
// artifact-check.ts
import { existsSync } from "node:fs";
import { join } from "node:path";

export function checkArtifacts(
  repoRoot: string,
  items: Array<{ path: string; fromHandoff: string }>,
): Array<{ path: string; exists: boolean; fromHandoff: string }> {
  return items.map((i) => ({
    ...i,
    exists: existsSync(join(repoRoot, i.path)),
  }));
}
```

- [ ] **Step 2: Seat report tests** — CEO human+agent actions, manager await_ic, IC complete_handoff, unknown→null, escalation secondaries, live run in-flight, missing artifact `exists: false`, pinned stale when handoff newer

Include fixture run:

```ts
liveRuns expectation: status "running" → nextAction cta open_runs, actor agent or human "Monitor run"
```

CEO escalate path:

```ts
expect(report.escalations[0].secondaries).toContain("head-of-research");
expect(report.nextActions.some((a) => a.actor === "human" && /secondary|escalat/i.test(a.label))).toBe(true);
```

- [ ] **Step 3: Implement `buildSeatReport`**

Role rules (minimum):

**CEO**
1. queue > 0 → `{ actor:"human", cta:"run_next", label:"Run next queued dispatch" }`
2. awaiting csuite → `{ actor:"human", cta:"draft_csuite", label:"Complete C-suite review phase N" }` + optional `{ actor:"agent", cta:"none", label:"Spawn ceo-strategist to draft review" }`
3. escalations → human: route secondaries; agent: spawn secondary slug
4. blocked under tree → human unblock
5. phase ⬜ → `{ actor:"human", cta:"assign", … }`
6. in-flight runs anywhere under tree → `{ cta:"open_runs", … }`

**Manager**
1. missing IC handoff → agent await / human spawn IC via manager run
2. ICs done, no manager brief → agent write brief
3. ready_for_csuite → human notify CEO / draft
4. own blocked → human/agent per ask

**IC**
1. no handoff → agent complete_handoff
2. blocked → human (ask) + agent continue
3. running run → open_runs
4. done → idle waiting manager

`lastActivityAt` = max of handoff mtimes (if passed) or run timestamps; for unit tests accept optional `now` / explicit activity map. Simplest: use run `finished_at`/`started_at` and briefing `updatedAt` strings, max lexicographically ISO.

`pinnedBriefing.stale` = pinned.updatedAt < lastActivityAt when both set.

`modelQuality: []` until Task 14.

Pass `repoRoot` + `existsSync` via `checkArtifacts` for artifacts.

- [ ] **Step 4: PASS + commit**

```bash
cd tools/org-command-center && npm test -- src/jarvis/seat-report.test.ts src/jarvis/artifact-check.test.ts
git add tools/org-command-center/src/jarvis/seat-report.ts \
  tools/org-command-center/src/jarvis/seat-report.test.ts \
  tools/org-command-center/src/jarvis/artifact-check.ts \
  tools/org-command-center/src/jarvis/artifact-check.test.ts
git commit -m "$(cat <<'EOF'
feat(occ): buildSeatReport with human/agent actions, runs, escalations

EOF
)"
```

---

### Task 4: API + chat tools

**Files:**
- Modify: `tools/org-command-center/server/api.ts`
- Modify: `tools/org-command-center/server/chat.ts`
- Modify: `tools/org-command-center/src/api/client.ts`
- Modify: `tools/org-command-center/server/snapshot.ts` if needed to expose spend/runs/briefings

- [ ] **Step 1: Client**

```ts
export async function fetchSeatReport(slug: string) {
  const res = await fetch(`/api/seat-report/${encodeURIComponent(slug)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "seat-report failed");
  return data.report;
}
```

- [ ] **Step 2: GET `/api/seat-report/:slug`**

Wire `buildSeatReport` with snapshot data + `loadSpend` → `spend.bySeat[slug]` + `repoRoot` for artifacts + heartbeat path check via `existsSync(`skills/org/positions/${slug}/HEARTBEAT.md`)`.

- [ ] **Step 3: Chat tool `get_seat_report`**

Update `file_briefing` description: pin only; prefer `get_seat_report` for truth.

- [ ] **Step 4: test + build + commit**

```bash
cd tools/org-command-center && npm test && npm run build
git add tools/org-command-center/server/api.ts \
  tools/org-command-center/server/chat.ts \
  tools/org-command-center/src/api/client.ts
git commit -m "$(cat <<'EOF'
feat(occ): GET seat-report API and get_seat_report chat tool

EOF
)"
```

---

### Task 5: Situation Room Report drawer + CTAs

**Files:**
- Modify: `tools/org-command-center/src/jarvis/SituationRoom.tsx`

- [ ] **Step 1: Rename File report → Report; load `fetchSeatReport`**

- [ ] **Step 2: Drawer sections**

Order: Summary + freshness · **You (human)** next actions · **Agents** next actions · Escalations · Live runs · Downward reports · Own handoffs · Artifacts (missing in red) · Spend · Pin (managers/CEO) with confirm if `pinnedBriefing` exists and not stale reverse

- [ ] **Step 3: CTA buttons**

```ts
function runCta(a: SeatNextAction) {
  switch (a.cta) {
    case "run_next": return void runNext();
    case "assign": setDrawer("assign"); break;
    case "open_runs": setDrawer("runs"); if (a.runId) setSelectedRunId(a.runId); break;
    case "rewake": if (a.relatedSlug) /* existing rewake by dispatch */; break;
    case "draft_csuite": /* Task 11 wires POST; until then disable or no-op */; break;
    case "open_handoff": setArtifact(`docs/projects/<active>/business-idea/HANDOFFS/${a.handoffFilename}`); setDrawer("outputs"); break;
    default: break;
  }
}
```

Render human actions with `data-active="true"`; agent actions as secondary chips.

- [ ] **Step 4: Drill-down + live task title → openReport(slug)**

- [ ] **Step 5: Pin with overwrite confirm**

```ts
if (seatReport.pinnedBriefing && !window.confirm("Overwrite pinned standup on disk?")) return;
```

- [ ] **Step 6: test + build + commit**

```bash
cd tools/org-command-center && npm test && npm run build
git commit -m "$(cat <<'EOF'
feat(occ): Seat Report drawer with human/agent CTAs

EOF
)"
```

---

### Task 6: Wave A verify

- [ ] **Step 1: Full verify**

```bash
cd tools/org-command-center && npm test && npm run build
```

- [ ] **Step 2: Commit README polish if needed**

---

# Wave B — Operator fidelity

### Task 7: Company digest (TDD)

**Files:**
- Create: `tools/org-command-center/src/jarvis/company-digest.ts`
- Create: `tools/org-command-center/src/jarvis/company-digest.test.ts`
- Modify: `server/api.ts`, `src/api/client.ts`, `SituationRoom.tsx`

**Interfaces:**

```ts
export interface CompanyDigest {
  blockedSeats: Array<{ slug: string; reason: string }>;
  escalateSeats: Array<{ slug: string; tags: string[]; secondaries: string[] }>;
  awaitingCsuite: string[]; // phases
  queueDepth: number;
  parallelTracks: string[];
  openAlerts: number;
  ceoNext: SeatNextAction[]; // top 5 from ceo-strategist report
}
```

- [ ] **Step 1: Failing test** — fixture with blocked IC + escalate manager + queue file → digest counts

- [ ] **Step 2: Implement `buildCompanyDigest` using `buildSeatReport` for CEO + scan handoffs

- [ ] **Step 3: `GET /api/company-digest` + mission-strip button **Digest**

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(occ): company digest rollup for operator

EOF
)"
```

---

### Task 8: Voice brief modes

**Files:**
- Modify: `tools/org-command-center/server/api.ts` (`POST /api/voice/brief`)
- Modify: `tools/org-command-center/src/jarvis/mission.ts` or new `seat-report-script.ts`
- Modify: Situation Room Brief me control (menu: Mission / CEO report / Digest)

- [ ] **Step 1: `seatReportBriefScript(report: SeatReport): string`**

Speak: role summary, top 3 human actions, top 2 agent actions, blocker count.

- [ ] **Step 2: API**

```ts
const body = await c.req.json<{ mode?: "mission" | "seat" | "digest"; slug?: string }>().catch(() => ({}));
```

- [ ] **Step 3: UI** — Brief me dropdown or long-press cycle; default Mission; CEO seat + Digest available

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(occ): voice brief for mission, seat report, and digest

EOF
)"
```

---

### Task 9: HEARTBEAT + parallel tracks on report

**Files:**
- Modify: `seat-report.ts` / tests
- Modify: Situation Room Report drawer
- Modify: `company-digest.ts` for parallelTracks (reuse `mission.parallelTracks` / HARD_GATES)

- [ ] **Step 1: Test** — when `heartbeatExists: true` passed in, `heartbeatPath` set; CEO digest lists Build/Brand/Content/Channels when phase ≥ 10

- [ ] **Step 2: UI** — chip `HEARTBEAT` linking to path in Outputs; parallel track pills on CEO report + digest

- [ ] **Step 3: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(occ): HEARTBEAT and parallel-track signals on seat reports

EOF
)"
```

---

### Task 10: Freshness display + pin stale banner

**Files:**
- Modify: `SituationRoom.tsx` Report drawer

- [ ] **Step 1: Show `lastActivityAt` and “Stale pin” banner when `pinnedBriefing.stale`**

- [ ] **Step 2: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(occ): seat report freshness and stale pin warning

EOF
)"
```

---

# Wave C — Former company gaps

### Task 11: Draft C-suite review from report (TDD)

**Files:**
- Create: `tools/org-command-center/src/jarvis/csuite-draft.ts`
- Create: `tools/org-command-center/src/jarvis/csuite-draft.test.ts`
- Modify: `server/api.ts` `POST /api/csuite-draft`
- Modify: Situation Room CTA `draft_csuite`

**Interfaces:**

```ts
export function renderCsuiteDraft(input: {
  phase: string;
  reviewer: string;
  managerBriefPath: string;
  artifactPaths: string[];
  scorecardLines: string[]; // split registry scorecard on ; or ,
  secondaryReviewers: string[];
}): string
```

Draft frontmatter: `verdict:` empty or `pending`; body scorecard rows `Pass?` blank; comments prefilled from manager asks/blockers.

- [ ] **Step 1: Failing test** — render includes phase, scorecard criterion rows, secondaries

- [ ] **Step 2: Implement render (aligned with `skills/org/CSUITE-REVIEW-TEMPLATE.md`)

- [ ] **Step 3: POST writes `docs/projects/<active>/business-idea/HANDOFFS/<phase>-csuite-review.md` only if missing OR query `?force=1`; never set `verdict: approve` automatically

- [ ] **Step 4: Wire CTA + commit**

```bash
git commit -m "$(cat <<'EOF'
feat(occ): draft csuite review markdown from seat report

EOF
)"
```

---

### Task 12: Seat spend on report + digest

**Files:**
- Modify: `seat-report.ts` (already has spend field — ensure API fills it)
- Modify: Situation Room Report + Digest UI
- Modify: mission strip optional total vs selected seat

Note: `server/spend.ts` already has `bySeat`. No new ledger.

- [ ] **Step 1: Test** — buildSeatReport with spend arg shows cost

- [ ] **Step 2: UI** — `Spend $X · N tokens` on report; digest lists top 3 spenders

- [ ] **Step 3: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(occ): show per-seat spend on reports and digest

EOF
)"
```

---

### Task 13: Handoff alerts (TDD)

**Files:**
- Create: `tools/org-command-center/src/jarvis/alerts.ts`
- Create: `tools/org-command-center/src/jarvis/alerts.test.ts`
- Create/modify: `server` load/save `DISPATCH/alerts.json`
- Modify: `api.ts` GET/POST ack
- Modify: Situation Room mission strip chip

**Interfaces:**

```ts
export interface HandoffAlert {
  id: string; // filename + status
  filename: string;
  slug: string;
  phase: string;
  kind: "new_handoff" | "blocked" | "escalate";
  createdAt: string;
  acked: boolean;
}

export function diffHandoffAlerts(
  prev: HandoffAlert[],
  handoffs: HandoffRecord[],
  nowIso: string,
): HandoffAlert[]
```

Rules: new filename → `new_handoff`; status blocked/needs_input → `blocked`; recommendation escalate or verdict_for_manager escalate → `escalate`. Preserve acked by id.

- [ ] **Step 1: Unit tests for diff**

- [ ] **Step 2: On snapshot/SSE cycle, merge alerts to `DISPATCH/alerts.json`

- [ ] **Step 3: UI chip `Alerts (N)` → drawer list → Ack + Open report

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(occ): handoff alerts when workers report back

EOF
)"
```

---

### Task 14: Model-routing quality on seat report (TDD)

**Files:**
- Create: `tools/org-command-center/src/jarvis/model-quality.ts`
- Create: `tools/org-command-center/src/jarvis/model-quality.test.ts`
- Modify: `seat-report.ts` to call it
- Reference: `skills/org/MODEL-REGISTRY.md` via existing `ModelRegistry` parse

**Interfaces:**

```ts
export function assessHandoffModelQuality(
  handoff: HandoffRecord,
  expected: { llmTier: string; generationProfile: string } | undefined,
  phase: string,
): { ok: boolean; detail: string }
```

Rules:
- If expected tier set and handoff.llmTier differs → `ok: false`
- Phases 11/12/15/19: generationProfile must not be empty/`none` unless handoff notes skip (detail string)
- `fallback_applied` true → warning detail (ok may still true)

- [ ] **Step 1: Tests** — wrong tier fails; matching passes; gen phase missing profile fails

- [ ] **Step 2: Wire into `buildSeatReport.modelQuality`; UI section “Model routing”

- [ ] **Step 3: CEO next action if any `ok: false` under tree → human “Revise model routing on …”

- [ ] **Step 4: Full verify + commit**

```bash
cd tools/org-command-center && npm test && npm run build
git commit -m "$(cat <<'EOF'
feat(occ): model-routing quality flags on seat reports

EOF
)"
```

---

### Task 15: Final docs + verification

**Files:**
- Modify: `tools/org-command-center/README.md`
- Modify: spec if any drift

- [ ] **Step 1: README table — Report, Digest, Alerts, Draft csuite, Pin, Voice modes, Seat spend**

- [ ] **Step 2:**

```bash
cd tools/org-command-center && npm test && npm run build
```

- [ ] **Step 3: Commit**

```bash
git commit -m "$(cat <<'EOF'
docs(occ): seat reports and company operator gaps

EOF
)"
```

---

## Self-review

| Requirement | Task |
|-------------|------|
| Derived report all seats | 3–5 |
| Human vs agent next actions | 3, 5 |
| CTA deep-links | 5 |
| Live runs on report | 3, 5 |
| Escalation → secondaries | 2, 3 |
| Scorecard / hard gate | 3 |
| Artifact existence | 3 |
| Voice seat/digest | 8 |
| Company digest | 7 |
| Pin stale / confirm | 3, 5, 10 |
| HEARTBEAT + parallel | 9 |
| Freshness | 3, 10 |
| Draft csuite review | 11 |
| Per-seat spend UI | 12 |
| Handoff alerts | 13 |
| Model-routing quality | 14 |
| Spec + README | 1, 15 |

Types `SeatNextAction.actor` / `cta` consistent across Tasks 3, 5, 7, 11.
`
