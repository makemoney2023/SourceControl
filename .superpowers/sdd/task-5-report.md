# Task 5 Report: Seat terminals and phase rail

**Status:** DONE  
**Commit:** `d4d2118` — `feat(occ): give seats terminal silhouettes and an in-floor phase rail`

## What shipped

- `SeatNode` rank silhouettes: CEO short cylinder r=0.38; manager box 0.36×0.16×0.28; IC box 0.22×0.10×0.18. Body `#1a2228` (roughness 0.45, metalness 0.55). Status is a small sphere pip using `STATUS_COLOR`, not a full-body wash.
- Persistent title Html at rest when `showHtmlLabels` (`!drawerOpen`). Hover card after 150ms dwell; cleared on pointer out.
- Gaze scale 1.02 unless `reducedMotion`; hover point light intensity 0.45, `#f2f0e8` (light still on under reduced motion).
- Dept pinstripe via `deptColor(seat.dept)` on manager/IC only. CEO has no pinstripe. Selection torus stays teal `#3fd4be`.
- Wake preview: `previewWakeSlug === seat.slug` draws a dashed torus at opacity 0.5. `OrgTheater` reads the store and passes `previewWakeSlug` into `SeatNode`.
- Seat clicks still `stopPropagation` so CommandTable empty-click deselect does not steal them.
- `PhaseBead` sits on the table at Y=0.06, radius 2.2. Marks: pending empty square, in-progress amber diamond, done green tick plate, skipped muted dash. Selected mark lifts 0.04. Labels use Pending / In progress / Done / Skipped — no emoji in the rendered label.

## TDD evidence

### RED

Wrote `SeatNode.test.tsx` source contracts + jsdom title-at-rest first. Ran:

```
cd tools/org-command-center && npm test -- src/jarvis/scene/nodes/SeatNode.test.tsx src/jarvis/scene/OrgTheater.test.tsx
```

**Result:** FAIL — 5 failed / 3 passed (OrgTheater a11y tests still green).

| Test | Failure (expected) |
|------|--------------------|
| title at rest | `Unable to find an element with the text: CFO` — title only existed on hover card |
| rank silhouettes | `expected … to match /boxGeometry/` — body still `<sphereGeometry args={[radius, 24, 24]} />` |
| gaze / dwell / preview | missing `1.02`, `150`, `previewWakeSlug` |
| PhaseBead rail | `y = 1.8`, no Pending/In progress/Done/Skipped, label interpolated `{phase.status}` |
| OrgTheater wiring | no `previewWakeSlug` |

Failures were missing features, not typos.

### GREEN

Implemented terminals, hover dwell, preview torus, in-floor phase marks, and OrgTheater pass-through. Re-ran the same command.

**Result:** PASS — 8 tests (2 files).

```
Test Files  2 passed (2)
     Tests  8 passed (8)
```

## Self-review

- Dispatch / confirm / auto-spawn / `JarvisShell` untouched.
- `deptColor` used only for the pinstripe; beacon pip and selection torus stay on `STATUS_COLOR` / teal.
- Beacon pip still uses `sphereGeometry` (brief: small sphere). Source contract asserts the *body* is no longer `<sphereGeometry args={[radius`.
- Tracker emoji (`⬜🔄✅⏭️`) still mapped internally in `PhaseBead` because `phase.status` from the snapshot is emoji; only the Html label is words.
- Design-spec extras not in the brief (collision-aware titles, camera-distance collapse to first word) were not added.

## Concerns

- Brief said OrgTheater should pass `previewWakeSlug` and `dept`. Only `previewWakeSlug` is a new prop; `dept` is already on `seat` and is read inside `SeatNode` for the pinstripe.
- Preview "dashed" torus is 12 short torus arcs at opacity 0.5, not `LineDashedMaterial`.

## Review fix: hover dwell across child meshes

**Finding:** `onPointerOver`/`onPointerOut` on the multi-child terminal `<group>` re-fired when the pointer crossed body, pip, pinstripe, and hover light — clearing and restarting the 150ms hover-card timer.

**Fix:** Switched to `onPointerEnter`/`onPointerLeave` on the same terminal group so enter/leave only fire at the group boundary.

**Commit:** `92d201b` — `fix(occ): keep seat hover-card dwell across child meshes`

**TDD:** Added source-contract assertion that SeatNode uses enter/leave and not over/out.

**Test command + results:**

```
cd tools/org-command-center && npm test -- src/jarvis/scene/nodes/SeatNode.test.tsx
```

PASS — 6 tests (1 file).
