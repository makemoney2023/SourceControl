# Design: Org Command Center

**Date:** 2026-07-16  
**Status:** Active  
**App:** `tools/org-command-center/`  
**Plan:** Org Command Center (approved)

## Jobs to be done

| Job | Screen | Operator outcome |
|-----|--------|------------------|
| Assign work to the virtual company | Assign | Valid manager packet queued; orchestrator can spawn without inventing packs |
| See what digital workers are doing | Floor | Live status from tracker + HANDOFFS frontmatter |
| Review deliverables | Outputs | Browse phase artifacts under `docs/projects/<active>/business-idea/` |
| Switch venture | Mission strip | Active slug in `projects/registry.json` via `GET/POST /api/project` |

**Primary user:** Human operator as CEO / main-session orchestrator.

**Multi-venture:** See `docs/superpowers/specs/2026-07-16-multi-venture-projects-design.md`. ChromaDB is deferred.

## Org skill mapping

| UI widget / action | Org source |
|--------------------|------------|
| Phase picker | `docs/projects/<active>/business-idea/RUNBOOK-TRACKER.md` |
| Manager owner (read-only resolve) | `skills/org/ORG-REGISTRY.md` phase → owner |
| Delegate preview | Registry `Manager may spawn` |
| `llm_tier` / `llm_model` defaults | `skills/org/MODEL-REGISTRY.md` |
| Packet shape | `skills/org/orchestrator/SKILL.md` manager context packet |
| Refuse IC-as-owner | Orchestrator hard rule: manager-only fan-out |
| Refuse missing `llm_tier` | Orchestrator + MODEL-REGISTRY |
| Worker cards / status | `HANDOFFS/*.md` frontmatter + tracker Positions table |
| Escalation badges | `skills/org/ESCALATION.md` tags in manager briefs |
| Artifact list | Tracker Artifact column + handoff “Artifacts written” |
| Queue consume | Orchestrator First actions → `DISPATCH/queue/` |

## Dispatch YAML schema

Queued at `docs/projects/<active>/business-idea/DISPATCH/queue/<phase>-<slug>-<timestamp>.yaml`.

```yaml
schema_version: 1
queued_at: "2026-07-16T14:00:00.000Z"
phase: "2"
position: "head-of-research"   # MANAGER slug only
goal: "Produce Phase 2 evidence base via delegates; merge; write manager brief"
report_to: "ceo-strategist"
parent_position: "orchestrator"
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
inputs:
  - docs/projects/<active>/business-idea/01-problem-framing.md
must_read:
  - skills/org/MODEL-REGISTRY.md
outputs:
  - docs/projects/<active>/business-idea/02-evidence-base.md
  - docs/projects/<active>/business-idea/02-market-research.md
write_lease:
  - docs/projects/<active>/business-idea/02-evidence-base.md
  - docs/projects/<active>/business-idea/02-market-research.md
  - docs/projects/<active>/business-idea/HANDOFFS/2-manager-head-of-research.md
budget_usd: null
collaborators: []
delegate_budget: 3
constraints:
  - Spawn only Delegates to from your position SKILL.md
  - Give each IC a write_lease subset (no colliding paths)
  - Each IC packet MUST include llm_tier
  - Await IC handoffs; merge; write manager brief
  - Do not mark phase complete
  - Do not spawn peer managers yourself — ask orchestrator
```

**Claim:** Orchestrator moves file to `DISPATCH/claimed/` then spawns the manager with Cursor model pin from registry.

## Validation rules

1. `position` must be a **manager** and the phase’s Manager owner (or `ceo-strategist` for CEO-owned phases).
2. `llm_tier` required; `llm_model` resolved from MODEL-REGISTRY if omitted.
3. Phases **11, 12, 15, 19** require `generation_profile` (may be `none` only with explicit skip reason in constraints).
4. Never accept an IC slug as `position` at orchestrator Assign.
5. On enqueue: write YAML; set tracker phase status to 🔄; seed Positions & handoffs row when empty.

## Data contracts (read)

| Source | Parsed fields |
|--------|---------------|
| RUNBOOK-TRACKER | Idea meta, current phase, phase rows (id, name, status, artifact, notes), Positions & handoffs rows |
| HANDOFFS `*.md` | Frontmatter: phase, position, reports_to, status, verdict_for_manager, verdict, llm_tier, generation_profile, fallback_applied |
| ORG-REGISTRY | Roster (slug, title, reports_to, level, dept), phase owners + may_spawn |
| MODEL-REGISTRY | slug → llm_tier, llm_model, generation_profile |

## FS allowlist (localhost API)

**Read:** `skills/org/**`, `docs/projects/<active>/business-idea/**`, `templates/business-idea/**`  
**Write:** `docs/projects/<active>/business-idea/DISPATCH/**`, controlled patches to `docs/projects/<active>/business-idea/RUNBOOK-TRACKER.md`  
**Never write:** `skills/org/**` (except orchestrator skill update is a repo change, not runtime), `.env*`, agent secrets

## Screens (v1 mockups = the UI)

1. **Assign** — phase → auto manager → goal/leases/tiers → Queue + orchestrator one-liner  
2. **Floor** — dept lanes / worker cards from registry + handoff status  
3. **Outputs** — artifact index + markdown preview for `.md`

## Non-goals (v1)

- Remote deploy / multi-user auth  
- Streaming Cursor agent tokens  
- Auto-spawn without an orchestrator Cursor session  
- In-app CAD binary editing  

## Success criteria

- Assign writes a packet the orchestrator accepts without edits  
- Floor reflects real tracker + handoffs  
- Outputs opens real `docs/projects/<active>/business-idea/` paths  
- Manager-only rule enforced in UI and queue validation  
- Vitest covers parsers, validate, queue  

---

## Jarvis presentation layer (v2)

**Branch:** `feature/org-command-center-jarvis-3d`  
**Status:** Active  
**Stack:** React Three Fiber + drei + glass HTML HUDs over the unchanged FS API / validation brain.

### Product rules

1. Floor, Assign, and Outputs live in **one 3D theater** with mode transitions (not three flat pages).
2. Dispatch / validation / orchestrator contracts from this doc are **unchanged**.
3. Critical text and typing use **glass HTML panels** (`@react-three/drei` `<Html>` or DOM overlay). Selection and status are spatial.
4. Visual language: dark holographic HUD, cyan/teal on *active* nodes only, restrained bloom. No purple nebula, no emoji, no particle spam.
5. Flat v1 screens archived under `tools/org-command-center/src/screens/legacy/` (reference only).

### Spatial model

| Element | Behavior |
|---------|----------|
| Pedestal | Idea name + current phase ring |
| Constellation | CEO center; managers inner ring; ICs outer arcs by `dept`; edges = `reports_to` |
| Status materials | idle dim · running pulse · done teal · blocked amber · C-suite edge on review only |
| Mode bar | Floor \| Assign \| Outputs + Refresh + queue count |
| Camera | Orbit + mode-specific targets; snap when `prefers-reduced-motion` |

### Modes

- **Floor** — constellation + handoff status; click → WorkerInspect HUD; phase beads arc.
- **Assign** — select phase bead → light manager hub → glass form → packet beam → `POST /api/assign`.
- **Outputs** — artifact plaques in helix; click → ArtifactReader; dirs drill in via `/api/file`.

### Accessibility

- Keys `1` / `2` / `3` switch modes.
- `prefers-reduced-motion`: disable bloom + beam; snap camera.
- Legacy screens remain in tree but are not the default shell.

### Non-goals (Jarvis v2)

- WebXR, remote multi-tenant deploy.

---

## Situation Room (v3)

**Branch:** `feature/org-command-center-jarvis-3d`  
**Status:** Active  
**Default shell:** `SituationRoom` is the canonical Jarvis interface. Its full organization theater is the defining workspace; mission controls, threat rail, C-suite, seat console, activity, and Command deck are glass overlays. Ops tables supplement the theater and may replace it only when explicitly selected; the workspace state cannot hide both.

### Mission command and navigation

- **Run next** is the dominant primary action. **Assign** and **Outputs**, plus **Talk** and **Brief me**, remain directly available.
- Lower-frequency actions are grouped under accessible **Intelligence** (seat/digest briefs, legacy voice, digest, alerts) and **System** (runs, routines, theater/Ops toggles, refresh) menus.
- The **Command deck** searches seats and non-completed tasks. It opens from its theater control or `Cmd+K` / `Ctrl+K`; arrow keys navigate, Enter selects, and Escape closes.
- Seat and task selection use the canonical Jarvis store. A selected seat highlights in the theater and drives `CameraControls`; run-backed tasks resolve a missing seat from the run position and open the matching run detail.

### Interaction and feedback contracts

- Drawers, command search, and menus use shadcn-style wrappers around Radix Dialog/Dropdown and `cmdk`: named roles, visible focus, focus trap, backdrop/Escape close, opener focus restoration, and keyboard-operable checkbox/menu items are required.
- Initial load uses a Situation Room skeleton. Async surfaces expose loading, error, empty, refresh/last-updated, retry, copy-path success/failure, and chat sending/failure/retry feedback. Status and error messages use live status/alert semantics where actionable.
- Theater and Ops toggles must never produce a blank workspace. Disabling one view enables the other.
- `prefers-reduced-motion` removes pulse/orbit and skeleton/modal animation, bloom/beam effects, and animated camera travel while retaining text and color-independent status cues.

### Responsive contracts

- **Wide desktop:** retain the full theater with left/right/bottom overlays and optional Ops tables.
- **Short laptop (`≤700px` height):** allow document scrolling and preserve a theater at least 520px high.
- **Mobile (validated at 390px):** retain a 620px theater, use document scrolling, compact horizontally scrollable command clusters, docked threat/seat/activity overlays, and single-column Ops/Outputs/Run drawers.

### Preserved control-plane contracts

This presentation work does not change manager-only dispatch, explicit confirmations, venture-isolated filesystem/API resolution, or LiveKit/DCP voice mode and confirmation-token behavior.

### UI verification baseline

From `tools/org-command-center/`:

```bash
npm test -- src/jarvis
npm test
```

Baseline on 2026-08-05: targeted Jarvis tests pass (30 files, 118 tests). The full suite has three pre-existing failures: two path tests assume `passive-grid` is the active venture, and one memory lifecycle test assumes a fixed session date. Those fixture assumptions are unrelated to Situation Room UI changes.

### Glanceable mission

Derived from `RUNBOOK-TRACKER.md`: current phase, progress % (excluding skipped), next action + owner, blockers, open questions, latest decision, hard-gate chip (phases 3/6/10/14/19/21), parallel-track pills when phase ≥ 10.

### C-suite board + authoring

Exec seats (managers reporting to `ceo-strategist` + CEO). Cards show dept pulse, owned active phases, escalation tags, briefing snippet.  
**Authoring:** `docs/projects/<active>/business-idea/BRIEFINGS/<slug>-standup.md` via `POST /api/briefing` (manager slugs only).

### Live tasks

Unified tasks from tracker phases, `DISPATCH/queue`, `DISPATCH/claimed`, handoffs, awaiting C-suite review.  
Updates: FS watch + SSE `GET /api/events` (2s poll fallback).

### Legacy HTTP voice chat (historical v3)

The Web Speech → `POST /api/voice/chat` → OmniVoice path remains only as the **Legacy voice** fallback. Canonical **Talk** behavior is the self-hosted LiveKit + Ollama + DCP contract in v3.5 below; it does not use Anthropic/OpenAI. Historical HTTP tools include `get_mission`, `get_tasks`, `get_seat`, `open_ui`, `file_briefing`, `queue_dispatch`, and `spawn_manager`.

### Auto-spawn

`POST /api/spawn` claims DISPATCH packet and launches Cursor SDK `Agent` with manager packet + registry model. Requires `CURSOR_API_KEY`. Manager-only. Run metadata in `DISPATCH/runs/`.

### OmniVoice in-repo

Vendored at `tools/OmniVoice-Studio/`. Scripts: `npm run voice:setup|up|down|health`. Env: `OMNIVOICE_URL` (default `http://127.0.0.1:3900`). Model weights not committed.

---

## Execution control (v3.1)

**Status:** Active  
**Plan:** `docs/superpowers/plans/2026-07-16-execution-control-plane.md`

Paperclip-style operator controls on the FS dispatch plane. Assign still queues work; **Play / Run next** executes it.

### Assign vs Play

| Action | Effect |
|--------|--------|
| **Assign** | Validate manager packet → `DISPATCH/queue/<file>.yaml` |
| **Run next** | Claim oldest queued packet → spawn manager (`wake_reason: run_next`) |
| **Play** (task row) | Claim that `dispatchFilename` → spawn (`wake_reason: on_demand`) |
| **Auto-spawn** | After queue, spawn with `wake_reason: auto_queue` |
| **Chat spawn** | Tool `spawn_manager` with `wake_reason: chat` |

### Wake reasons

`assignment` | `on_demand` | `auto_queue` | `chat` | `run_next`

Stored on each run record under `DISPATCH/runs/<runId>.json`.

### Run statuses

`starting` → `running` → `completed` | `error` | `cancelled`

Cancel: `POST /api/runs/:runId/cancel` aborts in-process via `AbortController` and marks `cancelled`.

### Seat runtime status

Derived from pause file + latest run + handoffs (priority):

`paused` > `error` > `running` > `active` / handoff-derived idle/done/blocked/csuite/escalate

Pause file: `DISPATCH/agent-state/<slug>.json` `{ "paused": true }`. Paused seats refuse spawn before claim.

### Budget hard-stop

If packet `budget_usd` is a number `<= 0`, refuse spawn **before** claim. `null` / omitted allows spawn.

### Claim

`claimDispatch(root, { filename? })` — specific file or oldest. Missing file → error (no claim).

### Activity

Append-only `DISPATCH/activity.jsonl` events: `spawn_refused_budget`, `spawn_refused_paused`, `spawn_started`, `spawn_finished`, `spawn_error`, `spawn_cancelled`, `seat_paused`, `seat_resumed`.

### APIs

- `POST /api/spawn` `{ filename?, wakeReason? }` (default `on_demand`)
- `GET /api/runs`, `GET /api/runs/:runId`
- `POST /api/runs/:runId/cancel`
- `POST /api/agents/:slug/pause` | `.../resume`

Snapshot includes `runs` (recent), `agentStates`, `activity` (tail).

### HEARTBEAT

Optional `skills/org/positions/<slug>/HEARTBEAT.md` (template under `skills/org/templates/HEARTBEAT.md`). Spawn prompt instructs managers to follow it after SKILL.md when present.

### Runtime

Cursor SDK behind `RuntimeAdapter`. Multi-runtime deferred. Transcript v1 = run JSON `result` / `error` (no live token stream).

---

## Ops wave 2 (v3.2)

**Status:** Active  
**Plan:** `docs/superpowers/plans/2026-07-16-paperclip-ops-wave-2.md`

### Activity rail

Situation Room renders snapshot `activity` (tail of `DISPATCH/activity.jsonl`) under the mission strip. Clicking a `runId` opens the Runs drawer.

Additional event types: `budget_exhausted`, `rewake_started`, `routine_fired`, `cost_recorded`.

### Usage, cost, budget burn

Runs store `usage` (SDK TokenUsage), `cost_usd` (estimated), `agentId`, `duration_ms`.  
Rates: `src/lib/cost-rates.ts` (env overrides `OCC_COST_INPUT_PER_1M`, `OCC_COST_OUTPUT_PER_1M`, `OCC_COST_CACHE_READ_PER_1M`).  
Ledger: `DISPATCH/spend.json` by seat and day.  
When cumulative seat `cost_usd >= budget_usd` (positive budget on packet or agent-state), auto-pause seat + `budget_exhausted`. Pre-spawn refuses if already over.

### Sessions + rewake

`DISPATCH/sessions/<dispatchFilename>.json` stores `{ agentId, position, phase, dispatch_filename, updated_at, status }`.  
First spawn uses `Agent.create` + `send` + `wait`.  
`POST /api/runs/rewake` `{ dispatchFilename | agentId }` resumes via `Agent.resume` (`wake_reason: rewake`).

### Goal ancestry

Optional packet fields (schema_version stays 1):

- `company_goal` — default tracker idea  
- `parent_goal` — default `Phase {n} — {name}`  
- `goal_path` — default `[company_goal, parent_goal, goal]`

Spawn prompt prints ancestry before YAML.

### Routines

YAML under `DISPATCH/routines/<id>.yaml` with 5-field cron. Server poller every 30s. Actions: `enqueue` | `rewake`. `wake_reason: timer` for enqueue spawns triggered by routines (via auto path) or rewake with timer label when from cron.

Wake reasons extended: `rewake` | `timer`.

---

## Seat reports + company operator gaps (v3.3)

**Status:** Active  
**Plan:** `docs/superpowers/plans/2026-07-16-seat-reports.md`

### Problem

“File report” was a manual standup form. Operators need a derived view of what every digital worker reported, what the runbook requires next, and which actions are human vs agent.

### Seat Report

`GET /api/seat-report/:slug` for any roster slug. Fields: identity, role, freshness, own/downward handoffs, asks/blockers, escalations (`ESCALATION.md`), liveRuns, liveTasks, artifact existence, scorecard/hard-gate, HEARTBEAT presence, seat spend, modelQuality, nextActions (`actor` + `cta`), pinnedBriefing with stale flag.

### Company digest

`GET /api/company-digest` — blocked/escalate seats, awaiting csuite, queue depth, parallel tracks (phase ≥ 10), unread handoff alerts.

### Writes (explicit)

| Action | Effect |
|--------|--------|
| Pin snapshot | `BRIEFINGS/<slug>-standup.md` from derived report; confirm overwrite if disk pin exists |
| Draft csuite review | Create/update draft `HANDOFFS/<phase>-csuite-review.md` (verdict unset / pending) |
| Ack alert | Mark handoff alert seen in `DISPATCH/alerts.json` |

### Voice

`POST /api/voice/brief` accepts `{ mode: "mission" \| "seat" \| "digest", slug? }`. Default seat = `ceo-strategist` when mode=seat.

### Non-goals

No Paperclip; no auto-approve; templates remain canonical.

---

## Self-hosted LiveKit voice (v3.4)

**Status:** Active  
**Plan:** `docs/superpowers/plans/2026-07-16-livekit-self-host-voice.md`  
**Superseded by:** Jarvis Dialog (v3.5) for Talk behavior — transport unchanged; see below.

### Cost policy

No LiveKit Cloud. No LiveKit Inference. No Deepgram/Cartesia.  
Local: `livekit-server --dev`, **Ollama-only** LLM (no Cursor models for voice), Whisper sidecar STT, OmniVoice TTS.

### Flow

1. Operator taps floating **Talk** FAB → `POST /api/livekit/token`  
2. Browser joins room with mic  
3. Agent `situation-room` dispatched → STT/LLM/TTS local → OCC tools  
4. If LiveKit down → `OCC_VOICE_BACKEND=legacy` keeps Web Speech + OmniVoice chat  

### Env

```
LIVEKIT_URL=ws://127.0.0.1:7880
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
OCC_VOICE_BACKEND=livekit
OLLAMA_BASE_URL=http://127.0.0.1:11434/v1
OLLAMA_MODEL=llama3.2
WHISPER_URL=http://127.0.0.1:8090/v1
OMNIVOICE_URL=http://127.0.0.1:3900
OCC_API_BASE=http://127.0.0.1:5177
```

---

## Jarvis Dialog (v3.5)

**Status:** Active (Waves A–D implemented; **catalog v2** E1–E5 extends modes + intents)  
**Design:** `docs/superpowers/specs/2026-07-16-enterprise-jarvis-dialog-design.md`  
**Plan:** `docs/superpowers/plans/2026-07-16-enterprise-jarvis-dialog.md`  
**Catalog v2:** `docs/superpowers/specs/2026-07-16-jarvis-intent-catalog-v2-design.md` — architect mode, ventures, `dispatch.queue_for`  
**Extends:** v3.4 LiveKit transport — adds Dialogue Control Plane (DCP), modes, confirm protocol, and full control-plane voice parity.

### Dialogue Control Plane (DCP)

Server module: `tools/org-command-center/server/jarvis/`

| Module | Responsibility |
|--------|----------------|
| `intents.ts` | Canonical intent enum + parse from tool args |
| `policy.ts` | Mode gates, confirm rules, deny reasons |
| `session.ts` | Per-room state: mode, pending confirm tokens |
| `briefing.ts` | Connect opener + mission script |
| `tools-exec.ts` | Execute intents against existing OCC services |
| `audit.ts` | Activity: `jarvis_intent`, `jarvis_confirm`, `jarvis_denied` |
| `act.ts` | `act` / `confirm` orchestration |

Voice agent tools call OCC (single source of truth), not raw `/api/*`:

- `POST /api/jarvis/act` `{ intent, args, confirmToken? }`
- `GET /api/jarvis/context` → mission + digest slice for system prompt
- `POST /api/jarvis/confirm` `{ token, accept: boolean }`

LiveKit agent (`livekit-agent/`) exposes thin tools → `jarvis_act` / `set_mode` / `jarvis_confirm`.

### Modes

Inspired by LiveKit agent handoffs; mode state lives in DCP session.

| Mode | Persona | Tool subset |
|------|---------|-------------|
| **Briefing** (default on connect) | COO on the radio | read: mission, digest, seat, tasks, runs, activity, alerts, spend, `venture.list` / `venture.get` |
| **Ops** | Execution officer | Briefing + queue, `queue_for`, run_next, cancel, rewake, pause, resume |
| **Review** | Chief of staff | Briefing + file.read, csuite.draft, handoffs, alerts |
| **Architect** | Venture setup | `venture.create`, `venture.switch` (confirm + auto-activate on create) |

Switch: say **“switch to ops”** / **“switch to briefing”** / **“switch to review”** / **“switch to architect”** (intent `mode.set`). Ops-only intents are denied in Briefing; venture ops require Architect.

### Confirm protocol

Hard writes and assign always return `{ status: "needs_confirm", token, summary }`:

1. Jarvis speaks a one-line summary + **“Confirm?”**
2. Operator replies **yes** or **no** (or UI tap → `jarvis_confirm`)
3. Token is single-use, 60s TTL

Soft writes (`alerts.ack`, `routine.enable`) confirm only when ambiguous.

### OSS voice stack (locked)

| Piece | Default |
|-------|---------|
| Transport | LiveKit server (self-host) |
| Agent | `@livekit/agents` (Node) |
| LLM | Ollama `qwen3` (fallback `llama3.1`) — tool-call smoke required |
| STT | Whisper sidecar |
| TTS | mlx-audio Kokoro `am_adam` (`npm run mlx-tts:setup` / `mlx-tts:up`) |
| VAD | Silero |

**Out of policy:** LiveKit Cloud/Inference, Deepgram, Cartesia, ElevenLabs, OpenAI/Anthropic for Talk. Cursor SDK remains worker runtime only.

### Command presence + UI sync

- On connect: `GET /api/jarvis/context` → spoken 2-sentence mission brief.
- SSE `jarvis.focus` events highlight mission strip / seat when Jarvis references phase or slug.
- Optional idle pulse: env `JARVIS_PULSE_MS` (default 0).

### Eval

- CI: `server/jarvis/eval/golden.json` (≥20 cases) + `run-golden.test.ts` (heuristic intent + policy, no LiveKit).
- Local: `npm run jarvis:smoke` (Ollama tool calls), `npm run jarvis:eval:ollama` (optional live LLM eval).

### Wave D (pending)

Audit deny UX, `file.read` path hardening, latency budget — see plan Task 13+.
