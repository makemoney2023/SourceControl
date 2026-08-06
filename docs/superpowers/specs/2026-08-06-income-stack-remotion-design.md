# Income Stack Remotion Film — Design

**Date:** 2026-08-06  
**Branch:** `feature/income-stack-remotion`  
**Baseline kept:** HyperFrames film on `feature/superpatch-income-stack-deck` @ `cbf8337`

## Goal

Ship a Remotion composition where **transitions**, **layered diagrams**, and **kinetic type** are first-class — not bolted onto HyperFrames HTML.

## Decisions

| Choice | Decision |
|--------|----------|
| Location | `apps/superpatch-income-stack/src/remotion/` (same package as web deck) |
| SSOT | `src/data/slides.ts` + `public/` assets |
| Formats | Mobile-first portrait master: 1080×1920; landscape adaptation: 1920×1080; both at 30 fps |
| Transitions | `@remotion/transitions` `TransitionSeries` + `fade()`, ~0.55–0.6s (`TRANSITION_FRAMES` = 18) |
| MotionDirector | `src/remotion/motion/presets.ts` (`getMotionBeat`) + `gating.ts` (`getMotionPhases`); `SlideScene` dispatches plate / annotation / copy timing from `motionPreset` |
| Heroes | `OffthreadVideo` for slides with `hero` (`HeroMedia`) / deprecated `heroVideoSrc` |
| Hero delivery | Native **1920×1080** @ 30 fps (dense keyframes); optional 1080×1920 when available. No 720p upscale for new assets. `assertHeroMedia` + slides tests enforce the contract; `01-title` / `03-four-stacks` remain allowlisted 720p debt until operator re-export (VIDEO-BRIEF checklist). |
| Labels | `shouldShowLiveAnnotations` — live overlays off when `hero.annotationsBaked === true` |
| Narrative | `onScreenBody` (film 30–50 words) preferred over `body`; `presenterNotes` for proof/objections; `INCOME_STREAMS` index + spine + slide-14 recap |
| CTA / close | `ctaPrimary` / `ctaSecondary` + `INCOME_DISCLOSURE` on `15-closing` via Remotion `EndCard` |
| Stills | Clean plate `Img` + motion presets |
| Type | Montserrat via `@remotion/google-fonts`; kinetic word springs on headlines |
| Diagrams | React layers: slab drop (`parallax-slabs`), annotation stagger (`pillars-sequence` / flywheel) |
| HyperFrames | Untouched; remains the approved HTML film path |

## Studio seek QA (landscape film)

Composition `IncomeStackFilm`: **1920×1080**, 30 fps, **2298** frames. Seek absolute starts:

| Slide | Frame | Expect |
|-------|------:|--------|
| 03 | 414 | Hero + pillars; baked-label policy respected |
| 04 | 696 | Flywheel overlay + plate entrance |
| 07 | 1092 | Retail diagram-first; disclosure; no unqualified “guaranteed” |
| 09 | 1356 | Annotations before dense copy |
| 15 | 2148 | EndCard CTAs + disclosure |

Full checklist also lives in `apps/superpatch-income-stack/README.md`.

## Responsive composition system

The presentation must not shrink a landscape composition onto a phone. Remotion exports
separate portrait and landscape compositions that share the same slide data, motion
presets, narration, and compliance copy while selecting aspect-specific layouts.

- **Portrait / mobile master:** `1080×1920` (9:16), designed first.
- **Landscape presentation:** `1920×1080` (16:9), adapted from the portrait hierarchy.
- **Optional social derivative:** `1080×1350` (4:5) after 9:16 and 16:9 are approved.
- Copy, focal subject, annotations, and CTA must remain inside aspect-specific safe zones.
- Every animated plate needs portrait and landscape framing, or a protected center-safe
  source with enough overscan to recompose both ways.
- Scene metadata should define portrait and landscape `copyZone`, `focalPoint`, `crop`,
  `protectedRegion`, and `typeScale`; these are art-directed values, not automatic scaling.
- The web deck remains fluid and must be verified at 390px, 768px, and desktop widths.

## Out of scope (v1)

- Voiceover / music bed
- Replacing HyperFrames generator
- Budgeted I2V for remaining slides
