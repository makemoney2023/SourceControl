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
- OpenMontage production folder + animation pipeline choice documented; finals not rendered yet
- Design brief written before any paid render
- Plates had type baked into the pixels, duplicating the live copy. All 50 text regions across the
  15 plates were detected (macOS Vision OCR) and painted out locally at no generation cost; a
  re-scan of the cleaned set returns zero detections. The recovered strings — pillar labels, tier
  percentages, `25%`, `$2,000`, `2%` — now render as an animated annotation layer in both the web
  app and the HyperFrames composition, positioned and sized from the original type.

## Next steps

1. ~~`npx hyperframes lint`~~ green (0 errors, 3 advisory warnings); run `validate|preview` next
2. Operator approve → `hyperframes render` into `15-media/openmontage/`
3. Optional: OpenMontage `animation` / `cinematic` pipeline for I2V hero loops (needs `budget_usd`)
4. Wire loops into `apps/superpatch-income-stack` `heroVideoSrc`

## Production fields

```yaml
production_status: in_progress
production_paths:
  - docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/15-media/hyperframes/income-stack-deck/index.html
  - docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/15-media/openmontage/
design_brief_path: docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/15-media/design/VIDEO-BRIEF.md
wire_owner: web-designer
budget_usd: 0
pipeline: animation.yaml
notes: >-
  Plates de-texted locally (0 spend, OCR-verified); type recovered as live annotation layer.
  Finals pending CLI preview + operator render approve; no paid I2V without budget.
```

## Asks

- Approve HyperFrames Studio preview before first render
- Confirm budget if hero I2V loops are required
