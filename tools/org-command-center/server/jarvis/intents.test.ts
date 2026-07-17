import { describe, expect, it } from "vitest";
import { parseJarvisAct } from "./intents";

describe("parseJarvisAct", () => {
  it("accepts mission.get", () => {
    expect(parseJarvisAct({ intent: "mission.get", args: {} }).intent).toBe("mission.get");
  });
  it("rejects unknown intent", () => {
    expect(() => parseJarvisAct({ intent: "spawn.anything", args: {} })).toThrow(/intent/);
  });
  it("accepts venture.create", () => {
    expect(parseJarvisAct({ intent: "venture.create", args: { name: "X" } }).intent).toBe(
      "venture.create",
    );
  });
  it("accepts architect mode.set args via parse still only checks intent", () => {
    expect(parseJarvisAct({ intent: "mode.set", args: { mode: "architect" } }).intent).toBe(
      "mode.set",
    );
  });
  it("accepts session.help", () => {
    expect(parseJarvisAct({ intent: "session.help", args: {} }).intent).toBe("session.help");
  });
  it("accepts session.repeat", () => {
    expect(parseJarvisAct({ intent: "session.repeat", args: {} }).intent).toBe("session.repeat");
  });
  it("accepts session.cancel_pending", () => {
    expect(parseJarvisAct({ intent: "session.cancel_pending", args: {} }).intent).toBe(
      "session.cancel_pending",
    );
  });
  it("accepts jarvis.ping", () => {
    expect(parseJarvisAct({ intent: "jarvis.ping", args: {} }).intent).toBe("jarvis.ping");
  });
  it("accepts brain.ask", () => {
    expect(
      parseJarvisAct({ intent: "brain.ask", args: { prompt: "What next?" } }).intent,
    ).toBe("brain.ask");
  });
  it("accepts phase.list_open", () => {
    expect(parseJarvisAct({ intent: "phase.list_open", args: {} }).intent).toBe("phase.list_open");
  });
  it("accepts digest.focus", () => {
    expect(parseJarvisAct({ intent: "digest.focus", args: { section: "blocked" } }).intent).toBe(
      "digest.focus",
    );
  });
  it("accepts blocker.list", () => {
    expect(parseJarvisAct({ intent: "blocker.list", args: {} }).intent).toBe("blocker.list");
  });
  it("accepts blocker.resolve", () => {
    expect(parseJarvisAct({ intent: "blocker.resolve", args: { seat: "market-research-analyst" } }).intent).toBe(
      "blocker.resolve",
    );
  });
  it("accepts dispatch.queue_batch", () => {
    expect(
      parseJarvisAct({
        intent: "dispatch.queue_batch",
        args: { items: [{ position: "cfo", goal: "Burn" }] },
      }).intent,
    ).toBe("dispatch.queue_batch");
  });
  it("accepts spawn.run_ready", () => {
    expect(parseJarvisAct({ intent: "spawn.run_ready", args: { limit: 2 } }).intent).toBe(
      "spawn.run_ready",
    );
  });
  it("accepts activity.tail", () => {
    expect(parseJarvisAct({ intent: "activity.tail", args: { n: 5 } }).intent).toBe("activity.tail");
  });
  it("accepts runs.watch", () => {
    expect(parseJarvisAct({ intent: "runs.watch", args: { limit: 10 } }).intent).toBe("runs.watch");
  });
  it("accepts run.instruct", () => {
    expect(parseJarvisAct({ intent: "run.instruct", args: { instruction: "Focus inbox" } }).intent).toBe(
      "run.instruct",
    );
  });
  it("accepts memory.note", () => {
    expect(parseJarvisAct({ intent: "memory.note", args: { text: "Remember MOF-303" } }).intent).toBe(
      "memory.note",
    );
  });
  it("accepts memory.recall", () => {
    expect(parseJarvisAct({ intent: "memory.recall", args: { query: "MOF sorbent" } }).intent).toBe(
      "memory.recall",
    );
  });
  it("accepts memory.brief", () => {
    expect(parseJarvisAct({ intent: "memory.brief", args: {} }).intent).toBe("memory.brief");
  });
});
