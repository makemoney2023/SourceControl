# Kokoro TTS voice (Situation Room) — design

**Date:** 2026-07-16  
**Status:** Approved  
**Goal:** Replace robotic macOS `say` TTS with natural local Kokoro (male `am_adam`) while staying $0 / localhost-only.

## Decision

Primary TTS = **mlx-audio** OpenAI-compatible server on `127.0.0.1:3900`, model `mlx-community/Kokoro-82M-bf16`, voice **`am_adam`**.

`say-tts` remains an emergency fallback (`npm run say-tts:up`).

## Non-goals

- Paid cloud TTS (Cartesia, ElevenLabs, OpenAI)
- Changing STT / LiveKit / Ollama wiring
- OmniVoice-Studio dependency for Talk

## Interface

Same contract the agent already uses:

- `POST /v1/audio/speech` `{ model, input, voice }` → audio bytes  
- Agent env: `OMNIVOICE_URL`, `OMNIVOICE_MODEL`, `OMNIVOICE_VOICE`

## Ops

- `npm run mlx-tts:setup` — create venv with **Python 3.11–3.13** (not 3.14; spaCy/misaki) + `mlx-audio[server,tts]` + `misaki[en]`
- `npm run mlx-tts:up` — start server on `:3900`
- First run downloads Kokoro weights (one-time)
- First speech after cold start may take ~10–15s while the model loads

## Success

Talk FAB greeting and replies sound natural (male), not macOS Samantha.
