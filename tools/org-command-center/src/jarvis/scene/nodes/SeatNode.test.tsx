// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@react-three/fiber", () => ({
  useFrame: vi.fn(),
}));

vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

vi.mock("../../state/useJarvisStore", () => ({
  useJarvisStore: () => ({
    drawerOpen: false,
  }),
}));

import { SeatNode } from "./SeatNode";

afterEach(cleanup);

const seatSource = () => readFileSync("src/jarvis/scene/nodes/SeatNode.tsx", "utf8");
const beadSource = () => readFileSync("src/jarvis/scene/nodes/PhaseBead.tsx", "utf8");
const theaterSource = () => readFileSync("src/jarvis/scene/OrgTheater.tsx", "utf8");

describe("SeatNode source contract", () => {
  it("renders the seat title at rest when the drawer is closed", () => {
    render(
      <SeatNode
        seat={{ slug: "cfo", title: "CFO", level: "manager", dept: "finance", reportsTo: "ceo-strategist" }}
        position={{ x: 0, y: 0, z: 0 }}
        status="idle"
        reducedMotion
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText("CFO")).toBeTruthy();
  });

  it("uses rank silhouettes, dept pinstripe, and a status pip — not a status-washed sphere body", () => {
    const source = seatSource();
    expect(source).toMatch(/seat\.title/);
    expect(source).toMatch(/boxGeometry/);
    expect(source).toMatch(/0\.36/);
    expect(source).toMatch(/0\.22/);
    expect(source).toMatch(/cylinderGeometry/);
    expect(source).toMatch(/#1a2228/);
    expect(source).toMatch(/deptColor/);
    expect(source).toMatch(/STATUS_COLOR/);
    expect(source).not.toMatch(/<sphereGeometry args=\{\[radius/);
  });

  it("gazes at 1.02, dwells 150ms for the hover card, and previews a dashed torus", () => {
    const source = seatSource();
    expect(source).toMatch(/1\.02/);
    expect(source).toMatch(/150/);
    expect(source).toMatch(/previewWakeSlug/);
    expect(source).toMatch(/opacity=\{0\.5\}/);
  });

  it("uses pointer enter/leave on the terminal group so child crossings do not reset hover dwell", () => {
    const source = seatSource();
    expect(source).toMatch(/onPointerEnter/);
    expect(source).toMatch(/onPointerLeave/);
    expect(source).not.toMatch(/onPointerOver/);
    expect(source).not.toMatch(/onPointerOut/);
  });
});

describe("PhaseBead source contract", () => {
  it("sits on the table and labels phases in words, not emoji", () => {
    const source = beadSource();
    expect(source).toMatch(/y = 0\.06/);
    expect(source).toMatch(/Pending/);
    expect(source).toMatch(/In progress/);
    expect(source).toMatch(/Done/);
    expect(source).toMatch(/Skipped/);
    expect(source).not.toMatch(/\{phase\.name\} \{phase\.status\}/);
  });
});

describe("OrgTheater seat wiring", () => {
  it("passes previewWakeSlug into SeatNode", () => {
    const source = theaterSource();
    expect(source).toMatch(/previewWakeSlug/);
    expect(source).toMatch(/<SeatNode[\s\S]*previewWakeSlug/);
  });
});
