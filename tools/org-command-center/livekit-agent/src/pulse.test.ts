import { describe, expect, it } from "vitest";
import {
  parsePulseSnapshot,
  readJarvisPulseMs,
  shouldPulseSpeak,
  type PulseSnapshot,
} from "./pulse.js";

const snap = (blockerCount: number, currentPhase: string): PulseSnapshot => ({
  blockerCount,
  currentPhase,
});

describe("shouldPulseSpeak", () => {
  it("returns false when prev is null", () => {
    expect(shouldPulseSpeak(null, snap(0, "2"))).toBe(false);
  });

  it("returns false when blocker count and phase unchanged", () => {
    expect(shouldPulseSpeak(snap(1, "2"), snap(1, "2"))).toBe(false);
  });

  it("returns true when blocker count changed", () => {
    expect(shouldPulseSpeak(snap(0, "2"), snap(2, "2"))).toBe(true);
  });

  it("returns true when phase changed", () => {
    expect(shouldPulseSpeak(snap(1, "2"), snap(1, "3"))).toBe(true);
  });

  it("returns true when both changed", () => {
    expect(shouldPulseSpeak(snap(0, "1"), snap(3, "4"))).toBe(true);
  });
});

describe("parsePulseSnapshot", () => {
  it("extracts mission fields", () => {
    expect(
      parsePulseSnapshot({
        mission: { blockerCount: 2, currentPhase: "3" },
      }),
    ).toEqual({ blockerCount: 2, currentPhase: "3" });
  });

  it("returns null when mission is missing", () => {
    expect(parsePulseSnapshot({ spokenBrief: "hi" })).toBeNull();
  });
});

describe("readJarvisPulseMs", () => {
  it("defaults to 0", () => {
    const prev = process.env.JARVIS_PULSE_MS;
    delete process.env.JARVIS_PULSE_MS;
    expect(readJarvisPulseMs()).toBe(0);
    process.env.JARVIS_PULSE_MS = prev;
  });

  it("parses positive integer", () => {
    const prev = process.env.JARVIS_PULSE_MS;
    process.env.JARVIS_PULSE_MS = "300000";
    expect(readJarvisPulseMs()).toBe(300000);
    process.env.JARVIS_PULSE_MS = prev;
  });
});
