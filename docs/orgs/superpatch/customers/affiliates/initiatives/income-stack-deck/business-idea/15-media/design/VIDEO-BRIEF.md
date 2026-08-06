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
| Accents | blue `#2F6BFF`, green `#22D36B`, orange `#FF7A1A`, violet `#8B5CFF`, SP red `#DD0604` |
| Type | Montserrat Black / ExtraBold |
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

## Acceptance

- [x] Design brief written before render claims
- [x] HyperFrames `index.html` composition present with 15 clips
- [x] Plates de-texted; OCR re-scan of `public/concepts/clean/` returns zero text detections
- [x] `npx hyperframes lint` green — 0 errors, 3 advisory warnings (file size, track density, Google Fonts)
- [ ] OpenMontage finals **or** honest skip documented
- [ ] Web app can point `heroVideoSrc` at exported loops
