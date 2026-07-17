#!/usr/bin/env bash
# Scaffold a new venture under docs/projects/<slug>/ and register it.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SLUG="${1:-}"
NAME="${2:-}"

if [[ -z "$SLUG" || -z "$NAME" ]]; then
  echo "Usage: $0 <slug> \"<Display Name>\"" >&2
  echo "Example: $0 acme-widgets \"Acme Widgets\"" >&2
  exit 1
fi

if [[ ! "$SLUG" =~ ^[a-z0-9]([a-z0-9-]*[a-z0-9])?$ ]]; then
  echo "Slug must be lowercase alphanumeric with optional hyphens: got '$SLUG'" >&2
  exit 1
fi

REGISTRY="$ROOT/projects/registry.json"
BI="$ROOT/docs/projects/$SLUG/business-idea"
MEM="$ROOT/docs/projects/$SLUG/MEMORY"

if [[ -d "$BI" ]]; then
  echo "Venture already exists: $BI" >&2
  exit 1
fi

if [[ ! -f "$REGISTRY" ]]; then
  echo "Missing $REGISTRY" >&2
  exit 1
fi

if python3 -c "import json; r=json.load(open('$REGISTRY')); exit(0 if '$SLUG' in r.get('projects',{}) else 1)"; then
  echo "Slug already registered in registry.json: $SLUG" >&2
  exit 1
fi

mkdir -p "$BI/DISPATCH/queue" "$BI/DISPATCH/claimed" "$BI/DISPATCH/runs" "$BI/DISPATCH/routines"
mkdir -p "$BI/HANDOFFS" "$BI/BRIEFINGS"
mkdir -p "$MEM/sessions" "$MEM/entities"

if [[ -d "$ROOT/templates/business-idea" ]]; then
  # Copy tracker + handoff readmes when present; do not overwrite if already copied
  if [[ -f "$ROOT/templates/business-idea/RUNBOOK-TRACKER.md" ]]; then
    cp "$ROOT/templates/business-idea/RUNBOOK-TRACKER.md" "$BI/RUNBOOK-TRACKER.md"
  fi
  if [[ -f "$ROOT/templates/business-idea/HANDOFFS/README.md" ]]; then
    cp "$ROOT/templates/business-idea/HANDOFFS/README.md" "$BI/HANDOFFS/README.md"
  elif [[ -f "$ROOT/docs/projects/passive-grid/business-idea/HANDOFFS/README.md" ]]; then
    cp "$ROOT/docs/projects/passive-grid/business-idea/HANDOFFS/README.md" "$BI/HANDOFFS/README.md"
  fi
  if [[ -f "$ROOT/templates/business-idea/DISPATCH/README.md" ]]; then
    mkdir -p "$BI/DISPATCH"
    cp "$ROOT/templates/business-idea/DISPATCH/README.md" "$BI/DISPATCH/README.md"
  elif [[ -f "$ROOT/docs/projects/passive-grid/business-idea/DISPATCH/README.md" ]]; then
    cp "$ROOT/docs/projects/passive-grid/business-idea/DISPATCH/README.md" "$BI/DISPATCH/README.md"
  fi
fi

if [[ ! -f "$BI/RUNBOOK-TRACKER.md" ]]; then
  cat > "$BI/RUNBOOK-TRACKER.md" <<EOF
# Business Idea Runbook Tracker

**Idea:** $NAME
**Classification:**
**Mode:** explore
**Depth:** standard
**Started:** $(date +%Y-%m-%d)
**Last updated:** $(date +%Y-%m-%d)
**Current phase:** 0

## Phase status

| Phase | Name | Status | Artifact | Notes |
|-------|------|--------|----------|-------|
| 0 | Intake | ⬜ | 00-intake.md | |
EOF
fi

cat > "$MEM/README.md" <<EOF
# $NAME — Memory

Filesystem memory for this venture. Active when \`projects/registry.json\` has \`"active": "$SLUG"\`.

| Path | Purpose |
|------|---------|
| \`decisions.md\` | Durable decisions and rationale |
| \`sessions/\` | Session summaries |
| \`entities/\` | Named entity notes |

No vector DB in v1.
EOF

cat > "$MEM/decisions.md" <<EOF
# Decisions — $NAME

| Date | Decision | Rationale |
|------|----------|-----------|
| $(date +%Y-%m-%d) | Venture scaffolded | Created via scripts/new-venture.sh |
EOF

python3 - <<PY
import json
from pathlib import Path
path = Path("$REGISTRY")
reg = json.loads(path.read_text())
reg["projects"]["$SLUG"] = {
    "name": "$NAME",
    "businessIdea": "docs/projects/$SLUG/business-idea",
    "memory": "docs/projects/$SLUG/MEMORY",
}
path.write_text(json.dumps(reg, indent=2) + "\n")
print(f"Registered venture: $SLUG ($NAME)")
print(f"  business-idea: docs/projects/$SLUG/business-idea")
print(f"  memory:        docs/projects/$SLUG/MEMORY")
print(f"Active remains:  {reg['active']}")
print("Switch with OCC Situation Room or: POST /api/project {\"active\":\"$SLUG\"}")
PY
