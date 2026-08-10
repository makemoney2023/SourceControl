# Income Stack — Hero 3D “Trailer Bay” Dose Design

**Date:** 2026-08-10  
**Status:** Draft — awaiting user review  
**App:** `apps/superpatch-income-stack`  
**Surface:** `?view=hero3d` only  
**Dose:** B — Transformers-trailer spectacle (not Bayhem)  
**Builds on:** muted Tron metallic stack (lasers removed); always-open local plate focus  
**Related:** `2026-08-10-income-stack-cinematic-hero3d-design.md`, `2026-08-10-income-stack-photoreal-hero3d-design.md`

## Goal

Add **blockbuster beats** to the interactive hero: camera punch + shake on plate focus, warm/cool Trailer lighting, selective volumetric/god-ray and anamorphic streak (desktop), heavier impact springs with neighbor reaction, and a short dust/ember burst — while keeping the **muted Tron metal** look and mobile quality tiers.

Success looks like: hover/tap feels like a *hit*, the stack still reads premium/industrial (not carnival neon), and phone stays smooth.

## Decisions locked

| Topic | Choice |
|-------|--------|
| Dose | **B Trailer** (not Lite, not Bayhem) |
| Materials | Keep muted Tron metal (`muteTowardTron`); no laser beams |
| Interaction | Always-open stack; local focus bounce only |
| Camera | Idle orbit + focus punch-in + short damped shake |
| Grade | Warm key + cool cyan fill/rim; deeper vignette; selective bloom |
| FX | God-ray (desktop), anamorphic streak (desktop), dust/ember burst on focus, rim light pulse |
| Audio | Out of scope |
| Default app entry | Unchanged (`ExperienceShell`) |

## Non-goals

- Bayhem: debris rain, lens dirt, hard cuts, permanent sparks
- Reintroducing hover lasers / electricity beams
- Wiring into cinematic ExperienceShell scenes
- Audio stingers or haptics (unless a later pass)
- Claiming film-render parity

## Architecture

### Data flow

```
Hero3dPreview (focusIndex state)
  └─ PhotorealStackScene
       ├─ CameraRig          ← punch + shake when focusIndex changes
       ├─ TrailerLights      ← warm key + cool fill (+ optional god-ray)
       ├─ AtmosphereSmoke     ← existing clouds (unchanged role)
       ├─ PhysicsAccordion   ← impact spring profile on focused plate
       ├─ ImpactParticles    ← burst on focusIndex change
       └─ CinematicPost      ← bloom bump on impact; optional streak
```

`focusIndex` remains the single source of truth for “which plate was hit.” New systems subscribe to focus transitions; they do not own pointer picking.

### File layout (additive / small edits)

| File | Role |
|------|------|
| `Hero3dPreview.tsx` | Overlay copy tweak (“Trailer metal” / bounce language); no entry change |
| `PhotorealStackScene.tsx` | Wire TrailerLights, CameraRig impact, ImpactParticles |
| `hero3d/CameraRig.tsx` *(extract or extend)* | Orbit + punch-in + shake; respects `reducedMotion` |
| `hero3d/TrailerLights.tsx` | Warm key, cool fill/rim, optional volumetric shaft |
| `hero3d/ImpactParticles.tsx` | Short-lived dust/ember burst at focused plate Y |
| `hero3d/impactMotion.ts` | Pure helpers: punch offsets, shake envelope, impact spring params |
| `PhysicsAccordion.tsx` | Apply impact spring profile when plate is focused |
| `accordionState.ts` | Optional: stronger neighbor falloff amp for impact window |
| `CinematicPost.tsx` | Tier-aware bloom; desktop anamorphic streak if available |
| `qualityTier.ts` | Flags: `enableGodRay`, `enableStreak`, `particleBudget`, `impactBloomBoost` |

Prefer extracting `CameraRig` from `PhotorealStackScene` if the punch/shake logic would clutter the scene file; otherwise extend the existing local `CameraRig` in place.

### Quality tiers

| Feature | Phone | Desktop |
|---------|-------|---------|
| Punch-in | Yes (shorter distance) | Yes |
| Camera shake | Yes (lower amplitude) | Yes |
| God-ray / volumetric | Off (or single soft fake) | On |
| Anamorphic streak | Off | On |
| Particles | Fewer, shorter life | Full budget |
| Impact bloom boost | Small / none | Brief bump |
| Idle auto-orbit | Off (existing) | On (existing) |

`prefers-reduced-motion`: no punch, no shake, no particles, soft spring only (current reduced-motion path).

## Behavior detail

### Camera

- On `focusIndex` change (null → N or N → M):  
  - Target Y lerps toward focused plate center over ~150ms.  
  - Distance eases in ~8–12% (punch), then returns.  
  - Shake: decaying noise on camera position for ~180–250ms (phone amp ~60% of desktop).
- Idle orbit unchanged aside from slightly lower heroic polar bias if cheap.
- User drag always wins over auto punch (do not fight OrbitControls mid-drag).

### Lighting & grade

- Key: warm (`#ffc8a0`–`#ffe0c8`), from upper-front; intensity tuned so metal reads, not blown.
- Fill/rim: cool cyan (`#6ec8e0` family), low intensity, opposite side.
- Ambient stays low; night env intensity stays low (avoid orbit flash).
- God-ray: one soft shaft through smoke toward stack (desktop); not a disco of cones.
- Bloom: raise luminance threshold slightly vs neon era; on impact, brief intensity boost then return.
- Anamorphic streak: desktop-only, subtle, tied to bright speculars — not full-frame rainbow.

### Impact physics

- Focused plate: higher spring stiffness + controlled overshoot for ~200–300ms, then settle to current open local-focus targets.
- Neighbors: amplify existing `localFocusOffsets` falloff briefly (same envelope as impact window).
- No global open/close accordion; stack stays always-open.
- Implementation preference: kinematic Y spring-damper params keyed by focus (already kinematic path) — avoid fighting Rapier unless springs already drive the feel.

### Particles & rim pulse

- Burst origin: world position at focused plate center (or gap above it).
- Count: phone ~12–20, desktop ~40–60; lifetime &lt; 0.6s; upward + outward velocity; gravity lightly down.
- Colors: warm ember + cool dust gray (Trailer grade), not spectral rainbow.
- Focused plate rim `emissiveIntensity` pulses +Δ for ~200ms then returns to muted Tron baseline.

## Testing (TDD)

| Unit | Assert |
|------|--------|
| `impactMotion.ts` | Punch distance/duration helpers; shake envelope decays to ~0; reduced-motion returns identity |
| `qualityTier` | Phone disables streak/god-ray; desktop enables; particle budget phone &lt; desktop |
| `accordion` / spring params | Focused index uses impact stiffness &gt; idle; reduced motion skips overshoot |
| Existing hero3d suite | Remains green; no laser/electricity imports |

Visual verify: Playwright Chromium screenshot at `?view=hero3d` after focus hover — metal still muted, no lasers, impact feel visible via camera/particles.

## Rollout

1. Pure motion helpers + quality flags (tests first).  
2. Camera punch/shake.  
3. Trailer lights + post bloom/streak.  
4. Impact springs + neighbor amp.  
5. Particles + rim pulse.  
6. Copy pass + graphify update on `apps/superpatch-income-stack`.

## Ownership

- **Creative Director:** look target (Trailer grade, mute metal preserved).  
- **Tech Lead / Web Designer seat:** R3F wiring, tiers, tests.  

## Open questions (resolved)

| Question | Resolution |
|----------|------------|
| Dose A/B/C? | **B Trailer** |
| Bring lasers back? | **No** |
| Audio in this pass? | **No** |
