import { describe, expect, it } from "vitest";
import { labelKindsForScope } from "./graph-labels";

describe("labelKindsForScope", () => {
  it("labels customers and initiatives on agency", () => {
    expect(labelKindsForScope("agency")).toEqual(["agency", "customer", "initiative"]);
  });
  it("labels seats on initiative", () => {
    expect(labelKindsForScope("initiative")).toContain("seat");
  });
});
