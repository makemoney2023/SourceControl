#!/usr/bin/env bash
# Lint email HTML files (alt, CTA, max-width 600, no script).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIR="${1:-$ROOT/docs/projects/blacksage-kennels/business-idea/17-channels/email/html}"
fail=0

shopt -s nullglob
files=("$DIR"/*.html)
if [[ ${#files[@]} -eq 0 ]]; then
  echo "validate-email-html: no HTML in $DIR" >&2
  exit 1
fi

for f in "${files[@]}"; do
  base="$(basename "$f")"
  [[ "$base" == _* ]] && continue
  if grep -qiE '<script[\s>]' "$f"; then
    echo "FAIL script: $base" >&2; fail=1
  fi
  if ! grep -qiE 'max-width:\s*600px|width="600"' "$f"; then
    echo "FAIL max-width: $base" >&2; fail=1
  fi
  if ! grep -qiE '<a[^>]+href=' "$f"; then
    echo "FAIL cta: $base" >&2; fail=1
  fi
  if grep -qiE '<img\b' "$f" && ! grep -qiE '\balt=' "$f"; then
    echo "FAIL img alt: $base" >&2; fail=1
  fi
done

if [[ "$fail" -ne 0 ]]; then
  echo "validate-email-html: FAILED" >&2
  exit 1
fi
echo "validate-email-html: OK (${#files[@]} files)"
