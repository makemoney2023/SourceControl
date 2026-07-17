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
  it("requires confirm for spawn.run in Ops", () => {
    expect(policyFor("spawn.run", "ops")).toEqual({
      allowed: true,
      needsConfirm: true,
    });
  });
  it("requires confirm for run.instruct in Ops", () => {
    expect(policyFor("run.instruct", "ops")).toEqual({
      allowed: true,
      needsConfirm: true,
    });
  });
  it("denies run.instruct in Briefing mode", () => {
    expect(policyFor("run.instruct", "briefing").allowed).toBe(false);
  });
  it("denies spawn.run in Briefing mode", () => {
    expect(policyFor("spawn.run", "briefing").allowed).toBe(false);
  });
  it("allows runs.get in ops without confirm", () => {
    expect(policyFor("runs.get", "ops")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
  });
  it("allows runs.watch in any mode without confirm", () => {
    expect(policyFor("runs.watch", "briefing")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
    expect(policyFor("runs.watch", "ops")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
    expect(policyFor("runs.watch", "review")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
  });
  it("allows routine.list in ops without confirm", () => {
    expect(policyFor("routine.list", "ops")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
  });
  it("allows handoff.list in review without confirm", () => {
    expect(policyFor("handoff.list", "review")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
  });
  it("allows briefing.pin in ops without confirm", () => {
    expect(policyFor("briefing.pin", "ops")).toEqual({
      allowed: true,
      needsConfirm: false,
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
  it("always denies agent.spawn_ic", () => {
    for (const mode of ["briefing", "ops", "review", "architect"] as const) {
      expect(policyFor("agent.spawn_ic", mode).allowed).toBe(false);
    }
  });
  it("dispatch.queue_for needs confirm in ops", () => {
    expect(policyFor("dispatch.queue_for", "ops")).toEqual({
      allowed: true,
      needsConfirm: true,
    });
  });
  it("dispatch.queue_for denied in briefing", () => {
    expect(policyFor("dispatch.queue_for", "briefing").allowed).toBe(false);
  });
  it("work.request needs confirm in ops", () => {
    expect(policyFor("work.request", "ops")).toEqual({
      allowed: true,
      needsConfirm: true,
    });
  });
  it("work.request denied in briefing", () => {
    expect(policyFor("work.request", "briefing").allowed).toBe(false);
  });
  it("work.request denied in review with ops guidance", () => {
    const p = policyFor("work.request", "review");
    expect(p.allowed).toBe(false);
    expect(p.reason).toMatch(/Ops/i);
  });
  it("work.intake_save denied in review", () => {
    expect(policyFor("work.intake_save", "review").allowed).toBe(false);
  });
  it("csuite.draft still allowed in review with confirm", () => {
    expect(policyFor("csuite.draft", "review")).toEqual({
      allowed: true,
      needsConfirm: true,
    });
  });
  it("work.resolve allowed in briefing without confirm", () => {
    expect(policyFor("work.resolve", "briefing")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
  });
  it("dispatch.preview allowed in ops without confirm", () => {
    expect(policyFor("dispatch.preview", "ops")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
  });
  it("session.help allowed in any mode without confirm", () => {
    expect(policyFor("session.help", "briefing")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
    expect(policyFor("session.help", "architect")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
  });
  it("session.repeat allowed in any mode without confirm", () => {
    expect(policyFor("session.repeat", "ops")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
  });
  it("jarvis.ping allowed in any mode without confirm", () => {
    expect(policyFor("jarvis.ping", "briefing")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
  });
  it("phase.list_open allowed in briefing without confirm", () => {
    expect(policyFor("phase.list_open", "briefing")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
  });
  it("digest.focus allowed in briefing without confirm", () => {
    expect(policyFor("digest.focus", "briefing")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
  });
  it("blocker.list allowed in any mode without confirm", () => {
    expect(policyFor("blocker.list", "briefing")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
    expect(policyFor("blocker.list", "ops")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
    expect(policyFor("blocker.list", "review")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
  });
  it("blocker.resolve requires ops and hard confirm", () => {
    expect(policyFor("blocker.resolve", "briefing")).toEqual({
      allowed: false,
      needsConfirm: false,
      reason: "Switch to Ops mode first",
    });
    expect(policyFor("blocker.resolve", "ops")).toEqual({
      allowed: true,
      needsConfirm: true,
    });
  });
  it("dispatch.queue_batch requires ops and confirm", () => {
    expect(policyFor("dispatch.queue_batch", "briefing")).toEqual({
      allowed: false,
      needsConfirm: false,
      reason: "Switch to Ops mode first",
    });
    expect(policyFor("dispatch.queue_batch", "ops")).toEqual({
      allowed: true,
      needsConfirm: true,
    });
  });
  it("spawn.run_ready requires ops and hard confirm", () => {
    expect(policyFor("spawn.run_ready", "briefing")).toEqual({
      allowed: false,
      needsConfirm: false,
      reason: "Switch to Ops mode first",
    });
    expect(policyFor("spawn.run_ready", "ops")).toEqual({
      allowed: true,
      needsConfirm: true,
    });
  });
  it("activity.tail allowed in briefing without confirm", () => {
    expect(policyFor("activity.tail", "briefing")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
  });
  it("session.cancel_pending denied in briefing", () => {
    expect(policyFor("session.cancel_pending", "briefing").allowed).toBe(false);
  });
  it("session.cancel_pending denied in review", () => {
    expect(policyFor("session.cancel_pending", "review").allowed).toBe(false);
  });
  it("session.cancel_pending allowed in ops without confirm", () => {
    expect(policyFor("session.cancel_pending", "ops")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
  });
  it("session.cancel_pending allowed in architect without confirm", () => {
    expect(policyFor("session.cancel_pending", "architect")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
  });
});
