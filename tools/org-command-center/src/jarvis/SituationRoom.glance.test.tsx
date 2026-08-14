// @vitest-environment jsdom

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const situationSource = () => readFileSync("src/jarvis/SituationRoom.tsx", "utf8");
const seatSource = () => readFileSync("src/jarvis/scene/nodes/SeatNode.tsx", "utf8");
const theaterSource = () => readFileSync("src/jarvis/scene/OrgTheater.tsx", "utf8");

describe("SituationRoom glance overlays", () => {
  it("does not mount the threat rail when there are no blocked seats", () => {
    const source = situationSource();
    expect(source).toMatch(/blockedSeats\.length > 0/);
    expect(source).toMatch(/selectedSlug &&/);
  });

  it("omits the theater C-suite aside and activity footer", () => {
    const source = situationSource();
    expect(source).not.toMatch(/j-stage-overlay-bottom/);
    expect(source).not.toMatch(/j-stage-overlay-left[\s\S]{0,400}C-Suite/);
  });

  it("routes Esc / j / k through glanceKeyAction and nextNeedsYouSlug", () => {
    const source = situationSource();
    expect(source).toMatch(/glanceKeyAction/);
    expect(source).toMatch(/nextNeedsYouSlug/);
    expect(source).toMatch(/needsYouSlugs/);
    expect(source).toMatch(/addEventListener\("keydown"/);
  });
});

describe("SeatNode double-click report", () => {
  it("opens the report from onDoubleClick via onOpenReport", () => {
    const source = seatSource();
    expect(source).toMatch(/onDoubleClick/);
    expect(source).toMatch(/onOpenReport\?\.\(slug\)/);
  });

  it("threads onOpenReport from OrgTheater into SeatNode", () => {
    const source = theaterSource();
    expect(source).toMatch(/onOpenReport/);
    expect(source).toMatch(/<SeatNode[\s\S]*onOpenReport/);
  });
});
