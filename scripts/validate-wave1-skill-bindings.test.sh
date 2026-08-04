#!/usr/bin/env bash
# TDD gate: wave-1 skill→role bindings (inference-sh craft + BA core).
# Run: bash scripts/validate-wave1-skill-bindings.test.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
POS="$ROOT/skills/org/positions"
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

# --- Packs must exist ---
for rel in \
  skills/community/inference-sh/landing-page-design \
  skills/community/inference-sh/logo-design-guide \
  skills/community/inference-sh/og-image-design \
  skills/community/inference-sh/product-photography \
  skills/community/inference-sh/ai-product-photography \
  skills/community/inference-sh/pitch-deck-visuals \
  skills/community/inference-sh/youtube-thumbnail-design \
  skills/community/inference-sh/app-store-screenshots \
  skills/community/inference-sh/newsletter-curation \
  skills/community/inference-sh/social-media-carousel \
  skills/community/inference-sh/ai-social-media-content \
  skills/community/inference-sh/google-veo \
  skills/community/inference-sh/ai-video-generation \
  skills/community/inference-sh/ai-marketing-videos \
  skills/community/inference-sh/explainer-video-guide \
  skills/community/inference-sh/storyboard-creation \
  skills/community/inference-sh/talking-head-production \
  skills/community/inference-sh/video-ad-specs \
  skills/community/inference-sh/video-prompting-guide \
  skills/community/inference-sh/seo-content-brief \
  skills/community/inference-sh/press-release-writing \
  skills/community/inference-sh/case-study-writing \
  skills/community/inference-sh/content-repurposing \
  skills/community/inference-sh/competitor-teardown \
  skills/community/inference-sh/customer-persona \
  skills/community/inference-sh/product-hunt-launch \
  skills/community/business-analysis-skills/skills/assumption-extractor \
  skills/community/business-analysis-skills/skills/assumptions-constraints-log \
  skills/community/business-analysis-skills/skills/problem-statement-refiner \
  skills/community/business-analysis-skills/skills/use-case-specification \
  skills/community/business-analysis-skills/skills/definition-of-done-drafter \
  skills/community/business-analysis-skills/skills/raci-matrix \
  skills/community/business-analysis-skills/skills/ambiguity-hunter \
  skills/community/business-analysis-skills/skills/requirements-gap-auditor \
  skills/community/business-analysis-skills/skills/moscow-prioritisation \
  skills/community/business-analysis-skills/skills/stakeholder-analysis
do
  assert_pack_exists "$rel"
done

# --- brand-designer ---
assert_bind brand-designer "inference-sh/logo-design-guide" "brand logo guide"
assert_bind brand-designer "inference-sh/og-image-design" "brand OG images"
assert_bind brand-designer "inference-sh/product-photography" "brand product photo"
assert_bind brand-designer "inference-sh/ai-product-photography" "brand AI product photo"
assert_bind brand-designer "inference-sh/pitch-deck-visuals" "brand pitch visuals"
assert_bind brand-designer "inference-sh/youtube-thumbnail-design" "brand thumbnails"
assert_bind brand-designer "inference-sh/app-store-screenshots" "brand ASO stills"
assert_bind brand-designer "inference-sh/character-design-sheet" "brand character sheets"
assert_bind brand-designer "inference-sh/book-cover-design" "brand book covers"

# --- web-designer ---
assert_bind web-designer "inference-sh/landing-page-design" "web LP design"

# --- video-producer ---
assert_bind video-producer "inference-sh/google-veo" "video Veo"
assert_bind video-producer "inference-sh/ai-video-generation" "video AI gen"
assert_bind video-producer "inference-sh/ai-marketing-videos" "video marketing"
assert_bind video-producer "inference-sh/image-to-video" "video I2V"
assert_bind video-producer "inference-sh/explainer-video-guide" "video explainer"
assert_bind video-producer "inference-sh/storyboard-creation" "video storyboard"
assert_bind video-producer "inference-sh/talking-head-production" "video talking head"
assert_bind video-producer "inference-sh/video-ad-specs" "video ad specs"
assert_bind video-producer "inference-sh/video-prompting-guide" "video prompting"
assert_bind video-producer "inference-sh/seedance" "video seedance"
assert_bind video-producer "inference-sh/remotion-render" "video remotion-render"
assert_bind video-producer "inference-sh/ai-avatar-video" "video avatar"

# --- paid-media-manager ---
assert_bind paid-media-manager "inference-sh/video-ad-specs" "paid video specs"
assert_bind paid-media-manager "inference-sh/ai-marketing-videos" "paid marketing video"
assert_bind paid-media-manager "inference-sh/ai-product-photography" "paid product stills"

# --- lifecycle-marketer ---
assert_bind lifecycle-marketer "inference-sh/newsletter-curation" "lifecycle newsletter"
assert_bind lifecycle-marketer "inference-sh/social-media-carousel" "lifecycle carousel"
assert_bind lifecycle-marketer "inference-sh/ai-social-media-content" "lifecycle social AI"

# --- content-strategist ---
assert_bind content-strategist "inference-sh/case-study-writing" "content case study"
assert_bind content-strategist "inference-sh/content-repurposing" "content repurpose"
assert_bind content-strategist "inference-sh/linkedin-content" "content linkedin"
assert_bind content-strategist "inference-sh/twitter-thread-creation" "content twitter"
assert_bind content-strategist "inference-sh/ai-content-pipeline" "content pipeline"
assert_bind content-strategist "inference-sh/technical-blog-writing" "content tech blog"
assert_bind content-strategist "inference-sh/product-hunt-launch" "content PH launch"

# --- seo-manager ---
assert_bind seo-manager "inference-sh/seo-content-brief" "seo content brief"

# --- pr-manager ---
assert_bind pr-manager "inference-sh/press-release-writing" "pr press release"

# --- product-marketing-manager ---
assert_bind product-marketing-manager "inference-sh/competitor-teardown" "pmm competitor teardown"
assert_bind product-marketing-manager "inference-sh/customer-persona" "pmm persona"
assert_bind product-marketing-manager "inference-sh/app-store-screenshots" "pmm ASO"

# --- business-analyst (core) ---
assert_bind business-analyst "assumption-extractor" "ba assumptions extract"
assert_bind business-analyst "assumptions-constraints-log" "ba assumptions log"
assert_bind business-analyst "problem-statement-refiner" "ba problem refine"
assert_bind business-analyst "use-case-specification" "ba use cases"
assert_bind business-analyst "definition-of-done-drafter" "ba DoD"
assert_bind business-analyst "raci-matrix" "ba RACI"
assert_bind business-analyst "ambiguity-hunter" "ba ambiguity"
assert_bind business-analyst "requirements-gap-auditor" "ba gap audit"
assert_bind business-analyst "moscow-prioritisation" "ba MoSCoW"
assert_bind business-analyst "stakeholder-analysis" "ba stakeholders"
assert_bind business-analyst "requirements-traceability-starter" "ba traceability"
assert_bind business-analyst "functional-vs-nonfunctional-splitter" "ba F/NFR"
assert_bind business-analyst "edge-case-elicitor" "ba edge cases"
assert_bind business-analyst "business-rule-extractor" "ba business rules"
assert_bind business-analyst "requirements-conflict-checker" "ba conflicts"
assert_bind business-analyst "requirements-prioritizer" "ba prioritize"

# --- ceo-strategist ---
assert_bind ceo-strategist "assumption-extractor" "ceo assumptions"
assert_bind ceo-strategist "problem-statement-refiner" "ceo problem refine"
assert_bind ceo-strategist "assumptions-constraints-log" "ceo assumptions log"

if [[ "$fail" -ne 0 ]]; then
  echo "validate-wave1-skill-bindings.test: FAILED" >&2
  exit 1
fi
echo "validate-wave1-skill-bindings.test: OK"
