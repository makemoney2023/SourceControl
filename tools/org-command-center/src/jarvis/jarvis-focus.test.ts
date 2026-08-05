import { describe, expect, it } from "vitest";
import { latestJarvisFocus, parseJarvisFocusEvent } from "./jarvis-focus";

describe("parseJarvisFocusEvent", () => {
  it("returns null for non-focus events", () => {
    expect(parseJarvisFocusEvent({ at: "t", type: "spawn_started" })).toBeNull();
  });

  it("parses slug and phase", () => {
    expect(
      parseJarvisFocusEvent({
        at: "t",
        type: "jarvis.focus",
        slug: "ceo-strategist",
        phase: "4",
      }),
    ).toEqual({ slug: "ceo-strategist", phase: "4" });
  });

  it("falls back to position for slug", () => {
    expect(
      parseJarvisFocusEvent({
        at: "t",
        type: "jarvis.focus",
        position: "cto",
      }),
    ).toEqual({ slug: "cto" });
  });

  it("returns empty object for mission-only focus", () => {
    expect(parseJarvisFocusEvent({ at: "t", type: "jarvis.focus" })).toEqual({});
  });

  it("parses openReport and focusQuestions flags", () => {
    expect(
      parseJarvisFocusEvent({
        at: "t",
        type: "jarvis.focus",
        slug: "cmo",
        openReport: true,
        focusQuestions: true,
      }),
    ).toEqual({ slug: "cmo", openReport: true, focusQuestions: true });
  });
});

describe("latestJarvisFocus", () => {
  it("returns newest focus event", () => {
    expect(
      latestJarvisFocus([
        { at: "2", type: "jarvis.focus", slug: "cto" },
        { at: "1", type: "spawn_started" },
        { at: "0", type: "jarvis.focus", phase: "3" },
      ]),
    ).toEqual({ slug: "cto" });
  });

  it("returns null when no focus events", () => {
    expect(latestJarvisFocus([{ at: "1", type: "seat_paused" }])).toBeNull();
  });
});
