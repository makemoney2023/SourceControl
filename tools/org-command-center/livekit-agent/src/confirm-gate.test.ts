import { describe, expect, it } from "vitest";
import { createConfirmGate } from "./confirm-gate.js";

describe("createConfirmGate", () => {
  it("tracks waiting state", () => {
    const gate = createConfirmGate();
    expect(gate.isWaiting()).toBe(false);
    gate.setWaiting(true);
    expect(gate.isWaiting()).toBe(true);
    gate.setWaiting(false);
    expect(gate.isWaiting()).toBe(false);
  });
});
