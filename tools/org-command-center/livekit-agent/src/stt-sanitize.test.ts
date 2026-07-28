import { describe, expect, it } from "vitest";
import { sanitizeSttUtterance } from "./stt-sanitize.js";

describe("sanitizeSttUtterance", () => {
  it("strips ships hallucination loops and keeps a short prefix when usable", () => {
    const ships = Array(80).fill("ships").join(" ");
    const out = sanitizeSttUtterance(`Let's turn. ${ships}`);
    expect(out.rejected).toBe(false);
    expect(out.reason).toBe("trimmed_loop");
    expect(out.text.toLowerCase()).toMatch(/let'?s turn/);
    expect(out.text.toLowerCase()).not.toMatch(/ships ships/);
  });

  it("rejects pure single-token loops", () => {
    const out = sanitizeSttUtterance(Array(20).fill("ship").join(" "));
    expect(out.rejected).toBe(true);
  });

  it("keeps normal next-steps asks", () => {
    const out = sanitizeSttUtterance("Okay, what are the next steps?");
    expect(out.rejected).toBe(false);
    expect(out.text).toMatch(/next steps/i);
  });

  it("keeps short confirms", () => {
    expect(sanitizeSttUtterance("yes").rejected).toBe(false);
    expect(sanitizeSttUtterance("confirm").text).toBe("confirm");
  });

  it("collapses a few accidental repeats but keeps meaning", () => {
    const out = sanitizeSttUtterance("yes yes yes go ahead");
    expect(out.rejected).toBe(false);
    expect(out.text.toLowerCase()).toMatch(/yes.*go ahead/);
  });
});
