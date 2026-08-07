# Income Stack Omni Chain — Design Spec

**Date:** 2026-08-07  
**Venture:** Superpatch / affiliates / income-stack-deck  
**Status:** Approved for execution

## Goal

Produce a text-free Gemini Omni Flash video for each of the 15 Income Stack slides, in both `16:9` and `9:16`, for a future 3D scroll website where each slide’s video layer slides over the previous one.

## Locked decisions

| Decision | Choice |
|---|---|
| Continuity model | Plate-anchored world bridge (Approach 1) |
| Aspect ratios | Both `16:9` and `9:16` |
| Audio | Light cinematic ambient only (no dialogue / VO) |
| On-screen text | None — site owns all typography + parallax overlays |
| Playback | Independent scroll-stack layers, not linear film cuts |
| Existing Veo heroes | Leave untouched; Omni assets land in a new folder |

## Scroll-stack continuity

- One 8s looping hero per slide
- Each plate PNG is `<FIRST_FRAME>`
- Prior last frame may be `<IMAGE_REF_0>` for palette/lighting only — not a forced morph
- Motion: assemble/awaken (0–2s) → living center motion (2–6s) → settle for loop (6–8s)
- Keep primary motion in the center ~60% (safe zones for overlays)

## Shot list

1. Title — ten luminous slabs stack with parallax  
2. Question — single income stream fractures  
3. Four stacks — four pillars assemble  
4. Flywheel — circular energy arcs  
5. Ecosystem — node mesh pulses  
6. Ten layers — exploded stack nests back  
7. Retail — particles rise through portal  
8. Fast Start — ascending platforms lock  
9. Team overrides — root system grows five tiers  
10. MD depth — rings expand past level 5  
11. VP override — leadership light down legs  
12. Generations — three concentric rings  
13. Exec/CEO — summit + dual beacons  
14. Global — earth arcs + pool glow  
15. Closing — horizon unifies motifs  

## Pipeline

- Tool: `gemini_omni_video` (`gemini-omni-flash-preview`) via Interactions API  
- Source plates: `apps/superpatch-income-stack/public/concepts/clean/`  
- Output:
  ```
  public/concepts/omni-chain/
    16x9/
    9x16/
    bridges/
    prompts.json
    manifest.json
  ```
- Cost estimate: ~$24 for 30×8s clips  
- QA: text scan, ffprobe, loop settle, safe-zone review; Omni edit pass if text appears  

## Out of scope

- Building the 3D scroll website  
- Replacing Remotion/Veo heroes in the current deck  
