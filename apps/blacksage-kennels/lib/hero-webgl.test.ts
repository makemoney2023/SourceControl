import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isReduce3dEnabled,
  shouldEnableWebGL,
  type WebGLGateInput,
} from "@/lib/hero-webgl";

describe("shouldEnableWebGL", () => {
  const base: WebGLGateInput = {
    prefersReducedMotion: false,
    reduce3d: false,
    webglAvailable: true,
    heroModelAvailable: true,
  };

  it("returns true when all gates pass", () => {
    expect(shouldEnableWebGL(base)).toBe(true);
  });

  it("returns false when prefers-reduced-motion", () => {
    expect(shouldEnableWebGL({ ...base, prefersReducedMotion: true })).toBe(false);
  });

  it("returns false when REDUCE_3D is enabled", () => {
    expect(shouldEnableWebGL({ ...base, reduce3d: true })).toBe(false);
  });

  it("returns false when WebGL is unavailable", () => {
    expect(shouldEnableWebGL({ ...base, webglAvailable: false })).toBe(false);
  });

  it("still enables when hero GLB is absent (stand-in preview)", () => {
    expect(shouldEnableWebGL({ ...base, heroModelAvailable: false })).toBe(true);
  });
});

describe("isReduce3dEnabled", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns false when env is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_REDUCE_3D", "");
    expect(isReduce3dEnabled()).toBe(false);
  });

  it("returns true when env is true", () => {
    vi.stubEnv("NEXT_PUBLIC_REDUCE_3D", "true");
    expect(isReduce3dEnabled()).toBe(true);
  });

  it("returns true when env is 1", () => {
    vi.stubEnv("NEXT_PUBLIC_REDUCE_3D", "1");
    expect(isReduce3dEnabled()).toBe(true);
  });
});
