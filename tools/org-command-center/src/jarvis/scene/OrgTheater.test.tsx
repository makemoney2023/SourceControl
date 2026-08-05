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
  Stars: () => null,
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

  it("stops starfield motion when reduced motion is active", () => {
    const source = readFileSync("src/jarvis/scene/OrgTheater.tsx", "utf8");
    expect(source).toContain("speed={reducedMotion ? 0 : 0.2}");
  });
});
