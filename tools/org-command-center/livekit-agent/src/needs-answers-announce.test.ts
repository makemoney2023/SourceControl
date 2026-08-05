import { describe, expect, it } from "vitest";
import {
  seatLabelForAnnounce,
  selectNeedsAnswersAnnounces,
} from "./needs-answers-announce.js";

describe("seatLabelForAnnounce", () => {
  it("labels CEO and hyphen seats", () => {
    expect(seatLabelForAnnounce("ceo-strategist")).toBe("CEO");
    expect(seatLabelForAnnounce("head-of-research")).toBe("head of research");
  });
});

describe("selectNeedsAnswersAnnounces", () => {
  it("speaks once for a new needing seat", () => {
    const announced = new Set<string>();
    const first = selectNeedsAnswersAnnounces(
      ["head-of-research"],
      announced,
      false,
    );
    expect(first.speak).toEqual(["head of research needs answers."]);
    expect(announced.has("head-of-research")).toBe(true);

    const second = selectNeedsAnswersAnnounces(
      ["head-of-research"],
      announced,
      false,
    );
    expect(second.speak).toEqual([]);
  });

  it("defers mark+speak while Confirm? pending", () => {
    const announced = new Set<string>();
    const deferred = selectNeedsAnswersAnnounces(
      ["cfo"],
      announced,
      true,
    );
    expect(deferred.speak).toEqual([]);
    expect(announced.has("cfo")).toBe(false);

    const later = selectNeedsAnswersAnnounces(["cfo"], announced, false);
    expect(later.speak).toEqual(["cfo needs answers."]);
  });

  it("clears announced when seat leaves needs_input", () => {
    const announced = new Set(["cfo"]);
    selectNeedsAnswersAnnounces([], announced, false);
    expect(announced.has("cfo")).toBe(false);

    const again = selectNeedsAnswersAnnounces(["cfo"], announced, false);
    expect(again.speak).toEqual(["cfo needs answers."]);
  });
});
