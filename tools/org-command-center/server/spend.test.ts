import { mkdtempSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { isOverBudget, loadSpend, recordSpend, seatSpendUsd } from "./spend";

describe("spend ledger", () => {
  it("rolls up by seat and day", () => {
    const root = mkdtempSync(join(tmpdir(), "spend-"));
    mkdirSync(root, { recursive: true });
    recordSpend(
      root,
      "cto",
      0.5,
      { inputTokens: 1000, outputTokens: 500, totalTokens: 1500 },
      new Date("2026-07-16T12:00:00Z"),
    );
    recordSpend(
      root,
      "cto",
      0.25,
      { totalTokens: 500 },
      new Date("2026-07-16T13:00:00Z"),
    );
    const ledger = loadSpend(root);
    expect(seatSpendUsd(ledger, "cto")).toBe(0.75);
    expect(ledger.byDay["2026-07-16"]?.cost_usd).toBe(0.75);
  });
});

describe("isOverBudget", () => {
  it("only when budget positive", () => {
    expect(isOverBudget(10, null)).toBe(false);
    expect(isOverBudget(10, 0)).toBe(false);
    expect(isOverBudget(10, 5)).toBe(true);
    expect(isOverBudget(4, 5)).toBe(false);
  });
});
