import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { consumeConfirm, createConfirmToken, resetSessionForTests } from "./session";

describe("session confirm tokens", () => {
  beforeEach(() => resetSessionForTests());
  afterEach(() => resetSessionForTests());

  it("creates and consumes a token", () => {
    const token = createConfirmToken("room-1", "spawn.run_next", {});
    expect(token).toBeTruthy();
    const pending = consumeConfirm("room-1", token);
    expect(pending).toEqual({ intent: "spawn.run_next", args: {} });
  });

  it("returns null for unknown token", () => {
    expect(consumeConfirm("room-1", "bad-token")).toBeNull();
  });

  it("expires after 60s", () => {
    vi.useFakeTimers();
    const token = createConfirmToken("room-1", "spawn.run_next", {});
    vi.advanceTimersByTime(61_000);
    expect(consumeConfirm("room-1", token)).toBeNull();
    vi.useRealTimers();
  });

  it("is single-use", () => {
    const token = createConfirmToken("room-1", "spawn.run_next", {});
    expect(consumeConfirm("room-1", token)).not.toBeNull();
    expect(consumeConfirm("room-1", token)).toBeNull();
  });

  it("scopes tokens to room", () => {
    const token = createConfirmToken("room-1", "spawn.run_next", {});
    expect(consumeConfirm("room-2", token)).toBeNull();
  });
});
