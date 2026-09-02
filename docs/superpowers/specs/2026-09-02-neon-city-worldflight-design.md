# Neon City Worldflight — Design

**Date:** 2026-09-02 (revised same day after end-to-end review)  
**Status:** Locked in conversation; waiting on operator review of this file  
**Branch:** `feat/neon-city-worldflight`  
**Deck:** SuperPatch Income Stack (same `slides.ts` copy and approved plates)

## Goal

Make **one continuous neon-city camera flight** the web front door. Scroll is the camera. Approved plates appear in glass (windows, windshield, wet street). Live type from `slides.ts` sits on top. The remembered moment is the **four stacks locking into the skyline**. The 26-scene scroller and the simple plate deck stay available behind query params.

This is not a 1:1 slide conversion and not a live WebGL city.

## Locked choices

| Topic | Lock |
|-------|------|
| World | Neon night city, matched to the Era terrace plate (cyan / magenta / amber, wet ground, no invented product in the open) |
| Motion | Filmed camera path, encoded for scroll-scrub. Not a live 3D city. Not Remotion-as-the-world |
| Grammar | One unbroken world (Scroll Craft worldflight). No pinned slide stack, no cover-on-cover scenes |
| Copy | Existing `SLIDES` strings only. No new compensation numbers, no new claims |
| Plates | Existing approved PNGs in `public/concepts/clean/` (verified present, 29 plates). Do not AI-redraw plates |
| Peak | Four stacks lock into the skyline. Longest beat on the page |
| Signature | Plates live in the glass. Focus (pointer, keyboard focus, or the active stop) sharpens the plate you are on |
| Tell-a-friend | It is the site where SuperPatch's own pictures live in the neon city's glass, and the income stack locks into the skyline |

Interview answers came from the operator in this thread (not inferred). Vibe: neon city. Journey: continuous flight. Peak: skyline lock. Build: filmed. Signature: plates in glass.

## Out of scope

- Rewriting PPTX or Remotion as the city (both keep reading `slides.ts` unchanged)
- Generating fake plates or baking headlines into the city film
- Live Three.js city, orbit controls, or a new 3D patch hero as the world
- Invented income figures, guaranteed earnings, or dropping disclosure on money stops
- Scene counters, "Scroll to explore" cues, or a 26-item jumper on this page
- Editing `engine/scrollcraft.js` or `engine/scrollcraft.css`

## Prerequisites (blockers found in review)

1. **`KIE_AI_API_KEY` is not set on this machine.** City-leg generation is blocked until the operator supplies it (check the Obsidian vault for keys first, per house rules). ffmpeg 7.1.1 (Homebrew, full build) and Node 24 are present.
2. Run the Scroll Craft preflight before generating: `node <skill>/scripts/doctor.mjs`, then `node <skill>/scripts/workspace.mjs --ensure`.
3. Budget note: roughly 8–10 stills + 8–10 short clips through kie.ai. Small spend (cents per still, more per clip), but it is real spend — operator confirms before the generation pass.

## Story (feeling curve)

Quiet at the terrace. Human on the street. Pressure in the windows. **Peak at the skyline.** Range through districts. Hold at the ask.

Adjacent beats must not feel the same. The act before the peak is quieter than the peak. The last screen resolves and holds; it does not fade to an empty footer.

| Beat | Feeling | Cause on screen | Copy / plates (slide ids) |
|------|---------|-----------------|---------------------------|
| Open | Quiet awe | Empty terrace, darker left | `00-era` (hero copy window: on from first pixel, gone by ~0.6 of leg 1) |
| Claim | This is bigger than a program | Title in the glass | `01-title` |
| Quiet | Still | Horizon overlook | `00b-mission` |
| Human | Trust | Wet street, Jay plate in glass | `00c-ceo` |
| Pressure | Unease | Four economies in windows | `02-world` |
| Approach | Rise | Camera lifts toward a stacked skyline | `03-four-stacks`, `03b-name-stacks` (short; not a second peak) |
| **Peak** | **The stacks became the city** | **Four stacks lock into the skyline** | Visual lock of `04-flywheel`, `05-product`, `06-brand`, `07-development`. Not a spoken list |
| Range | Possibility | District flight; stream index lights up; a few stream plates in storefronts | `08-ten-layers` + `INCOME_STREAMS` index (see Streams treatment) |
| Bridge | Lift | Short overlay on the way to Join | `17-compounding`, `18-different`, `19-future` as one short bridge, not three equal legs |
| Resolve | Done | City holds; one ask | `15-closing` |

**Off the glass unless a locked plate is already the hero of that stop:** speaker `body` that is not `onScreenBody`, `presenterNotes`, `05b-science`, `05c-market`. Those remain on `?view=experience` and PPTX.

**Peak sentence a visitor would say:** "The stacks became the city."

### Streams treatment (resolved in review)

Ten streams live on 8 slides plus the ten-layers index — 11 slides cannot fit one flight beat legibly. The repo already has the answer: `INCOME_STREAMS` in `src/data/streamIndex.ts` is the ten-stream SSOT.

- The Streams stop shows a **live ten-item index** built from `INCOME_STREAMS` `shortLabel`s that lights up as the district flight passes.
- **Three to four** stream plates appear in storefront glass (recommend `07-retail`, `09-team-overrides`, `12-generations`, `14-global-pool` — first, structural, generational, global). Not all ten.
- The **income disclosure stays pinned on screen for the entire Streams stop**, at readable size, not per-plate flashes.
- A quiet link — "See every stream in detail" — goes to `?view=experience`. That deck remains the full catalog; this page is the flight over it.

## Page rules

- One city for the whole page. Scroll scrubs one film timeline. No slide seams, no pin/unpin blocks.
- No `01 / 26` (or any scene counter) on this surface. `formatSceneCounter` stays on the 26-scene experience only.
- No "Scroll to explore" / "Swipe to explore" cue.
- Type is live DOM (`h1`, `p`, links). Plates are live `img`. City film has **empty dark glass** and **no readable signage**.
- Money stops that already set `requiresDisclosure` show the same `INCOME_DISCLOSURE` string as those slides (pinned through Streams, present at Join).
- Close labels stay `ctaPrimary` / `ctaSecondary` from `15-closing`. Affiliate and disclosure buttons render only when both production URLs are valid HTTPS (same rule as today's experience).
- `prefers-reduced-motion: reduce`: no clip is ever fetched; posters cross-dissolve through the same seams, same copy windows. Signature focus still works as a static sharp plate.
- Respect Save-Data / reduced-data the way the experience's `useDataSave` does: posters only, no clip fetch.
- Total scroll length about 9–12 viewport-heights. Peak is the longest beat by a visible margin (about 2× the next-longest).
- Copy overlay obeys the worldflight copy contract: plateau windows (not triangle fades), translateY capped at 4vh, scrims shaped to where copy sits, pointer events only above 0.5 opacity.

## Flight plan (pace law)

- Eight to ten legs. Every leg's `weight ÷ clip seconds` is held within a few percent of **~0.21–0.22vh per second of film** — one speed for the whole flight. The peak buys room with a longer clip (10s vs 5s legs), not a pace surge.
- **Seam law:** each leg's start image is a frame pulled from the previous leg's **encoded** mp4 (chain on start images; never force end frames). Posters are extracted from the encoded files too.
- Encode for scrubbing: GOP 8 desktop, GOP 4 mobile, muted. Every leg ships a `data-sc-src-mobile` portrait-friendly encode; the engine picks it on coarse pointers and narrow viewports.
- The engine lazy-fetches legs within ±1.6vh, so the page never loads the whole flight up front; arriving at a poster with its push-in is the designed fallback.

## Map stops (jumping)

Five stops, labeled like a map, not a deck:

| Stop | Lands on |
|------|----------|
| Era | Open (`00-era`) |
| Opportunity | Claim through Human (`01-title` … `00c-ceo`) |
| Skyline | Approach + peak |
| Streams | Range + bridge |
| Join | Resolve |

Built in the page off the engine's `sc:waypoint` events and `--sc-seg` / `--sc-segp` variables (the engine renders no rail). Stops are real buttons: keyboard reachable, `aria-current` on the active stop. The 26-scene scroller is **not** this map.

## Routes and rollout (resolved in review)

`e2e/experience.spec.ts` calls `page.goto("/")` ~20 times expecting the 26-scene shell, with visual snapshots. Flipping the default on day one breaks the entire e2e suite, so the flip is its own final phase.

**Phase 1 — build behind a param.** City page lives at `?view=city`. Zero changes to existing routes or tests. All city verification happens here.

**Phase 2 — flip the default** (separate commit, only after Phase 1 passes its gate):

| URL | Surface |
|-----|---------|
| `/` (no `view`) | Neon-city worldflight |
| `?view=experience` | Current 26-scene `ExperienceShell` |
| `?view=legacy` or `?view=static` | Current `DeckShell` |
| `?view=hero3d` | Current 3D patch preview |

Phase 2 also: migrate every `goto("/")` in `e2e/experience.spec.ts` to `goto("/?view=experience")`, update `App.test.tsx` default-view assertion, update `README.md` and `index.html` meta/title/OG so the front door describes the flight, and preload the first poster (it is the LCP).

## Architecture

- App: SuperPatch income-stack Vite app on this branch.
- **React integration (resolved in review):** a `CityFlightShell` React component renders the worldflight markup as static, authored JSX (`data-sc-mode="worldflight"`, real `h1`/`p`/links — JSX as handwritten markup, never a config-object DOM generator) and calls `ScrollCraft.mount(document)` in a mount effect with full cleanup on unmount. GSAP / ScrollTrigger must not be active on the city view; the engine owns scroll here.
- **Known silent failure:** the worldflight spacer sizes once at mount and sets 0px if `innerHeight` reads 0 — the page looks fine and simply cannot scroll. The shell re-dispatches `resize` on `load` and `document.fonts.ready`. Sanity check: `document.documentElement.scrollHeight ≈ (sum of weights + 1) × innerHeight`.
- Engine: copy Scroll Craft `scrollcraft.js` / `scrollcraft.css` into the app. Theme only: six color tokens and two fonts from SuperPatch. Do not edit the engine.
- Copy SSOT: `src/data/slides.ts` + `src/data/streamIndex.ts`. A small map module (`cityFlight.ts`) lists beat → slide id(s) → copy window → glass plates. Contract tests fail if on-page headline / chip / CTA / disclosure text does not equal the SSOT strings.
- Plates SSOT: each glass `img` `src` equals that slide's `conceptSrc`. Missing file: skip that glass; do not generate a substitute plate. Plates carry `alt=""` (their copy is the live headline beside them); the glass container is not a focus trap.
- City film: generated camera-path clips + posters only, styled to the Era plate. Existing Omni/hero loops are not the world (optional reflection texture at most, never the flight).
- Signature: page-local behavior driven off `--sc-seg` / `--sc-segp` and pointer/keyboard focus. Sharpen / lift the active plate in glass. Not a stock spotlight or magnet, not a lamp-in-the-dark (taken by a prior registry build). If the sharpening lives on a bespoke fixed layer, it publishes `data-sc-verify-state` so the harness can see it.
- Failures: missing clip → poster with push-in. Missing production URLs → hide Join buttons. Reduced motion / Save-Data → stills.

## Asset rules

- One style preamble, written once from the locked Era look and reused verbatim in every prompt: neon night terrace/city, cyan/magenta/amber, wet reflections, empty product-free glass, no people in the open, no readable signs, no Freedom patch/seal on the open.
- Look at every generated frame before use. Reroll rather than ship a clay, cartoon, or product-filled city.
- Do not composite baked type into generated frames.
- Chain frames and posters are extracted from **encoded** mp4s, not source renders (the encode changes pixels; a pre-encode poster mismatches the first decoded frame).

## Accessibility (WCAG 2.2 AA, same bar as the experience)

- Real reading order: the flight's copy blocks read as a document top to bottom.
- Keyboard: tab reaches the five map stops and the Join CTAs; focusing a glass plate's copy block triggers the signature sharpen; `aria-current` tracks the active stop.
- Contrast measured on the composited page at the brightest frame under each line (the shoot harness does this); scrims shaped to copy, never a full-frame dark wash.
- Axe checks at three scroll positions (open, peak, close) in e2e, matching the experience suite's pattern.

## Verification

- Contract tests (vitest): city copy map vs `slides.ts` / `streamIndex.ts`; disclosure pinned through Streams; no scene counter / scroll-nudge markup on the city page; route table (both phases).
- Existing experience, legacy, and hero3d suites still pass — untouched in Phase 1, migrated (not weakened) in Phase 2.
- Scroll Craft shoot: desktop, 390px phone, reduced motion. Served over HTTP with real Chrome (file:// and bundled Chromium both silently pass against posters). Read `sheet.png` for composition; harness catches dead scroll, frozen clips, contrast.
- Feel check: one word per beat vs the curve above. Where they disagree, the page is wrong.
- Pace check: leg `weight ÷ clip seconds` spread within a few percent.
- Say what was not verified: a real iPhone (decoder, autoplay policy, Low Power Mode, touch). On any reported mobile defect, deploy the device-diag page beside the site on the first round.

## Acceptance

**Phase 1 (city behind `?view=city`)**
- [ ] Wheel scrubs one city; no slide cover seams; no counter, no scroll cue
- [ ] Era → Jay → skyline lock → streams → Join completable; peak clearly the longest beat
- [ ] Plates in glass are the approved PNGs; headlines live from `slides.ts`; stream index from `streamIndex.ts`
- [ ] Disclosure pinned through Streams; Join uses existing CTA labels and URL rules
- [ ] Reduced motion / Save-Data hold stills and remain readable
- [ ] Shoot passes on desktop + 390px + reduced motion; axe passes at open/peak/close
- [ ] Existing test suites untouched and green

**Phase 2 (default flip)**
- [ ] `/` is the flight; `?view=experience` is the 26-scene scroller; `legacy` / `static` / `hero3d` unchanged
- [ ] e2e migrated to `?view=experience` without weakening assertions; `App.test.tsx` updated
- [ ] README + index.html meta updated; first poster preloaded (LCP)

## Fingerprint (for the city page)

When this ships, log one row: grammar = continuous world / worldflight; nav = five map stops, no wordmark+CTA bar; hero = filmed terrace with live Era headline (not a kinetic filmic scrub template); act shape = one flight, ~9–12vh, peak ~2× via clip length; close = city holds with Join + disclosure in the stage; signature = plates in glass with focus sharpen. Must differ from prior Scroll Craft registry rows on at least four of six dimensions — checked against the lab registry (`descent` and `orrery` are also worldflights, so nav, hero, close, and signature carry the difference: map stops vs depth gauge/bearing dial, plate-in-glass sharpen vs lamp/elsewhere-field, disclosure-holding Join vs etched plate/letterpress card).
