# Situation Room — Physical Table + Inspect Staging

**Date:** 2026-08-14  
**Status:** Implemented (Wave A + C) — awaiting operator visual check  
**Parent spec:** [2026-08-14-situation-room-war-table-design.md](./2026-08-14-situation-room-war-table-design.md)  
**App:** `tools/org-command-center`  
**Surface:** `OrgTheater` + `CommandTable` + `SeatNode` + Seat console overlay  
**Branch / worktree:** `feature/situation-room-ui-polish` · `.worktrees/situation-room-ui-polish`  
**Review:** [situation-room-visual-upgrades canvas](/Users/cbsuperpatch/.cursor/projects/Users-cbsuperpatch-Desktop-ClaudeSkills/canvases/situation-room-visual-upgrades.canvas.tsx)

This spec is a visual upgrade on the shipped War Table. It does not reopen Glance chrome, verbs, dispatch, or portfolio switching.

## Problem

Wave 2 delivered a table-shaped scene, not a table. The top is a cylinder plus a torus lip, seats are unlit-looking boxes, fill is a flat `ambientLight`, and the renderer has no tone mapping. Seat titles still collide. On inspect, Html labels compete with the Seat console even after the z-index fix.

The room should feel like furniture under a real light, and inspect should stage the console as the instrument — not another card taped on the WebGL canvas.

## Approach (chosen)

**A then C.**

| Wave | Name | Outcome |
|------|------|---------|
| **A** | Physical table | Hemisphere fill, ACES tone mapping, beveled clearcoat lip, Lathe dais, shared PBR seat metal, studio environment at low intensity |
| **C** | Inspect staging | Collision-aware Glance labels; on select, dim others, keep the selected title, hide the rest, spring the console in |

Wave B (extra RectAreaLights / theatrical spots) is out of scope. Key + rim stay. Lighting quality comes from hemisphere + materials + tone mapping.

Do not ship C before A: staging a fake puck is wasted motion.

## Decisions locked

| Topic | Choice |
|-------|--------|
| Sequence | A complete (tests green) before C starts |
| Renderer | `ACESFilmicToneMapping`, `toneMappingExposure` `1.05`. No `EffectComposer`, bloom, vignette, SMAA pass, or DOF |
| Fill light | Replace `ambientLight` with `hemisphereLight`. Keep the existing key and rim directionals unchanged |
| Environment | drei `<Environment preset="studio" />` with default intensity. Materials use `envMapIntensity` `0.35`. No downloaded HDR file |
| Lip | Replace the 0.05 torus with a beveled extruded annulus + `EdgesGeometry` hairline. `MeshPhysicalMaterial` clearcoat on the lip only |
| Table top | Keep `MeshReflectorMaterial` at `mirror` `0.12`, `mixStrength` `0.35`, blur `[80, 20]` |
| Dais | `LatheGeometry` profile, not a short cylinder |
| Seat meshes | Keep per-seat `SeatNode` meshes. Share three module-level body materials (CEO / manager / IC). No `InstancedMesh` in this spec |
| Extra lights | No RectAreaLight, no origin teal point, no per-seat lights except the existing gaze key |
| Type / radius / accent | Unchanged: IBM Plex, 11/13/16/22, 4px, teal on live work only |
| Inspect labels | When `selectedSlug` is set, only the selected seat keeps its rest title. All other scene Html titles, cues, and hover cards unmount |
| Collision | Screen-space hide on Glance (no selection). Priority below. Distance > 16 collapses rest titles to first word |
| Console motion | 180ms ease-out on the right overlay only. Reduced motion: no animation |
| Console surface | Raise Seat console mix to 94% opaque. No extra glow, no 16px radius |
| Parent locks | Bloom off, no stars, no grain, no DOF, no emoji chrome, no dispatch / confirm / auto-spawn writes |

## Non-goals

- Wave B ceiling bars, colored dept spots, or exposure automation
- `InstancedMesh`, GLB assets, custom GLSL, or a new post stack
- Swapping IBM Plex for Inter, or teal for indigo
- Liquid glass, scanlines, glitch, animated background blobs
- Rewriting Seat console content / seat-report schema
- New APIs
- Changing follow-cam, tour, or Glance bar layout
- Deleting `JarvisShell` / ModeBar / FloorDashboard / KpiStrip

## Wave A — physical table

### Renderer (`OrgTheater` Canvas `gl`)

```
antialias: true
alpha: false
toneMapping: ACESFilmicToneMapping
toneMappingExposure: 1.05
```

No `outputColorSpace` change beyond Three’s default sRGB. No composer.

### Lighting (`TheaterScene`)

Remove `ambientLight`.

```
hemisphereLight  sky #e8e6e0  ground #1a2228  intensity 0.42  position [0, 12, 0]
directionalLight intensity 0.95  color #f2f0e8  position [6, 10, 4]   key, castShadow
directionalLight intensity 0.35  color #9bb8c4  position [-4, 3, -6]  rim, no shadow
```

Fog, background, contact shadows, and room hemisphere stay as the parent spec.

### Environment

Mount `<Environment preset="studio" />` inside the Canvas (drei default intensity). Seat and lip materials set `envMapIntensity` `0.35`. Table top reflector does not use the env map (it already reflects the scene).

### Command table furniture

Keep `CommandTable` as the only table component. Change the lip and dais; do not add a second table mesh tree.

**Lip.** Delete the `torusGeometry` `[TABLE_RADIUS, 0.05, 12, 96]`. Build an annulus `Shape` (outer 9.08, inner 8.86) and `ExtrudeGeometry` with:

```
depth: 0.06
bevelEnabled: true
bevelThickness: 0.035
bevelSize: 0.03
bevelSegments: 2
```

Place it so the bevel sits on the table rim (Y ≈ 0). Material: `MeshPhysicalMaterial` `{ color: #1a2228, roughness: 0.38, metalness: 0.55, clearcoat: 0.55, clearcoatRoughness: 0.25, envMapIntensity: 0.35 }`. Overlay `EdgesGeometry` (threshold 20) as `LineSegments` with `LineBasicMaterial` `{ color: #2a343c, transparent: true, opacity: 0.55 }`. Raycast off on the edge lines.

**Dais.** Replace the 0.7 × 0.10 cylinder with `LatheGeometry` from this profile (x = radius, y = height), 32 segments:

```
(0.00, 0.00)
(0.70, 0.00)
(0.70, 0.04)
(0.62, 0.08)
(0.58, 0.10)
(0.00, 0.10)
```

Material: shared CEO metal `{ color: #161c22, roughness: 0.40, metalness: 0.62, envMapIntensity: 0.35 }`.

**Unchanged:** table cylinder body, reflector top, etched rings, dept wedges, ticks, room shell.

### Seat metal

Add `src/jarvis/scene/seat-materials.ts` exporting three `MeshStandardMaterial` instances created once at module load:

| Export | Color | Roughness | Metalness | envMapIntensity |
|--------|-------|-----------|-----------|-----------------|
| `ceoBody` | `#1a2228` | 0.40 | 0.62 | 0.35 |
| `managerBody` | `#1a2228` | 0.45 | 0.55 | 0.35 |
| `icBody` | `#1a2228` | 0.50 | 0.50 | 0.35 |

`SeatNode` uses the matching instance. Do not construct a new body material per seat. Pip, pinstripe, selection torus, and orbit ring stay local (they differ by status). Dim / ghost still modulate opacity on the pip and overlays, not by cloning the shared body.

### Isolation

All Wave A edits stay under `tools/org-command-center/src/jarvis/scene/` plus the Canvas `gl` prop in `OrgTheater.tsx`. No HUD CSS in A except if ACES makes the canvas look darker — do not compensate by raising `--j-accent`.

## Wave C — inspect staging

### Collision-aware titles (Glance, no selection)

Parent spec promised this; it is not implemented. Add a pure helper `collideSeatLabels` in `src/jarvis/scene/label-collision.ts`:

```
collideSeatLabels(input: {
  seats: { slug: string; title: string; level: string; status: string }[]
  positions: Map<string, { x: number; y: number; z: number }>
  project: (world: { x: number; y: number; z: number }) => { x: number; y: number } | null
  cameraDistance: number
  selectedSlug: string | null
  previewWakeSlug: string | null
}): { slug: string; text: string }[]
```

Rules, applied after projection, in this hide-priority (later rows lose):

1. Drop any seat whose `project` returns `null` (behind camera).
2. If `cameraDistance > 16`, rest text is the first whitespace-separated word of `title`. Selected / preview / needs-you (`blocked` or `needs_input`) keep the full title.
3. If two projected titles are closer than **48 CSS pixels**, hide the lower-priority one. Priority, high to low: `selected` → `previewWake` → `needs-you` → `running`/`active` → `manager` → other idle. CEO titles never hide to a collision (they may still collapse to first word at distance > 16 when not selected).
4. Return only visible `{ slug, text }` pairs. `SeatNode` renders the rest title only when its slug is in that set, using `text` as the label.

`OrgTheater` holds `visibleSeatLabels` in local React state and refreshes it at most every 100ms from `useFrame` (timestamp gate). Do not put this on `useJarvisStore`. Reduced motion uses the same collision math (no animation).

### Inspect label yield

When `selectedSlug` is non-null:

- Selected seat: rest title stays (full title, collision ignored).
- Every other seat: no rest title, no cue Html, no hover card Html.
- Phase rail Html is unchanged (already hover/selected only).
- `drawerOpen` still hides all scene Html as today.

Implementation: `showHtmlLabels` becomes `!drawerOpen && (selectedSlug == null || selectedSlug === seat.slug)` for titles; cues and hover cards require `selectedSlug == null && !drawerOpen`.

### Dim others

Keep the existing `dimmed` path and opacities. Do not add a second dim system. CEO never dims.

### Console entrance

`.j-stage-overlay-right` (or `.j-seat-console`) animates `opacity 0 → 1` and `translateX(12px) → 0` over **180ms** with `cubic-bezier(0.16, 1, 0.3, 1)` (Expo.out). Reduced motion: `animation: none`. Do not animate the 3D camera as part of this wave (dolly on select already exists).

### Console surface

`.j-seat-console` keeps `isolation: isolate` and overlay `z-index: 50`. Panel background becomes `color-mix(in oklab, var(--j-panel) 94%, transparent)` on `.j-seat-console` only (not every `.j-hud-panel`). Radius stays 4px. No new box-shadow. Section titles stay 11px uppercase.

### Isolation

Wave C may touch `SeatNode`, `OrgTheater`, `theme.css`, and `label-collision.ts`. Do not add store fields. Do not change `SeatConsole.tsx` copy or report shape.

## Data flow

No new APIs. Snapshot, digest, seat report, and confirm tokens unchanged.

| Source | Wave use |
|--------|----------|
| Canvas `gl` | ACES + exposure |
| `TheaterScene` lights | Hemisphere replaces ambient |
| `Environment` | Studio IBL for shared metals + lip |
| `seat-materials.ts` | Shared body materials |
| `collideSeatLabels` | Glance title visibility |
| `selectedSlug` | Inspect yield + console mount (already) |
| `prefers-reduced-motion` | No console slide; collision still runs |

`SituationRoom` stays the state owner. Do not move fetch/subscribe logic.

## Error, empty, loading

Unchanged from the parent spec. Collision helper on empty roster returns `[]`. Missing layout position skips that seat.

## Accessibility

- Contrast on Seat console stays ≥ 4.5:1 after the 94% mix.
- Collision-hidden titles are visual only; Command deck and `j`/`k` still reach every seat.
- Reduced motion: no console translation/opacity animation; gaze scale already off.
- Focus order unchanged. Seat title buttons that are hidden are not in the a11y tree (`aria-hidden` or unmount). Unmount.

## Testing

TDD. New tests first.

**Wave A**

- `OrgTheater.test.tsx`: source contains `HemisphereLight` or `hemisphereLight`, `ACESFilmicToneMapping`, `toneMappingExposure`, `Environment`; does not contain `ambientLight` or `EffectComposer`.
- `CommandTable` source contract: `ExtrudeGeometry` (or `extrudeGeometry`), `MeshPhysicalMaterial` / `clearcoat`, `LatheGeometry` / `latheGeometry`, `EdgesGeometry`; no lip `torusGeometry` with `0.05`.
- `seat-materials.ts` unit: three exports, identical color `#1a2228` for manager/ic CEO body color `#1a2228` / dais is separate; materials are the same reference when imported twice.
- `SeatNode.test.tsx`: body material comes from `seat-materials` (source match), not an inline `meshStandardMaterial` with `#1a2228` on the body.

**Wave C**

- `label-collision.test.ts`: overlapping idle IC vs manager hides the IC; selected wins over preview; needs-you keeps full title at distance 17; CEO not hidden by collision; `null` projection dropped.
- `SeatNode` / `OrgTheater` source: titles gated on `selectedSlug`; cues/hover cards require no selection.
- `theme.test.ts`: overlay animation 180ms + reduced-motion `animation: none` on the seat overlay; `.j-seat-console` 94% mix.

Parent suite must stay green. No Playwright in this spec.

## Success criteria

1. Still shot of Glance: table lip catches the key as a highlight line, not a flat ring.
2. CEO dais reads as a stepped podium, not a hockey puck.
3. Terminals pick up a faint studio reflection; idle bodies stay slate, not teal.
4. No bloom, stars, grain, or composer in the tree.
5. At the home camera, overlapping IC names hide; a blocked seat’s full title stays.
6. At camera distance > 16, idle titles are one word; a selected title is full.
7. Selecting a seat unmounts other titles/cues and shows the console above the table within 180ms (instant if reduced motion).
8. Esc / empty-table click restores Glance labels and collision.
9. Confirmation, cancel-token, and dispatch-isolation tests still pass.
10. `prefers-reduced-motion: reduce` still disables dolly, orbit, pulse, packet, follow-cam, gaze lift, tour motion, and the new console slide.

## File map

| File | Wave | Change |
|------|------|--------|
| `src/jarvis/scene/OrgTheater.tsx` | A, C | `gl` tone mapping; hemisphere; Environment; label set; pass `selectedSlug` / visible labels |
| `src/jarvis/scene/CommandTable.tsx` | A | Lip extrude + clearcoat + edges; Lathe dais |
| `src/jarvis/scene/seat-materials.ts` | A | New shared materials |
| `src/jarvis/scene/nodes/SeatNode.tsx` | A, C | Shared body material; collision text; inspect yield |
| `src/jarvis/scene/label-collision.ts` | C | New pure helper |
| `src/jarvis/hud/theme.css` | C | Console 94% mix; 180ms overlay motion |
| Tests listed above | A, C | New / extended contracts |

## Safety

No change to dispatch isolation, `needs_confirm`, blocker token confirm/cancel, auto-spawn writes, or `/api/project` switching. Work stays in the situation-room worktree.
