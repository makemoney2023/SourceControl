# Phase 0 C-Suite Roundtable Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On Phase 0 intake confirm, automatically run CEO → parallel CFO/CMO/COO/HoR → CEO merge (optional one peer rewake cycle).

**Architecture:** Persist `DISPATCH/phase0-roundtable.json` state machine; advance waves from run-lifecycle + snapshot hooks; reuse `queueDispatchBatch` + `spawnRunReady` for peers; extend `work.request` Phase 0 confirm summary and kickoff.

**Tech Stack:** TypeScript, Vitest, existing OCC Jarvis intents / spawn / dispatch-queue.

**Spec:** `docs/superpowers/specs/2026-07-17-phase0-csuite-roundtable-design.md`

## Global Constraints

- CEO remains Phase 0 owner; peers orchestrator-spawned only
- One Confirm? for kickoff; no mid-wave invent-confirm
- Detached spawn; non-blocking HTTP
- Agents never mark phase ✅
- Peer timeout default 25 minutes → partial merge
- Max one rewake cycle
- TDD for state machine + kickoff wiring

## File map

| File | Responsibility |
|------|----------------|
| `server/jarvis/phase0-roundtable.ts` | State load/save, peer batch plan, wave advance |
| `server/jarvis/phase0-roundtable.test.ts` | Unit tests |
| `server/jarvis/tools-exec.ts` | Kickoff on Phase 0 `work.request`; call advance hooks |
| `server/jarvis/act.ts` | Confirm summary text for roundtable |
| `server/memory/run-lifecycle.ts` | Call `advancePhase0Roundtable` after finished runs |
| `server/snapshot.ts` | Also tick advance (timeout path) |
| `skills/org/ORG-REGISTRY.md` | Document secondary Phase 0 seats |
| `livekit-agent/src/jarvis-system-prompt.ts` | Phase 0 → roundtable Confirm? wording |

---

### Task 1: State machine + peer batch planner

**Files:**
- Create: `tools/org-command-center/server/jarvis/phase0-roundtable.ts`
- Create: `tools/org-command-center/server/jarvis/phase0-roundtable.test.ts`

**Produces:**
- `PHASE0_PEER_SEATS`, `loadPhase0Roundtable`, `savePhase0Roundtable`, `startPhase0Roundtable`, `planPhase0PeerBatch`, `advancePhase0Roundtable`, `isPhase0RoundtableRequest`

- [x] **Step 1:** Failing tests for peer batch seats/goals/phase, start→awaiting_ceo_intake, advance CEO done→peers_running, all briefs→merge spawn request shape, timeout partial
- [x] **Step 2:** Implement state + planner (spawn side effects injected via deps for tests)
- [x] **Step 3:** Tests green

---

### Task 2: Wire kickoff into `work.request`

**Files:**
- Modify: `server/jarvis/tools-exec.ts` (`work.request` case)
- Modify: `server/jarvis/act.ts` (`confirmSummary` for work.request phase 0)
- Modify: `server/jarvis/act.test.ts` / `tools-exec.test.ts`

- [x] **Step 1:** When phase is `0` (or intake goal), after successful CEO spawn call `startPhase0Roundtable` with runId
- [x] **Step 2:** Confirm summary: `Start Phase 0 C-suite roundtable (CEO → peers → CEO merge). Confirm?`
- [x] **Step 3:** Tests green

---

### Task 3: Advance waves on lifecycle + snapshot

**Files:**
- Modify: `server/memory/run-lifecycle.ts`
- Modify: `server/snapshot.ts`
- Modify: `server/jarvis/phase0-roundtable.ts` (spawn peers/merge via real queue+spawn)

- [x] **Step 1:** `recordRunLifecycle` → `advancePhase0Roundtable(repoRoot)`
- [x] **Step 2:** `loadSnapshot` → advance (timeout)
- [x] **Step 3:** Integration-style unit test with fixture repo + fake spawn deps or disk queue assert
- [x] **Step 4:** Tests green

---

### Task 4: Docs + voice prompt

**Files:**
- Modify: `skills/org/ORG-REGISTRY.md` Phase 0 note
- Modify: `skills/org/positions/ceo-strategist/SKILL.md` Phase 0 section (brief)
- Modify: `livekit-agent/src/jarvis-system-prompt.ts` + test
- Modify: spec status → Approved; plan link

- [x] **Step 1:** Registry + skill note
- [x] **Step 2:** Prompt: Phase 0 intake uses roundtable Confirm? wording
- [x] **Step 3:** Prompt test passes

---

### Task 5: Verify

- [x] Run vitest for phase0-roundtable, act, tools-exec, prompt tests
- [ ] Manual: optional lemonade re-kick Phase 0 only if operator asks

---

### Task 6: Approve closeout + auto-rewake (2026-07-17 follow-up)

**Problem:** CEO `verdict: approve` left `REVIEW/inbox` at `pending_review` and tracker Phase 0 🔄; UI listed all inbox rows under “Needs review”. `rewake_seats: [cfo]` also failed to parse (unquoted YAML), so respawn never ran.

**Files:**
- Modify: `server/jarvis/phase0-roundtable.ts` (+ tests)
- Modify: `server/jarvis/review-inbox.ts` (`setReviewInboxStatus`)
- Modify: `src/jarvis/hud/OutputsDashboard.tsx` (pending-only list)

- [x] On approve/skip-review with empty rewake: mark phase-0 inbox `approved`, tracker Phase 0 ✅, current phase 1 (`closeoutApplied`)
- [x] Recover closeout when state already `done` without flag
- [x] Parse YAML `rewake_seats: [cfo, cmo]`; auto `rewaking_peers` → respawn → re-merge (max 1 cycle)
- [x] On `block`: mark phase-0 inbox `declined`
- [x] UI “Needs review” shows `pending_review` only
