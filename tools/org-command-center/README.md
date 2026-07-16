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

**Talk FAB:** tap to connect · tap again to mute/unmute · × to hang up. Mission strip **Talk** uses the same session. **Legacy voice** = old Web Speech + HTTP chat (`OCC_VOICE_BACKEND=legacy`).

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
CURSOR_API_KEY=   # digital workers only (Run next), not voice LLM
```

Verify Ollama tool-calling before Talk:

```bash
npm run jarvis:smoke   # requires: ollama pull qwen3 && ollama serve
```

## Jarvis modes

Default on connect: **Briefing** (read-only). Hard writes require **Ops** mode + spoken confirm.

| Mode | Say | Unlocks |
|------|-----|---------|
| **Briefing** | “switch to briefing” | mission, digest, seat report, tasks, runs, activity, alerts, spend |
| **Ops** | “switch to ops” | + assign, run next, cancel, rewake, pause, resume |
| **Review** | “switch to review” | + file read (allowlisted), csuite draft, alerts |

Mode changes via natural speech (`mode.set` intent) or agent tool `set_mode`. Ops-only intents are **denied** while in Briefing.

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

Jarvis maps natural speech to **intents** via `jarvis_act`. Use **Ops** mode before assign, run, pause, cancel, rewake, or draft actions.

| Say (examples) | Intent | Confirm? |
|----------------|--------|----------|
| Where are we / mission status / AWG status | `mission.get` | No |
| Company digest / rollup / blockers | `digest.get` | No |
| Report on CEO / seat report for … | `seat.report` | No |
| What tasks / live tasks | `tasks.list` | No |
| List runs / what’s running | `runs.list` | No |
| Activity / recent pulse | `activity.list` | No |
| Alerts / handoff alerts | `alerts.list` | No |
| Ack alert … / dismiss alert … | `alerts.ack` | Soft |
| Spend / budget by seat | `spend.get` | No |
| Assign phase 2 research / queue dispatch | `dispatch.queue` | Yes |
| Run next / spawn / execute queue | `spawn.run_next` | Yes |
| Cancel run … | `run.cancel` | Yes |
| Rewake / resume session … | `run.rewake` | Yes |
| Pause head-of-research / pause seat … | `agent.pause` | Yes |
| Resume … / unpause seat … | `agent.resume` | Yes |
| Draft csuite / csuite review phase 2 | `csuite.draft` | Yes |
| Enable routine … | `routine.enable` | Soft |
| Read file … (allowlisted paths only) | `file.read` | No |
| Switch to ops / briefing / review | `mode.set` | No |

Review mode adds `file.read` and `csuite.draft`; spawn intents stay disabled there.

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
