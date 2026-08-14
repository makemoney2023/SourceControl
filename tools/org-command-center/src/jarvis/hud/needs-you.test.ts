import { describe, expect, it } from "vitest";
import { glanceKeyAction, needsYouSlugs, nextNeedsYouSlug } from "./needs-you";

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

describe("glanceKeyAction", () => {
  const clear = { inputFocused: false, dialogOpen: false };

  it("returns null when an input is focused or a dialog is open", () => {
    expect(glanceKeyAction("Escape", { inputFocused: true, dialogOpen: false })).toBeNull();
    expect(glanceKeyAction("j", { inputFocused: false, dialogOpen: true })).toBeNull();
    expect(glanceKeyAction("k", { inputFocused: true, dialogOpen: true })).toBeNull();
  });

  it("maps Escape to escape when the room is free", () => {
    expect(glanceKeyAction("Escape", clear)).toBe("escape");
  });

  it("maps j to next and k to prev", () => {
    expect(glanceKeyAction("j", clear)).toBe("next");
    expect(glanceKeyAction("k", clear)).toBe("prev");
  });

  it("ignores other keys", () => {
    expect(glanceKeyAction("Enter", clear)).toBeNull();
  });
});
