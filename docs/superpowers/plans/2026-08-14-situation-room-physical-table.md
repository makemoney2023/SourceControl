# Physical Table + Inspect Staging Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Situation Room table read as physical furniture (Wave A), then stage inspect so names yield and the Seat console enters cleanly (Wave C).

**Architecture:** Shared PBR materials + hemisphere/ACES/studio IBL in `OrgTheater`. Beveled extruded lip and Lathe dais in `CommandTable`. Pure `collideSeatLabels` drives Glance titles; `SeatNode` only renders a title when given `labelText`.

**Tech Stack:** React 19, R3F, drei, Three r185, Vitest, existing Jarvis HUD CSS.

## Global Constraints

- Work only in `.worktrees/situation-room-ui-polish`
- TDD: failing test before production code
- No EffectComposer, bloom, stars, grain, DOF, InstancedMesh, GLB, or RectAreaLight
- IBM Plex, 4px radius, teal on live work only
- No dispatch / confirm / auto-spawn / `/api/project` writes
- Do not commit unless the operator asks
- Wave A tests green before Wave C production code
- `graphify update .` after code file changes

## File map

| File | Role |
|------|------|
| `src/jarvis/scene/seat-materials.ts` | Three shared `MeshStandardMaterial` instances |
| `src/jarvis/scene/CommandTable.tsx` | Extruded clearcoat lip, Lathe dais |
| `src/jarvis/scene/OrgTheater.tsx` | Hemisphere, ACES, Environment, 100ms collision state |
| `src/jarvis/scene/nodes/SeatNode.tsx` | Shared body material; `labelText`; inspect yield |
| `src/jarvis/scene/label-collision.ts` | Pure collision helper |
| `src/jarvis/hud/theme.css` | Console 94% mix + 180ms overlay |

---

### Task 1: Shared seat materials

**Files:**
- Create: `tools/org-command-center/src/jarvis/scene/seat-materials.ts`
- Test: `tools/org-command-center/src/jarvis/scene/seat-materials.test.ts`

**Produces:** `ceoBody`, `managerBody`, `icBody` — `MeshStandardMaterial`

- [x] Write failing test for shared instances and PBR numbers
- [x] Implement module-level materials
- [x] Tests pass

### Task 2: Theater light + ACES + Environment

**Files:**
- Modify: `src/jarvis/scene/OrgTheater.tsx`
- Modify: `src/jarvis/scene/OrgTheater.test.tsx`

**Produces:** `hemisphereLight`, `ACESFilmicToneMapping`, `toneMappingExposure: 1.05`, `<Environment preset="studio" />`

- [x] Extend source contract (expect hemisphere, not ambient)
- [x] Implement Canvas `gl` + lights + Environment
- [x] Tests pass

### Task 3: Physical lip and dais

**Files:**
- Modify: `src/jarvis/scene/CommandTable.tsx`
- Modify: `src/jarvis/scene/OrgTheater.test.tsx` (table source contract)

**Produces:** Extrude annulus lip + EdgesGeometry; Lathe dais

- [x] Failing source contract
- [x] Implement lip/dais
- [x] Tests pass

### Task 4: SeatNode uses shared body materials

**Files:**
- Modify: `src/jarvis/scene/nodes/SeatNode.tsx`
- Modify: `src/jarvis/scene/nodes/SeatNode.test.tsx`

**Produces:** `material={ceoBody|managerBody|icBody}`; dim/ghost do not mutate shared body opacity

- [x] Failing source contract for `seat-materials`
- [x] Wire materials
- [x] Tests pass

### Task 5: collideSeatLabels

**Files:**
- Create: `src/jarvis/scene/label-collision.ts`
- Test: `src/jarvis/scene/label-collision.test.ts`

**Produces:** `collideSeatLabels(input) => { slug, text }[]`

- [x] Failing unit tests (overlap, selected, needs-you, CEO, null project)
- [x] Implement helper
- [x] Tests pass

### Task 6: Wire collision + inspect yield

**Files:**
- Modify: `OrgTheater.tsx`, `SeatNode.tsx`, their tests

**Produces:** `labelText` prop; 100ms `useFrame` gate; cues/cards only when no selection

- [x] Failing tests
- [x] Implement
- [x] Tests pass

### Task 7: Console surface + entrance

**Files:**
- Modify: `src/jarvis/hud/theme.css`
- Modify: `src/jarvis/hud/theme.test.ts`

**Produces:** 94% mix; 180ms Expo.out on `.j-stage-overlay-right`; reduced-motion none

- [x] Failing theme contract
- [x] CSS
- [x] Tests pass
- [x] `graphify update .` and full `npm test`
