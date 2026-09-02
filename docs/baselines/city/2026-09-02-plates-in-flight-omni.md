# Gemini Omni city-flight baseline — plates in flight — 2026-09-02

## What landed

All 18 city legs were regenerated with Gemini Omni (`gemini-omni-flash-preview`) using Architecture A seam law: leg N+1 opens from leg N's encoded desktop last frame; leg 1 opens from the approved Era plate. Leg 01 also grounds the SuperPatch logo reference for the terrace wordmark reveal.

Each leg ships desktop (1920×1080, GOP 8), mobile (720×1280, GOP 4), and a poster from frame 0 of the encoded desktop file. Leg 08 (skyline peak) uses 8s Omni motion slowed to 10s via `setpts=1.25*PTS`.

**Generation cost:** ~$14.40 total (18 legs × $0.80; leg 04 failed once on a transient 400, then succeeded on retry).

## Verification

- `npm run verify:city-assets`: **all 18 legs verified**
- Seam frames written under `out/city-chain/*.png`
- Manifest: `out/city-chain/manifest.json`

## 26-plate checklist

Each approved slide plate appears once in-world across the expanded flight (`CITY_PLATE_MOMENTS`).

| Slide | Leg | Status | In-world note |
|-------|-----|--------|---------------|
| 00-era | leg-01-terrace | [x] | Era plate on terrace facade; logo reveal first seconds |
| 01-title | leg-02-title-glass | [x] | Title plate as neon storefront glass |
| 00b-mission | leg-03-overlook | [x] | Mission plate on horizon skyboard |
| 00c-ceo | leg-04-street | [x] | CEO plate on wet street-level facade |
| 02-world | leg-05-windows | [x] | World plate in tower window grid |
| 03-four-stacks | leg-06-ascent | [x] | Four stacks plate on ascent-facing billboard |
| 03b-name-stacks | leg-07-name-stacks | [x] | Name stacks plate on mid-rise facade |
| 04-flywheel | leg-08-skyline-lock | [x] | Flywheel plate locked in skyline peak |
| 05-product | leg-09-product | [x] | Product plate on wellness kiosk skyboard |
| 05b-science | leg-10-science | [x] | VTT science plate on lab facade |
| 05c-market | leg-11-market-brand | [x] | Market plate on district marquee |
| 06-brand | leg-11-market-brand | [x] | Brand plate on adjacent media tower |
| 07-development | leg-12-development | [x] | Development plate on training-center facade |
| 08-ten-layers | leg-13-ten-layers | [x] | Ten layers plate over income district |
| 07-retail | leg-14-districts-a | [x] | Retail stream plate on corner storefront |
| 08-fast-start | leg-14-districts-a | [x] | Fast Start plate on district LED board |
| 09-team-overrides | leg-14-districts-a | [x] | Team overrides plate on wet reflection |
| 10-md-depth | leg-15-districts-b | [x] | MD depth plate on mid-district facade |
| 11-vp-override | leg-15-districts-b | [x] | VP override plate on tower skyboard |
| 12-generations | leg-15-districts-b | [x] | Generations plate on bridge-facing wall |
| 13-executive | leg-16-districts-c | [x] | Executive plate on executive-tier signage |
| 14-global | leg-16-districts-c | [x] | Global pool plate on upper district skyboard |
| 17-compounding | leg-17-bridge | [x] | Compounding plate on bridge approach |
| 18-different | leg-17-bridge | [x] | Different plate on bridge mid-span |
| 19-future | leg-17-bridge | [x] | Future plate on bridge exit facade |
| 15-closing | leg-18-hold | [x] | Closing plate on resolve hold — city stays |

## Package accents (sparse)

| Accent | Leg | Status | Note |
|--------|-----|--------|------|
| freedom-30pk | leg-09-product | [x] | Freedom 30-pack beside the product-stack kiosk |
| freedom-peel | leg-10-science | [x] | Single Freedom patch accent near the VTT science facade |
| rem-patch | leg-11-market-brand | [x] | REM patch in a wellness storefront window |
| focus-patch | leg-14-districts-a | [x] | Focus patch on a district retail ledge |
| boost-patch | leg-17-bridge | [x] | Boost patch on the bridge railing |

## VTT pair (consecutive beat)

| Slide | Leg | Status | Note |
|-------|-----|--------|------|
| 05-product | leg-09-product | [x] | Product plate on wellness kiosk skyboard |
| 05b-science | leg-10-science | [x] | VTT science plate on lab facade — consecutive VTT beat; camera continues without reset |

Legs 09→10 share continuous forward camera geography per `BASE_LEG_MOVES` (product-to-science consecutive VTT beat).

## Dry-run (leg 01)

Leg 01 regenerated with logo reference + Era plate. Poster and encoded desktop confirm neon terrace push-in with SuperPatch wordmark grounding. Seam frame extracted to `out/city-chain/leg-01-terrace.png` for leg 02 chain start.

## Failures and retries

| Leg | Error | Resolution |
|-----|-------|------------|
| leg-04-street | Gemini Omni 400 `invalid_request` (transient, first pass) | Retried with `--force leg-04-street`; succeeded; legs 05–18 continued in same run |

## Limits

- Midpoint still review not yet run on every encoded desktop leg for this 18-leg expansion.
- Flight not verified on a real iPhone (decoder, autoplay, Low Power Mode, touch feel).
- Full Task 9 Scroll Craft reshoot on device remains deferred; this baseline confirms the Omni media pack and asset contract only.
