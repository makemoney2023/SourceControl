import { describe, expect, it } from "vitest";
import { needsYouSlugs, nextNeedsYouSlug } from "./needs-you";

describe("needsYou", () => {
  it("orders blocked before needs_input and skips other statuses", () => {
    expect(
      needsYouSlugs([
        { slug: "pm", status: "needs_input" },
        { slug: "cfo", status: "blocked" },
        { slug: "ceo-strategist", status: "running" },
      ]),
    ).toEqual(["cfo", "pm"]);
  });

  it("cycles forward and wraps", () => {
    expect(nextNeedsYouSlug(["cfo", "pm"], "cfo", 1)).toBe("pm");
    expect(nextNeedsYouSlug(["cfo", "pm"], "pm", 1)).toBe("cfo");
  });

  it("starts at the first slug when nothing is selected", () => {
    expect(nextNeedsYouSlug(["cfo", "pm"], null, 1)).toBe("cfo");
  });
});
