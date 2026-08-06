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
cd ..                     # the CLI takes the project dir
npx hyperframes check income-stack-deck    # lint + motion + WCAG contrast
npx hyperframes preview income-stack-deck  # Studio
npx hyperframes render income-stack-deck --quality high \
  --output ../openmontage/income-stack-deck-final.mp4
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

Positions and sizes come from the original burned-in type — see
`apps/superpatch-income-stack/scripts/plate-text.json`.

Two rules keep the two type layers apart in the 16:9 film, where the copy block covers far
more of the plate than it does in the web app's two-column layout:

- **Annotations sit above the scrim** so they stay bright artwork. Under the scrim they read
  as leftover baked type, which is the exact impression the de-texting was meant to remove.
- **The copy block picks a free corner.** The generator measures each slide's annotation box
  and anchors the copy bottom-left / bottom-right / top-left / top-right — the first corner
  that clears it, flipping the scrim gradient when the copy goes up top. Slide 03 takes
  top-left, slide 09 bottom-right. When no corner is free (slides 04 and 07) the annotations
  are dropped from the film; the headline and body already state those figures.

Montserrat is wider than the condensed face the plates were originally set in, so a metric
reproduced at its original cap height can overrun the plate edge. `fittedSizePct()` in
`slides.ts` shrinks any such string to fit, and both surfaces call it so the web deck and the
film stay identical.

## Relationship to Vite app

| Surface | Job |
|---------|-----|
| `apps/superpatch-income-stack` | Fluid responsive web scroll for affiliates |
| This HyperFrames project | Keynote-grade timed deck + MP4 render path |
| OpenMontage | Pipeline for cinematic finals / I2V hero loops |
