import { describe, expect, it } from "vitest";
import { applyRefuseRules, containsBannedClaim, sanitizeActions } from "./gate";

describe("gate", () => {
  it("refuses when child in frame", () => {
    const result = applyRefuseRules({
      child_in_frame: true,
      refuse: false,
      refuse_reason: null,
      confidence: "high",
      confidence_note: "clear",
      signals: ["child visible"],
      gate_inputs: {},
      actions: ["step back"],
      stop_rule: "stop if growling",
      escalate: "call trainer",
      notes: "child in yard",
    });
    expect(result.refuse).toBe(true);
    expect(result.refuse_reason).toBe("kids-in-frame");
    expect(result.actions).toEqual([]);
  });

  it("does not auto-refuse on freeze alone", () => {
    const result = applyRefuseRules({
      child_in_frame: false,
      refuse: false,
      refuse_reason: null,
      confidence: "medium",
      confidence_note: "could change with clearer angle",
      signals: ["dog frozen at doorway"],
      gate_inputs: { freeze: true },
      actions: ["give space", "avoid leaning over"],
      stop_rule: "stop if snapping starts",
      escalate: "vet if injury suspected",
      notes: "still at threshold",
    });
    expect(result.refuse).toBe(false);
    expect(result.actions.length).toBeGreaterThan(0);
  });

  it("refuses on low confidence floor", () => {
    const result = applyRefuseRules({
      child_in_frame: false,
      refuse: false,
      refuse_reason: null,
      confidence: "low",
      confidence_note: "clip too dark",
      signals: [],
      gate_inputs: {},
      actions: [],
      stop_rule: "stop",
      escalate: "retry with light",
      notes: "unclear",
    });
    expect(result.refuse).toBe(true);
    expect(result.refuse_reason).toBe("confidence-floor");
  });

  it("strips banned claims from actions", () => {
    expect(containsBannedClaim("Your dog is relaxed and safe")).toBe(true);
    expect(sanitizeActions(["Give space", "Dog is safe to approach"])).toEqual([
      "Give space",
    ]);
  });
});
