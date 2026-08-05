#!/usr/bin/env bash
# Regenerate Blacksage photoreal stills via local FLUX.2-dev (ai-toolkit) or fal.
# Usage:
#   bash scripts/render-blacksage-stills.sh --dry-run
#   bash scripts/render-blacksage-stills.sh --backend local --run --only email-header
#   bash scripts/render-blacksage-stills.sh --backend local --run
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BACKEND=""
DRY_RUN=0
DO_RUN=0
ONLY=""
JOB_FILE="$ROOT/docs/projects/blacksage-kennels/business-idea/11-brand/refs/blacksage-stills.job.json"
AI_TOOLKIT_ROOT="${AI_TOOLKIT_ROOT:-/Users/cbsuperpatch/Desktop/ai-toolkit}"

usage() {
  echo "Usage: $0 [--backend local|fal] [--dry-run] [--run] [--only id] [--job PATH]" >&2
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --backend) BACKEND="$2"; shift 2 ;;
    --dry-run) DRY_RUN=1; shift ;;
    --run) DO_RUN=1; shift ;;
    --only) ONLY="$2"; shift 2 ;;
    --job) JOB_FILE="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; usage; exit 1 ;;
  esac
done

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

load_dotenv_local
AI_TOOLKIT_ROOT="${AI_TOOLKIT_ROOT:-/Users/cbsuperpatch/Desktop/ai-toolkit}"

fal_ready=0
[[ -n "${FAL_KEY:-}" || -n "${FAL_AI_API_KEY:-}" ]] && fal_ready=1
local_ready=0
[[ -n "${HF_TOKEN:-}" && -d "$AI_TOOLKIT_ROOT" && -f "$AI_TOOLKIT_ROOT/run.py" ]] && local_ready=1

if [[ -z "$BACKEND" ]]; then
  if [[ "$(uname -s)" == "Darwin" && "$local_ready" -eq 1 ]]; then
    BACKEND=local
  elif [[ "$fal_ready" -eq 1 ]]; then
    BACKEND=fal
  elif [[ "$local_ready" -eq 1 ]]; then
    BACKEND=local
  else
    BACKEND=none
  fi
fi

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "render-blacksage-stills: dry-run backend=${BACKEND} job=$JOB_FILE"
  [[ -f "$JOB_FILE" ]] || { echo "missing job file" >&2; exit 1; }
  echo "render-blacksage-stills: dry-run OK"
  exit 0
fi

if [[ "$BACKEND" == "none" ]]; then
  echo "render-blacksage-stills: no backend (need HF_TOKEN+ai-toolkit or FAL_KEY)" >&2
  echo "See scripts/bootstrap-production-secrets.md" >&2
  exit 2
fi

if [[ "$BACKEND" == "local" && "$local_ready" -eq 0 ]]; then
  echo "render-blacksage-stills: local backend not ready (HF_TOKEN + AI_TOOLKIT_ROOT)" >&2
  exit 2
fi
if [[ "$BACKEND" == "fal" && "$fal_ready" -eq 0 ]]; then
  echo "render-blacksage-stills: fal backend not ready (FAL_KEY)" >&2
  exit 2
fi

if [[ ! -f "$JOB_FILE" ]]; then
  echo "render-blacksage-stills: missing job file $JOB_FILE" >&2
  exit 1
fi

echo "render-blacksage-stills: backend=$BACKEND job=$JOB_FILE only=${ONLY:-all}"

OUT_DIR="$AI_TOOLKIT_ROOT/output/blacksage-stills"
GEN_YAML="$AI_TOOLKIT_ROOT/config/blacksage-stills.generate.yaml"
mkdir -p "$OUT_DIR" "$(dirname "$GEN_YAML")"

python3 - "$JOB_FILE" "$GEN_YAML" "$OUT_DIR" "$ONLY" <<'PY'
import json, sys, pathlib
job_path, out_yaml, out_dir, only = sys.argv[1:5]
job = json.loads(pathlib.Path(job_path).read_text())
stills = job.get("stills", [])
if only:
    stills = [s for s in stills if s["id"] == only]
    if not stills:
        raise SystemExit(f"unknown --only id: {only}")
# Prefer moderate size for first local runs; flags can override per prompt
lines = [
    "---",
    "",
    "job: generate",
    "config:",
    "  name: blacksage-stills",
    "  process:",
    "    - type: to_folder",
    f"      output_folder: \"{out_dir}\"",
    "      device: mps",
    "      model:",
    "        name_or_path: \"black-forest-labs/FLUX.2-dev\"",
    "        arch: flux2",
    "        dtype: bf16",
    "      generate:",
    "        sampler: flowmatch",
    "        sample_steps: 20",
    "        guidance_scale: 4",
    "        width: 1024",
    "        height: 1024",
    "        ext: \".png\"",
    "        prompts:",
]
for item in stills:
    w, h = item.get("width", 1024), item.get("height", 1024)
    # keep aspect via prompt flags; base 1024 square then --w/--h
    prompt = item["prompt"].replace('"', '\\"')
    lines.append(f"          - \"{prompt} --w {w} --h {h} --steps 20 --cfg 4\"")
pathlib.Path(out_yaml).write_text("\n".join(lines) + "\n")
meta = {"stills": stills, "yaml": out_yaml, "out_dir": out_dir}
pathlib.Path(out_yaml + ".meta.json").write_text(json.dumps(meta, indent=2))
print(f"wrote {out_yaml} ({len(stills)} prompts)")
PY

if [[ "$BACKEND" == "fal" ]]; then
  echo "render-blacksage-stills: fal path not automated yet — use fal-media with job JSON prompts" >&2
  exit 2
fi

if [[ "$DO_RUN" -ne 1 ]]; then
  echo "Prepared YAML. To generate:"
  echo "  bash scripts/render-blacksage-stills.sh --backend local --run${ONLY:+ --only $ONLY}"
  echo "Or: cd \"$AI_TOOLKIT_ROOT\" && .venv/bin/python run.py \"$GEN_YAML\""
  exit 0
fi

PY="$AI_TOOLKIT_ROOT/.venv/bin/python"
[[ -x "$PY" ]] || PY=python3
export HF_TOKEN
export HF_HUB_ENABLE_HF_TRANSFER="${HF_HUB_ENABLE_HF_TRANSFER:-1}"

echo "render-blacksage-stills: invoking ai-toolkit (first run may download FLUX.2-dev — large)"
echo "  $PY run.py $GEN_YAML"
(
  cd "$AI_TOOLKIT_ROOT"
  "$PY" run.py "$GEN_YAML"
)

# Copy newest PNGs onto targets in job order
python3 - "$GEN_YAML.meta.json" "$ROOT" <<'PY'
import json, pathlib, shutil, sys
from datetime import datetime, timezone

meta = json.loads(pathlib.Path(sys.argv[1]).read_text())
root = pathlib.Path(sys.argv[2])
out = pathlib.Path(meta["out_dir"])
pngs = sorted(out.glob("*.png"), key=lambda p: p.stat().st_mtime)
stills = meta["stills"]
if len(pngs) < len(stills):
    print(f"WARNING: expected {len(stills)} pngs, found {len(pngs)} in {out}", file=sys.stderr)
pngs = pngs[-len(stills) :] if pngs else []
for i, item in enumerate(stills):
    dest = root / item["path"]
    dest.parent.mkdir(parents=True, exist_ok=True)
    if i >= len(pngs):
        print(f"MISSING output for {item['id']}", file=sys.stderr)
        continue
    shutil.copy2(pngs[i], dest)
    side = dest.with_suffix(dest.suffix + ".photoreal.json")
    side.write_text(
        json.dumps(
            {
                "id": item["id"],
                "path": item["path"],
                "model_id": "black-forest-labs/FLUX.2-dev",
                "generation_used": "local/flux-2-dev",
                "device": "mps",
                "photoreal_qa": "draft",
                "license_basis": "",
                "notes": "Operator: run photoreal checklist; set photoreal_qa pass + license_basis for commercial Layer B",
                "generated_at": datetime.now(timezone.utc).isoformat(),
            },
            indent=2,
        )
        + "\n"
    )
    print(f"copied {pngs[i].name} -> {dest}")
PY

echo "render-blacksage-stills: done (sidecars photoreal_qa=draft until checklist + license_basis)"
exit 0
