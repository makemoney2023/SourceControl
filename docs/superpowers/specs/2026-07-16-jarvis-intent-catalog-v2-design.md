# Design: Jarvis Intent Catalog v2

**Date:** 2026-07-16  
**Status:** Approved  
**Extends:** `2026-07-16-enterprise-jarvis-dialog-design.md` (v1 catalog = 19 intents)  
**App:** `tools/org-command-center/server/jarvis/`  
**Plan:** `docs/superpowers/plans/2026-07-16-jarvis-intent-catalog-v2.md`  
**Implementation:** Waves E1–E5 — see plan (README + goldens complete in Task 10)

### Locked operator decisions (2026-07-16)

1. **`venture.create` auto-switches** the active venture (`activate: true` / default). Confirm echoes name + slug once; no second confirm for switch.
2. **`dispatch.queue_for` may target any manager** slug (roster `level === "manager"`), not only the current phase owner. Still manager-only — never IC.
3. **Fourth mode `architect` kept** — venture create/switch and structural tracker edits require Architect; Ops stays execution-focused.

## Purpose

Define a **complete voice control-plane intent catalog** so Jarvis can:

1. Create and switch **ventures / ideas**  
2. Assign **on-the-fly work** to the right seats (without breaking manager-only law)  
3. Reach **parity with every OCC UI control** (and a few voice-native extras)  
4. Stay **OSS voice brain** + confirm/audit/mode policy

## Hard laws (non-negotiable)

| Law | Voice implication |
|-----|-------------------|
| Manager-only fan-out | No `agent.spawn_ic`. On-the-fly work → **manager packet** (phase owner) who may spawn ICs. |
| No pack invention | Queue/spawn only via validated packet builders (`validateManagerPacket` / templates). |
| No silent phase ✅ | `phase.complete` forbidden unless csuite review `verdict: approve` exists (or explicit skip-review path). |
| Active venture isolation | Writes only under `docs/projects/<active>/…`. |
| Confirm hard writes | Destructive / irreversible / spend-inducing actions need confirm tokens. |
| Cursor = workers | Voice triggers OCC; Cursor SDK still runs managers/ICs. |

## Naming & shape

```
<domain>.<verb>           # e.g. venture.create, dispatch.queue
<domain>.<noun>.<verb>    # e.g. agent.seat.pause (alias of agent.pause)
```

**Args:** zod per intent (v2 stops using opaque `Record` for writes).  
**Result:** same DCP envelope `{ status, reason?, token?, summary?, result? }`.  
**Modes:** `briefing` | `ops` | `review` | **`architect`** (new — venture + structural setup).

| Mode | Unlocks |
|------|---------|
| briefing | reads + spoken digests |
| ops | execution (queue, spawn, pause, cancel, rewake) |
| review | file.read, csuite.draft, handoff inspect, alerts |
| architect | venture.create/switch, registry, tracker structural edits |

Default on connect: **briefing**. “Switch to architect” required before creating ventures.

## Confirm policy (v2)

| Tier | Confirm? | Examples |
|------|----------|----------|
| R0 Read | Never | `*.get`, `*.list`, `*.report` |
| R1 Soft write | Confirm if args ambiguous / high blast | `alerts.ack`, `routine.enable`, `briefing.pin` |
| R2 Hard write | Always | spawn, cancel, pause, venture.create, dispatch.queue |
| R3 Structural | Always + spoken slug/name echo | venture.create, venture.switch, phase.advance, tracker.set_status |
| R4 Forbidden | Always deny | `phase.complete_force`, `agent.spawn_ic`, cloud LLM |

---

## Catalog — shipped (v1) vs proposed

Legend: ✅ shipped · 🆕 proposed · 🔒 forbidden · ≈ alias

### A. Session / meta

| Intent | Tier | Mode | Args | Backend | Notes |
|--------|------|------|------|---------|-------|
| `mode.set` | R0 | any | `mode` | session | ✅ |
| `session.help` | R0 | any | `topic?` | static cheatsheet | 🆕 Spoken capability summary |
| `session.repeat` | R0 | any | — | last summary | 🆕 |
| `session.cancel_pending` | R1 | ops/architect | — | burn confirm token | 🆕 |
| `jarvis.ping` | R0 | any | — | health | 🆕 Stack health (LiveKit/Ollama/TTS) |

### B. Mission / company awareness

| Intent | Tier | Mode | Args | Backend | Notes |
|--------|------|------|------|---------|-------|
| `mission.get` | R0 | briefing+ | — | snapshot.mission | ✅ |
| `digest.get` | R0 | briefing+ | — | company digest | ✅ |
| `digest.focus` | R0 | briefing+ | `section?` | digest slice | 🆕 blocked / escalate / awaiting |
| `activity.list` | R0 | briefing+ | `limit?` | activity | ✅ |
| `activity.tail` | R0 | briefing+ | `n?` | last N events | 🆕 |
| `alerts.list` | R0 | briefing+ | — | alerts | ✅ |
| `alerts.ack` | R1 | ops/review | `id` | ack alert | ✅ |
| `alerts.ack_all` | R2 | ops | `filter?` | batch ack | 🆕 |
| `spend.get` | R0 | briefing+ | `slug?` | spend | ✅ |
| `spend.budget.set` | R2 | ops | `slug`, `usd` | seat budget | 🆕 |
| `memory.recall` | R0 | briefing+ | `query?` | MEMORY/ skim | 🆕 Voice-native |
| `memory.note` | R1 | ops | `text` | append MEMORY note | 🆕 |

### C. Ventures / ideas (gap today)

| Intent | Tier | Mode | Args | Backend | Notes |
|--------|------|------|------|---------|-------|
| `venture.list` | R0 | any | — | `GET /api/project` | 🆕 |
| `venture.get` | R0 | any | — | active project | 🆕 |
| `venture.switch` | R3 | architect | `slug` | `POST /api/project` | 🆕 Confirm echo name |
| `venture.create` | R3 | architect | `name`, `slug?`, `depth?` | `POST /api/project/create` | 🆕 Scaffold idea |
| `venture.slugify` | R0 | architect | `name` | slugify helper | 🆕 Preview only |
| `venture.rename` | R3 | architect | `slug`, `name` | registry (if exists) | 🆕 Future if API added |
| `venture.archive` | R3 | architect | `slug` | future | 🆕 Soft-delete; not delete disk |

**Spoken flow (create):**  
“Create a venture called Night-Safe Water” → architect mode → preview slug → confirm → `createVenture` → switch active → brief Phase 0.

### D. Tracker / phases

| Intent | Tier | Mode | Args | Backend | Notes |
|--------|------|------|------|---------|-------|
| `phase.get` | R0 | briefing+ | `phase?` | tracker row | 🆕 Alias/enrich mission |
| `phase.list_open` | R0 | briefing+ | — | ⬜/🔄 rows | 🆕 |
| `phase.set_status` | R3 | architect/ops | `phase`, `status` | tracker edit | 🆕 ⬜/🔄/✅/⏭️ only with rules |
| `phase.advance` | R3 | ops | `phase?` | next eligible | 🆕 Requires csuite approve for ✅ |
| `phase.complete` | R4 | — | — | — | 🔒 Deny; use csuite path |
| `phase.skip` | R3 | architect | `phase`, `reason` | ⏭️ + reason | 🆕 |
| `tracker.open_questions` | R0 | briefing+ | — | open Qs | 🆕 |
| `tracker.decision_log` | R0 | review | `n?` | decisions | 🆕 |

### E. Dispatch / on-the-fly work (roles)

This is how voice creates **tasks for roles** without spawning ICs directly.

| Intent | Tier | Mode | Args | Backend | Notes |
|--------|------|------|------|---------|-------|
| `dispatch.queue` | R2 | ops | `phase`, `goal`, optional packet fields | `/api/assign` | ✅ Manager for **phase owner** |
| `dispatch.queue_for` | R2 | ops | `position`, `goal`, `phase?` | assign + owner check | 🆕 **On-the-fly manager task** — `position` must be a **manager** slug; if `phase` omitted, use current phase only when owner matches |
| `dispatch.preview` | R0 | ops | same as queue | dry-run validate | 🆕 Speak packet summary, no write |
| `dispatch.list` | R0 | ops | `status?` | queue/claimed | 🆕 |
| `dispatch.cancel` | R2 | ops | `filename` or `id` | remove queued | 🆕 Not claimed |
| `dispatch.explain` | R0 | ops | `filename?` | read YAML | 🆕 |
| `delegate.plan` | R0 | ops/review | `position`, `goal` | resolve Manager may spawn | 🆕 Spoken IC plan — **no spawn** |
| `agent.spawn_ic` | R4 | — | — | — | 🔒 Always deny; say “queue the manager instead” |

**On-the-fly role task examples (legal):**

- “Give head-of-research a task to finish the market evidence base”  
  → `dispatch.queue_for { position: head-of-research, goal: …, phase: "2" }`  
  → confirm → validated manager packet → later `spawn.run_next` / Play.

- “Have the CMO draft GTM” while phase 2 is active  
  → **deny** if phase owner ≠ cmo (or queue as future phase 6 with confirm).

**Illegal (Jarvis must refuse):**

- “Spawn the copywriter IC now” → deny + offer `delegate.plan` / manager queue.

### F. Execution / runs / seats

| Intent | Tier | Mode | Args | Backend | Notes |
|--------|------|------|------|---------|-------|
| `tasks.list` | R0 | briefing+ | `status?` | snapshot.tasks | ✅ |
| `tasks.get` | R0 | ops | `id` | one task | 🆕 |
| `runs.list` | R0 | ops | — | runs | ✅ |
| `runs.get` | R0 | ops | `runId` | run detail | 🆕 |
| `spawn.run_next` | R2 | ops | — | `/api/spawn` | ✅ |
| `spawn.run` | R2 | ops | `runId` or task id | play specific | 🆕 |
| `run.cancel` | R2 | ops | `runId` | cancel | ✅ |
| `run.rewake` | R2 | ops | `runId`/`agentId` | rewake | ✅ |
| `agent.pause` | R2 | ops | `slug` | pause seat | ✅ |
| `agent.resume` | R2 | ops | `slug` | resume | ✅ |
| `agent.states` | R0 | ops | — | agent-states | 🆕 |
| `agent.heartbeat` | R1 | ops | `slug` | nudge HEARTBEAT | 🆕 Soft; may map to rewake |
| `seat.report` | R0 | briefing+ | `slug` | seat report | ✅ |
| `seat.list` | R0 | briefing+ | `tier?` | org registry | 🆕 |
| `seat.who_owns` | R0 | briefing+ | `phase` | phase→manager | 🆕 |

### G. C-suite / review / artifacts

| Intent | Tier | Mode | Args | Backend | Notes |
|--------|------|------|------|---------|-------|
| `csuite.draft` | R2 | review | `phase?` | draft review | ✅ |
| `csuite.status` | R0 | review | `phase?` | verdict present? | 🆕 |
| `handoff.list` | R0 | review | `phase?` | HANDOFFS dir | 🆕 |
| `handoff.get` | R0 | review | `path` or `slug` | file.read subset | 🆕 |
| `file.read` | R0 | review | `path` | assertJarvisReadable | ✅ |
| `file.list` | R0 | review | `path?` | dir listing | 🆕 |
| `artifact.list` | R0 | review | `phase?` | tracker artifacts | 🆕 |
| `briefing.pin` | R1 | ops | `mode`, `slug?` | `/api/briefing` | 🆕 Pin standup |
| `briefing.speak` | R0 | briefing+ | `mode` | mission/seat/digest script | 🆕 |

### H. Routines / automation

| Intent | Tier | Mode | Args | Backend | Notes |
|--------|------|------|------|---------|-------|
| `routine.list` | R0 | ops | — | routines | 🆕 (partial via enable) |
| `routine.enable` | R1 | ops | `id` | enable | ✅ |
| `routine.disable` | R1 | ops | `id` | disable | 🆕 |
| `routine.create` | R2 | architect | cron + action | POST routines | 🆕 |

### I. Focus / UI sync (voice → glass)

| Intent | Tier | Mode | Args | Backend | Notes |
|--------|------|------|------|---------|-------|
| `ui.focus` | R0 | any | `phase?`, `slug?` | jarvis.focus event | 🆕 Explicit |
| `ui.open_report` | R0 | briefing+ | `slug` | focus + seat.report | 🆕 |
| `ui.open_assign` | R0 | ops | — | focus assign panel | 🆕 |

### J. Integrations (optional later)

| Intent | Tier | Mode | Args | Backend | Notes |
|--------|------|------|------|---------|-------|
| `integration.status` | R0 | ops | `name?` | TOOL-REGISTRY / env | 🆕 |
| `integration.pull` | R2 | ops | `name` | gated fetch | 🆕 Only allowlisted |

---

## Counts

| | Count |
|---|------|
| Shipped v1 | 19 |
| Proposed net-new (approx.) | ~45 |
| Forbidden explicit | 2+ (`agent.spawn_ic`, `phase.complete` force) |
| **Target catalog size** | **~65** intents (incl. aliases) |

Group for LLM reliability: keep voice tools as **`jarvis_act` / `jarvis_confirm` / `jarvis_context` / `set_mode`** — do **not** expose 65 LiveKit tools. Expand the **intent enum + zod args** behind `jarvis_act`.

---

## Implementation waves (after approval)

| Wave | Intents | Outcome |
|------|---------|---------|
| **E1** | `venture.*`, `architect` mode | Create/switch ideas by voice |
| **E2** | `dispatch.queue_for`, `dispatch.preview`, `dispatch.list`, `seat.who_owns`, `delegate.plan` | On-the-fly manager tasks |
| **E3** | `phase.*` (safe subset), `handoff.*`, `artifact.list`, `briefing.pin` | Review/tracker depth |
| **E4** | `spawn.run`, `runs.get`, `routine.*`, `spend.budget.set`, `memory.*` | Ops polish |
| **E5** | Heuristic goldens + README cheatsheet refresh | CI + spoken UX |

Each wave: TDD zod args → `executeIntent` → policy → goldens → README.

---

## Example dialogues

**Create idea**

> You: Switch to architect.  
> You: Create a venture called “Grid-Down Water.”  
> Jarvis: I’ll create slug `grid-down-water` and make it active. Confirm?  
> You: Yes.  
> Jarvis: Venture created. Phase 0 Intake is next.

**On-the-fly role task**

> You: Switch to ops.  
> You: Queue head-of-research to finish the Phase 2 evidence base focusing on TEBS competitors.  
> Jarvis: Manager packet for head-of-research, phase 2: “…”. Confirm?  
> You: Yes.  
> You: Run next.  
> Jarvis: Confirm spawn via Cursor?  
> You: Yes.

**Illegal IC spawn**

> You: Spawn the copywriter now.  
> Jarvis: I can’t spawn ICs directly. I can show who CMO may delegate, or queue the CMO manager. Which do you want?

---

## Non-goals

- Free-form natural language → arbitrary shell/git  
- Voice-marking phase ✅ without csuite file  
- Replacing Cursor workers with Ollama  
- Multi-operator RBAC (still single trusted operator)

## Success criteria

1. “Create a venture called X” works end-to-end with confirm + active switch.  
2. “Give \<manager-slug\> a task to …” queues a **valid** manager packet (never IC).  
3. IC spawn requests are denied with a helpful redirect.  
4. Golden suite covers ≥ 40 utterances including venture + queue_for.  
5. No new LiveKit tools — still ≤ 4 agent tools.

## Open questions for operator

1. Should `venture.create` auto-switch active, or require a second confirm?  
2. May `dispatch.queue_for` target **any** manager, or only the **current phase owner** (stricter)?  
3. Do you want `architect` as a fourth mode, or fold venture ops into `ops`?

---

## Spec self-review

- Manager-only preserved via forbidden `agent.spawn_ic` + queue_for manager check.  
- Confirm tiers defined.  
- Grounded in existing OCC APIs where possible; marks future APIs.  
- Implementation deferred to waves E1–E5 after approval.
