# Design: Phase 0 C-Suite Roundtable

**Date:** 2026-07-17  
**Status:** Approved  
**Extends:** `2026-07-17-jarvis-closed-action-loop-design.md`, `2026-07-16-jarvis-work-request-voice-spawn-design.md`  
**App:** `tools/org-command-center/`  
**Plan:** `docs/superpowers/plans/2026-07-17-phase0-csuite-roundtable.md`

## Purpose

When a new venture starts Phase 0 intake, C-suite must collaborate automatically — not CEO-solo. Pattern: **parallel peer roundtable → CEO merge → optional peer rewake on conflict**.

## Decisions (locked)

| Decision | Choice |
|----------|--------|
| Collaboration pattern | **C — Full roundtable loop** |
| Peer seats | **CEO + CFO + CMO + COO + Head of Research** |
| Kickoff UX | One Confirm? starts the whole Phase 0 roundtable |
| Peer merge policy | Prefer all four peer briefs; allow **partial merge** after timeout with gaps listed |
| Ownership | Phase 0 manager owner stays `ceo-strategist` (ORG-REGISTRY unchanged for owner) |
| Spawn authority | Jarvis/OCC orchestrates peer batch — Cursor managers **do not** spawn peer managers |

## Hard laws (unchanged)

- Manager-only fan-out from Jarvis; no peer-manager self-spawn
- Hard confirm for the kickoff write/spawn wave
- Cursor = workers; voice = control plane
- Detached spawn must not block confirm HTTP
- Agents must not mark phase ✅ (C-suite / human gate)
- Non-colliding `write_lease` paths per seat

## Problem today

- ORG-REGISTRY Phase 0: manager `ceo-strategist`, may-spawn `—`, `skip-review` allowed
- `work.request` spawns a single manager with `delegate_budget: 0`
- Lemonade Stand Phase 0 produced only CEO artifacts; `0-csuite-review.md` stayed `pending`
- Multi-manager path (`dispatch.queue_batch` + `spawn.run_ready`) exists but is not wired to Phase 0

## Flow

```text
Operator: "new idea / Phase 0 intake" + Confirm?
        │
        ▼
 Wave 1 — CEO intake
   spawn ceo-strategist
   → 00-intake.md
   → HANDOFFS/0-manager-ceo-strategist.md
        │
        ▼  (on CEO completed / completed_with_gaps with intake present)
 Wave 1b — Peer roundtable (parallel)
   queue+spawn: cfo, cmo, coo, head-of-research
   each reads 00-intake.md (+ MEMORY/context)
   each writes ONLY HANDOFFS/0-manager-<seat>.md
   require_inbox: true (receipt/deliverable)
   do not mark phase ✅
        │
        ▼  (all 4 briefs OR timeout → partial)
 Wave 2 — CEO merge
   spawn ceo-strategist (merge goal)
   → HANDOFFS/0-csuite-review.md
      verdict: approve | skip-review | block
      secondary_reviewers: [cfo, cmo, coo, head-of-research]
      gaps: [...] if partial
   on conflict: at most one rewake/instruct per named peer
        │
        ▼
 Jarvis speaks wave transitions; operator reviews inbox / csuite
```

## State machine

Persist under active venture DISPATCH (JSON), e.g. `DISPATCH/phase0-roundtable.json`:

```ts
type Phase0RoundtableState = {
  venture: string;
  status:
    | "idle"
    | "awaiting_ceo_intake"
    | "peers_running"
    | "awaiting_ceo_merge"
    | "rewaking_peers"
    | "done"
    | "failed";
  ceoIntakeRunId?: string;
  peerRunIds: Record<string, string>; // seat → runId
  peerBriefs: Record<string, string>; // seat → handoff rel path
  mergeRunId?: string;
  startedAt: string;
  updatedAt: string;
  partial?: boolean;
  error?: string;
};
```

Transitions are driven by OCC (snapshot poll, run-lifecycle hook, or activity watcher) — not by voice LLM improvisation.

### Transition rules

| From | Event | To | Action |
|------|-------|-----|--------|
| idle | Confirm Phase 0 kickoff | awaiting_ceo_intake | Spawn CEO intake |
| awaiting_ceo_intake | CEO run completed + `00-intake.md` exists | peers_running | `queueDispatchBatch` + `spawnRunReady` for 4 peers |
| awaiting_ceo_intake | CEO error / no intake after settle | failed | Speak failure; leave artifacts |
| peers_running | All 4 `HANDOFFS/0-manager-{cfo,cmo,coo,head-of-research}.md` present | awaiting_ceo_merge | Spawn CEO merge |
| peers_running | Timeout (default **25 min**) with ≥1 peer brief | awaiting_ceo_merge | Spawn CEO merge with `partial: true` |
| peers_running | Timeout with 0 peer briefs | failed | Speak; CEO intake still reviewable |
| awaiting_ceo_merge | Merge run completed + `0-csuite-review.md` has terminal verdict | done | Pulse operator |
| awaiting_ceo_merge | Merge asks rewake seats S | rewaking_peers | `run.instruct` / rewake each S once |
| rewaking_peers | Peer rewake finished or timeout | awaiting_ceo_merge | One more CEO merge (max **1** rewake cycle) |

## Packet contracts

### Wave 1 — CEO intake

Same as today `work.request` Phase 0:

- `position: ceo-strategist`, `phase: "0"`, `require_inbox: true`
- Goal: classify + write `00-intake.md` + manager brief
- `delegate_budget: 0` (CEO still must not spawn peers)

### Wave 1b — Peer briefs

For each of `cfo`, `cmo`, `coo`, `head-of-research`:

| Field | Value |
|-------|--------|
| `phase` | `"0"` |
| `position` | seat slug |
| `require_inbox` | `true` |
| `write_lease` | `[businessIdea/HANDOFFS/0-manager-<seat>.md]` (+ inbox path via prompt) |
| `must_read` | includes `00-intake.md`, MEMORY context, SOURCES index when present |
| `goal` | Seat-specific stub (see below); must not rewrite intake; must not mark phase ✅ |

**Seat goals (templates):**

- **cfo** — Unit economics / budget / capital assumptions for this intake classification
- **cmo** — Customer, channel, positioning assumptions
- **coo** — Ops, delivery, legal/compliance flags
- **head-of-research** — Evidence gaps, what must be true, early market reality check

### Wave 2 — CEO merge

- `position: ceo-strategist`, `phase: "0"`
- Goal: read all peer `0-manager-*.md` + intake; write/update `HANDOFFS/0-csuite-review.md`
- Frontmatter must include: `verdict`, `secondary_reviewers`, optional `gaps`, `rewakes`
- Conflicts → list seats to rewake (max one cycle)

## Kickoff API / intents

Prefer **one operator-facing path** (no new voice tool unless needed):

1. Extend `work.request` when resolved phase is `"0"` **or** goal matches intake / new venture:
   - Confirm summary: `Start Phase 0 C-suite roundtable (CEO → peers → CEO merge). Confirm?`
   - On confirm: spawn Wave 1 + write `phase0-roundtable.json` (`awaiting_ceo_intake`)
2. Watcher advances waves automatically (no second Confirm? for peers/merge unless policy later requires it)

Optional thin intent `phase0.roundtable` for UI/tests that aliases the same path.

`venture.create` spoken next step becomes: “Confirm Phase 0 roundtable?” rather than “brief Phase 0 alone.”

## Voice / Jarvis behavior

- Speak Confirm? once for the roundtable kickoff
- On wave change, short pulse: “CEO intake done — spinning up CFO, CMO, COO, and research.” / “Peers done — CEO merging C-suite review.”
- Do not invent mid-wave confirms
- `runs.watch` / activity remain the status source

## ORG-REGISTRY documentation tweak

Keep owner `ceo-strategist`. Add note on Phase 0 row (or adjacent policy line):

> Secondary Phase 0 roundtable seats (orchestrator-spawned): `cfo`, `cmo`, `coo`, `head-of-research`. CEO merges into `0-csuite-review.md`. `skip-review` only after merge run (or explicit operator skip).

CEO SKILL.md: Phase 0 section references roundtable peers as **orchestrator-provided inputs**, not self-spawn targets.

## Acceptance / completion

Roundtable `done` when:

1. `00-intake.md` exists with classification, and
2. `HANDOFFS/0-csuite-review.md` has `verdict` in `approve | skip-review | block`, and
3. State file `status: done`

Partial peer set is allowed if merge frontmatter lists `gaps`.

## Non-goals (this slice)

- Full C-suite board fan-out (CTO, people, etc.)
- Changing hard-gate phases (3/6/10/…)
- Letting CEO Cursor agent call `agent.spawn` for peers
- Automatic phase ✅ on approve (human/gate still required unless existing skip rules apply)
- Rewriting mic intake Q&A (still one domain seat for spoken checklist)

## Implementation sketch (for plan)

| Piece | Where |
|-------|--------|
| State read/write | `server/jarvis/phase0-roundtable.ts` |
| Peer batch planner | `planPhase0PeerBatch(repoRoot)` → items for `queueDispatchBatch` |
| Wave advance | Hook from `recordRunLifecycle` / snapshot load / light interval in API |
| Kickoff wiring | `work.request` confirm path + `act.ts` summary |
| Tests | State transitions; peer packet leases; kickoff confirm summary; no double-spawn |
| Prompt | Jarvis system prompt: Phase 0 → roundtable Confirm? wording |

## Risks

| Risk | Mitigation |
|------|------------|
| Peers start before intake exists | Wave 1b only after intake file present |
| Cost (5 frontier seats) | Detached spawn; peers are intentional; operator Confirm? gates spend |
| Double wave advance | State machine + file lock / compare-and-swap on status |
| Stuck peers | Timeout → partial merge |
| Voice re-confirms mid-flight | Soft-ok confirm + awaitingConfirm guards (already landing) |

## Spec self-review

- No TBDs left for locked decisions
- Partial merge + 25m timeout + one rewake cycle are explicit
- Does not contradict closed-action-loop hard laws
- Scope limited to Phase 0 roundtable; reuses batch/spawn primitives
