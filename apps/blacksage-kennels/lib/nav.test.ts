import { describe, expect, it } from "vitest";
import { NAV_ITEMS } from "./nav";

describe("NAV_ITEMS", () => {
  it("renders all 5 nav links in locked order", () => {
    expect(NAV_ITEMS).toHaveLength(5);
    expect(NAV_ITEMS.map((item) => item.label)).toEqual([
      "Home",
      "Dogs",
      "Health/Education",
      "About",
      "Inquire",
    ]);
  });

  it("maps nav links to required routes", () => {
    expect(NAV_ITEMS.map((item) => item.href)).toEqual([
      "/",
      "/dogs",
      "/health",
      "/about",
      "/inquire",
    ]);
  });
});
