import { mkdtempSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import {
  appendRunEvent,
  eventCursor,
  listRunEvents,
  listRunEventsSince,
  runEventsPath,
  spokenAnnounceLine,
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

  it("listRunEventsSince returns events after cursor in chronological order", () => {
    const droot = tempDispatchRoot();
    appendRunEvent(droot, sampleEvent({ at: "2026-07-17T12:00:01.000Z", runId: "run-1", type: "started" }));
    appendRunEvent(
      droot,
      sampleEvent({ at: "2026-07-17T12:00:02.000Z", runId: "run-1", type: "finished" }),
    );
    appendRunEvent(
      droot,
      sampleEvent({
        at: "2026-07-17T12:00:03.000Z",
        runId: "run-2",
        type: "acceptance_failed",
        position: "cmo",
        detail: "inbox",
      }),
    );
    const first = listRunEventsSince(droot);
    expect(first.events.map((e) => e.type)).toEqual(["started", "finished", "acceptance_failed"]);
    expect(first.nextCursor).toBe(eventCursor(first.events[2]!));

    const after = listRunEventsSince(droot, eventCursor(first.events[0]!));
    expect(after.events.map((e) => `${e.runId}:${e.type}`)).toEqual([
      "run-1:finished",
      "run-2:acceptance_failed",
    ]);
  });

  it("spokenAnnounceLine covers terminal events without runIds", () => {
    expect(spokenAnnounceLine(sampleEvent({ type: "started" }))).toBeNull();
    const finished = spokenAnnounceLine(
      sampleEvent({ type: "finished", runId: "1784308096815-ceo-strategist" }),
    );
    expect(finished).toBe("CEO finished.");
    expect(finished).not.toMatch(/\d{6,}/);
    expect(
      spokenAnnounceLine(
        sampleEvent({ type: "acceptance_failed", detail: "inbox", position: "cmo" }),
      ),
    ).toBe("cmo finished with gaps: inbox.");
    expect(
      spokenAnnounceLine(sampleEvent({ type: "error", detail: "timeout", position: "cfo" })),
    ).toBe("cfo failed: timeout.");
  });
});
