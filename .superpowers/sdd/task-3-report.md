# Task 3 Report — Omni script: style, legs, refs

**Status:** DONE  
**Branch:** `feat/neon-city-worldflight`  
**Date:** 2026-09-02

## Summary

Replaced the product-free style ban with a preamble that allows SuperPatch logo, in-world plates, and sparse package accents. Expanded `CITY_OMNI_LEGS` to 18 legs built from `CITY_LEGS` SSOT, with plate `conceptSrc` and package refs wired into multi-image Omni calls. Leg 1 reveals the logo; legs 9–10 carry consecutive VTT product/science beats.

## Commits

- `bbc33dd` feat(city): point Omni chain at logo, plates, and package accents

## Tests

`npm test -- --run scripts/omni-animate-city-legs.test.ts` — **9/9 passed**

Coverage: style preamble allows logo/packages; 18-leg id/clipSeconds alignment; `<FIRST_FRAME>` prompts; plate conceptSrc paths exist; logo on leg 1; VTT consecutive legs; seam frames; force expansion; encode args; package accent refs.

## Concerns

1. **`city:omni` now runs via `tsx`** — the script imports `cityFlight.ts`; plain `node` cannot load it.
2. **Encoded legs still 10-wide on disk** — Task 4 placeholders / Task 5 Omni re-chain must land new mp4s.
3. **Omni multi-ref count** — some legs carry 4+ refs (e.g. districts-a); watch API limits during Task 5 spend.

## Files changed

- `scripts/omni-animate-city-legs.mjs`
- `scripts/omni-animate-city-legs.test.ts`
- `docs/.../city/STYLE-PREAMBLE.md` (verbatim match required by `main()`)
- `package.json` (`city:omni` → tsx)
