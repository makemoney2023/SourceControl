import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  consumeConfirm,
  createConfirmToken,
  getLastReportedSeat,
  getLastSummary,
  getRoomMode,
  getSeatAnswerDraft,
  patchSeatAnswerDraft,
  peekLatestConfirm,
  resetSessionForTests,
  seedSeatAnswerDraft,
  setLastReportedSeat,
  setLastSummary,
  setRoomMode,
} from "./session";

describe("session confirm tokens", () => {
  beforeEach(() => resetSessionForTests());
  afterEach(() => resetSessionForTests());

  it("creates and consumes a token", () => {
    const token = createConfirmToken("room-1", "spawn.run_next", {}, "ops");
    expect(token).toBeTruthy();
    const pending = consumeConfirm("room-1", token);
    expect(pending).toEqual({ intent: "spawn.run_next", args: {}, mode: "ops" });
  });

  it("returns null for unknown token", () => {
    expect(consumeConfirm("room-1", "bad-token")).toBeNull();
  });

  it("expires after 10 minutes", () => {
    vi.useFakeTimers();
    const token = createConfirmToken("room-1", "spawn.run_next", {}, "ops");
    vi.advanceTimersByTime(10 * 60_000 + 1);
    expect(consumeConfirm("room-1", token)).toBeNull();
    vi.useRealTimers();
  });

  it("replaces prior pending for the same room", () => {
    const first = createConfirmToken("room-1", "spawn.run_next", {}, "ops");
    const second = createConfirmToken("room-1", "work.request", { goal: "x" }, "ops");
    expect(consumeConfirm("room-1", first)).toBeNull();
    expect(consumeConfirm("room-1", second)?.intent).toBe("work.request");
  });

  it("is single-use", () => {
    const token = createConfirmToken("room-1", "spawn.run_next", {}, "ops");
    expect(consumeConfirm("room-1", token)).not.toBeNull();
    expect(consumeConfirm("room-1", token)).toBeNull();
  });

  it("scopes tokens to room", () => {
    const token = createConfirmToken("room-1", "spawn.run_next", {}, "ops");
    expect(consumeConfirm("room-2", token)).toBeNull();
  });
});

describe("room mode", () => {
  beforeEach(() => resetSessionForTests());
  afterEach(() => resetSessionForTests());

  it("defaults to briefing per room", () => {
    expect(getRoomMode("room-1")).toBe("briefing");
    expect(getRoomMode("room-2")).toBe("briefing");
  });

  it("persists mode per roomId", () => {
    setRoomMode("room-1", "ops");
    expect(getRoomMode("room-1")).toBe("ops");
    expect(getRoomMode("room-2")).toBe("briefing");
  });
});

describe("last summary", () => {
  beforeEach(() => resetSessionForTests());
  afterEach(() => resetSessionForTests());

  it("stores and retrieves per room", () => {
    setLastSummary("room-1", "Mission phase 2.");
    expect(getLastSummary("room-1")).toBe("Mission phase 2.");
    expect(getLastSummary("room-2")).toBeUndefined();
  });
});

describe("peekLatestConfirm", () => {
  beforeEach(() => resetSessionForTests());
  afterEach(() => resetSessionForTests());

  it("returns the single pending token for room", () => {
    createConfirmToken("room-1", "spawn.run_next", {}, "ops");
    const second = createConfirmToken("room-1", "agent.pause", { slug: "cfo" }, "ops");
    const latest = peekLatestConfirm("room-1");
    expect(latest?.token).toBe(second);
    expect(latest?.intent).toBe("agent.pause");
  });

  it("returns null when no pending", () => {
    expect(peekLatestConfirm("room-1")).toBeNull();
  });
});

describe("last reported seat + answer draft", () => {
  beforeEach(() => resetSessionForTests());
  afterEach(() => resetSessionForTests());

  it("remembers last reported seat per room", () => {
    setLastReportedSeat("r1", "market-research-analyst");
    expect(getLastReportedSeat("r1")).toBe("market-research-analyst");
    expect(getLastReportedSeat("r2")).toBeUndefined();
  });

  it("seeds draft and clears answers when seat changes", () => {
    seedSeatAnswerDraft("r1", "market-research-analyst", ["Q1?"]);
    patchSeatAnswerDraft("r1", {
      seat: "market-research-analyst",
      answers: { "Q1?": "A" },
    });
    expect(getSeatAnswerDraft("r1")?.answers["Q1?"]).toBe("A");
    seedSeatAnswerDraft("r1", "cfo", ["Budget?"]);
    expect(getSeatAnswerDraft("r1")).toEqual({
      seat: "cfo",
      openQuestions: ["Budget?"],
      answers: {},
    });
  });
});
