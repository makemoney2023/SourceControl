# City placeholder-flight baseline — 2026-09-02

## Build and URL

- Built with `npm run build:e2e`.
- Served `dist` over HTTP at `http://localhost:4500/?view=city`.
- `shoot.mjs --help` is not implemented; the command attempted its default URL
  and returned `ERR_CONNECTION_REFUSED` before the server was started. The three
  documented shoot forms were then run with installed Chrome.

## Shoot results

- Desktop: no dead scroll; all 10 legs reached full opacity and painted real
  frames; every cue cleared 4.5:1 after the contrast fix.
- Mobile, 390×844: no dead scroll; all 10 legs reached full opacity and painted
  real frames; every cue cleared 4.5:1 after the close treatment was fixed.
- Reduced motion: dead-scroll detection was correctly skipped because posters
  hold by design; all 10 poster legs reached full opacity; every cue cleared
  4.5:1.

Both motion passes print `FROZEN CLIP` for the stacked worldflight videos and
aborted Blob URLs. Manual review and the harness's worldflight result show all
10 active legs advancing and painting real frames. The frozen detector measures
each full-viewport segment container as visible even while that segment is at
zero opacity, so it reports inactive past and future clips. This is a harness
concern, not a green assertion, and remains recorded.

## Contact-sheet review

- No visually dead scroll was found. Every active leg advances.
- The ffmpeg zoompans are mechanically smooth but less organic than final Omni
  legs; repeated push-in movement is the main placeholder limitation.
- Leg 7 is weighted 2× and has the most scroll room. Its luminous stack is the
  largest visual change and reads as the peak after a quieter approach.
- The final city view holds. Join actions and the disclosure remain in the
  stage instead of fading away.
- Approved glass plates appear at varied lead/trail positions beside their copy.
  They remain readable on desktop and compact, but present, on mobile.

## Feel check

| Beat | Intended | Felt |
|---|---|---|
| 1 | quiet awe | awe |
| 2 | bigger | scale |
| 3 | still | stillness |
| 4 | trust | trust |
| 5 | unease | tension |
| 6 | rise | ascent |
| 7 | peak | climax |
| 8 | possibility | possibility |
| 9 | lift | lift |
| 10 | done | resolve |

The curve agrees in meaning. The rise and peak feel more mechanical than the
target because these are placeholder zoompans, not final Omni camera legs.

## Fixes made during verification

- Replaced the insufficient single bottom band with a localized center-and-bottom
  contrast scrim that remains outside copy blocks for honest composite grading.
- Added a held, translucent close plate so Join and its disclosure remain
  readable on the bright mobile finale.
- Added regression checks for both contrast structures.

## Limits

This baseline is **not verified on a real iPhone**. It does not cover the iPhone
decoder, autoplay policy, Low Power Mode, or touch scrolling.

The fingerprint registry was an empty seed. No `descent` or `orrery` rows
existed, so there was no prior row against which to perform the 4-of-6
difference count.
