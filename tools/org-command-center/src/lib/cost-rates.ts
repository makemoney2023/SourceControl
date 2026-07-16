export interface TokenUsageLike {
  inputTokens?: number;
  outputTokens?: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
  totalTokens?: number;
  reasoningTokens?: number;
}

export interface CostRates {
  inputPer1M: number;
  outputPer1M: number;
  cacheReadPer1M: number;
}

export function loadCostRates(env: Record<string, string | undefined> = {}): CostRates {
  return {
    inputPer1M: num(env.OCC_COST_INPUT_PER_1M, 3),
    outputPer1M: num(env.OCC_COST_OUTPUT_PER_1M, 15),
    cacheReadPer1M: num(env.OCC_COST_CACHE_READ_PER_1M, 0.3),
  };
}

function num(raw: string | undefined, fallback: number): number {
  if (raw == null || raw === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

/** Estimate USD from token usage. `model` reserved for future per-model tables. */
export function estimateCostUsd(
  usage: TokenUsageLike | undefined | null,
  _model?: string,
  rates: CostRates = loadCostRates(),
): number {
  if (!usage) return 0;
  const input = usage.inputTokens ?? 0;
  const output = usage.outputTokens ?? 0;
  const cacheRead = usage.cacheReadTokens ?? 0;
  const usd =
    (input / 1_000_000) * rates.inputPer1M +
    (output / 1_000_000) * rates.outputPer1M +
    (cacheRead / 1_000_000) * rates.cacheReadPer1M;
  return Math.round(usd * 1_000_000) / 1_000_000;
}

export function totalTokens(usage: TokenUsageLike | undefined | null): number {
  if (!usage) return 0;
  if (typeof usage.totalTokens === "number") return usage.totalTokens;
  return (
    (usage.inputTokens ?? 0) +
    (usage.outputTokens ?? 0) +
    (usage.cacheReadTokens ?? 0) +
    (usage.cacheWriteTokens ?? 0)
  );
}
