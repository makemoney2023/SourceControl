import { describe, expect, it } from "vitest";
import { shouldRecoverEmptySttConfirm } from "./confirm-recovery.js";

describe("shouldRecoverEmptySttConfirm", () => {
  it("recovers short empty-STT speech while Confirm? pending", () => {
    expect(
      shouldRecoverEmptySttConfirm({
        confirmPending: true,
        speechDurationMs: 450,
        committedHeard: false,
      }),
    ).toBe(true);
  });

  it("does not recover when STT already committed", () => {
    expect(
      shouldRecoverEmptySttConfirm({
        confirmPending: true,
        speechDurationMs: 450,
        committedHeard: true,
      }),
    ).toBe(false);
  });

  it("does not recover when nothing pending or speech too short/long", () => {
    expect(
      shouldRecoverEmptySttConfirm({
        confirmPending: false,
        speechDurationMs: 450,
        committedHeard: false,
      }),
    ).toBe(false);
    expect(
      shouldRecoverEmptySttConfirm({
        confirmPending: true,
        speechDurationMs: 50,
        committedHeard: false,
      }),
    ).toBe(false);
    expect(
      shouldRecoverEmptySttConfirm({
        confirmPending: true,
        speechDurationMs: 8000,
        committedHeard: false,
      }),
    ).toBe(false);
  });
});
