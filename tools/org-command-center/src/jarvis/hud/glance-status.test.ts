import { describe, expect, it } from "vitest";
import { glanceStatusLine } from "./glance-status";

describe("glanceStatusLine", () => {
  it("prefers the top blocked headline over nextAction", () => {
    expect(
      glanceStatusLine({
        blockedSeats: [
          { title: "CFO", slug: "cfo", headline: "needs spend cap", status: "blocked" },
        ],
        nextAction: "Run research",
      }),
    ).toBe("CFO: needs spend cap");
  });

  it("falls back to nextAction when the rail is clear", () => {
    expect(glanceStatusLine({ blockedSeats: [], nextAction: "Run research" })).toBe(
      "Run research",
    );
  });

  it("truncates to 96 characters", () => {
    const line = glanceStatusLine({
      blockedSeats: [],
      nextAction: "x".repeat(120),
    });
    expect(line.length).toBe(96);
    expect(line.endsWith("…")).toBe(true);
  });
});
