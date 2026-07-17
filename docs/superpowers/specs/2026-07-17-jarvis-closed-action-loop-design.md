# Design: Jarvis Closed Action Loop + Ops Control Plane

**Date:** 2026-07-17  
**Status:** Approved  
**Extends:** `2026-07-16-jarvis-work-request-voice-spawn-design.md`, `2026-07-16-jarvis-intent-catalog-v2-design.md`  
**App:** `tools/org-command-center/`  
**Plan:** `docs/superpowers/plans/2026-07-17-jarvis-action-loop-and-ops-control.md`

## Purpose

Close the gap between “Jarvis confirmed a spawn” and “the agent actually did the ask.” Then extend the control plane so voice can resolve blockers and kick off multiple managers in one confirm.

## Sequencing (locked recommendation)

| Phase | Name | Why first |
|-------|------|-----------|
| **1** | Closed action loop | Spawn already works; agency, mid-flight instruct, and completion feedback are why requests feel inert |
| **2** | Ops control plane | Blocker resolve + multi-manager batch build on run lifecycle from Phase 1 |

## Hard laws (unchanged)

- Manager-only fan-out from Jarvis (`agent.spawn_ic` stays denied)
- Hard confirm for writes; audit trail
- Cursor = workers; voice = control plane
- Detached spawn must not block confirm HTTP
- Agents must not mark phase ✅ (C-suite / human gate)

## Phase 1 — Closed action loop

### 1.1 Structured preferred IC + acceptance contract

Add optional fields on dispatch packets (schema stays v1; unknown fields ignored by older readers, but we validate when present):

| Field | Type | Meaning |
|-------|------|---------|
| `preferred_ic` | string? | IC slug manager should spawn (replaces prose-only append) |
| `require_inbox` | boolean | default `true` for `work.request` |
| `require_ic_handoff` | boolean | default `true` when `preferred_ic` set |

`buildSpawnPrompt` must state these as **hard acceptance criteria**, not hints.

On `finishAdapterRun` success, run `evaluateRunAcceptance(repoRoot, run)`:

- If `require_inbox`: at least one `REVIEW/inbox/*` file with frontmatter `runId` matching (or `position`+`goal` fuzzy match if runId missing in older artifacts)
- If `require_ic_handoff`: at least one handoff under `HANDOFFS/` for `preferred_ic` with non-empty status

Result stored on run JSON:

```ts
acceptance: { ok: boolean; missing: string[]; checkedAt: string }
```

If acceptance fails → run status `completed_with_gaps` (still not a hard crash of Cursor), activity event `spawn_acceptance_failed`, voice pulse can speak the gap.

### 1.2 Instruct / rewake with delta

Extend `run.rewake` args:

```ts
{ dispatchFilename?: string; agentId?: string; instruction?: string }
```

`buildRewakePrompt(packet, repoRoot, instruction?)` prepends:

```
## Operator instruction (new)
{instruction}
Continue the existing packet. Do not discard prior work.
```

Wire Situation Room seat CTA `rewake` to API (today no-op).

New soft intent alias (optional): `run.instruct` → same as rewake with required `instruction` (ops + confirm).

### 1.3 Completion → control plane + voice

On adapter finish (success or error):

1. Persist run JSON (existing)
2. Run acceptance check (1.1)
3. Append to room-scoped **run events** ring buffer (or `DISPATCH/events.jsonl`)
4. Extend Jarvis pulse / new read intent `runs.watch` → `{ started, finished, failed, gaps }` spoken summary

Voice prompt: after `work.request` confirm success, do **not** claim the work is done; say “started”; on later pulse or user ask “is it done?”, call `runs.watch` / `runs.get`.

### 1.4 Out of scope for Phase 1

- Auto phase ✅
- Auto C-suite approve
- Jarvis spawning ICs directly
- Multi-manager batch (Phase 2)

## Phase 2 — Ops control plane

### 2.1 Blocker → action

| Intent | Mode | Confirm | Behavior |
|--------|------|---------|----------|
| `blocker.list` | any | no | Alias of `digest.focus { section: "blocked" }` + escalate slice |
| `blocker.resolve` | ops | hard | Args: `{ seat?, phase?, goal? }`. Resolve owning manager from blocked seat/digest → `dispatch.queue_for` or `run.rewake` if session live → return plan spoken |

Heuristic: utterance “blocker(s)” → `blocker.list` (not `mission.get`).

### 2.2 Multi-manager kickoff

| Intent | Mode | Confirm | Behavior |
|--------|------|---------|----------|
| `dispatch.queue_batch` | ops | hard | Args: `{ items: { position, goal, phase? }[] }` max N (start with 5). Queue all; return filenames |
| `spawn.run_ready` | ops | hard | Spawn up to N queued (or just-queued batch) managers detached; one confirm summary listing seats |

Respect pause + budget per seat; fail partial with spoken “started A,B; skipped C (paused)”.

### 2.3 Prompt / README / goldens

Teach: blockers → list → resolve; “spin up research and finance” → queue_batch → run_ready; never invent completion.

## Success metrics

- Voice “write a blog” → run finishes with inbox file + acceptance ok ≥ 80% in manual soak
- “Also fix the pricing section” mid-run → rewake with instruction creates new run on same session
- “What’s running / is it done?” → accurate spoken status including gaps
- “Resolve the research blocker” → queued or rewaked owner in one confirm
- “Kick off research and CFO” → two managers started from one confirm

## Non-goals

- Replacing Cursor SDK with Grok Build workers (separate track)
- Live multi-agent voice braid in one mic turn beyond batch spawn
- Automatic phase completion without C-suite
