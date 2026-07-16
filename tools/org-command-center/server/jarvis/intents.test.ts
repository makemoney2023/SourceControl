import { describe, expect, it } from "vitest";
import { parseJarvisAct } from "./intents";

describe("parseJarvisAct", () => {
  it("accepts mission.get", () => {
    expect(parseJarvisAct({ intent: "mission.get", args: {} }).intent).toBe("mission.get");
  });
  it("rejects unknown intent", () => {
    expect(() => parseJarvisAct({ intent: "spawn.anything", args: {} })).toThrow(/intent/);
  });
});
