import { describe, expect, it } from "vitest";
import {
  latestJarvisFocus,
  parseJarvisFocusEvent,
  resolveJarvisFocusApply,
} from "./jarvis-focus";

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
    ).toEqual({ at: "t", slug: "ceo-strategist", phase: "4" });
  });

  it("falls back to position for slug", () => {
    expect(
      parseJarvisFocusEvent({
        at: "t",
        type: "jarvis.focus",
        position: "cto",
      }),
    ).toEqual({ at: "t", slug: "cto" });
  });

  it("returns empty object for mission-only focus", () => {
    expect(parseJarvisFocusEvent({ at: "t", type: "jarvis.focus" })).toEqual({
      at: "t",
    });
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
    ).toEqual({
      at: "t",
      slug: "cmo",
      openReport: true,
      focusQuestions: true,
    });
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
    ).toEqual({ at: "2", slug: "cto" });
  });

  it("returns null when no focus events", () => {
    expect(latestJarvisFocus([{ at: "1", type: "seat_paused" }])).toBeNull();
  });
});

describe("resolveJarvisFocusApply", () => {
  const staleOpenReport: ReturnType<typeof parseJarvisFocusEvent> = {
    at: "2026-08-05T19:56:14.542Z",
    slug: "head-of-product",
    openReport: true,
    focusQuestions: true,
  };

  it("on first hydrate selects the seat but strips auto-open report flags", () => {
    const { apply, next } = resolveJarvisFocusApply(staleOpenReport, {
      hydrated: false,
      lastAppliedAt: null,
    });
    expect(apply).toEqual({
      at: "2026-08-05T19:56:14.542Z",
      slug: "head-of-product",
    });
    expect(apply?.openReport).toBeUndefined();
    expect(next).toEqual({
      hydrated: true,
      lastAppliedAt: "2026-08-05T19:56:14.542Z",
    });
  });

  it("ignores the same focus event on later syncs so closing the report sticks", () => {
    const state = {
      hydrated: true,
      lastAppliedAt: "2026-08-05T19:56:14.542Z",
    };
    const { apply, next } = resolveJarvisFocusApply(staleOpenReport, state);
    expect(apply).toBeNull();
    expect(next).toEqual(state);
  });

  it("applies a newer focus event including openReport", () => {
    const { apply, next } = resolveJarvisFocusApply(
      {
        at: "2026-08-06T14:00:00.000Z",
        slug: "cmo",
        openReport: true,
        focusQuestions: true,
      },
      {
        hydrated: true,
        lastAppliedAt: "2026-08-05T19:56:14.542Z",
      },
    );
    expect(apply).toEqual({
      at: "2026-08-06T14:00:00.000Z",
      slug: "cmo",
      openReport: true,
      focusQuestions: true,
    });
    expect(next.lastAppliedAt).toBe("2026-08-06T14:00:00.000Z");
  });
});
