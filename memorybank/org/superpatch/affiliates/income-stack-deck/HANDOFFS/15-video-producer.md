# Handoff — video-producer (Income Stack)

**phase:** 15  
**seat:** video-producer  
**report_to:** creative-director  
**venture:** superpatch / affiliates / income-stack-deck  
**date:** 2026-08-06

## Operator brief (plain English)

We scaffolded OpenMontage + HyperFrames under this initiative so the Income Stack can be a real timed keynote deck and (when budgeted) a shareable MP4 / hero loops — without replacing the fluid Vite web app.

## What we found

- HyperFrames composition authored: 15 clips, 75s, HQ concept plates + live copy + slideshow JSON island
- **Deck MP4 rendered** at no spend: `15-media/openmontage/income-stack-deck-final.mp4`,
  1920×1080 / 30fps / 2250 frames / 75.0s / 76 MB, local Chrome + FFmpeg in ~30s
- `hyperframes check` green: 0 lint errors, 0 motion errors, 23/23 text checks pass WCAG AA
- Design brief written before any paid render
- Plates had type baked into the pixels, duplicating the live copy. All 50 text regions across the
  15 plates were detected (macOS Vision OCR) and painted out locally at no generation cost; a
  re-scan of the cleaned set returns zero detections. The recovered strings — pillar labels, tier
  percentages, `25%`, `$2,000`, `2%` — now render as an animated annotation layer in both the web
  app and the HyperFrames composition, positioned and sized from the original type.
- Verifying real frames out of the MP4 caught three issues the web app never showed, all
  fixed and re-rendered: annotations were dimmed under the scrim and hidden behind the film's
  bottom-left copy block (slides 03 and 09); `$2,000` ran off the right edge because
  Montserrat is wider than the plates' condensed face; and the closing slide's red eyebrow
  failed contrast at 1.53:1.

## Next steps

1. ~~`hyperframes check`~~ green; ~~render deck MP4~~ done and frame-verified
2. Operator review of `income-stack-deck-final.mp4` — the open call is whether slides 04 and
   07 should keep their plate metrics (needs a copy-block reposition) or stay as rendered
3. Optional: OpenMontage `animation` / `cinematic` pipeline for I2V hero loops (needs `budget_usd`)
4. Wire loops into `apps/superpatch-income-stack` `heroVideoSrc`

## Production fields

```yaml
production_status: in_progress
production_paths:
  - docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/15-media/hyperframes/income-stack-deck/index.html
  - docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/15-media/openmontage/
  - docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/15-media/openmontage/income-stack-deck-final.mp4
design_brief_path: docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/15-media/design/VIDEO-BRIEF.md
wire_owner: web-designer
budget_usd: 0
pipeline: animation.yaml
notes: >-
  Plates de-texted locally (0 spend, OCR-verified); type recovered as live annotation layer.
  Deck MP4 rendered locally at 0 spend and frame-verified; no paid I2V without budget.
```

## Asks

- Review `income-stack-deck-final.mp4`, and decide whether slides 04 and 07 keep their plate
  metrics (needs a copy-block reposition) or ship as rendered
- Confirm budget if hero I2V loops are required
