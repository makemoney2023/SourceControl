import { describe, expect, it } from "vitest";
import {
  HERO_CAMERA,
  HERO_FOG,
  HERO_GL,
  HERO_IDLE_ORBIT,
  HERO_LIGHTS,
  HERO_MATERIALS,
  HERO_SCENE_BG,
  assertHeroOrbitSafe,
} from "@/lib/hero-scene";

describe("HERO_SCENE lighting (threejs-lighting)", () => {
  it("uses hemisphere + key + fill + rim (not flat ambient-only)", () => {
    expect(HERO_LIGHTS.hemisphere).toBeDefined();
    expect(HERO_LIGHTS.key).toBeDefined();
    expect(HERO_LIGHTS.fill).toBeDefined();
    expect(HERO_LIGHTS.rim).toBeDefined();
    expect(HERO_LIGHTS.hemisphere.intensity).toBeGreaterThan(0);
    expect(HERO_LIGHTS.key.intensity).toBeGreaterThan(HERO_LIGHTS.fill.intensity);
  });

  it("keys light with brand tan, not pure white", () => {
    expect(HERO_LIGHTS.key.color.toLowerCase()).toBe("#c4a35a");
  });

  it("keeps ambient low so form reads (PBR)", () => {
    expect(HERO_LIGHTS.ambient.intensity).toBeLessThanOrEqual(0.25);
  });
});

describe("HERO_SCENE camera / fog / gl", () => {
  it("uses cinematic FOV and capped DPR", () => {
    expect(HERO_CAMERA.fov).toBeGreaterThanOrEqual(35);
    expect(HERO_CAMERA.fov).toBeLessThanOrEqual(50);
    expect(HERO_GL.dprMax).toBeLessThanOrEqual(1.75);
  });

  it("matches brand ground fog to scene background", () => {
    expect(HERO_SCENE_BG).toBe("#050505");
    expect(HERO_FOG.color).toBe(HERO_SCENE_BG);
    expect(HERO_FOG.far).toBeGreaterThan(HERO_FOG.near);
  });
});

describe("HERO_IDLE_ORBIT (threejs-interaction, no scroll-jack)", () => {
  it("disables pan and zoom; enables damping rotate only", () => {
    expect(HERO_IDLE_ORBIT.enablePan).toBe(false);
    expect(HERO_IDLE_ORBIT.enableZoom).toBe(false);
    expect(HERO_IDLE_ORBIT.enableRotate).toBe(true);
    expect(HERO_IDLE_ORBIT.enableDamping).toBe(true);
    expect(HERO_IDLE_ORBIT.autoRotate).toBe(true);
  });

  it("clamps polar angle so camera cannot go under the dog", () => {
    expect(HERO_IDLE_ORBIT.minPolarAngle).toBeGreaterThan(0.4);
    expect(HERO_IDLE_ORBIT.maxPolarAngle).toBeLessThan(Math.PI / 2 + 0.15);
    expect(HERO_IDLE_ORBIT.maxPolarAngle).toBeGreaterThan(
      HERO_IDLE_ORBIT.minPolarAngle,
    );
  });

  it("assertHeroOrbitSafe rejects scroll-jacking configs", () => {
    expect(() => assertHeroOrbitSafe(HERO_IDLE_ORBIT)).not.toThrow();
    expect(() =>
      assertHeroOrbitSafe({
        ...HERO_IDLE_ORBIT,
        enableZoom: true,
      }),
    ).toThrow(/zoom/i);
  });
});

describe("HERO_MATERIALS (threejs-materials)", () => {
  it("uses brand black/tan with non-shiny coat roughness", () => {
    expect(HERO_MATERIALS.coat.color.toLowerCase()).toBe("#1a1a1a");
    expect(HERO_MATERIALS.tan.color.toLowerCase()).toBe("#c4a35a");
    expect(HERO_MATERIALS.coat.roughness).toBeGreaterThanOrEqual(0.55);
    expect(HERO_MATERIALS.coat.metalness).toBeLessThanOrEqual(0.15);
  });
});
