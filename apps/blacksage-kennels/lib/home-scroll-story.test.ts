import { describe, expect, it } from "vitest";
import {
  HOME_SCROLL_CHAPTERS,
  HOME_SCROLL_PAGES,
  assertHomeScrollStoryValid,
  getChapterAtProgress,
  getCameraAtProgress,
  type HomeScrollChapterId,
} from "@/lib/home-scroll-story";

describe("HOME_SCROLL_STORY (Option C)", () => {
  it("defines five scroll pages and six chapters covering 0–1", () => {
    expect(HOME_SCROLL_PAGES).toBe(5);
    expect(HOME_SCROLL_CHAPTERS.length).toBe(6);
    assertHomeScrollStoryValid(HOME_SCROLL_CHAPTERS);
  });

  it("orders chapters presence → standards → proof → health → dogs → inquire", () => {
    const ids = HOME_SCROLL_CHAPTERS.map((c) => c.id);
    expect(ids).toEqual([
      "presence",
      "standards",
      "proof",
      "health",
      "dogs",
      "inquire",
    ] satisfies HomeScrollChapterId[]);
  });

  it("marks proof as HTML-hard (not WebGL-only)", () => {
    const proof = HOME_SCROLL_CHAPTERS.find((c) => c.id === "proof");
    expect(proof?.htmlOnly).toBe(true);
  });

  it("resolves chapter by progress", () => {
    expect(getChapterAtProgress(0).id).toBe("presence");
    expect(getChapterAtProgress(0.4).id).toBe("proof");
    expect(getChapterAtProgress(0.95).id).toBe("inquire");
  });

  it("returns camera keyframes that stay finite", () => {
    const cam = getCameraAtProgress(0.25);
    expect(cam.position.every(Number.isFinite)).toBe(true);
    expect(cam.target.every(Number.isFinite)).toBe(true);
  });

  it("uses warm kennel voice — not film jargon or clinical brochure tone", () => {
    const joined = HOME_SCROLL_CHAPTERS.map(
      (c) => `${c.kicker ?? ""} ${c.title} ${c.body} ${c.linkLabel ?? ""}`,
    ).join(" ");
    expect(joined).not.toMatch(
      /filmed with intent|Cut to the standard|standards reel|The cast|When the frame|Feature Presentation|Final frame|Reel break|Evidence-led breeding/i,
    );
    expect(HOME_SCROLL_CHAPTERS[0].title).toBe("Blacksage Kennels");
    expect(HOME_SCROLL_CHAPTERS[0].body).toMatch(/lives with you|stand behind it/i);
    expect(HOME_SCROLL_CHAPTERS.find((c) => c.id === "inquire")?.title).toBe(
      "Tell us about your home",
    );
    expect(HOME_SCROLL_CHAPTERS.find((c) => c.id === "dogs")?.title).toBe(
      "Meet the kennel",
    );
  });
});
