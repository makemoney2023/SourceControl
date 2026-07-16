import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  consumeConfirm,
  createConfirmToken,
  getRoomMode,
  resetSessionForTests,
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

  it("expires after 60s", () => {
    vi.useFakeTimers();
    const token = createConfirmToken("room-1", "spawn.run_next", {}, "ops");
    vi.advanceTimersByTime(61_000);
    expect(consumeConfirm("room-1", token)).toBeNull();
    vi.useRealTimers();
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
