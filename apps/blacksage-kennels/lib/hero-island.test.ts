import { describe, expect, it } from "vitest";
import { resolveHeroDisplayMode } from "@/lib/hero-island";

describe("resolveHeroDisplayMode", () => {
  it("uses poster when WebGL gates fail", () => {
    expect(
      resolveHeroDisplayMode({
        prefersReducedMotion: true,
        reduce3d: false,
        webglAvailable: true,
        heroModelAvailable: true,
      }),
    ).toBe("poster");
  });

  it("uses canvas with stand-in when hero GLB is unavailable", () => {
    expect(
      resolveHeroDisplayMode({
        prefersReducedMotion: false,
        reduce3d: false,
        webglAvailable: true,
        heroModelAvailable: false,
      }),
    ).toBe("canvas");
  });

  it("uses canvas when all gates pass", () => {
    expect(
      resolveHeroDisplayMode({
        prefersReducedMotion: false,
        reduce3d: false,
        webglAvailable: true,
        heroModelAvailable: true,
      }),
    ).toBe("canvas");
  });
});
