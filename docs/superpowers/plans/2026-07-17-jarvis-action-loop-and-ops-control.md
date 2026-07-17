# Jarvis Closed Action Loop + Ops Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make spoken/UI requests result in agents that deliver, accept mid-flight instructions, and report completion — then add blocker-resolve and multi-manager kickoff on that foundation.

**Architecture:** Phase 1 closes the post-spawn loop (structured `preferred_ic` + acceptance checks on run finish, `run.rewake`/`run.instruct` with operator delta, run-event feed for voice). Phase 2 adds control-plane intents (`blocker.*`, `dispatch.queue_batch`, `spawn.run_ready`) that reuse the same lifecycle. Manager-only law unchanged; Jarvis never spawns ICs.

**Tech Stack:** TypeScript, Vitest, OCC `server/spawn.ts` + Jarvis intents, LiveKit voice agent prompt/tools, Cursor SDK via `runtime-adapter.ts`, YAML DISPATCH packets.

**Spec:** `docs/superpowers/specs/2026-07-17-jarvis-closed-action-loop-design.md`

## Global Constraints

- Manager-only fan-out from Jarvis; `agent.spawn_ic` remains denied
- Hard confirm for writes; 60s single-use tokens
- Detached spawn must not block confirm HTTP
- Agents must not mark phase ✅
- TDD: failing test before implementation on every task
- Work only under `tools/org-command-center/` (+ this docs path); do not create root Superpatch AI files
- Plain spoken summaries for voice (no markdown TTS)

## File map

| Path | Responsibility |
|------|----------------|
| `src/lib/types.ts` | Packet fields + run acceptance types |
| `src/lib/validate-packet.ts` | Validate `preferred_ic` against roster |
| `src/lib/runs.ts` | Persist acceptance + events helpers if needed |
| `server/spawn.ts` | Prompts, acceptance after finish, instruct rewake |
| `server/jarvis/run-acceptance.ts` | Pure acceptance evaluator (new) |
| `server/jarvis/run-events.ts` | Ring buffer / jsonl for voice watch (new) |
| `server/jarvis/intents.ts` | New intents |
| `server/jarvis/tools-exec.ts` | Intent handlers |
| `server/jarvis/policy.ts` | Mode/confirm for new intents |
| `server/jarvis/act.ts` | Confirm + ok summaries |
| `server/api.ts` | Wire rewake instruction; optional instruct route |
| `livekit-agent/src/jarvis-system-prompt.ts` | Voice playbooks |
| `livekit-agent/src/occ-tools.ts` | Optional thin wrappers |
| `README.md` | Cheatsheet |
| `server/jarvis/eval/golden.json` | New utterances |
| `src/jarvis/SituationRoom.tsx` | Fix rewake CTA no-op |

---

# Phase 1 — Closed action loop (do this first)

### Task 1: Packet fields for preferred IC + acceptance flags

**Files:**
- Modify: `tools/org-command-center/src/lib/types.ts`
- Modify: `tools/org-command-center/src/lib/validate-packet.ts`
- Modify: `tools/org-command-center/src/lib/validate-packet.test.ts`
- Modify: `tools/org-command-center/server/jarvis/dispatch-for.ts`
- Modify: `tools/org-command-center/server/jarvis/work-request.ts` (resolve already has `targetIc`)
- Modify: `tools/org-command-center/server/jarvis/act.ts` (work.request confirm args)
- Modify: `tools/org-command-center/server/jarvis/tools-exec.ts` (`work.request` queue path)

**Interfaces:**
- Produces: `ManagerPacketInput.preferred_ic?: string`, `require_inbox?: boolean`, `require_ic_handoff?: boolean` mirrored on `ManagerPacket`
- Consumes: roster from `ORG-REGISTRY` for IC validation

- [x] **Step 1: Write failing tests** in `validate-packet.test.ts` — accept `preferred_ic: "copy-chief"` when reportsTo is manager; reject unknown IC; default `require_inbox` true when building from `buildQueueForPacket` with targetIc

- [x] **Step 2: Run tests — expect FAIL**

```bash
cd tools/org-command-center && npx vitest run src/lib/validate-packet.test.ts
```

- [x] **Step 3: Implement types + validation + wire `preferred_ic` from `resolveWorkTarget.targetIc` into queue packet (stop relying only on goal prose)**

- [x] **Step 4: Tests PASS**

- [x] **Step 5: Commit** — `feat(occ): structured preferred_ic on manager packets`

---

### Task 2: Spawn/rewake prompts state hard acceptance criteria

**Files:**
- Modify: `tools/org-command-center/server/spawn.ts` (`buildSpawnPrompt`, `buildRewakePrompt`)
- Modify: `tools/org-command-center/server/spawn.test.ts`

**Interfaces:**
- Consumes: packet `preferred_ic`, `require_inbox`, `require_ic_handoff`
- Produces: prompt lines that name acceptance criteria + require frontmatter `runId: <id>` when known (pass runId into prompt builder from `beginRunRecord` if needed — add optional `runId` arg to `buildSpawnPrompt`)

- [ ] **Step 1: Failing test** — prompt contains `preferred_ic`, `require_inbox`, and `runId` frontmatter instruction when those fields set

- [ ] **Step 2: Implement minimal prompt changes**

- [ ] **Step 3: Tests PASS + commit** — `feat(occ): acceptance criteria in spawn prompts`

---

### Task 3: Run acceptance evaluator

**Files:**
- Create: `tools/org-command-center/server/jarvis/run-acceptance.ts`
- Create: `tools/org-command-center/server/jarvis/run-acceptance.test.ts`
- Modify: `tools/org-command-center/src/lib/runs.ts` (extend `RunRecord` with `acceptance?`)
- Modify: `tools/org-command-center/server/spawn.ts` (`finishAdapterRun` after success)

**Interfaces:**
```ts
export type RunAcceptance = {
  ok: boolean;
  missing: string[];
  checkedAt: string;
};

export function evaluateRunAcceptance(
  repoRoot: string,
  args: {
    runId: string;
    packet: ManagerPacket;
    requireInbox?: boolean;
    requireIcHandoff?: boolean;
  },
): RunAcceptance;
```

- [ ] **Step 1: Failing tests** — temp repo with inbox file matching runId → ok; missing inbox → `missing` includes `inbox`; preferred_ic without handoff → missing `ic_handoff`

- [ ] **Step 2: Implement evaluator** using existing `listReviewInbox` / handoff parsers

- [ ] **Step 3: Call from `finishAdapterRun`**; set run status `completed_with_gaps` when Cursor ok but acceptance fails; emit activity `spawn_acceptance_failed`

- [ ] **Step 4: Tests PASS + commit** — `feat(occ): evaluate run acceptance after Cursor finish`

---

### Task 4: Run events feed + `runs.watch` intent

**Files:**
- Create: `tools/org-command-center/server/jarvis/run-events.ts`
- Create: `tools/org-command-center/server/jarvis/run-events.test.ts`
- Modify: `tools/org-command-center/server/jarvis/intents.ts` — add `runs.watch`
- Modify: `tools/org-command-center/server/jarvis/tools-exec.ts`
- Modify: `tools/org-command-center/server/jarvis/policy.ts` — read, any mode
- Modify: `tools/org-command-center/server/jarvis/act.ts` — `okSummary` for watch
- Modify: `tools/org-command-center/server/spawn.ts` — append events on start/finish/error/acceptance

**Interfaces:**
```ts
export type RunEvent = {
  at: string;
  type: "started" | "finished" | "error" | "acceptance_failed";
  runId: string;
  position: string;
  detail?: string;
};

export function appendRunEvent(dispatchRoot: string, event: RunEvent): void;
export function listRunEvents(dispatchRoot: string, limit?: number): RunEvent[];
```

- [x] **Step 1: Failing tests** for append/list + tools-exec `runs.watch` returns spoken-friendly `{ events, summary }`

- [x] **Step 2: Implement jsonl under `DISPATCH/run-events.jsonl` (cap read last 50)**

- [x] **Step 3: Wire intent + summaries** (“CEO finished with gaps: missing inbox.”)

- [x] **Step 4: Commit** — `feat(occ): runs.watch event feed for voice status`

---

### Task 5: Instruct / rewake with operator delta

**Files:**
- Modify: `tools/org-command-center/server/spawn.ts` — `buildRewakePrompt(..., instruction?)`, `rewakeSession` opts
- Modify: `tools/org-command-center/server/spawn.test.ts`
- Modify: `tools/org-command-center/server/jarvis/intents.ts` — add `run.instruct`
- Modify: `tools/org-command-center/server/jarvis/tools-exec.ts` — `run.rewake` pass instruction; `run.instruct` requires instruction
- Modify: `tools/org-command-center/server/jarvis/policy.ts` — both ops + hard confirm
- Modify: `tools/org-command-center/server/api.ts` — rewake body accepts `instruction`
- Modify: `tools/org-command-center/src/jarvis/SituationRoom.tsx` — wire rewake CTA to API (remove no-op)

**Interfaces:**
```ts
rewakeSession(repoRoot, { dispatchFilename?, agentId?, instruction?, ... })
// run.instruct args: { instruction: string; dispatchFilename?: string; agentId?: string }
```

- [ ] **Step 1: Failing tests** — rewake prompt includes instruction block; `run.instruct` without instruction → `JarvisExecError`

- [ ] **Step 2: Implement**

- [ ] **Step 3: Fix UI CTA** — call existing rewake endpoint with seat’s `dispatch_filename`

- [ ] **Step 4: Commit** — `feat(occ): rewake/instruct with operator delta`

---

### Task 6: Voice prompt + tools for lifecycle (not “done” at start)

**Files:**
- Modify: `tools/org-command-center/livekit-agent/src/jarvis-system-prompt.ts`
- Modify: `tools/org-command-center/livekit-agent/src/jarvis-system-prompt.test.ts`
- Modify: `tools/org-command-center/livekit-agent/src/occ-tools.ts` — optional `runs_watch` wrapper
- Modify: `tools/org-command-center/README.md`
- Modify: `tools/org-command-center/server/jarvis/eval/golden.json` — “is the CEO done?”, “tell them to also cover pricing”

- [x] **Step 1: Failing prompt tests** — must say started≠done; teach `runs.watch`; teach instruct/rewake

- [x] **Step 2: Update prompt + README cheatsheet rows**

- [x] **Step 3: Goldens + `npm test` / `npm run agent:test`**

- [x] **Step 4: Commit** — `docs(occ): voice playbook for run lifecycle`

---

# Phase 2 — Ops control plane (after Phase 1)

### Task 7: `blocker.list` + heuristic fix

**Files:**
- Modify: `intents.ts`, `tools-exec.ts`, `policy.ts`, `act.ts`
- Modify: `server/jarvis/eval/heuristic-intent.ts` + tests
- Modify: `golden.json`, system prompt, README

- [x] **Step 1: Failing tests** — `blocker.list` returns blocked seats; heuristic “resolve the blocker” / “what’s blocked” → `blocker.list`

- [x] **Step 2: Implement as thin wrapper over `digest.focus` blocked (+ escalate snippet)

- [x] **Step 3: Commit** — `feat(occ): blocker.list intent`

---

### Task 8: `blocker.resolve` → queue or rewake owner

**Files:**
- Create: `server/jarvis/blocker-resolve.ts` + test
- Modify: intents, tools-exec, policy (ops, hard confirm), act confirmSummary, prompt, README, goldens

**Interfaces:**
```ts
export function planBlockerResolve(repoRoot, args: { seat?: string; phase?: string; goal?: string }): {
  action: "queue" | "rewake";
  position: string;
  goal: string;
  dispatchFilename?: string;
  spoken: string;
};
// execute via existing queueValidatedDispatch + spawnClaimedManagerDetached OR rewakeSession
```

- [x] **Step 1: Failing tests** — blocked IC seat → resolve to manager; live session → prefer rewake; else queue+spawn

- [x] **Step 2: Implement + wire intent**

- [x] **Step 3: Commit** — `feat(occ): blocker.resolve queues or rewakes owner`

---

### Task 9: `dispatch.queue_batch` + `spawn.run_ready`

**Files:**
- Modify: intents, tools-exec, policy, act, dispatch-for helpers, spawn helpers
- Tests: `tools-exec.test.ts`, spawn tests
- Prompt + README + goldens: “spin up research and finance”

**Constraints:**
- Max 5 items per batch (constant `MAX_BATCH = 5`)
- One confirm summarizes all seats
- Partial success allowed (paused/budget skip)

- [x] **Step 1: Failing tests** for batch queue count + run_ready spawns N detached adapters (mock)

- [x] **Step 2: Implement**

- [x] **Step 3: Commit** — `feat(occ): batch queue and spawn.run_ready`

---

### Task 10: Phase 2 voice playbook soak + docs

**Files:**
- Prompt, README, `docs/superpowers/specs/2026-07-17-jarvis-closed-action-loop-design.md` status → Approved
- Manual soak checklist in README

- [ ] **Step 1: Update docs status + cheatsheet**

- [ ] **Step 2: Full test suite**

```bash
cd tools/org-command-center && npm test && npm run agent:test
```

- [ ] **Step 3: Commit** — `docs(occ): action loop + ops control plane complete`

---

## Manual soak (after Phase 1, before Phase 2)

1. Voice: “Spin up the CEO to review this project” → Confirm → hear **started** + runId  
2. Wait / ask “is it done?” → `runs.watch` reflects finished or gaps  
3. If gaps: “tell them to write the review to the inbox” → `run.instruct`  
4. Confirm inbox file has `runId` frontmatter  

## Manual soak (after Phase 2)

1. Create a blocked handoff fixture → “what’s blocked?” → “resolve that blocker” → confirm → owner running  
2. “Kick off head of research and CFO on market and burn” → one confirm → two runIds  

---

## Out of scope (later)

- Auto phase ✅ / C-suite verdict write  
- Grok Build as worker runtime  
- Auto-rewake on human inbox approve (nice follow-on using Task 4 events)
