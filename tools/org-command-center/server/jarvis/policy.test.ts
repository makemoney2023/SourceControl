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
  it("denies venture.create in briefing", () => {
    expect(policyFor("venture.create", "briefing").allowed).toBe(false);
  });
  it("denies venture.create in ops", () => {
    expect(policyFor("venture.create", "ops").allowed).toBe(false);
  });
  it("allows venture.create in architect with confirm", () => {
    expect(policyFor("venture.create", "architect")).toEqual({
      allowed: true,
      needsConfirm: true,
    });
  });
  it("allows venture.list in briefing without confirm", () => {
    expect(policyFor("venture.list", "briefing")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
  });
  it("requires confirm for venture.switch in architect", () => {
    expect(policyFor("venture.switch", "architect").needsConfirm).toBe(true);
  });
});
