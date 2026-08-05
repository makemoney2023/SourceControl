import { describe, expect, it } from "vitest";
import { SCENE_HTML_Z_INDEX_RANGE } from "./sceneHtml";

describe("SCENE_HTML_Z_INDEX_RANGE", () => {
  it("stays below Situation Room drawer stacking (z-index 90+)", () => {
    expect(SCENE_HTML_Z_INDEX_RANGE[0]).toBeLessThan(90);
    expect(SCENE_HTML_Z_INDEX_RANGE[1]).toBeLessThan(SCENE_HTML_Z_INDEX_RANGE[0]);
  });
});
