import { mkdtempSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import {
  appendRunEvent,
  listRunEvents,
  runEventsPath,
  summarizeRunEvents,
  type RunEvent,
} from "./run-events";

function tempDispatchRoot() {
  const root = mkdtempSync(join(tmpdir(), "run-events-"));
  mkdirSync(root, { recursive: true });
  return root;
}

function sampleEvent(overrides: Partial<RunEvent> = {}): RunEvent {
  return {
    at: "2026-07-17T12:00:00.000Z",
    type: "started",
    runId: "20260717-ceo-strategist",
    position: "ceo-strategist",
    ...overrides,
  };
}

describe("run-events", () => {
  it("appendRunEvent writes jsonl under DISPATCH/run-events.jsonl", () => {
    const droot = tempDispatchRoot();
    appendRunEvent(droot, sampleEvent());
    expect(runEventsPath(droot)).toMatch(/run-events\.jsonl$/);
    const events = listRunEvents(droot);
    expect(events).toHaveLength(1);
    expect(events[0]?.type).toBe("started");
    expect(events[0]?.runId).toBe("20260717-ceo-strategist");
  });

  it("listRunEvents returns newest first and caps at limit", () => {
    const droot = tempDispatchRoot();
    for (let i = 0; i < 55; i++) {
      appendRunEvent(
        droot,
        sampleEvent({
          at: `2026-07-17T12:00:${String(i).padStart(2, "0")}.000Z`,
          runId: `run-${i}`,
        }),
      );
    }
    const events = listRunEvents(droot, 50);
    expect(events).toHaveLength(50);
    expect(events[0]?.runId).toBe("run-54");
    expect(events[49]?.runId).toBe("run-5");
  });

  it("summarizeRunEvents speaks acceptance gaps plainly", () => {
    const summary = summarizeRunEvents([
      sampleEvent({
        type: "acceptance_failed",
        detail: "inbox",
      }),
    ]);
    expect(summary).toBe("CEO finished with gaps: inbox.");
  });

  it("summarizeRunEvents handles empty feed", () => {
    expect(summarizeRunEvents([])).toBe("No recent run events.");
  });
});
