#!/usr/bin/env bash
# Cloud Agent install: refresh dependencies for the runnable web apps.
# Idempotent and non-interactive: safe to run repeatedly.
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# App directories that ship an npm lockfile and form the core dev experience.
apps=(
  "apps/blacksage-kennels"
  "apps/superpatch-income-stack"
  "tools/org-command-center"
)

for app in "${apps[@]}"; do
  dir="$repo_root/$app"
  if [[ -f "$dir/package-lock.json" ]]; then
    echo "==> npm ci in $app"
    ( cd "$dir" && npm ci --no-audit --no-fund )
  else
    echo "==> skipping $app (no package-lock.json)"
  fi
done

echo "==> install complete"
