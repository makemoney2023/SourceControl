# City plates-in-flight shoot baseline — 2026-09-02

## Build and URL

- Built with `npm run build:e2e`.
- Served `dist` over HTTP at `http://localhost:4500/?view=city` via scroll-craft `serve.mjs`.
- Omni media pack from commit `e4d81af` (18-leg chain; glass overlay removed — plates live in-world on facades and skyboards).
- Three scroll-craft shoots: desktop (1440×900), mobile (390×844), reduced motion. Contact sheets in `lab/shots-plates-in-flight/`, `lab/mobile-plates-in-flight/`, `lab/reduced-plates-in-flight/`.

## Shoot results

- Desktop: no dead scroll; all **18** legs reached full opacity and painted real Omni frames.
- Mobile, 390×844: no dead scroll; all 18 legs reached full opacity and painted real frames.
- Reduced motion: dead-scroll detection skipped (posters hold by design); all 18 poster legs reached full opacity.

Both motion passes print `FROZEN CLIP` for stacked worldflight videos. Manual review and per-leg opacity in the harness show all 18 active legs advancing and painting real frames. The frozen detector measures each full-viewport segment container as visible even while that segment is at zero opacity, so it reports inactive past and future clips. This is a harness concern, not a green assertion, same as the placeholder baseline.

`npm run verify:city-assets`: all 18 legs verified before shoot.

## Contact-sheet review

- No visually dead scroll. Every active leg advances through the ~20.4 viewport-height track.
- **Logo open:** leg 01 (Era terrace) grounds the SuperPatch wordmark in the first seconds; reads as a live neon reveal, not a glass card.
- **VTT pair:** legs 09→10 (product kiosk → science facade) share continuous forward camera geography; consecutive VTT beat with no reset.
- **Peak:** leg 08 (`leg-08-skyline-lock`, 2× weight via 10s clip) has the most scroll room; luminous stack reads as the visual climax after a quieter approach.
- **Streams:** leg 13 (`leg-13-ten-layers`, Streams waypoint) opens the ten-stream index block; disclosure and experience link stay in the copy layer.
- **Join:** leg 18 (`leg-18-hold`, Join waypoint) holds the city; closing copy, CTA placeholders, and disclosure remain in stage instead of fading away.
- Approved slide plates appear **inside the neon city film** on facades, skyboards, and marquees — not as floating glass cards. Sparse package accents (Freedom, REM, Focus, Boost) sit on ledges and railings per the omni baseline checklist.
- Harness contrast sampling flags many copy blocks below 4.5:1 on bright Omni frames (band scrim only where copy sits). Follow-up contrast pass may be needed; not blocking this fingerprint land.

## Feel check

| Beat | Intended | Felt (desktop contact sheet) |
|---|---|---|
| Era / logo open | quiet awe | awe |
| Opportunity | bigger | scale |
| Mission / overlook | still | stillness |
| Street / trust beats | trust | trust |
| Ascent | rise | ascent |
| Skyline peak | climax | climax |
| Product → science VTT | lift | lift |
| Streams index | possibility | possibility |
| Districts / bridge | momentum | momentum |
| Join hold | resolve | resolve |

Omni camera legs feel more organic than the placeholder zoompans. Full on-device feel (touch, decoder, Low Power Mode) remains deferred.

## Limits

This baseline is **not verified on a real iPhone**. It does not cover the iPhone decoder, autoplay policy, Low Power Mode, or touch scrolling.

Default route unchanged (`?view=city` only when explicitly requested; Task 8 gates the flip).
