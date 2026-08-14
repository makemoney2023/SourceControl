import { describe, expect, it } from "vitest";
import { DEPT_PALETTE, deptColor } from "./dept-color";

describe("deptColor", () => {
  it("is stable for the same department name", () => {
    expect(deptColor("product")).toBe(deptColor("product"));
  });

  it("maps onto the eight-swatch palette", () => {
    expect(DEPT_PALETTE).toHaveLength(8);
    expect(DEPT_PALETTE).toContain(deptColor("finance"));
  });
});
