import { describe, expect, it } from "vitest";
import { selectAnnounceEvents, shouldPollEvents } from "./completion-announce.js";

describe("shouldPollEvents", () => {
  it("polls when active", () => {
    expect(shouldPollEvents(true, null, 1000)).toBe(true);
  });

  it("polls within 30s of last terminal", () => {
    expect(shouldPollEvents(false, 1000, 1000 + 29_000)).toBe(true);
    expect(shouldPollEvents(false, 1000, 1000 + 31_000)).toBe(false);
  });

  it("idle when no active and no terminal", () => {
    expect(shouldPollEvents(false, null, 1000)).toBe(false);
  });
});

describe("selectAnnounceEvents", () => {
  const ev = {
    at: "t",
    type: "finished",
    runId: "r1",
    position: "cmo",
    cursor: "c1",
    spoken: "cmo finished.",
  };

  it("defers while waiting for confirm", () => {
    const out = selectAnnounceEvents([ev], new Set(), true);
    expect(out.speak).toEqual([]);
    expect(out.mark).toEqual([]);
  });

  it("dedupes by cursor and speaks once", () => {
    const announced = new Set<string>();
    const first = selectAnnounceEvents([ev], announced, false);
    expect(first.speak).toEqual(["cmo finished."]);
    for (const k of first.mark) announced.add(k);
    const second = selectAnnounceEvents([ev], announced, false);
    expect(second.speak).toEqual([]);
    expect(second.mark).toEqual([]);
  });
});
