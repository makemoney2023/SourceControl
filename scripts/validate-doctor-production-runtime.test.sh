#!/usr/bin/env bash
# TDD gate for doctor-production-runtime.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOC="$ROOT/scripts/doctor-production-runtime.sh"
fail=0

if [[ ! -f "$DOC" ]]; then
  echo "FAIL: missing $DOC" >&2
  exit 1
fi

# Structure-only: keys may be missing; remotion may still fail — create temp marker or allow both paths
# When keys missing and ALLOW!=1, doctor must exit non-zero (even if remotion present).
out="$(
  env -u FAL_KEY -u FAL_AI_API_KEY -u ELEVENLABS_API_KEY \
    DOCTOR_ALLOW_MISSING_KEYS=0 \
    bash "$DOC" 2>&1 || true
)"
if echo "$out" | grep -q 'doctor-production-runtime: OK'; then
  # Only OK if somehow keys exist in shell environment outside .env — re-check unset message
  if echo "$out" | grep -q 'keys incomplete'; then
    echo "FAIL: reported keys incomplete but exited OK" >&2
    fail=1
  fi
else
  if ! echo "$out" | grep -qE 'unset|FAILED|keys incomplete|node_modules: missing'; then
    echo "FAIL: expected failure signal when keys/tooling incomplete" >&2
    echo "$out" >&2
    fail=1
  fi
fi

# CI-safe mode must not fail solely on keys when remotion is present OR we stub by allowing missing keys
# and accepting remotion missing as the only hard fail — with ALLOW=1, remotion missing still fails.
ci_out="$(
  env -u FAL_KEY -u FAL_AI_API_KEY -u ELEVENLABS_API_KEY \
    DOCTOR_ALLOW_MISSING_KEYS=1 \
    bash "$DOC" 2>&1 || true
)"
if ! echo "$ci_out" | grep -q 'DOCTOR_ALLOW_MISSING_KEYS=1'; then
  echo "FAIL: CI mode should note allow-missing-keys" >&2
  fail=1
fi
if ! echo "$ci_out" | grep -qE 'FAL_KEY: unset|FAL_AI_API_KEY: unset|ELEVENLABS'; then
  echo "FAIL: should report key status names" >&2
  fail=1
fi
# Must never echo a long secret-looking value
if echo "$ci_out" | grep -qE 'sk-[a-zA-Z0-9]{20,}|[a-f0-9]{40,}'; then
  echo "FAIL: possible secret value leaked" >&2
  fail=1
fi

if [[ "$fail" -ne 0 ]]; then
  echo "validate-doctor-production-runtime.test: FAILED" >&2
  exit 1
fi
echo "validate-doctor-production-runtime.test: OK"
