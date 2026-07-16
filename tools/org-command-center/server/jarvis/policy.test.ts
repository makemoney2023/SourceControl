import { describe, expect, it } from "vitest";
import { policyFor } from "./policy";

describe("policyFor", () => {
  it("allows mission.get in Briefing without confirm", () => {
    expect(policyFor("mission.get", "briefing")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
  });
  it("denies spawn.run_next in Briefing mode", () => {
    expect(policyFor("spawn.run_next", "briefing").allowed).toBe(false);
  });
  it("requires confirm for spawn.run_next in Ops", () => {
    expect(policyFor("spawn.run_next", "ops")).toEqual({
      allowed: true,
      needsConfirm: true,
    });
  });
});
