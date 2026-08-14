import { describe, expect, it } from "vitest";
import { BRIEF_ECHO_THRESHOLD, briefJaccard, findBriefEcho } from "./handoff-discipline";

const PM = `We drafted the product requirements slice for Sieger Show Secretary—the software that turns a judge's spoken ringside critique into an approved PDF emailed to the dog owner. The PRD honors every lock you already set: multi-show with login, four selectable rulebooks.`;
const HOP = `We completed the product requirements document for Sieger Show Secretary—the software that captures a judge’s spoken critique outdoors, turns it into a draft PDF the show secretary can edit and approve. Every lock you set in Phase 0 is in the PRD: multi-show with login, four selectable rulebooks.`;
const DELTA = `Merged 47 acceptance criteria onto PM stories US-001–US-021. Remapped BA ACs. Three register items still open: O2, B1, B3.`;

describe("briefJaccard", () => {
  it("scores the Sieger PM/HoP echo above the threshold", () => {
    expect(briefJaccard(PM, HOP)).toBeGreaterThan(BRIEF_ECHO_THRESHOLD);
  });

  it("scores a delta brief below the threshold against the product story", () => {
    expect(briefJaccard(HOP, DELTA)).toBeLessThan(BRIEF_ECHO_THRESHOLD);
  });
});

describe("findBriefEcho", () => {
  it("returns the other filename when overlap exceeds threshold", () => {
    expect(
      findBriefEcho(HOP, [{ filename: "5-product-manager.md", brief: PM }]),
    ).toBe("5-product-manager.md");
  });

  it("returns null when the candidate is a delta", () => {
    expect(
      findBriefEcho(DELTA, [{ filename: "5-product-manager.md", brief: PM }]),
    ).toBeNull();
  });
});
