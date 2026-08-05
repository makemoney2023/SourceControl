#!/usr/bin/env bash
# Plane B runtime doctor: env flags (set/unset only) + OpenMontage/Remotion bootstrap checks.
# Never prints secret values.
#
# Usage:
#   bash scripts/doctor-production-runtime.sh
#   DOCTOR_ALLOW_MISSING_KEYS=1 bash scripts/doctor-production-runtime.sh   # CI / structure-only for keys
#
# One-time bootstrap when remotion node_modules missing:
#   cd skills/community/openmontage/remotion-composer && npm install
# Python OpenMontage deps: follow skills/community/openmontage README when rendering.
#
# Secrets: resolve via Obsidian MCP / skills/integrations/obsidian-secrets → repo .env.local
#   Local FLUX.2-dev: HF_TOKEN + AI_TOOLKIT_ROOT
#   fal upgrade: FAL_KEY or FAL_AI_API_KEY
#   ELEVENLABS_API_KEY, BLOB_READ_WRITE_TOKEN
# See scripts/bootstrap-production-secrets.md
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

fail=0
allow_missing="${DOCTOR_ALLOW_MISSING_KEYS:-0}"

load_dotenv_local() {
  local f="$ROOT/.env.local"
  [[ -f "$f" ]] || return 0
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ "$line" =~ ^[[:space:]]*$ ]] && continue
    if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
      local k="${BASH_REMATCH[1]}"
      local v="${BASH_REMATCH[2]}"
      v="${v%\"}"; v="${v#\"}"
      v="${v%\'}"; v="${v#\'}"
      if [[ -z "${!k:-}" ]]; then
        export "$k=$v"
      fi
    fi
  done <"$f"
}

report_key() {
  local name="$1"
  if [[ -n "${!name:-}" ]]; then
    echo "  $name: set"
    return 0
  fi
  echo "  $name: unset"
  return 1
}

load_dotenv_local

echo "doctor-production-runtime: secrets (names only)"
keys_ok=1
fal_ok=0
hf_ok=0
report_key FAL_KEY && fal_ok=1 || true
report_key FAL_AI_API_KEY && fal_ok=1 || true
report_key HF_TOKEN && hf_ok=1 || true
if [[ "$fal_ok" -eq 0 && "$hf_ok" -eq 0 ]]; then
  echo "  (need HF_TOKEN for local FLUX.2-dev and/or FAL_KEY for fal)"
  keys_ok=0
fi
report_key ELEVENLABS_API_KEY || keys_ok=0
report_key BLOB_READ_WRITE_TOKEN || true

echo "doctor-production-runtime: local FLUX.2-dev"
toolkit="${AI_TOOLKIT_ROOT:-/Users/cbsuperpatch/Desktop/ai-toolkit}"
if [[ -d "$toolkit" && -f "$toolkit/run.py" ]]; then
  echo "  AI_TOOLKIT_ROOT: present ($toolkit)"
else
  echo "  AI_TOOLKIT_ROOT: missing ($toolkit) — informational; fal still viable"
fi

echo "doctor-production-runtime: tooling"
remotion_dir="$ROOT/skills/community/openmontage/remotion-composer"
if [[ -d "$remotion_dir/node_modules" ]]; then
  echo "  remotion-composer node_modules: present"
else
  echo "  remotion-composer node_modules: missing"
  echo "  fix: cd skills/community/openmontage/remotion-composer && npm install"
  fail=1
fi

if command -v python3 >/dev/null 2>&1; then
  echo "  python3: present"
else
  echo "  python3: missing"
  fail=1
fi

if [[ "$keys_ok" -eq 0 ]]; then
  echo "doctor-production-runtime: keys incomplete (Obsidian → .env.local)"
  if [[ "$allow_missing" != "1" ]]; then
    fail=1
  else
    echo "  DOCTOR_ALLOW_MISSING_KEYS=1 — not failing on keys"
  fi
fi

if [[ "$fail" -ne 0 ]]; then
  echo "doctor-production-runtime: FAILED" >&2
  exit 1
fi
echo "doctor-production-runtime: OK"
exit 0
