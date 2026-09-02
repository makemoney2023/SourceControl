# Neon City — Plates in Flight (amendment)

**Date:** 2026-09-02  
**Status:** Locked in conversation (operator approved)  
**Branch:** `feat/neon-city-worldflight`  
**Amends:** `docs/superpowers/specs/2026-09-02-neon-city-worldflight-design.md`  
**Deck:** SuperPatch Income Stack (`slides.ts` SSOT)

## Goal

Make the neon-city worldflight carry the **full Income Stack story in the film**: every approved plate appears **in the world**, the SuperPatch **logo opens** the flight, **sparse patch packages** accent the path, and **VTT** gets an unmistakable beat. Live DOM **glass overlays go away**. Live **copy remains for every slide**, sequenced so the page does not crowd.

Remembered line: “The plates became the city.”

## Locked choices (this amendment)

| Topic | Lock |
|-------|------|
| Plates | All **26** `conceptSrc` plates appear as **baked in-world surfaces** in Omni legs (storefront / facade / skyboard / wet reflection). Never AI-redraw the plate art — ground Omni on the approved PNG. |
| Glass DOM | **Remove** `CITY_GLASS`, glass focus sharpen, and CSS plate blur. No `figure.city-glass` on the page. |
| Logo | **Baked** reveal in the **first seconds of leg 1** (Era / terrace). Use brand assets under `public/brand/` and/or `concepts/omni-chain/superpatch-logo-transparent.png`. Not a Freedom seal on the Era still. |
| Packages | **Sparse accents** — **4–6** moments across the flight (Freedom + a few SKUs from `public/concepts/refs/packages/` and `patches/`). Never a catalog wall. |
| Bake method | **Full Omni chain re-shoot from leg 1** with `--force` so Architecture A seams stay valid. No ffmpeg composite of packages as the primary path. |
| Copy | Every slide gets live **eyebrow (if any) + headline**. Show `onScreenBody` only when the slide already defines it. Speaker-only `body` / `presenterNotes` stay off. |
| Crowding | Solved by **sequenced copy windows** (one readable plateau at a time; brief crossfade only) + **no glass stack**. Mobile must not dual-hold two headlines over the streams detail link. |
| VTT | Explicit consecutive beats: **`05-product` → `05b-science`** (filmed plate + live headlines). Science is no longer “experience-only.” |
| Streams | Keep lit **`INCOME_STREAMS` index** + pinned disclosure + “See every stream in detail.” Also give each of the ten stream slides its own short headline window as its plate flies by. |
| Signature | Was “plates in glass, focus sharpen.” Becomes **“approved plates live inside the neon city film.”** Update scroll-craft fingerprint notes when this ships. |

## Relationship to the original worldflight spec

Still true:

- One continuous worldflight; Scroll Craft engine; pace law ~**0.215 vh/s**; seam law on encoded frames; `?view=city` until Task 11 flip.
- No scene counter, no scroll/swipe cue, no 26-item jumper.
- Join CTAs only when both production HTTPS URLs exist.
- Copy and claims only from `SLIDES` / `INCOME_STREAMS` / `INCOME_DISCLOSURE`.

Superseded / changed:

- “Empty dark glass / no logos / no product in the open” → **logo + sparse packages + plate art in-world** are allowed and required.
- Peak “not a spoken list” of stacks → peak may still be **visual-dominant**, but **04 / 05 / 06 / 07** each get a plate moment and a short headline window (not one silent lock with zero copy).
- “Off the glass: `05b-science`, `05c-market`” → **both are on the flight** (film + headline).
- DOM glass plates → **removed**.
- Track length **9–12vh** → expand to about **16–22vh** so 26 plate moments are not a strobe (exact total = sum of leg weights under pace law).

## Feeling curve (updated)

| Beat | Feeling | Film cause | Live copy |
|------|---------|------------|-----------|
| Open | Quiet awe + brand | Terrace; **logo reveal** first seconds | `00-era` |
| Claim → Human | Bigger than a program → trust | Facades / street; plates `01-title` … `00c-ceo` | matching headlines |
| Pressure → Approach | Unease → rise | Windows / ascent; `02-world` … `03b-name-stacks` | matching headlines |
| Product / **VTT** | Belief | `05-product` then **`05b-science`** in-world | both headlines |
| Market → Development | Proof / system | `05c-market`, `06-brand`, `07-development` | matching headlines |
| Peak | Stacks became the city | Skyline lock; `04-flywheel` moment nearby in approach/peak | short windows, not a list dump |
| Range | Possibility | Districts; ten stream plates + sparse packages | `08-ten-layers` (+ onScreenBody), each stream headline, streams index + disclosure |
| Bridge | Lift | `17` / `18` / `19` | three short windows |
| Resolve | Done | Hold; city stays | `15-closing` + CTAs |

## Plate coverage contract

`CITY_PLATE_MOMENTS` (name in data module) is an ordered array of **26** entries:

```ts
type CityPlateMoment = {
  slideId: string;       // must exist in SLIDES
  legId: string;         // must exist in CITY_LEGS
  note: string;          // Omni prompt hint: where the plate sits in frame
};
```

Rules:

1. Every `SLIDES[].id` appears exactly once.
2. Every `conceptSrc` is used as an Omni **reference / grounding** image for that moment (path unchanged).
3. A human scrubbing the flight can pause and **recognize** each plate at least once (feel-check + contact strip).
4. Package accents are **not** plate moments; they are separate `CITY_PACKAGE_ACCENTS` (4–6) tied to leg ids.

## Legs and pace

- Keep **pace law**: `weight = clipSeconds * CITY_RATE` with `CITY_RATE = 0.215`.
- Expand `CITY_LEGS` as needed so track total is in **16–22vh** (add 5s legs; keep **one** ~10s peak leg ≈ 2× a normal leg).
- Do **not** require one leg per slide. Multiple plate moments may share a leg if the camera move shows them in sequence.
- Seam law unchanged: start frame of leg N = last encoded frame of leg N−1; leg 1 starts from Era plate (and logo grounding as Omni refs).

## Omni style preamble (replace product ban)

Replace the current “no logos / empty product-free” ban with:

- Neon night city, cyan/magenta/amber, wet reflections, photographic, no people.
- **Allowed:** SuperPatch wordmark/logo (open), approved Income Stack plates as in-world art, **4–6** real SuperPatch package/patch product accents.
- **Forbidden:** inventing other brands, readable unrelated signage, crowds, clinical claim text in the film, guaranteed-income numbers in the film.

## Live UI contracts

- `CityFlightShell` renders **no** `CITY_GLASS` figures and does not call `wireGlassFocus`.
- Delete or stop shipping glass-only CSS / `glassFocus.ts` once unused (prefer delete + test removal over dead code).
- Copy blocks: one `[data-city-copy="{slideId}"]` per slide, `data-sc-window` from sequenced helpers (`windowAcross` / `windowForLegSlice`).
- Streams block remains `[data-city-streams]` with index + disclosure + experience link; its window must **not** dual-hold with `08-ten-layers` or stream headlines on mobile (same sequencing rule already used for Range).
- Map rail: still five stops.

## Routes

Unchanged: Phase 1 = `?view=city`. Default flip remains gated (original Task 11).

## Acceptance

- [ ] Logo visible in first ~1–2s of scrub on leg 1.
- [ ] All 26 plates identifiable in film; checklist in baseline doc.
- [ ] 4–6 package accents noted in baseline; none dominate the frame for a full leg.
- [ ] `05b-science` filmed + live headline; VTT readable without opening `?view=experience`.
- [ ] Zero `.city-glass` / `[data-glass]` in DOM.
- [ ] Every slide id has a copy node; mobile e2e: no long dual-hold of two headlines over the detail link.
- [ ] Pace + seam laws hold; `verify:city-assets` green; city Playwright + axe green.
- [ ] Scroll-craft shoot / fingerprint note updated for new signature.

## Out of scope

- Flipping `/` to city without operator gate.
- Rewriting PPTX/Remotion as the city.
- New compensation figures or paraphrased claims.
- Restoring Freedom patch onto the Era **still** (logo is live-in-film / Omni, not the locked empty Era PNG composition).
