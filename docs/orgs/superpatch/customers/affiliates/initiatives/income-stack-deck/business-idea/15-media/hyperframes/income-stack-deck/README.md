# HyperFrames — Income Stack Deck

Seekable 1920×1080 composition with 15 clips (5s each = **75s**).

## Files

| Path | Role |
|------|------|
| `index.html` | Standalone HyperFrames composition |
| `assets/*.png` | HQ concept plates, **text-free** (copied from `public/concepts/clean/`) |
| `#slideshow-deck` JSON island | Deck metadata for navigable / presenter mode |
| `window.__timelines["income-stack-main"]` | Paused GSAP timeline |

## Dev loop

Requires Node ≥ 22 + FFmpeg (`hyperframes-cli` skill).

```bash
cd docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/15-media/hyperframes/income-stack-deck
npx hyperframes lint
npx hyperframes validate
npx hyperframes preview   # Studio — review before render
# Only after operator approve:
npx hyperframes render --quality high --output ../../openmontage/income-stack-deck-final.mp4
```

Regenerate HTML from slide SSOT:

```bash
cd apps/superpatch-income-stack
node scripts/generate-hyperframes.mjs   # rewrites index.html + re-copies clean plates
```

Source of truth: `apps/superpatch-income-stack/src/data/slides.ts`.

## Type layers

No type is baked into the plates. All copy is live:

| Layer | Content |
|-------|---------|
| `.copy` block | eyebrow, headline, body, disclosure |
| `.annotations` | diagram labels and display metrics recovered from the original plates (`PRODUCT/BRAND/INCOME/PEOPLE`, `15/10/4%`, `25%`, `$2,000`, `2%`) |

Annotations render between plate and scrim, so they read as part of the artwork and never
collide with the copy block. Positions and sizes come from the original burned-in type —
see `apps/superpatch-income-stack/scripts/plate-text.json`.

## Relationship to Vite app

| Surface | Job |
|---------|-----|
| `apps/superpatch-income-stack` | Fluid responsive web scroll for affiliates |
| This HyperFrames project | Keynote-grade timed deck + MP4 render path |
| OpenMontage | Pipeline for cinematic finals / I2V hero loops |
