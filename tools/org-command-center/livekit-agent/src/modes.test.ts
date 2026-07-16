import { describe, expect, it } from "vitest";
import {
  applyModeFromActResult,
  createModeState,
  modeAck,
  summarizeSetMode,
} from "./modes.js";

describe("createModeState", () => {
  it("defaults to briefing", () => {
    const state = createModeState();
    expect(state.getMode()).toBe("briefing");
  });

  it("updates local mode", () => {
    const state = createModeState();
    state.setMode("ops");
    expect(state.getMode()).toBe("ops");
  });
});

describe("applyModeFromActResult", () => {
  it("updates state from ok mode.set result", () => {
    const state = createModeState();
    const applied = applyModeFromActResult(state, {
      status: "ok",
      result: { ok: true, mode: "ops", previous: "briefing" },
    });
    expect(applied).toBe(true);
    expect(state.getMode()).toBe("ops");
  });

  it("ignores denied responses", () => {
    const state = createModeState();
    const applied = applyModeFromActResult(state, { status: "denied", reason: "nope" });
    expect(applied).toBe(false);
    expect(state.getMode()).toBe("briefing");
  });

  it("applyModeFromActResult accepts architect", () => {
    const state = createModeState("briefing");
    applyModeFromActResult(state, { status: "ok", result: { mode: "architect" } });
    expect(state.getMode()).toBe("architect");
  });
});

describe("modeAck", () => {
  it("returns spoken acknowledgement per mode", () => {
    expect(modeAck("ops")).toMatch(/ops/i);
    expect(modeAck("briefing")).toMatch(/briefing/i);
    expect(modeAck("review")).toMatch(/review/i);
  });

  it("modeAck describes architect", () => {
    expect(modeAck("architect")).toMatch(/architect/i);
  });
});

describe("summarizeSetMode", () => {
  it("includes acknowledgement on success", () => {
    const spoken = summarizeSetMode(
      { status: "ok", result: { ok: true, mode: "ops" } },
      "ops",
    );
    expect(spoken).toMatch(/ops/i);
  });

  it("passes through errors", () => {
    const spoken = summarizeSetMode({ status: "error", reason: "bad mode" }, "ops");
    expect(spoken).toMatch(/bad mode/i);
  });
});
