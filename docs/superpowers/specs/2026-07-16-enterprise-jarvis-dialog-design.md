# Design: Enterprise Jarvis Dialog (open source)

**Date:** 2026-07-16  
**Status:** Waves A–B implemented (C–D pending)  
**App:** `tools/org-command-center/` + `livekit-agent/`  
**Plan:** `docs/superpowers/plans/2026-07-16-enterprise-jarvis-dialog.md`  
**Extends:** OCC design v3.4 (LiveKit voice) + Kokoro TTS design

## Jobs to be done

| Job | Operator outcome |
|-----|------------------|
| Understand & act | Natural speech maps to the correct OCC action; destructive steps require spoken confirm |
| Command presence | On connect: crisp mission brief; interruptible; always knows phase / blockers |
| Full control plane | Voice can drive the same control surface as the UI (assign, run, pause, cancel, rewake, digest, alerts, draft) with audit |
| Stay open source | No LiveKit Cloud, Deepgram, Cartesia, OpenAI, Anthropic for the **voice brain**. Local STT/LLM/TTS only |

## Hard constraints

1. **OSS voice stack only:** LiveKit (self-host), Ollama, Whisper sidecar, mlx-audio Kokoro, Silero VAD.  
2. **Workers still Cursor SDK** (existing execution plane). Jarvis *triggers* spawn via OCC; it does not replace Cursor for IC/manager runs.  
3. **Manager-only fan-out** remains law — no free-form “spawn any agent by name.”  
4. **No auto-approve** of c-suite / phase completion.  
5. **TDD** for policy, intent routing, and OCC tool wrappers.

## Current gap (why it doesn’t feel like Jarvis)

| Layer today | Gap |
|-------------|-----|
| LLM | `llama3.2` weak at multi-tool planning |
| Tools | 6 thin tools; most OCC APIs unreachable by voice |
| Policy | No confirm / dry-run / permission tiers |
| Dialog | No modes, no session memory beyond chat buffer |
| Presence | Greeting only; no proactive mission pulse |
| UI sync | Speech does not drive Situation Room focus |
| Eval | No transcript → intent → tool golden tests |

## Approaches considered

| | Approach | Pros | Cons |
|---|----------|------|------|
| A | Stuff more tools into current `VoicePipelineAgent` + prompt | Fast | Still flaky tool use; no confirmations; no presence |
| B | **Dialogue Control Plane** (intent → policy → OCC tools) + stronger Ollama tool model + LiveKit modes | Enterprise behavior without cloud SaaS | More code; need good local tool-calling model |
| C | Migrate voice agent to Python `AgentSession` + cloud inference | Best LiveKit docs ergonomics | Violates OSS / $0 inference policy |

**Decision: B.** Keep Node `livekit-agent` (or dual-run later), insert a typed Dialogue Control Plane in OCC + agent, upgrade default Ollama model to a tool-capable OSS model (`qwen3` or `llama3.1` — verify tool calls locally), mirror UI APIs as voice tools with policy.

## Architecture

```text
Operator mic
    → LiveKit room
    → situation-room agent (STT Whisper / LLM Ollama / TTS Kokoro)
         │
         ├─ Persona + mode (Briefing | Ops | Review)
         ├─ Intent normalizer (optional small classifier)
         └─ Dialogue Control Plane (OCC)
                │
                ├─ Policy (confirm, allowlist, dry-run)
                ├─ Tool registry → existing /api/* 
                ├─ Audit log (activity pulse)
                └─ UI focus events (SSE /api/events)
    → Cursor SDK only when run_next / rewake / play (unchanged)
```

### Dialogue Control Plane (DCP)

New server module: `tools/org-command-center/server/jarvis/`

| Module | Responsibility |
|--------|----------------|
| `intents.ts` | Canonical intent enum + parse from tool args / NL hints |
| `policy.ts` | Which intents need confirm; seat pause; budget gates |
| `tools.ts` | Thin wrappers over existing API handlers / services |
| `session.ts` | Per-room dialog state: mode, pendingConfirm, lastMission |
| `briefing.ts` | Scripted + tool-backed openers (“Phase 2 Market, 14%, one blocker…”) |
| `audit.ts` | Append activity: `jarvis_intent`, `jarvis_confirm`, `jarvis_denied` |

Voice agent tools call **one** OCC endpoint family:

- `POST /api/jarvis/act` `{ intent, args, confirmToken? }`  
- `GET /api/jarvis/context` → mission + digest slice for system prompt refresh  
- `POST /api/jarvis/confirm` `{ token, accept: boolean }`

This keeps policy and audit in OCC (single source of truth), not duplicated in the agent process.

### Intent catalog (v1)

**Read (no confirm):** `mission.get`, `digest.get`, `seat.report`, `tasks.list`, `runs.list`, `activity.list`, `alerts.list`, `spend.get`, `file.read` (path allowlisted)

**Write soft (confirm if ambiguous):** `dispatch.queue`, `alerts.ack`, `routine.enable`

**Write hard (always confirm):** `spawn.run_next`, `run.cancel`, `run.rewake`, `agent.pause`, `agent.resume`, `csuite.draft`

**Never via voice:** invent packets, mark phase complete, bypass manager-only rules, call cloud LLMs for the brain.

### Confirm protocol

1. Jarvis proposes action in one short sentence.  
2. DCP returns `{ status: "needs_confirm", token, summary }`.  
3. Agent speaks summary + “Confirm?”  
4. Operator says yes/no (or tap UI).  
5. `confirm` executes once; token single-use, 60s TTL.

### Modes (LiveKit agent handoffs — OSS pattern)

Inspired by LiveKit [agent handoffs](https://docs.livekit.io/agents/logic/agents-handoffs.md):

| Mode | Persona | Tool subset |
|------|---------|-------------|
| Briefing | COO on the radio | read + digest + seat |
| Ops | Execution officer | + queue, run_next, pause, cancel, rewake |
| Review | Chief of staff | + file.read, csuite.draft, alerts |

Default: **Briefing** on connect; “switch to ops” handoff unlocks hard writes.

### Model policy (OSS)

| Role | Default | Notes |
|------|---------|-------|
| Voice LLM | `qwen3` via Ollama (fallback `llama3.1`) | Must pass tool-call smoke test |
| STT | Whisper sidecar | Unchanged |
| TTS | Kokoro `am_adam` | Unchanged |
| Workers | Cursor per MODEL-REGISTRY | Unchanged; not the voice brain |

### Command presence

1. On participant link: `GET /api/jarvis/context` → spoken 2-sentence brief.  
2. Optional 5-min soft pulse if still connected and no speech (env `JARVIS_PULSE_MS`).  
3. UI: FAB state + mission strip highlight when Jarvis references a seat/phase (`jarvis.focus` event).

### Open-source stack (locked)

| Piece | OSS |
|-------|-----|
| Transport | LiveKit server |
| Agent framework | `@livekit/agents` (Apache-2.0) |
| LLM | Ollama + open weights |
| STT | mlx-whisper / openai-whisper sidecar |
| TTS | mlx-audio Kokoro |
| VAD | Silero |
| Policy/UI | OCC (this repo) |

**Out of policy:** LiveKit Inference, Deepgram, Cartesia, ElevenLabs, OpenAI/Anthropic for Talk.

## Non-goals (this program)

- Replacing Cursor workers with Ollama agents  
- Telephony / SIP  
- Multi-operator auth (single trusted operator assumed for v1)  
- Cloud-hosted anything for voice

## Success criteria

1. “Where are we on the AWG?” → correct mission answer without hallucinated phases.  
2. “Queue phase 2 and run it” → confirm → dispatch + spawn via Cursor.  
3. “Pause head-of-research” → confirm → seat paused.  
4. On connect, spoken brief matches `/api/snapshot` mission fields.  
5. Golden transcript suite ≥ 20 cases; CI runs intent/policy unit tests without LiveKit.  
6. Zero paid voice SaaS dependencies in `package.json` / agent deps for Talk path.

## Spec self-review

- No cloud TTS/STT/LLM in voice path — covered.  
- Manager-only preserved — covered.  
- Confirm for hard writes — covered.  
- Workers remain Cursor — covered.  
- Implementation tasks live in companion plan — covered.
