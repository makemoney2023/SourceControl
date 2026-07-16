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
});
