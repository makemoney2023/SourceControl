# Video design brief — Super Patch Income Stack™

**Initiative:** `superpatch` / `affiliates` / `income-stack-deck`  
**Date:** 2026-08-06  
**Seats:** creative-director (accountable) · video-producer (responsible)  
**Web companion:** `apps/superpatch-income-stack/`

## Role

Two complementary motion products:

1. **HyperFrames navigable deck** — 1920×1080 composition with 15 timed slides, live copy, HQ concept plates (`object-fit: contain`), GSAP seekable timeline + slideshow JSON island.
2. **OpenMontage finals** — optional cinematic MP4 / muted hero loops for share + embedding into the Vite app via `heroVideoSrc`.

## Visual system

| Token | Value |
|-------|--------|
| Background | `#05070F` |
| Accents | Keep the deck accent set: blue `#2F6BFF`, green `#22D36B`, orange `#FF7A1A`, violet `#8B5CFF`, SP red `#DD0604` (not the product-patch rainbow) |
| Type | Brand HTML rules: Montserrat. Headlines Black/900, always uppercase, 100% leading, −1.6% tracking. Sub-headlines bold/700 sentence case at 150%. Body medium/500 at 150%, one grey step lighter than the headline |
| Imagery | v1 concept PNGs, **de-texted** — do not invent new compensation art |
| Motif | Full Stack Flywheel (live SVG in web app; optional HF overlay later) |

## Type policy

Plates carry **zero baked type**. The v1 concepts shipped with headlines and diagram labels
burned into the pixels; those were painted out (`apps/superpatch-income-stack/scripts/`) and the
strings re-declared as live layers:

| Layer | Content | Source |
|-------|---------|--------|
| Copy block | eyebrow, headline, body, disclosure | `slides.ts` |
| Annotations | pillar labels, tier percentages, display metrics | `slides.ts` `annotations[]`, positioned from the original type |

Consequence for render: every figure on screen is text the compliance read can verify in source,
and re-typesetting a number never requires regenerating art.

The 16:9 film gives the copy block much more of the frame than the web app's two-column layout,
so the two type layers have to be kept apart deliberately: annotations render above the scrim,
and the copy block is anchored to whichever corner clears them. Where no corner is free
(slides 04 and 07) the film drops the plate annotations rather than stack type on type.

## Shot list (15)

| # | Beat | Source plate | Motion intent | Duration |
|---|------|--------------|---------------|----------|
| 01 | Title monolith | `sp-stack-01-title.png` | Slow push + copy rise | 5s |
| 02 | Struggle | `sp-stack-02-the-question.png` | Ken Burns + lamp feel | 5s |
| 03 | Four stacks | `sp-stack-03-four-stacks.png` | Scale settle | 5s |
| 04 | Flywheel | `sp-stack-04-flywheel.png` | Scale in | 5s |
| 05 | Ecosystem | `sp-stack-05-ecosystem.png` | Brightness settle | 5s |
| 06 | Ten layers | `sp-stack-06-ten-layers.png` | Explode settle | 5s |
| 07–14 | Income stacks 1–10 | matching `sp-stack-07`…`14` | Per-stack entrance | 5s each |
| 15 | Close | `sp-stack-15-closing.png` | Horizon settle | 5s |

**Total HyperFrames duration:** 75s @ 1920×1080.

## Audio plan

| Cut | Audio |
|-----|--------|
| HyperFrames deck / Studio preview | Silent or light bed (optional later) |
| OpenMontage share MP4 | Optional bed + no VO in v1 (affiliate-led narration) |
| Hero loops for web | **Muted** seamless loops |

## Pipelines

| Product | Path | Pipeline / runtime |
|---------|------|--------------------|
| HyperFrames deck | `15-media/hyperframes/income-stack-deck/` | HyperFrames GSAP composition (`hyperframes-core`) |
| OpenMontage share + loops | `15-media/openmontage/` | `pipeline_defs/animation.yaml` (motion-first) or `cinematic.yaml` for hero I2V |

## Non-goals

- Changing compensation numbers
- Baking final type into new plates (live type in HF + web)
- Auto-spend on Veo/fal without `budget_usd` and operator approve

## Hero / I2V delivery (mandatory)

New animated backgrounds for Remotion / web must ship native HD — do not upscale 720p for new assets.

- Resolution: 1920×1080 (16:9) and 1080×1920 (9:16) when available
- Frame rate: 30 fps, dense keyframes for Remotion seek
- Labels: either baked (set `annotationsBaked: true`) OR text-free (`false` + live annotations)
- First frame must match still plate grade/framing for handoff
- No 720p upscale for new assets

### Operator re-export (existing 720p debt)

Slides `01-title` and `03-four-stacks` currently ship 1280×720 loops under
`apps/superpatch-income-stack/public/concepts/animated/`. They remain on an
explicit allowlist in `LEGACY_720P_HERO_IDS` until native 1080p files land.

```bash
# Example (operator machine) — re-encode / re-export each hero at native 1080p
ffmpeg -i sp-stack-01-title_animated.mp4 -vf scale=1920:1080:flags=lanczos \
  -c:v libx264 -pix_fmt yuv420p -r 30 -g 15 \
  sp-stack-01-title_animated_1080.mp4
```

Prefer a true 1080p I2V re-export over Lanczos upscale when the pipeline allows.
After files land:

1. Replace (or add) the asset under `public/concepts/animated/`
2. Update `hero.src`, `hero.width` (1920), `hero.height` (1080) in `slides.ts`
3. Remove the slide id from `LEGACY_720P_HERO_IDS` — tests then require 1080p for all heroes

## Remotion Studio seek QA

After `npm run remotion` in `apps/superpatch-income-stack`, open `IncomeStackFilm`
(1920×1080 / 30 fps / 2298 frames). Absolute clip starts (18f fade overlap):

| Slide | Frame | Check |
|-------|------:|-------|
| 03 four-stacks | 414 | Hero loop; live annotations off when baked |
| 04 flywheel | 696 | Flywheel overlay visible; plate entrance distinct |
| 07 retail | 1092 | Disclosure; no unqualified “guaranteed” earnings |
| 09 team-overrides | 1356 | Annotations settle before dense copy |
| 15 closing | 2148 | EndCard CTAs + ≥16px disclosure |

MotionDirector: `src/remotion/motion/presets.ts` + `gating.ts`. Hero meta / CTA fields:
see app README “Remotion motion system”.

## Acceptance

- [x] Design brief written before render claims
- [x] HyperFrames `index.html` composition present with 15 clips
- [x] Plates de-texted; OCR re-scan of `public/concepts/clean/` returns zero text detections
- [x] `npx hyperframes check` green — 0 lint errors, 0 motion errors, 23/23 text checks pass WCAG AA
- [x] Deck MP4 rendered and frame-verified: 1920×1080 / 30fps / 75.0s, 0 spend
- [x] Hero / I2V delivery contract + 720p allowlist documented (Tasks 5–7)
- [x] Remotion Studio seek checklist (03 / 04 / 07 / 09 / 15) documented
- [ ] OpenMontage finals **or** honest skip documented
- [ ] Web app can point `heroVideoSrc` at exported loops
- [ ] Hero loops at native 1920×1080 (01 / 03 still 720p allowlisted debt)
