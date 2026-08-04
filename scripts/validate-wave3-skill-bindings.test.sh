#!/usr/bin/env bash
# TDD gate: wave-3 skill→role bindings (remotion/CAD/marketing leftovers + selective plugins/context).
# Run: bash scripts/validate-wave3-skill-bindings.test.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
POS="$ROOT/skills/org/positions"
PACK="$ROOT/skills/org/packs/production-artifacts/SKILL.md"
fail=0

assert_bind() {
  local seat="$1" pack_fragment="$2" label="$3"
  local file="$POS/$seat/SKILL.md"
  if [[ ! -f "$file" ]]; then
    echo "FAIL: $label — missing seat file $file" >&2
    fail=1
    return
  fi
  if ! grep -qF "$pack_fragment" "$file"; then
    echo "FAIL: $label — '$pack_fragment' not bound on $seat" >&2
    fail=1
  fi
}

assert_pack_exists() {
  local rel="$1"
  if [[ ! -f "$ROOT/$rel/SKILL.md" ]] && [[ ! -f "$ROOT/$rel/AGENTS.md" ]]; then
    echo "FAIL: pack missing on disk: $rel" >&2
    fail=1
  fi
}

assert_grep() {
  local file="$1" pattern="$2" label="$3"
  if [[ ! -f "$file" ]]; then
    echo "FAIL: $label — file missing: $file" >&2
    fail=1
    return
  fi
  if ! grep -qE "$pattern" "$file"; then
    echo "FAIL: $label — /$pattern/ not in ${file#"$ROOT/"}" >&2
    fail=1
  fi
}

for rel in \
  skills/community/remotion/video/remotion-captions \
  skills/community/remotion/video/remotion-interactivity \
  skills/community/remotion/video/remotion-markup \
  skills/community/remotion/video/remotion-saas \
  skills/community/remotion/video/mediabunny \
  skills/community/text-to-cad/implicit-cad \
  skills/community/text-to-cad/sdf \
  skills/community/text-to-cad/urdf \
  skills/community/text-to-cad/bambu-labs \
  skills/community/text-to-cad/sendcutsend \
  skills/community/text-to-cad/srdf \
  skills/community/awesome-claude-corporate-skills/04-marketing/brand-voice-enforcement \
  skills/community/awesome-claude-corporate-skills/04-marketing/canvas-design \
  skills/community/awesome-claude-corporate-skills/04-marketing/competitive-ads-extractor \
  skills/community/awesome-claude-corporate-skills/04-marketing/domain-name-brainstormer \
  skills/community/awesome-claude-corporate-skills/04-marketing/guideline-generation \
  skills/plugins/figma/figma-use \
  skills/plugins/figma/figma-generate-design \
  skills/plugins/figma/figma-implement-motion \
  skills/plugins/vercel/ai-sdk \
  skills/plugins/vercel/auth \
  skills/plugins/vercel/env-vars \
  skills/plugins/superpowers/writing-plans \
  skills/plugins/superpowers/executing-plans \
  skills/context-engineering/skills/context-fundamentals \
  skills/context-engineering/skills/multi-agent-patterns \
  skills/context-engineering/skills/tool-design
do
  assert_pack_exists "$rel"
done

# remotion (non-maintainer)
assert_bind video-producer "remotion/video/remotion-captions" "video captions"
assert_bind video-producer "remotion/video/remotion-interactivity" "video interactivity"
assert_bind video-producer "remotion/video/remotion-markup" "video markup"
assert_bind video-producer "remotion/video/remotion-saas" "video saas"
assert_bind video-producer "remotion/video/mediabunny" "video mediabunny"

# text-to-cad leftovers
assert_bind hardware-engineer "text-to-cad/implicit-cad" "hw implicit-cad"
assert_bind hardware-engineer "text-to-cad/sdf" "hw sdf"
assert_bind hardware-engineer "text-to-cad/urdf" "hw urdf"
assert_bind hardware-engineer "text-to-cad/bambu-labs" "hw bambu"
assert_bind hardware-engineer "text-to-cad/sendcutsend" "hw sendcutsend"
assert_bind hardware-engineer "text-to-cad/srdf" "hw srdf"

# corporate marketing leftovers
assert_bind copy-chief "04-marketing/brand-voice-enforcement" "copy brand voice"
assert_bind brand-designer "04-marketing/canvas-design" "brand canvas"
assert_bind brand-designer "04-marketing/domain-name-brainstormer" "brand domain"
assert_bind brand-designer "04-marketing/guideline-generation" "brand guidelines gen"
assert_bind paid-media-manager "04-marketing/competitive-ads-extractor" "paid competitive ads"
assert_bind creative-director "04-marketing/canvas-design" "cd canvas"

# figma plugins
assert_bind web-designer "plugins/figma/figma-use" "web figma-use"
assert_bind web-designer "plugins/figma/figma-generate-design" "web figma-generate"
assert_bind web-designer "plugins/figma/figma-implement-motion" "web figma-motion"
assert_bind brand-designer "plugins/figma/figma-use" "brand figma-use"
assert_bind brand-designer "plugins/figma/figma-generate-design" "brand figma-generate"

# vercel + superpowers + context-engineering
assert_bind tech-lead "plugins/vercel/ai-sdk" "tl ai-sdk"
assert_bind tech-lead "plugins/vercel/auth" "tl auth"
assert_bind tech-lead "plugins/vercel/env-vars" "tl env-vars"
assert_bind tech-lead "plugins/superpowers/writing-plans" "tl writing-plans"
assert_bind tech-lead "plugins/superpowers/executing-plans" "tl executing-plans"
assert_bind tech-lead "context-engineering/skills/context-fundamentals" "tl context fundamentals"
assert_bind tech-lead "context-engineering/skills/tool-design" "tl tool-design"
assert_bind cto "context-engineering/skills/multi-agent-patterns" "cto multi-agent"
assert_bind cto "context-engineering/skills/context-fundamentals" "cto context fundamentals"
assert_bind cto "plugins/superpowers/writing-plans" "cto writing-plans"

# production-artifacts must classify deliverable types
assert_grep "$PACK" "Artifact class|artifact class" "pack defines artifact classes"
assert_grep "$PACK" "Layer A|Craft deliverable" "pack distinguishes craft deliverables"
assert_grep "$PACK" "Tooling" "pack notes tooling packs"

if [[ "$fail" -ne 0 ]]; then
  echo "validate-wave3-skill-bindings.test: FAILED" >&2
  exit 1
fi
echo "validate-wave3-skill-bindings.test: OK"
