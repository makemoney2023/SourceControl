// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ "aria-hidden": ariaHidden }: ComponentProps<"canvas">) => (
    <canvas aria-hidden={ariaHidden} />
  ),
  useFrame: vi.fn(),
}));

vi.mock("@react-three/drei", () => ({
  CameraControls: () => null,
  ContactShadows: () => null,
  Html: () => null,
  MeshReflectorMaterial: () => null,
}));

vi.mock("@react-three/postprocessing", () => ({
  Bloom: () => null,
  EffectComposer: () => null,
  Vignette: () => null,
}));

vi.mock("../state/useJarvisStore", () => ({
  useJarvisStore: () => ({
    mode: "floor",
    selectedSlug: null,
    selectedPhase: null,
    selectedArtifact: null,
    beamActive: false,
    reducedMotion: false,
    bloomEnabled: false,
    selectSlug: vi.fn(),
    selectPhase: vi.fn(),
    selectArtifact: vi.fn(),
    setBeam: vi.fn(),
    followCam: true,
    orbiting: false,
    setOrbiting: vi.fn(),
  }),
}));

import { OrgTheater } from "./OrgTheater";

afterEach(cleanup);

describe("OrgTheater accessibility", () => {
  it("labels the surrounding region while hiding the decorative WebGL canvas", () => {
    render(<OrgTheater snapshot={{} as never} />);

    const region = screen.getByRole("region", { name: "Interactive organization theater" });
    expect(region.textContent).toContain("displayed keyboard shortcut");
    expect(region.querySelector("canvas")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not mount a starfield or bloom composer", () => {
    const source = readFileSync("src/jarvis/scene/OrgTheater.tsx", "utf8");
    expect(source).not.toMatch(/<Stars\b/);
    expect(source).not.toMatch(/EffectComposer/);
    expect(source).toMatch(/CommandTable/);
    expect(source).toMatch(/ambientLight/);
  });

  it("follows running seats only when idle and not orbiting", () => {
    const source = readFileSync("src/jarvis/scene/OrgTheater.tsx", "utf8");
    expect(source).toMatch(/followCam && !selectedSlug && !orbiting && !reducedMotion/);
    expect(source).toMatch(/followSlug/);
    expect(source).toMatch(/followCentroid/);
    expect(source).toMatch(/onStart=\{.*setOrbiting\(true\)/);
    expect(source).toMatch(/setOrbiting\(false\)/);
  });

  it("does not let decorative table meshes steal empty-table clicks", () => {
    const source = readFileSync("src/jarvis/scene/CommandTable.tsx", "utf8");
    const groupHandlesClick = /<group\b[\s\S]{0,80}onClick=/.test(source);
    const overlaySkipCount = (source.match(/raycast=\{null\}/g) ?? []).length;
    expect(groupHandlesClick || overlaySkipCount >= 5).toBe(true);
  });
});
