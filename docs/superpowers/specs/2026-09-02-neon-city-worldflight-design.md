# Neon City Worldflight — Design

**Date:** 2026-09-02  
**Status:** Locked in conversation; waiting on operator review of this file  
**Branch:** `feat/neon-city-worldflight`  
**Deck:** SuperPatch Income Stack (same `slides.ts` copy and approved plates)

## Goal

Replace the default web front door with **one continuous neon-city camera flight**. Scroll is the camera. Approved plates appear in glass (windows, windshield, wet street). Live type from `slides.ts` sits on top. The remembered moment is the **four stacks locking into the skyline**. The 26-scene scroller and the simple plate deck stay available behind query params.

This is not a 1:1 slide conversion and not a live WebGL city.

## Locked choices

| Topic | Lock |
|-------|------|
| World | Neon night city, matched to the Era terrace plate (cyan / magenta / amber, wet ground, no invented product in the open) |
| Motion | Filmed camera path, encoded for scroll-scrub. Not a live 3D city. Not Remotion-as-the-world |
| Grammar | One unbroken world (Scroll Craft worldflight). No pinned slide stack, no cover-on-cover scenes |
| Copy | Existing `SLIDES` strings only. No new compensation numbers, no new claims |
| Plates | Existing approved PNGs in `public/concepts/clean/` (and locked conceptSrc paths). Do not AI-redraw plates |
| Peak | Four stacks lock into the skyline. Longest beat on the page |
| Signature | Plates live in the glass. Focus (pointer or the active stop) sharpens the plate you are on |
| Tell-a-friend | It is the site where SuperPatch's own pictures live in the neon city's glass, and the income stack locks into the skyline |

Interview answers came from the operator in this thread (not inferred). Vibe: neon city. Journey: continuous flight. Peak: skyline lock. Build: filmed. Signature: plates in glass.

## Out of scope

- Rewriting PPTX or Remotion as the city
- Generating fake plates or baking headlines into the city film
- Live Three.js city, orbit controls, or a new 3D patch hero as the world
- Invented income figures, guaranteed earnings, or dropping disclosure on money stops
- Scene counters, "Scroll to explore" cues, or a 26-item jumper on this page
- Editing `engine/scrollcraft.js` or `engine/scrollcraft.css`

## Story (feeling curve)

Quiet at the terrace. Human on the street. Pressure in the windows. **Peak at the skyline.** Range through districts. Hold at the ask.

Adjacent beats must not feel the same. The act before the peak is quieter than the peak. The last screen resolves and holds; it does not fade to an empty footer.

| Beat | Feeling | Cause on screen | Copy / plates (slide ids) |
|------|---------|-----------------|---------------------------|
| Open | Quiet awe | Empty terrace, darker left | `00-era` |
| Claim | This is bigger than a program | Title in the glass | `01-title` |
| Quiet | Still | Horizon overlook | `00b-mission` |
| Human | Trust | Wet street, Jay plate in glass | `00c-ceo` |
| Pressure | Unease | Four economies in windows | `02-world` |
| Approach | Rise | Camera lifts toward a stacked skyline | `03-four-stacks`, `03b-name-stacks` (short; not a second peak) |
| **Peak** | **The stacks became the city** | **Four stacks lock into the skyline** | Visual lock of `04-flywheel`, `05-product`, `06-brand`, `07-development`. Not a spoken list |
| Range | Possibility | District flight; stream plates in storefronts | `08-ten-layers` plus the ten money/stream slides through `14-global` |
| Bridge | Lift | Short overlay on the way to Join | `17-compounding`, `18-different`, `19-future` as one short bridge, not three equal legs |
| Resolve | Done | City holds; one ask | `15-closing` |

**Off the glass unless a locked plate is already the hero of that stop:** speaker `body` that is not `onScreenBody`, `presenterNotes`, `05b-science`, `05c-market`. Those remain on `?view=experience` and PPTX.

**Peak sentence a visitor would say:** "The stacks became the city."

## Page rules

- One city for the whole page. Scroll scrubs one film timeline. No slide seams, no pin/unpin blocks.
- No `01 / 26` (or any scene counter) on this surface. `formatSceneCounter` stays on the 26-scene experience only.
- No "Scroll to explore" / "Swipe to explore" cue.
- Type is live DOM (`h1`, `p`, links). Plates are live `img`. City film has **empty dark glass** and **no readable signage**.
- Money stops that already set `requiresDisclosure` show the same `INCOME_DISCLOSURE` string as those slides.
- Close labels stay `ctaPrimary` / `ctaSecondary` from `15-closing`. Affiliate and disclosure buttons render only when both production URLs are valid HTTPS (same rule as today's experience).
- `prefers-reduced-motion: reduce`: still posters + copy; no scrub. Signature focus still works as a static sharp plate, not a motion trick.
- Total scroll length about 9–12 viewport-heights. Peak is the longest beat by a visible margin (about 2× the next-longest).
- At most two city-film scrub weights that feel like "video hero"; the rest of the flight is still one world, not a second unrelated clip style.

## Map stops (jumping)

Five stops, labeled like a map, not a deck:

| Stop | Lands on |
|------|----------|
| Era | Open (`00-era`) |
| Opportunity | Claim through Human (`01-title` … `00c-ceo`) |
| Skyline | Approach + peak |
| Streams | Range + bridge |
| Join | Resolve |

The 26-scene scroller is **not** this map.

## Routes

Keep today's meanings of `legacy` and `hero3d`. Add an explicit experience URL. Default becomes the city.

| URL | Surface |
|-----|---------|
| `/` (no `view`) | Neon-city worldflight (new default) |
| `?view=experience` | Current 26-scene `ExperienceShell` |
| `?view=legacy` or `?view=static` | Current `DeckShell` |
| `?view=hero3d` | Current 3D patch preview |

Update `App` view selection and `App.test.tsx` so the default query no longer expects `[data-experience-shell]`.

## Architecture

- App: SuperPatch income-stack Vite app on this branch.
- Engine: copy Scroll Craft `scrollcraft.js` / `scrollcraft.css` into the world folder. Theme only: six color tokens and two fonts from SuperPatch. Do not edit the engine.
- Markup: real HTML for the flight (`data-sc-mode="worldflight"`), not a React tree that builds the page from a config object.
- Copy SSOT: `src/data/slides.ts`. A small map module lists beat → slide id(s) → copy window. Tests fail if on-page headline / chip / CTA / disclosure text does not equal `SLIDES`.
- Plates SSOT: each glass `img` `src` equals that slide's `conceptSrc`. Missing file: skip that glass; do not generate a substitute plate.
- City film: generated or graded camera-path clips + posters only, styled to the Era plate. Existing Omni/hero loops are not the world (optional reflection texture at most, never the flight).
- Encode clips for scrubbing (dense GOP), muted, with a mobile encode. Poster stays until a real frame paints (iPhone blank-seek).
- Signature: page-local behavior driven off scroll progress and pointer position. Sharpen / lift the active plate in glass. Not a stock spotlight or magnet. Not a lamp-in-the-dark (that move is taken elsewhere).
- Failures: missing clip → hold poster. Missing production URLs → hide Join buttons. Reduced motion → stills.

## Asset rules

- Style preamble for any generated city still/clip is written once from the locked Era look: neon night terrace/city, cyan/magenta/amber, wet reflections, empty product-free glass, no people in the open, no readable signs, no Freedom patch/seal on the open.
- Look at every generated frame before use. Reroll rather than ship a clay, cartoon, or product-filled city.
- Do not composite baked type into generated frames.

## Verification

- Contract tests: copy map vs `slides.ts`; disclosure on money stops; no scene counter / scroll-nudge on the city page; route table above.
- Existing experience, legacy, and hero3d tests still pass.
- Scroll Craft shoot (or equivalent): desktop, phone-width, reduced motion. Contact sheet proves the clip advances and the peak occupies the most scroll. Read the sheet for composition, not only harness green.
- Feel check: one word per beat vs the curve above. If they disagree, change the page.
- Say what was not verified: a real iPhone (decoder, Low Power Mode, touch).

## Acceptance

- [ ] `/` is the neon-city flight; `?view=experience` is the 26-scene scroller
- [ ] Wheel scrubs one city; no slide cover seams
- [ ] Era → Jay → skyline lock → streams → Join is completable without a counter
- [ ] Peak is clearly the longest beat; four stacks lock into the skyline
- [ ] Plates in glass are the approved PNGs; headlines are live from `slides.ts`
- [ ] Money glass shows the existing disclosure; Join uses existing CTA labels and URL rules
- [ ] Reduced motion holds stills and remains readable
- [ ] `legacy` and `hero3d` unchanged in meaning

## Fingerprint (for the city page)

When this ships, log one row: grammar = continuous world / worldflight; nav = five map stops, no wordmark+CTA bar; hero = filmed terrace with live Era headline (not a kinetic filmic scrub template); act shape = one flight, ~9–12vh, peak ~2×; close = city holds with Join + disclosure in the stage; signature = plates in glass. Must differ from prior Scroll Craft lab rows on at least four of those six dimensions (this repo's registry starts empty).
