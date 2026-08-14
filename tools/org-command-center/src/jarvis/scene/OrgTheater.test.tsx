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
  useThree: () => ({
    camera: { position: { length: () => 12 }, project: () => {} },
    size: { width: 800, height: 600 },
  }),
}));

vi.mock("@react-three/drei", () => ({
  CameraControls: () => null,
  ContactShadows: () => null,
  Environment: () => null,
  Html: () => null,
  MeshReflectorMaterial: () => null,
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
    expect(source).toMatch(/hemisphereLight/);
    expect(source).not.toMatch(/ambientLight/);
    expect(source).toMatch(/ACESFilmicToneMapping/);
    expect(source).toMatch(/toneMappingExposure:\s*1\.05/);
    expect(source).toMatch(/<Environment preset="studio"/);
    expect(source).toMatch(/minDistance=\{5\}/);
    expect(source).toMatch(/maxDistance=\{20\}/);
  });

  it("uses a beveled clearcoat lip and lathe dais, not a 0.05 torus rim", () => {
    const source = readFileSync("src/jarvis/scene/CommandTable.tsx", "utf8");
    expect(source).toMatch(/extrudeGeometry|ExtrudeGeometry/);
    expect(source).toMatch(/clearcoat/);
    expect(source).toMatch(/latheGeometry|LatheGeometry/);
    expect(source).toMatch(/EdgesGeometry|edgesGeometry/);
    expect(source).not.toMatch(/torusGeometry args=\{\[TABLE_RADIUS, 0\.05/);
  });

  it("follows running seats only when idle and not orbiting", () => {
    const source = readFileSync("src/jarvis/scene/OrgTheater.tsx", "utf8");
    expect(source).toMatch(/followCam && !selectedSlug && !orbiting && !reducedMotion/);
    expect(source).toMatch(/followSlug/);
    expect(source).toMatch(/followCentroid/);
    expect(source).toMatch(/onStart=\{.*setOrbiting\(true\)/);
    expect(source).toMatch(/setOrbiting\(false\)/);
  });

  it("collides Glance titles at most every 100ms and yields on inspect", () => {
    const source = readFileSync("src/jarvis/scene/OrgTheater.tsx", "utf8");
    expect(source).toMatch(/collideSeatLabels/);
    expect(source).toMatch(/visibleSeatLabels/);
    expect(source).toMatch(/labelText=/);
    expect(source).toMatch(/100/);
  });

  it("includes word statuses on the phase rail", () => {
    const theater = readFileSync("src/jarvis/scene/OrgTheater.tsx", "utf8");
    const beads = readFileSync("src/jarvis/scene/nodes/PhaseBead.tsx", "utf8");
    expect(beads).toMatch(/export function isPhaseRailStatus/);
    expect(theater).toMatch(/isPhaseRailStatus/);
    expect(beads).toMatch(/"Pending"/);
    expect(beads).toMatch(/"In progress"/);
    expect(beads).toMatch(/"Done"/);
    expect(beads).toMatch(/"Skipped"/);
  });

  it("does not let decorative table meshes steal empty-table clicks", () => {
    const source = readFileSync("src/jarvis/scene/CommandTable.tsx", "utf8");
    const groupHandlesClick = /<group\b[\s\S]{0,80}onClick=/.test(source);
    const overlaySkipCount = (source.match(/raycast=\{null\}/g) ?? []).length;
    expect(groupHandlesClick || overlaySkipCount >= 5).toBe(true);
    expect(source).toMatch(/htmlPointerRecently/);
  });
});
