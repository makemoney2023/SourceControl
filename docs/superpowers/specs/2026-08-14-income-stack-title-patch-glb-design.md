# Income Stack — Title Patch GLB Design

**Date:** 2026-08-14  
**Venture:** Superpatch / affiliates / income-stack-deck  
**Status:** Approved for planning (Approach 1 — patch scene in the existing title slot)  
**Implementation repo:** [SuperPatchAi/affiliateincomestack](https://github.com/SuperPatchAi/affiliateincomestack) (`deploy/affiliate-income-stack` tracks `affiliateincomestack/main`)  
**Monorepo mirror:** `apps/superpatch-income-stack`  
**Source asset:** `/Users/cbsuperpatch/Downloads/texturized-new.glb` (~1.3 MB)

## Goal

Replace the title-scene photoreal plate stack with the texturized Super Patch `.glb` as the scene `01-title` hero. Desktop visitors get a pointer-follow tilt. Touch visitors get a still-facing patch with a small idle rock. The existing 15-scene GSAP scroll experience, lower-third copy, and scenes 02–15 stay unchanged.

**Success bar:** The patch reads as the title product hero, stays above the lower-third scrim, never spins around to its back, and does not steal scene scroll.

## Locked decisions

| Decision | Choice |
|---|---|
| Title media | Texturized patch GLB replaces the photoreal plate stack on `01-title` |
| Desktop motion | Pointer-follow tilt; rest pose faces camera; no drag orbit; no full spin; no intro whip |
| Tilt range | About ±18° yaw, ±12° pitch; damped; spring back to rest in 300–400ms on pointer leave |
| Mobile / coarse | No pointer tracking; subtle idle rock only (a few degrees, slow sine) |
| Framing | Raised / optically centered in the open sky above the lower-third scrim |
| Scroll | GSAP pin, cover handoff, dwell, SplitText, chapter chrome unchanged |
| Copy | Existing `01-title` eyebrow / headline / body stay; no rewrite |
| Plate stack | Keep on `?view=hero3d` only; do not delete photoreal look-dev |
| Reduced motion | Static facing camera; no tilt, no idle rock; poster remains LCP |
| No WebGL / GLB fail | Existing title poster + copy; never a black empty plane |
| Worktree / repo | Implement on the standalone income-stack repo, not ClaudeSkills `main` |

## Non-goals

- Changing Omni video, posters, or motion for scenes 02–15
- Rewriting approved slide copy or disclosures
- Full `OrbitControls` orbit, auto-rotate, or the current full-turn intro
- Finger-follow tilt or device gyro on touch (fights swipe-to-scroll)
- Replacing `ExperienceShell` as the default app entry
- Deleting `PhotorealStackScene`, physics accordion, or `?view=hero3d`
- New sound, auto-advance, or smooth-scroll libraries

## Architecture

Approach 1: new patch scene in the existing title WebGL slot.

| Piece | Role |
|---|---|
| `ExperienceShell` | Unchanged 15-scene GSAP host |
| `ExperienceScene` | Still routes `01-title` to `SceneHero3d` via `isHero3dExperienceSlide` |
| `SceneHero3d` | Poster-first media plane; mounts `Hero3dCanvas` with `variant="patch"` when active, WebGL is available, and motion is allowed |
| `Hero3dCanvas` | Shared R3F canvas host. `variant="patch"` (title) renders `PatchHeroScene`. `variant="stack"` (`?view=hero3d`) still renders `PhotorealStackScene` |
| `PatchHeroScene` | Loads GLB, frames it above the scrim, studio lights, pointer-tilt / idle-rock |
| `pointerTilt.ts` | Pure helpers: NDC → clamped yaw/pitch; leave → rest; coarse → idle; reduced motion → zero |
| `public/models/superpatch-title.glb` | Checked-in copy of `texturized-new.glb` |
| `?view=hero3d` | Continues to mount `PhotorealStackScene` for plate-stack look-dev |

**Data flow**

`ExperienceShell` → scene `01-title` → `SceneHero3d` → poster + `Hero3dCanvas variant="patch"` → `PatchHeroScene` (`useGLTF('/models/superpatch-title.glb')`) → `pointerTilt` / idle rock. GSAP still owns every scroll transform. The 3D scene owns only local rotation of the patch group.

**Path note:** On the standalone income-stack repo these files live at `src/...`. The monorepo mirror uses `apps/superpatch-income-stack/src/...`. Implement against the standalone tree.

## Visual craft

- Black void background, matching the current title canvas clear color.
- Use the GLB’s authored materials and textures. Do not rebuild the patch as procedural geometry.
- Add a simple key / fill / rim so the texturized surface reads on black. No new bloom requirement; keep existing quality-tier DPR cap.
- Center and scale from the GLB bounding box. Camera and/or group offset place the patch in the upper ~60% of the viewport so the lower-third scrim and copy do not cover it.
- Rest pose faces the camera. No ornamental spin-in.

## Interaction

### Desktop (fine pointer)

1. Pointer position over the title media plane maps to normalized device coordinates.
2. NDC maps to yaw/pitch around the rest pose.
3. Clamp to about ±18° yaw and ±12° pitch so the back of the patch is never visible.
4. Damp toward the target each frame.
5. Pointer leave springs back to rest in 300–400ms.
6. No `OrbitControls`. Wheel and page scroll stay with the document / GSAP.

### Mobile (coarse pointer)

1. No pointer-to-tilt mapping.
2. While the title scene is the active play target, apply a small idle rock (slow sine, a few degrees).
3. First swipe still owns scene scroll. The canvas must not capture touch in a way that blocks the cover handoff.
4. Idle rock is off when `prefers-reduced-motion: reduce`.

### Lifecycle

- Mount the live canvas only when the title scene is active (current `SceneHero3d` `active` contract) and WebGL is available.
- Inactive / distant title keeps the poster. Unmounting the canvas must not flash a black plane.
- Quality tier still caps `devicePixelRatio`.

## Fallbacks and errors

| Condition | Behavior |
|---|---|
| `prefers-reduced-motion: reduce` | Do not mount the canvas (current `SceneHero3d` contract); poster + copy only |
| `canUseWebGL()` false | Poster + copy only |
| GLB load / decode failure | Keep poster + copy; do not leave an empty black media plane |
| Data-saver / constrained path | Same as today’s title rule: do not force Omni video; poster remains valid |
| `?view=legacy` | `DeckShell` unchanged |

## Testing

TDD on pure helpers first, then wiring, then existing experience tests.

**Unit**

- Fine pointer NDC maps to clamped yaw/pitch inside the locked ranges.
- Values at the clamp edges never exceed the max; the back of the patch is not reachable.
- Pointer leave returns rest pose `{ yaw: 0, pitch: 0 }`.
- Coarse pointer path returns idle-rock parameters and does not apply pointer mapping.
- Reduced motion returns zero motion in both paths.
- `isHero3dExperienceSlide("01-title")` stays true; other slide IDs stay false.

**Component / experience**

- `SceneHero3d` remains poster-first; canvas mounts only when active + WebGL + motion allowed.
- Existing experience motion tests and scene-01 e2e stay green: title copy, first-scroll/swipe cue, cover handoff into scene 02.
- Title canvas does not prevent native/GSAP scroll on wheel or touch.

## Acceptance criteria

| Criterion | Pass condition |
|---|---|
| Title media | Scene `01-title` shows the texturized patch GLB when WebGL is available and motion is allowed |
| No full orbit | Patch never rotates through a full turn; back is not visible |
| Desktop tilt | Fine pointer over the media plane nudges yaw/pitch; leave eases to rest |
| Mobile rock | Coarse pointer shows idle rock only; swipe still advances the experience |
| Framing | Patch sits above the lower-third scrim on 1440×900 and 375×812 |
| Scroll intact | Pin, handoff, dwell, SplitText, chapter chrome, and scenes 02–15 match the locked Premium V2 / Mobile UX V3 contract |
| Copy intact | Title eyebrow, headline, and body are unchanged |
| Fallback | No WebGL, reduced motion, or GLB failure keeps poster + copy; no black empty plane |
| Plate stack preserved | `?view=hero3d` still shows the photoreal plate stack |
| A11y | Title `h1` and scene label remain; canvas is decorative relative to the HTML copy |

## Out of scope

- Photoreal plate-stack material or orbit changes
- Remotion film title treatment
- New affiliate CTA or copy on scene 01
- Compressing or swapping the GLB for a different asset after check-in (follow-up if weight or framing fails QA)
