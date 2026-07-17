# Org Command Center — Situation Room

Glanceable mission status, activity pulse, C-suite board, live tasks, execution controls, seat reports, and **enterprise Jarvis voice** (self-hosted LiveKit + Dialogue Control Plane).

## Quick start

```bash
cd tools/org-command-center
npm install
npm run dev           # http://localhost:5177
```

## Jarvis voice stack (zero-cost, OSS)

No LiveKit Cloud. No Deepgram/Cartesia. Voice LLM is **Ollama only** (`qwen3` default).

```bash
npm run voice-stack   # prints the full recipe

# Terminals:
npm run livekit:up          # brew install livekit → :7880 (devkey/secret)
npm run whisper:up          # local Whisper → :8090
ollama serve && ollama pull qwen3   # fallback: ollama pull llama3.1
npm run mlx-tts:setup       # once — Kokoro via mlx-audio
npm run mlx-tts:up          # Kokoro TTS → :3900 (voice am_adam)
# fallback: npm run say-tts:up
npm run agent:dev           # situation-room worker
npm run dev                 # UI — floating mic FAB bottom-right
```

| Piece | Port | Role |
|-------|------|------|
| livekit-server --dev | 7880 | WebRTC room |
| Whisper sidecar | 8090 | STT |
| Ollama | 11434 | LLM (Talk agent, `qwen3`) |
| mlx-audio Kokoro | 3900 | TTS (`am_adam`) |
| OCC | 5177 | DCP + company tools + token mint |
| Agent worker | — | Joins rooms as `situation-room` |

### Latency targets (local, warm)

| Stage | Target |
|-------|--------|
| STT end → first audio | < 2.5s |
| Confirm round-trip | < 1.5s |
| Kokoro cold start | Once per boot; `mlx-tts:up` preloads via 1-word synthesis |

`mlx-tts:up` starts Kokoro in the background, waits for `:3900`, POSTs a warmup to `/tmp/kokoro-warm.wav`, then keeps the server in the foreground. Preload failure logs a warning only — the server stays up.

**Talk FAB:** tap to connect · tap again to mute/unmute · × to hang up. Mission strip **Talk** uses the same session. **Legacy voice** = old Web Speech + HTTP chat (`OCC_VOICE_BACKEND=legacy`).

**Speech hygiene:** Tool results are sanitized for TTS (`sanitizeForSpeech`) and prefer the act `summary` over raw JSON/markdown so Kokoro does not say “asterisk” or monologue dump payloads. Restart `npm run jarvis:agent` (or your voice-stack recipe) after pulling these changes.

Env (defaults work for local):

```bash
LIVEKIT_URL=ws://127.0.0.1:7880
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
OCC_VOICE_BACKEND=livekit
OLLAMA_BASE_URL=http://127.0.0.1:11434/v1
OLLAMA_MODEL=qwen3
WHISPER_URL=http://127.0.0.1:8090/v1
OMNIVOICE_URL=http://127.0.0.1:3900
OMNIVOICE_MODEL=mlx-community/Kokoro-82M-bf16
OMNIVOICE_VOICE=am_adam
OCC_API_BASE=http://127.0.0.1:5177
JARVIS_PULSE_MS=0          # optional idle mission pulse (ms; 0 = off)
XAI_API_KEY=               # Jarvis voice LLM (Grok); omit or JARVIS_LLM_BACKEND=ollama for local
JARVIS_LLM_MODEL=grok-4.5  # optional override
CURSOR_API_KEY=   # required for voice work.request + Run next (Cursor SDK workers)
```

**Voice LLM:** With `XAI_API_KEY` in repo `.env.local`, Jarvis’s spoken brain uses xAI Grok (`grok-4.5` by default; override with `JARVIS_LLM_MODEL`). STT/TTS stay local (Whisper + Kokoro). Force Ollama with `JARVIS_LLM_BACKEND=ollama`. Worker spawn is separate and still uses the Cursor SDK + `CURSOR_API_KEY`. The system prompt includes a domain→seat routing cheat sheet so Grok can infer who to spin up when you don’t name a seat.

**Voice → Cursor spawn:** In Ops, say e.g. “spin up the CEO to look at this project” or “write a short blog”. Jarvis switches to Ops, runs `work.resolve` once, then `work.request` → one confirm → queues the manager and starts Cursor (`spawnClaimedManagerDetached`). Content asks (blog/copy) may gather a couple of requirements first; clear seat+goal asks skip invented clarifying questions. Deliverables land under `docs/projects/<active>/business-idea/REVIEW/inbox/` (Outputs drawer → **Needs review**). Without `CURSOR_API_KEY` in repo `.env.local`, confirm will fail with “CURSOR_API_KEY missing”.

Optional Ollama smoke (only if using `JARVIS_LLM_BACKEND=ollama`):

```bash
npm run jarvis:smoke   # requires: ollama pull qwen3 && ollama serve
```

## Jarvis modes

Default on connect: **Briefing** (read-only). Hard writes require the right mode + spoken confirm.

| Mode | Say | Unlocks |
|------|-----|---------|
| **Briefing** | “switch to briefing” | Reads, digests, `venture.list` / `venture.get` |
| **Ops** | “switch to ops” | Queue, `queue_for`, `work.request`, spawn, pause, cancel, rewake |
| **Review** | “switch to review” | `file.read`, `csuite.draft`, handoffs |
| **Architect** | “switch to architect” | `venture.create`, `venture.switch` |

Mode changes via natural speech (`mode.set` intent) or agent tool `set_mode`. Ops-only intents are **denied** in Briefing; venture create/switch require **Architect**.

## Confirm phrase

When Jarvis proposes a write (assign, run, pause, cancel, etc.):

1. Jarvis speaks a one-line summary and asks **“Confirm?”**
2. Reply **yes** to execute or **no** to cancel (also `jarvis_confirm` tool / UI)
3. Confirm tokens expire in **60s** and are **single-use**

Example: “Queue phase 2 research” → summary → “Confirm?” → “yes”.

## What you see

| Zone | Purpose |
|------|---------|
| Mission strip | NOW phase, %, Brief / Talk / Assign / Run next / Digest / Alerts |
| Floating Talk | LiveKit mic session (Ollama + Whisper + Kokoro TTS) |
| Seat Report | Derived status + human/agent next actions for any worker |
| Company digest | Blocked/escalate/awaiting-csuite rollup |
| Live tasks | Play / Cancel / Rewake |
| Runs / Routines | Execution + cron |

## Execution

| Action | Effect |
|--------|--------|
| Assign | Queue manager packet |
| Run next / Play | Claim + Cursor SDK spawn (workers) |
| Talk FAB | Self-hosted LiveKit voice ↔ DCP ↔ OCC tools |
| Report | Derived seat brief |
| Pin snapshot | Optional BRIEFINGS standup |
| Draft csuite | Prefill review (no auto-approve) |

## Voice commands cheatsheet

Jarvis maps natural speech to **intents** via `jarvis_act`. Use **Ops** before queue/spawn/pause/cancel; **Architect** before venture create/switch; **Review** for file read and csuite draft.

| Say (examples) | Intent | Confirm? |
|----------------|--------|----------|
| Where are we / mission status / AWG status | `mission.get` | No |
| Company digest / rollup / blockers | `digest.get` | No |
| What's blocked / any blockers / list blockers | `blocker.list` | No |
| Resolve that blocker / unblock research (after listing) | `blocker.resolve` | Yes |
| Report on CEO / seat report for … | `seat.report` | No |
| What tasks / live tasks | `tasks.list` | No |
| List runs / what’s running | `runs.list` | No |
| Is it done / run status / watch runs | `runs.watch` | No |
| Status of run … (by id) | `runs.get` | No |
| Activity / recent pulse | `activity.list` | No |
| Alerts / handoff alerts | `alerts.list` | No |
| Ack alert … / dismiss alert … | `alerts.ack` | Soft |
| Spend / budget by seat | `spend.get` | No |
| Assign phase 2 research / queue dispatch | `dispatch.queue` | Yes |
| Give CFO a task to … / queue head-of-research to … | `dispatch.queue_for` | Yes |
| Spin up research and finance / kick off multiple managers | `dispatch.queue_batch` then `spawn.run_ready` | Yes (each) |
| Run ready / start queued managers | `spawn.run_ready` | Yes |
| Run next / spawn / execute queue | `spawn.run_next` | Yes |
| Cancel run … | `run.cancel` | Yes |
| Rewake / resume session … | `run.rewake` | Yes |
| Tell them to … / also cover … (mid-run) | `run.instruct` | Yes |
| Pause head-of-research / pause seat … | `agent.pause` | Yes |
| Resume … / unpause seat … | `agent.resume` | Yes |
| Draft csuite / csuite review phase 2 | `csuite.draft` | Yes |
| Enable routine … | `routine.enable` | Soft |
| Read file … (allowlisted paths only) | `file.read` | No |
| Switch to ops / briefing / review / architect | `mode.set` | No |
| Create a venture called X | `venture.create` | Yes (auto-activates) |
| Switch to venture slug | `venture.switch` | Yes |
| Spawn the copywriter | `agent.spawn_ic` | Denied |
| Write a short blog / create an article | `work.resolve` → intake → `work.request` | Yes (on request) |
| Kick off the work / start Cursor | `work.request` | Yes |
| Show review inbox / needs review | `review.inbox_list` | No |

Review mode adds `file.read`, `csuite.draft`, and handoffs; spawn intents stay disabled there. IC spawn requests are always denied — use `work.resolve` / `work.request` so Jarvis intakes with the manager and starts Cursor.

**Phase 1+2 lifecycle intents:** `runs.watch` (completion/gaps), `run.instruct` (mid-run operator delta), `blocker.list` / `blocker.resolve` (blocked seats), `dispatch.queue_batch` + `spawn.run_ready` (multi-manager kickoff). Started ≠ done — always confirm with `runs.watch` before reporting completion.

## Manual soak

Use a live voice session (LiveKit + Ops mode) to validate end-to-end behavior after deploy.

**After Phase 1 (closed action loop):**

1. Voice: “Spin up the CEO to review this project” → Confirm → hear **started** + runId
2. Wait / ask “is it done?” → `runs.watch` reflects finished or gaps
3. If gaps: “tell them to write the review to the inbox” → `run.instruct`
4. Confirm inbox file has `runId` frontmatter

**After Phase 2 (ops control plane):**

1. Create a blocked handoff fixture → “what’s blocked?” → “resolve that blocker” → confirm → owner running
2. “Kick off head of research and CFO on market and burn” → one confirm → two runIds

## Tests & eval

```bash
npm test                  # unit + golden transcript eval (≥20 cases, no LiveKit)
npm run build
npm run agent:test        # livekit-agent wiring
npm run jarvis:smoke      # Ollama tool-call smoke (requires ollama pull qwen3)
npm run jarvis:eval:ollama   # optional live LLM eval against golden.json
```

Golden cases live in `server/jarvis/eval/golden.json`; CI runs heuristic intent + policy via `run-golden.test.ts` inside `npm test`.

## Design

- `docs/superpowers/specs/2026-07-16-org-command-center-design.md` — **v3.5** Jarvis Dialog
- `docs/superpowers/specs/2026-07-16-enterprise-jarvis-dialog-design.md` — DCP detail
- `docs/superpowers/plans/2026-07-16-enterprise-jarvis-dialog.md` — implementation plan
- `docs/superpowers/specs/2026-07-16-jarvis-intent-catalog-v2-design.md` — catalog v2 (architect mode, ventures, `queue_for`)
- `docs/superpowers/plans/2026-07-16-jarvis-intent-catalog-v2.md` — catalog v2 implementation plan
- `docs/superpowers/specs/2026-07-16-jarvis-work-request-voice-spawn-design.md` — voice-driven `work.request` + REVIEW inbox
- `docs/superpowers/specs/2026-07-17-jarvis-closed-action-loop-design.md` — closed action loop + ops control plane (Approved)
