# Org Command Center — Situation Room

Glanceable mission status, activity pulse, C-suite board, live tasks, execution controls, seat reports, and **zero-cost LiveKit voice** (floating Talk FAB).

## Quick start

```bash
cd tools/org-command-center
npm install
npm run dev           # http://localhost:5177
```

## Zero-cost voice (LiveKit self-host + Ollama)

No LiveKit Cloud. No Deepgram/Cartesia. Voice LLM is **Ollama only**.

```bash
npm run voice-stack   # prints the recipe

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
| Ollama | 11434 | LLM (Talk agent) |
| mlx-audio Kokoro | 3900 | TTS (`am_adam`) |
| OCC | 5177 | Company tools + token mint |
| Agent worker | — | Joins rooms as `situation-room` |

**Talk FAB:** tap to connect · tap again to mute/unmute · × to hang up. Mission strip **Talk** uses the same session. **Legacy voice** = old Web Speech + HTTP chat.

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
CURSOR_API_KEY=   # digital workers only (Run next), not voice LLM
```

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
| Talk FAB | Self-hosted LiveKit voice ↔ OCC tools |
| Report | Derived seat brief |
| Pin snapshot | Optional BRIEFINGS standup |
| Draft csuite | Prefill review (no auto-approve) |

## Tests

```bash
npm test && npm run build
npm run agent:test
npm run jarvis:smoke   # Ollama tool-call smoke (requires ollama pull qwen3)
```

## Design

`docs/superpowers/specs/2026-07-16-org-command-center-design.md` — **v3.4** LiveKit voice
