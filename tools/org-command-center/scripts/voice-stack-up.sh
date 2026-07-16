#!/usr/bin/env bash
# Prints the terminal recipe for the zero-cost voice stack (does not daemonize everything).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cat <<EOF
Zero-cost Situation Room voice stack
====================================
Run each in its own terminal from: $ROOT

  1) npm run livekit:up          # :7880  (brew install livekit)
  2) npm run whisper:up          # :8090  (local Whisper)
  3) ollama serve                # :11434
     ollama pull qwen3          # Jarvis tool-calling LLM (fallback: llama3.1)
     npm run jarvis:smoke       # verify tool_calls before Talk FAB
  4) npm run mlx-tts:setup       # once — Kokoro / mlx-audio
     npm run mlx-tts:up          # :3900  Kokoro TTS (am_adam)
     # fallback: npm run say-tts:up
  5) npm run agent:dev           # situation-room worker
  6) npm run dev                 # OCC UI :5177 — use floating Talk FAB

Health checks:
  curl -s http://127.0.0.1:7880 >/dev/null && echo livekit: ok || echo livekit: down
  curl -sf http://127.0.0.1:8090/health && echo
  curl -sf http://127.0.0.1:11434/api/tags >/dev/null && echo ollama: ok || echo ollama: down
  npm run voice:health
EOF
