#!/usr/bin/env bash
# Smoke-test Ollama tool calling for Jarvis voice (localhost only).
# Exit 0 when the model returns tool_calls; non-zero with setup hints otherwise.
set -euo pipefail

OLLAMA_HOST="${OLLAMA_HOST:-http://127.0.0.1:11434}"
MODEL="${OLLAMA_MODEL:-qwen3}"
FALLBACK="${OLLAMA_FALLBACK_MODEL:-llama3.1}"

if [[ "$OLLAMA_HOST" != http://127.0.0.1:* && "$OLLAMA_HOST" != http://localhost:* ]]; then
  echo "ERROR: OLLAMA_HOST must be localhost (got ${OLLAMA_HOST})"
  exit 1
fi

if ! curl -sf "${OLLAMA_HOST}/api/tags" >/dev/null 2>&1; then
  echo "ERROR: Ollama not reachable at ${OLLAMA_HOST}"
  echo "Run: ollama serve"
  exit 2
fi

if ! python3 - "$OLLAMA_HOST" "$MODEL" <<'PY'
import json, sys, urllib.request

host, model = sys.argv[1], sys.argv[2]
with urllib.request.urlopen(f"{host}/api/tags", timeout=5) as r:
    tags = json.load(r)
names = {m.get("name", "").split(":")[0] for m in tags.get("models", [])}
if model not in names:
    sys.exit(1)
PY
then
  echo "ERROR: Model '${MODEL}' not found locally."
  echo "Run: ollama pull ${MODEL}"
  echo "Fallback (if pull fails): ollama pull ${FALLBACK} && OLLAMA_MODEL=${FALLBACK} $0"
  exit 3
fi

PAYLOAD=$(python3 - "$MODEL" <<'PY'
import json, sys
print(json.dumps({
    "model": sys.argv[1],
    "messages": [{"role": "user", "content": "Call the ping tool now."}],
    "tools": [{
        "type": "function",
        "function": {
            "name": "ping",
            "description": "Return pong",
            "parameters": {"type": "object", "properties": {}},
        },
    }],
    "stream": False,
}))
PY
)

if ! RESPONSE=$(curl -sf "${OLLAMA_HOST}/api/chat" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" 2>&1); then
  echo "ERROR: Ollama /api/chat failed for model '${MODEL}'"
  echo "$RESPONSE"
  echo "Ensure the model supports tool calling. Try: ollama pull ${FALLBACK}"
  exit 4
fi

if python3 - "$RESPONSE" <<'PY'
import json, sys
data = json.loads(sys.argv[1])
msg = data.get("message") or {}
tool_calls = msg.get("tool_calls") or []
sys.exit(0 if tool_calls else 1)
PY
then
  echo "OK: ${MODEL} returned tool_calls (Jarvis voice LLM ready)"
  exit 0
fi

echo "ERROR: ${MODEL} responded but did not return tool_calls."
echo "Jarvis voice requires a tool-capable OSS model."
echo "Try: ollama pull ${FALLBACK} && OLLAMA_MODEL=${FALLBACK} $0"
exit 5
