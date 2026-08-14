import { describe, expect, it } from "vitest";
import { labelKindsForScope, legendForNodes } from "./graph-labels";

describe("labelKindsForScope", () => {
  it("labels customers and initiatives on agency", () => {
    expect(labelKindsForScope("agency")).toEqual(["agency", "customer", "initiative"]);
  });
  it("labels seats on initiative", () => {
    expect(labelKindsForScope("initiative")).toContain("seat");
  });
});

describe("legendForNodes", () => {
  it("hides kinds that are not in the current graph", () => {
    const kinds = legendForNodes([
      { kind: "agency" },
      { kind: "customer" },
      { kind: "initiative" },
    ]).map((item) => item.kind);
    expect(kinds).toEqual(["agency", "customer", "initiative"]);
    expect(kinds).not.toContain("seat");
    expect(kinds).not.toContain("handoff");
  });
});
