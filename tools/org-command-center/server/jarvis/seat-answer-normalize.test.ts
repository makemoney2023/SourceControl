import { describe, expect, it } from "vitest";
import {
  fuzzyMatchOpenAsk,
  normalizeSeatAnswers,
  significantTokens,
} from "./seat-answer-normalize";

describe("fuzzyMatchOpenAsk", () => {
  const asks = [
    "Which geography should we prioritize?",
    "Confirm weekend vs weekday events?",
  ];

  it("matches geography freeform to the geography ask", () => {
    expect(fuzzyMatchOpenAsk("Outer Banks for geography", asks)).toBe(
      "Which geography should we prioritize?",
    );
  });

  it("matches weekend cue to the weekend ask", () => {
    expect(fuzzyMatchOpenAsk("weekends only", asks)).toBe(
      "Confirm weekend vs weekday events?",
    );
  });

  it("returns null when no token overlap", () => {
    expect(fuzzyMatchOpenAsk("purple elephants", asks)).toBeNull();
  });
});

describe("normalizeSeatAnswers", () => {
  const asks = ["Which geography should we prioritize?"];

  it("prefers an answers map", () => {
    expect(
      normalizeSeatAnswers({
        answers: { "Which geography should we prioritize?": "OBX" },
        openAsks: asks,
      }),
    ).toEqual({ "Which geography should we prioritize?": "OBX" });
  });

  it("maps answer + question", () => {
    expect(
      normalizeSeatAnswers({
        answer: "OBX",
        question: "Which geography should we prioritize?",
        openAsks: asks,
      }),
    ).toEqual({ "Which geography should we prioritize?": "OBX" });
  });

  it("fuzzy-maps a freeform answer onto an open ask", () => {
    expect(
      normalizeSeatAnswers({
        answer: "prioritize Outer Banks geography",
        openAsks: asks,
      }),
    ).toEqual({ "Which geography should we prioritize?": "prioritize Outer Banks geography" });
  });

  it("falls back to first ask when fuzzy fails", () => {
    expect(
      normalizeSeatAnswers({
        answer: "just go with it",
        openAsks: asks,
      }),
    ).toEqual({ "Which geography should we prioritize?": "just go with it" });
  });

  it("uses Operator answer when no asks", () => {
    expect(
      normalizeSeatAnswers({
        answer: "yes",
        openAsks: [],
      }),
    ).toEqual({ "Operator answer": "yes" });
  });

  it("throws when nothing usable", () => {
    expect(() =>
      normalizeSeatAnswers({ answers: {}, answer: "  ", openAsks: asks }),
    ).toThrow(/No usable answers/i);
  });
});

describe("significantTokens", () => {
  it("drops short tokens", () => {
    expect(significantTokens("a to be for geography")).toContain("geography");
    expect(significantTokens("a to be for geography")).not.toContain("to");
  });
});
