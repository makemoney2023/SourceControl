import { describe, expect, it } from "vitest";
import { formatActivityLine } from "./activity-ui";

describe("formatActivityLine", () => {
  it("formats time type position runId detail", () => {
    expect(
      formatActivityLine({
        at: "2026-07-16T14:30:05.000Z",
        type: "spawn_started",
        position: "cto",
        runId: "1-cto",
        detail: "run_next",
      }),
    ).toBe("14:30:05 · spawn_started · cto · 1-cto — run_next");
  });

  it("handles sparse events", () => {
    expect(formatActivityLine({ at: "", type: "seat_paused" })).toBe(
      "--:--:-- · seat_paused",
    );
  });
});
