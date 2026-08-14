# Income Stack Title Patch GLB Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the texturized Super Patch `.glb` on scene `01-title` with desktop pointer-follow tilt and mobile idle rock, without changing the GSAP scroll experience.

**Architecture:** Keep `SceneHero3d` as the title media slot. Add `Hero3dCanvas variant="patch"` that mounts `PatchHeroScene` (`useGLTF`). `?view=hero3d` keeps `variant="stack"` / `PhotorealStackScene`. Pure helpers in `pointerTilt.ts` and `patchFrame.ts` own the math.

**Tech Stack:** React 19, Vite, R3F, drei `useGLTF`, three.js, GSAP ScrollTrigger (unchanged), Vitest.

**Spec:** `docs/superpowers/specs/2026-08-14-income-stack-title-patch-glb-design.md`

**Repo:** Implement on a worktree of `deploy/affiliate-income-stack` (standalone [affiliateincomestack](https://github.com/SuperPatchAi/affiliateincomestack) tree: `src/` at repo root). Do not implement on ClaudeSkills `main`. Paths below are standalone-repo paths. Create the worktree at execution time via `superpowers:using-git-worktrees`.

## Global Constraints

- Title media is `public/models/superpatch-title.glb` (copy of `/Users/cbsuperpatch/Downloads/texturized-new.glb`).
- Desktop tilt: about ±18° yaw, ±12° pitch; spring back 300–400ms; no `OrbitControls`; no full spin; no intro whip.
- Mobile / coarse: idle rock only; no pointer tracking; swipe must still scroll.
- Patch sits in the upper ~60% of the viewport, above the lower-third scrim.
- `prefers-reduced-motion: reduce` and no-WebGL: do not mount the canvas; poster + copy only.
- GLB load failure: keep poster + copy; never a black empty plane.
- Do not change `01-title` copy, scenes 02–15, or delete `PhotorealStackScene`.
- TDD: failing tests before implementation on every task that adds logic.
- After code changes in the worktree, run `graphify update .` if `graphify` is available.

---

## File map

| File | Responsibility |
|------|----------------|
| `src/components/hero3d/pointerTilt.ts` | NDC → clamped yaw/pitch, damp, idle rock, motion mode |
| `src/components/hero3d/pointerTilt.test.ts` | Unit tests for tilt math |
| `src/components/hero3d/patchHero.ts` | Model URL, tilt/idle/frame constants |
| `src/components/hero3d/patchFrame.ts` | Bounding-box → scale + lift so the patch sits above the scrim |
| `src/components/hero3d/patchFrame.test.ts` | Unit tests for fit transform |
| `src/components/hero3d/PatchHeroScene.tsx` | R3F scene: GLB, lights, tilt / idle rock |
| `src/components/hero3d/Hero3dCanvas.tsx` | `variant: "patch" \| "stack"` |
| `src/components/experience/SceneHero3d.tsx` | Pass `variant="patch"`; poster-first; load-error fallback |
| `src/components/experience/SceneHero3d.test.tsx` | Poster / mount / reduced-motion / error |
| `src/components/experience/experience.css` | Title `touch-action: pan-y` so swipe scrolls |
| `src/components/Hero3dPreview.tsx` | Explicit `variant="stack"` |
| `public/models/superpatch-title.glb` | Checked-in patch asset |
| `src/App.test.tsx` | Preview still stack; add `data-hero3d-variant` |
| `src/components/experience/ExperienceShell.test.tsx` | Title still hero3d, no Omni video |
| `README.md` | Title GLB note |

---

### Task 1: Pointer-tilt helpers

**Files:**
- Create: `src/components/hero3d/pointerTilt.ts`
- Test: `src/components/hero3d/pointerTilt.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `type TiltPose = { yaw: number; pitch: number }`
  - `type MotionMode = "tilt" | "idle" | "none"`
  - `ndcFromPointer(clientX: number, clientY: number, rect: { left: number; top: number; width: number; height: number }): { x: number; y: number }`
  - `tiltFromNdc(ndc: { x: number; y: number }, yawMax: number, pitchMax: number): TiltPose`
  - `restPose(): TiltPose`
  - `motionMode(input: { coarsePointer: boolean; reducedMotion: boolean }): MotionMode`
  - `idleRockAt(elapsedSec: number, yawAmp: number, pitchAmp: number, hz: number): TiltPose`
  - `dampPose(current: TiltPose, target: TiltPose, dtSec: number, returnMs: number): TiltPose`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import {
  dampPose,
  idleRockAt,
  motionMode,
  ndcFromPointer,
  restPose,
  tiltFromNdc,
} from "./pointerTilt";

const YAW_MAX = (18 * Math.PI) / 180;
const PITCH_MAX = (12 * Math.PI) / 180;

describe("pointerTilt", () => {
  it("maps the rect center to NDC origin", () => {
    expect(
      ndcFromPointer(150, 100, { left: 0, top: 0, width: 300, height: 200 }),
    ).toEqual({ x: 0, y: 0 });
  });

  it("maps fine-pointer NDC to clamped yaw/pitch", () => {
    const center = tiltFromNdc({ x: 0, y: 0 }, YAW_MAX, PITCH_MAX);
    expect(center).toEqual({ yaw: 0, pitch: 0 });

    const far = tiltFromNdc({ x: 2, y: -2 }, YAW_MAX, PITCH_MAX);
    expect(far.yaw).toBeCloseTo(YAW_MAX);
    expect(far.pitch).toBeCloseTo(PITCH_MAX);
    expect(Math.abs(far.yaw)).toBeLessThanOrEqual(YAW_MAX);
    expect(Math.abs(far.pitch)).toBeLessThanOrEqual(PITCH_MAX);
  });

  it("returns rest pose on leave", () => {
    expect(restPose()).toEqual({ yaw: 0, pitch: 0 });
  });

  it("uses tilt on fine pointer, idle on coarse, none when reduced motion", () => {
    expect(motionMode({ coarsePointer: false, reducedMotion: false })).toBe(
      "tilt",
    );
    expect(motionMode({ coarsePointer: true, reducedMotion: false })).toBe(
      "idle",
    );
    expect(motionMode({ coarsePointer: false, reducedMotion: true })).toBe(
      "none",
    );
    expect(motionMode({ coarsePointer: true, reducedMotion: true })).toBe(
      "none",
    );
  });

  it("idle rock stays inside a few degrees and does not use pointer NDC", () => {
    const pose = idleRockAt(0.7, (3 * Math.PI) / 180, (1.5 * Math.PI) / 180, 0.18);
    expect(Math.abs(pose.yaw)).toBeLessThanOrEqual((3 * Math.PI) / 180 + 1e-9);
    expect(Math.abs(pose.pitch)).toBeLessThanOrEqual((1.5 * Math.PI) / 180 + 1e-9);
  });

  it("damps toward rest within the 300–400ms return window", () => {
    const start = { yaw: YAW_MAX, pitch: PITCH_MAX };
    const mid = dampPose(start, restPose(), 0.2, 350);
    expect(Math.abs(mid.yaw)).toBeLessThan(Math.abs(start.yaw));
    const end = dampPose(start, restPose(), 0.4, 350);
    expect(end.yaw).toBeCloseTo(0, 2);
    expect(end.pitch).toBeCloseTo(0, 2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/hero3d/pointerTilt.test.ts`

Expected: FAIL — `pointerTilt` module not found.

- [ ] **Step 3: Write minimal implementation**

```ts
export type TiltPose = { yaw: number; pitch: number };
export type MotionMode = "tilt" | "idle" | "none";

export function restPose(): TiltPose {
  return { yaw: 0, pitch: 0 };
}

export function ndcFromPointer(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
): { x: number; y: number } {
  const w = Math.max(1, rect.width);
  const h = Math.max(1, rect.height);
  return {
    x: ((clientX - rect.left) / w) * 2 - 1,
    y: -(((clientY - rect.top) / h) * 2 - 1),
  };
}

export function tiltFromNdc(
  ndc: { x: number; y: number },
  yawMax: number,
  pitchMax: number,
): TiltPose {
  const x = Math.min(1, Math.max(-1, ndc.x));
  const y = Math.min(1, Math.max(-1, ndc.y));
  return { yaw: x * yawMax, pitch: y * pitchMax };
}

export function motionMode(input: {
  coarsePointer: boolean;
  reducedMotion: boolean;
}): MotionMode {
  if (input.reducedMotion) return "none";
  return input.coarsePointer ? "idle" : "tilt";
}

export function idleRockAt(
  elapsedSec: number,
  yawAmp: number,
  pitchAmp: number,
  hz: number,
): TiltPose {
  const t = elapsedSec * hz * Math.PI * 2;
  return {
    yaw: Math.sin(t) * yawAmp,
    pitch: Math.cos(t * 0.85) * pitchAmp,
  };
}

export function dampPose(
  current: TiltPose,
  target: TiltPose,
  dtSec: number,
  returnMs: number,
): TiltPose {
  const tau = Math.max(0.001, returnMs / 1000);
  const alpha = 1 - Math.exp(-dtSec / tau);
  return {
    yaw: current.yaw + (target.yaw - current.yaw) * alpha,
    pitch: current.pitch + (target.pitch - current.pitch) * alpha,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/hero3d/pointerTilt.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/hero3d/pointerTilt.ts src/components/hero3d/pointerTilt.test.ts
git commit -m "feat(income-stack): add title patch pointer-tilt helpers"
```

---

### Task 2: Patch constants, framing helpers, and GLB asset

**Files:**
- Create: `src/components/hero3d/patchHero.ts`
- Create: `src/components/hero3d/patchFrame.ts`
- Test: `src/components/hero3d/patchFrame.test.ts`
- Create: `public/models/superpatch-title.glb` (copy from `/Users/cbsuperpatch/Downloads/texturized-new.glb`)

**Interfaces:**
- Consumes: nothing
- Produces:
  - `PATCH_MODEL_URL = "/models/superpatch-title.glb"`
  - `TILT_YAW_MAX`, `TILT_PITCH_MAX`, `TILT_RETURN_MS`
  - `IDLE_ROCK_YAW`, `IDLE_ROCK_PITCH`, `IDLE_ROCK_HZ`
  - `PATCH_TARGET_HEIGHT`, `PATCH_Y_LIFT`
  - `patchFitTransform(box: { min: Vec3; max: Vec3 }): { scale: number; position: Vec3 }`

- [ ] **Step 1: Copy the GLB into the app**

```bash
mkdir -p public/models
cp /Users/cbsuperpatch/Downloads/texturized-new.glb public/models/superpatch-title.glb
test -s public/models/superpatch-title.glb
```

Expected: file exists and is about 1.3 MB.

- [ ] **Step 2: Write the failing framing test**

```ts
import { describe, expect, it } from "vitest";
import { PATCH_TARGET_HEIGHT, PATCH_Y_LIFT } from "./patchHero";
import { patchFitTransform } from "./patchFrame";

describe("patchFitTransform", () => {
  it("scales a unit box to the target height and lifts it above the scrim", () => {
    const fit = patchFitTransform({
      min: { x: -0.5, y: -0.5, z: -0.5 },
      max: { x: 0.5, y: 0.5, z: 0.5 },
    });
    expect(fit.scale).toBeCloseTo(PATCH_TARGET_HEIGHT);
    expect(fit.position.y).toBeGreaterThan(0);
    expect(fit.position.y).toBeCloseTo(PATCH_Y_LIFT);
    expect(fit.position.x).toBeCloseTo(0);
    expect(fit.position.z).toBeCloseTo(0);
  });

  it("scales a taller box by height and still only lifts on Y", () => {
    const fit = patchFitTransform({
      min: { x: 2, y: 4, z: -1 },
      max: { x: 4, y: 6, z: 1 },
    });
    expect(fit.scale).toBeCloseTo(PATCH_TARGET_HEIGHT / 2);
    expect(fit.position.y).toBeCloseTo(PATCH_Y_LIFT);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- src/components/hero3d/patchFrame.test.ts`

Expected: FAIL — modules not found.

- [ ] **Step 4: Write constants and framing**

`src/components/hero3d/patchHero.ts`:

```ts
export const PATCH_MODEL_URL = "/models/superpatch-title.glb";

export const TILT_YAW_MAX = (18 * Math.PI) / 180;
export const TILT_PITCH_MAX = (12 * Math.PI) / 180;
export const TILT_RETURN_MS = 350;

export const IDLE_ROCK_YAW = (3 * Math.PI) / 180;
export const IDLE_ROCK_PITCH = (1.5 * Math.PI) / 180;
export const IDLE_ROCK_HZ = 0.18;

/** World-space height the fitted patch should occupy. */
export const PATCH_TARGET_HEIGHT = 1.55;
/** Lift the fitted origin so the patch sits in the open sky above the lower third. */
export const PATCH_Y_LIFT = 0.42;
```

`src/components/hero3d/patchFrame.ts`:

```ts
import { PATCH_TARGET_HEIGHT, PATCH_Y_LIFT } from "./patchHero";

export type Vec3 = { x: number; y: number; z: number };

export function patchFitTransform(box: {
  min: Vec3;
  max: Vec3;
}): { scale: number; position: Vec3 } {
  const sizeY = Math.max(1e-4, box.max.y - box.min.y);
  const scale = PATCH_TARGET_HEIGHT / sizeY;
  return {
    scale,
    position: { x: 0, y: PATCH_Y_LIFT, z: 0 },
  };
}
```

`patchFitTransform` returns uniform scale + Y lift only. Task 3 subtracts `box.getCenter()` on the primitive so a non-origin GLB is still optically centered.

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- src/components/hero3d/patchFrame.test.ts src/components/hero3d/pointerTilt.test.ts`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add public/models/superpatch-title.glb src/components/hero3d/patchHero.ts src/components/hero3d/patchFrame.ts src/components/hero3d/patchFrame.test.ts
git commit -m "feat(income-stack): add title patch asset and framing helpers"
```

---

### Task 3: PatchHeroScene

**Files:**
- Create: `src/components/hero3d/PatchHeroScene.tsx`

**Interfaces:**
- Consumes: `pointerTilt` helpers; `patchHero` constants; `patchFitTransform`; drei `useGLTF`; R3F `useFrame` / `useThree`
- Produces: `function PatchHeroScene(props: { reducedMotion: boolean; coarsePointer: boolean }): JSX.Element`

- [ ] **Step 1: Implement `PatchHeroScene`**

There is no reliable jsdom WebGL path for this component. Keep logic in the already-tested helpers. This file only wires them.

```tsx
import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { patchFitTransform } from "./patchFrame";
import {
  IDLE_ROCK_HZ,
  IDLE_ROCK_PITCH,
  IDLE_ROCK_YAW,
  PATCH_MODEL_URL,
  TILT_PITCH_MAX,
  TILT_RETURN_MS,
  TILT_YAW_MAX,
} from "./patchHero";
import {
  dampPose,
  idleRockAt,
  motionMode,
  ndcFromPointer,
  restPose,
  tiltFromNdc,
  type TiltPose,
} from "./pointerTilt";

type Props = {
  reducedMotion: boolean;
  coarsePointer: boolean;
};

export function PatchHeroScene({ reducedMotion, coarsePointer }: Props) {
  const { scene: gltfScene } = useGLTF(PATCH_MODEL_URL);
  const { gl, camera } = useThree();
  const group = useRef<THREE.Group>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const pose = useRef<TiltPose>(restPose());
  const elapsed = useRef(0);
  const mode = motionMode({ coarsePointer, reducedMotion });

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltfScene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const transform = patchFitTransform({
      min: { x: box.min.x, y: box.min.y, z: box.min.z },
      max: { x: box.max.x, y: box.max.y, z: box.max.z },
    });
    return {
      scale: transform.scale,
      lift: transform.position,
      center: { x: center.x, y: center.y, z: center.z },
    };
  }, [gltfScene]);

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.set(0, 0.55, 3.15);
      camera.lookAt(0, 0.55, 0);
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  useEffect(() => {
    const el = gl.domElement;
    const onMove = (event: PointerEvent) => {
      if (mode !== "tilt") return;
      const rect = el.getBoundingClientRect();
      pointer.current = ndcFromPointer(event.clientX, event.clientY, rect);
    };
    const onLeave = () => {
      pointer.current = null;
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [gl, mode]);

  useFrame((_, dt) => {
    elapsed.current += dt;
    const target =
      mode === "none"
        ? restPose()
        : mode === "idle"
          ? idleRockAt(
              elapsed.current,
              IDLE_ROCK_YAW,
              IDLE_ROCK_PITCH,
              IDLE_ROCK_HZ,
            )
          : pointer.current
            ? tiltFromNdc(pointer.current, TILT_YAW_MAX, TILT_PITCH_MAX)
            : restPose();
    pose.current = dampPose(pose.current, target, dt, TILT_RETURN_MS);
    const node = group.current;
    if (!node) return;
    node.rotation.order = "YXZ";
    node.rotation.y = pose.current.yaw;
    node.rotation.x = pose.current.pitch;
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[2.4, 3.2, 2.2]} intensity={1.15} />
      <directionalLight position={[-2.2, 1.4, -1.6]} intensity={0.35} />
      <directionalLight position={[0.2, 1.8, 3.4]} intensity={0.55} />
      <group
        ref={group}
        position={[fit.lift.x, fit.lift.y, fit.lift.z]}
        scale={fit.scale}
      >
        <primitive
          object={gltfScene}
          position={[
            -fit.center.x,
            -fit.center.y,
            -fit.center.z,
          ]}
        />
      </group>
    </>
  );
}

useGLTF.preload(PATCH_MODEL_URL);
```

- [ ] **Step 2: Typecheck the new file**

Run: `npx tsc -p tsconfig.app.json --noEmit`

Expected: no errors from `PatchHeroScene.tsx`. If `useGLTF` needs a module declaration, add `src/glb.d.ts`:

```ts
declare module "*.glb" {
  const src: string;
  export default src;
}
```

Do not add that file unless `tsc` fails. The model is loaded by URL string, not import.

- [ ] **Step 3: Commit**

```bash
git add src/components/hero3d/PatchHeroScene.tsx
git commit -m "feat(income-stack): add title PatchHeroScene"
```

---

### Task 4: Wire `variant` and keep scroll

**Files:**
- Modify: `src/components/hero3d/Hero3dCanvas.tsx`
- Modify: `src/components/experience/SceneHero3d.tsx`
- Modify: `src/components/Hero3dPreview.tsx`
- Modify: `src/components/experience/experience.css` (`.scene-hero3d` `touch-action`)
- Test: `src/components/experience/SceneHero3d.test.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes: `PatchHeroScene`; existing `PhotorealStackScene`
- Produces: `Hero3dCanvas` prop `variant?: "patch" | "stack"` (default `"stack"`); `data-hero3d-variant` on the canvas host

- [ ] **Step 1: Write SceneHero3d + App tests first**

`src/components/experience/SceneHero3d.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SceneHero3d } from "./SceneHero3d";

describe("SceneHero3d", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps the poster when reduced motion is on", () => {
    const { container } = render(
      <SceneHero3d
        active
        reducedMotion
        poster="/concepts/omni-chain/posters/16x9/sp-stack-01-title.webp"
        priority
      />,
    );
    expect(container.querySelector("[data-scene-poster]")).toBeTruthy();
    expect(container.querySelector("[data-hero3d-canvas]")).toBeNull();
  });

  it("mounts the patch canvas when active and WebGL works", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
      (type: string) =>
        type === "webgl2" || type === "webgl"
          ? ({} as WebGLRenderingContext)
          : null,
    );
    const { container } = render(
      <SceneHero3d
        active
        reducedMotion={false}
        poster="/concepts/omni-chain/posters/16x9/sp-stack-01-title.webp"
      />,
    );
    const canvas = container.querySelector("[data-hero3d-canvas]");
    expect(canvas).toBeTruthy();
    expect(canvas?.getAttribute("data-hero3d-variant")).toBe("patch");
  });
});
```

In `src/App.test.tsx`, inside the `?view=hero3d` test, add:

```ts
expect(
  shell?.querySelector("[data-hero3d-canvas]")?.getAttribute("data-hero3d-variant"),
).toBe("stack");
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/components/experience/SceneHero3d.test.tsx src/App.test.tsx`

Expected: FAIL — `SceneHero3d.test.tsx` missing and/or `data-hero3d-variant` absent.

- [ ] **Step 3: Add `variant` to `Hero3dCanvas`**

Change the props and render branch. Default remains `"stack"` so `?view=hero3d` is unchanged.

```tsx
type Hero3dVariant = "patch" | "stack";

type Props = {
  width: number;
  height: number;
  reducedMotion: boolean;
  embedded?: boolean;
  variant?: Hero3dVariant;
};
```

Destructure `variant = "stack"`. On the host div:

```tsx
data-hero3d-variant={variant}
style={{
  width: "100%",
  height: "100%",
  touchAction: variant === "patch" ? "pan-y" : "none",
}}
```

In `onCreated`, set `gl.domElement.style.touchAction` to `"pan-y"` when `variant === "patch"`, else `"none"`.

Camera for patch (front-on, no orbit start):

```tsx
camera={
  variant === "patch"
    ? { position: [0, 0.55, 3.15], fov: config.cameraFov, near: 0.05, far: 40 }
    : { position: [1.35, 1.15, 4.2], fov: config.cameraFov, near: 0.05, far: 40 }
}
```

`aria-label`: `"Super Patch title product"` when patch, keep the existing plate label when stack.

Replace the single `PhotorealStackScene` with:

```tsx
{variant === "patch" ? (
  <PatchHeroScene
    reducedMotion={reducedMotion}
    coarsePointer={viewport.coarsePointer}
  />
) : (
  <PhotorealStackScene
    focusIndex={focusIndex}
    config={config}
    reducedMotion={reducedMotion}
    onFocusPlate={setFocusIndex}
  />
)}
```

Import `PatchHeroScene` from `./PatchHeroScene`.

- [ ] **Step 4: Pass `variant="patch"` from `SceneHero3d`**

In the existing `Hero3dCanvas` JSX, add `variant="patch"`. Do not change the `active && !reducedMotion && webgl` mount gate.

- [ ] **Step 5: Pass `variant="stack"` from `Hero3dPreview`**

```tsx
<Hero3dCanvas
  width={viewport.width}
  height={viewport.height}
  reducedMotion={reducedMotion}
  variant="stack"
/>
```

- [ ] **Step 6: Allow title swipe-scroll**

In `src/components/experience/experience.css`, change:

```css
.scene-hero3d {
  z-index: 1;
  touch-action: none;
}
```

to:

```css
.scene-hero3d {
  z-index: 1;
  touch-action: pan-y;
}
```

Do not change `hero3dPreview.css` (`?view=hero3d` may still lock scroll for look-dev).

- [ ] **Step 7: Run the new and existing tests**

Run: `npm test -- src/components/experience/SceneHero3d.test.tsx src/App.test.tsx src/components/experience/ExperienceShell.test.tsx src/components/experience/hero3dExperienceSlide.test.ts`

Expected: PASS. Title scene still has `[data-scene-hero3d]`, no title `<video>`, copy unchanged. Preview variant is `stack`.

- [ ] **Step 8: Commit**

```bash
git add src/components/hero3d/Hero3dCanvas.tsx src/components/experience/SceneHero3d.tsx src/components/experience/SceneHero3d.test.tsx src/components/Hero3dPreview.tsx src/components/experience/experience.css src/App.test.tsx
git commit -m "feat(income-stack): mount the patch GLB on the title scene"
```

---

### Task 5: GLB failure fallback, docs, verify

**Files:**
- Modify: `src/components/experience/SceneHero3d.tsx`
- Modify: `src/components/experience/SceneHero3d.test.tsx`
- Modify: `README.md`

**Interfaces:**
- Consumes: existing `SceneHero3d` mount gate
- Produces: `onPatchError` / error boundary so a thrown `useGLTF` failure unmounts the canvas and leaves the poster at opacity 1

- [ ] **Step 1: Add a failing error-fallback test**

Append to `SceneHero3d.test.tsx`:

```tsx
it("keeps the poster when the patch canvas reports a load error", () => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    (type: string) =>
      type === "webgl2" || type === "webgl"
        ? ({} as WebGLRenderingContext)
        : null,
  );
  const { container } = render(
    <SceneHero3d
      active
      reducedMotion={false}
      poster="/concepts/omni-chain/posters/16x9/sp-stack-01-title.webp"
    />,
  );
  const host = container.querySelector("[data-scene-hero3d]");
  host?.dispatchEvent(new CustomEvent("hero3d-error", { bubbles: true }));
  expect(container.querySelector("[data-hero3d-canvas]")).toBeNull();
  expect(
    container.querySelector<HTMLImageElement>("[data-scene-poster]")?.style
      .opacity,
  ).not.toBe("0");
});
```

Prefer a React error boundary over a DOM custom event. If the custom-event approach is awkward in tests, export a tiny `PatchErrorBoundary` from `SceneHero3d.tsx` and trigger `onError` from a test child. The pass condition is: after error, no canvas, poster visible.

- [ ] **Step 2: Run the new test — expect fail**

Run: `npm test -- src/components/experience/SceneHero3d.test.tsx`

Expected: FAIL — no error fallback yet.

- [ ] **Step 3: Add the error boundary and unmount the canvas**

In `SceneHero3d.tsx`, add a class boundary and local `failed` state:

```tsx
import { Component, type ErrorInfo, type ReactNode, useEffect, useState, useRef } from "react";

type BoundaryProps = {
  onError: () => void;
  children: ReactNode;
};

class PatchErrorBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.props.onError();
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
```

`mountCanvas` becomes `active && !reducedMotion && webgl && !failed`.

Wrap `Hero3dCanvas` in `<PatchErrorBoundary onError={() => setFailed(true)}>`. Poster opacity uses `mountCanvas` so a failure restores the poster.

- [ ] **Step 4: Update README title-hero row**

In `README.md`, under the 3D scroll experience table (or the hero3d section if one exists), add:

```md
| Title scene | Interactive patch GLB (`public/models/superpatch-title.glb`) via `SceneHero3d` + `Hero3dCanvas variant="patch"`. Desktop pointer-follow tilt; mobile idle rock. Poster fallback. `?view=hero3d` still shows the photoreal plate stack. |
```

Do not rewrite the older “no Three.js” row into a lie — if that row is still present, change it to: layered DOM + GSAP for scenes 02–15; title scene may use R3F.

- [ ] **Step 5: Run the full unit suite**

Run: `npm test`

Expected: PASS. If `SceneHero3d` WebGL mock mounts R3F and jsdom throws, keep the test at the data-attribute / poster level and mock `Hero3dCanvas` in `SceneHero3d.test.tsx`:

```tsx
vi.mock("../hero3d/Hero3dCanvas", () => ({
  Hero3dCanvas: (props: { variant?: string }) => (
    <div data-hero3d-canvas data-hero3d-variant={props.variant ?? "stack"} />
  ),
}));
```

Use that mock if the real canvas crashes jsdom. Then throw from the mock when testing the error path.

- [ ] **Step 6: Visual check**

Run: `npm run dev`

1. Open the default experience. Scene 01 shows the patch above the lower-third copy.
2. Desktop: move the pointer — patch tilts a little and eases back. It never shows its back. Scroll still advances to scene 02 with the existing cover handoff.
3. Narrow / coarse: patch idles slightly; swipe still moves to scene 02.
4. `?view=hero3d` still shows the photoreal plate stack.
5. `?view=legacy` still shows `DeckShell`.

- [ ] **Step 7: Graphify + commit**

```bash
graphify update .
git add src/components/experience/SceneHero3d.tsx src/components/experience/SceneHero3d.test.tsx README.md
git commit -m "feat(income-stack): fall back to the title poster if the patch GLB fails"
```

---

## Self-review

| Spec requirement | Task |
|---|---|
| Replace title plate stack with GLB | 2 (asset), 3 (scene), 4 (wire) |
| Desktop pointer-follow tilt, clamped, spring back | 1, 3 |
| No OrbitControls / full spin / intro whip | 3, 4 (patch camera, no controls) |
| Mobile idle rock only | 1, 3 |
| Raised above scrim | 2, 3 |
| Scroll / copy / scenes 02–15 unchanged | 4 CSS `pan-y`; no slide copy edits |
| Reduced motion / no WebGL → poster | 4 mount gate; existing `SceneHero3d` |
| GLB failure → poster | 5 |
| `?view=hero3d` stays plate stack | 4 default `variant="stack"` |
| `isHero3dExperienceSlide("01-title")` | existing test, re-run in 4 |
| Implement on income-stack repo | plan header / worktree |
