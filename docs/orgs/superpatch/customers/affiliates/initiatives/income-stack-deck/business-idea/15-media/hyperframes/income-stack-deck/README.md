# HyperFrames — Income Stack Deck

Seekable 1920×1080 composition with 15 clips (5s each = **75s**).

## Files

| Path | Role |
|------|------|
| `index.html` | Standalone HyperFrames composition |
| `assets/*.png` | HQ concept plates |
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
# from repo root — re-run the generator script in git history / agent session
# Source of truth: apps/superpatch-income-stack/src/data/slides.ts
```

## Relationship to Vite app

| Surface | Job |
|---------|-----|
| `apps/superpatch-income-stack` | Fluid responsive web scroll for affiliates |
| This HyperFrames project | Keynote-grade timed deck + MP4 render path |
| OpenMontage | Pipeline for cinematic finals / I2V hero loops |
