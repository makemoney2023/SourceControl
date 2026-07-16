import { describe, expect, it } from "vitest";
import { resolveEscalationSecondaries } from "./escalation";

describe("resolveEscalationSecondaries", () => {
  it("maps tags to secondaries", () => {
    expect(resolveEscalationSecondaries(["legal", "brand"])).toEqual([
      "coo",
      "creative-director",
    ]);
    expect(resolveEscalationSecondaries(["spend"])).toEqual(["cfo"]);
  });

  it("dedupes and ignores unknown", () => {
    expect(resolveEscalationSecondaries(["evidence", "evidence", "nope"])).toEqual([
      "head-of-research",
    ]);
  });
});
