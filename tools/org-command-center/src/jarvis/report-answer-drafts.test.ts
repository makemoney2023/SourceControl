import { describe, expect, it } from "vitest";
import {
  mergeReportAnswerDrafts,
  shouldHardReloadSeatReport,
} from "./report-answer-drafts";

describe("shouldHardReloadSeatReport", () => {
  it("hard-reloads only when the selected seat changes", () => {
    expect(shouldHardReloadSeatReport("ceo-strategist", null)).toBe(true);
    expect(shouldHardReloadSeatReport("ceo-strategist", "ceo-strategist")).toBe(
      false,
    );
    expect(shouldHardReloadSeatReport("cto", "ceo-strategist")).toBe(true);
    expect(shouldHardReloadSeatReport(null, "ceo-strategist")).toBe(false);
  });
});

describe("mergeReportAnswerDrafts", () => {
  it("keeps typed answers when question text is unchanged", () => {
    expect(
      mergeReportAnswerDrafts(
        { "Confirm GO on creative redo": "yes, ship it" },
        ["Confirm GO on creative redo"],
        ["Confirm GO on creative redo"],
      ),
    ).toEqual({ "Confirm GO on creative redo": "yes, ship it" });
  });

  it("keeps answers by index when Grok rewrites question wording", () => {
    expect(
      mergeReportAnswerDrafts(
        {
          "Confirm GO on creative redo before Phase 14": "yes",
          "Pick launch geography": "US + Canada",
        },
        [
          "Confirm GO on creative redo before Phase 14",
          "Pick launch geography",
        ],
        [
          "Should we green-light the creative redo?",
          "Which countries should we launch in first?",
        ],
      ),
    ).toEqual({
      "Should we green-light the creative redo?": "yes",
      "Which countries should we launch in first?": "US + Canada",
    });
  });

  it("prefers exact question-key matches over index when both exist", () => {
    expect(
      mergeReportAnswerDrafts(
        {
          "Exact match question": "kept-by-key",
          "Old first question": "index-would-be-wrong",
        },
        ["Old first question", "Exact match question"],
        ["Rewritten first question", "Exact match question"],
      ),
    ).toEqual({
      "Rewritten first question": "index-would-be-wrong",
      "Exact match question": "kept-by-key",
    });
  });

  it("fills missing answers with empty strings", () => {
    expect(
      mergeReportAnswerDrafts({}, [], ["New question only"]),
    ).toEqual({ "New question only": "" });
  });
});
