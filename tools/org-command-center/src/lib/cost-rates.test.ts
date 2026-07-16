import { describe, expect, it } from "vitest";
import { estimateCostUsd, loadCostRates, totalTokens } from "./cost-rates";

describe("estimateCostUsd", () => {
  it("computes from defaults", () => {
    const rates = { inputPer1M: 3, outputPer1M: 15, cacheReadPer1M: 0.3 };
    // 1M input = $3; 1M output = $15
    expect(
      estimateCostUsd(
        { inputTokens: 1_000_000, outputTokens: 1_000_000, cacheReadTokens: 0 },
        "x",
        rates,
      ),
    ).toBe(18);
  });

  it("returns 0 for missing usage", () => {
    expect(estimateCostUsd(undefined)).toBe(0);
  });
});

describe("loadCostRates", () => {
  it("reads env overrides", () => {
    expect(
      loadCostRates({
        OCC_COST_INPUT_PER_1M: "1",
        OCC_COST_OUTPUT_PER_1M: "2",
        OCC_COST_CACHE_READ_PER_1M: "0.1",
      }),
    ).toEqual({ inputPer1M: 1, outputPer1M: 2, cacheReadPer1M: 0.1 });
  });
});

describe("totalTokens", () => {
  it("prefers totalTokens field", () => {
    expect(totalTokens({ totalTokens: 99, inputTokens: 1 })).toBe(99);
  });
});
