import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { totalTokens, type TokenUsageLike } from "../src/lib/cost-rates";

export interface SeatSpend {
  tokens: number;
  cost_usd: number;
  updated_at: string;
}

export interface SpendLedger {
  bySeat: Record<string, SeatSpend>;
  byDay: Record<string, { tokens: number; cost_usd: number }>;
}

export function spendPath(dispatchRoot: string) {
  return join(dispatchRoot, "spend.json");
}

export function loadSpend(dispatchRoot: string): SpendLedger {
  const path = spendPath(dispatchRoot);
  if (!existsSync(path)) return { bySeat: {}, byDay: {} };
  try {
    const raw = JSON.parse(readFileSync(path, "utf8")) as SpendLedger;
    return {
      bySeat: raw.bySeat ?? {},
      byDay: raw.byDay ?? {},
    };
  } catch {
    return { bySeat: {}, byDay: {} };
  }
}

export function recordSpend(
  dispatchRoot: string,
  seat: string,
  costUsd: number,
  usage: TokenUsageLike | undefined,
  at = new Date(),
): SpendLedger {
  const ledger = loadSpend(dispatchRoot);
  const day = at.toISOString().slice(0, 10);
  const tokens = totalTokens(usage);
  const prev = ledger.bySeat[seat] ?? { tokens: 0, cost_usd: 0, updated_at: at.toISOString() };
  ledger.bySeat[seat] = {
    tokens: prev.tokens + tokens,
    cost_usd: Math.round((prev.cost_usd + costUsd) * 1_000_000) / 1_000_000,
    updated_at: at.toISOString(),
  };
  const dayPrev = ledger.byDay[day] ?? { tokens: 0, cost_usd: 0 };
  ledger.byDay[day] = {
    tokens: dayPrev.tokens + tokens,
    cost_usd: Math.round((dayPrev.cost_usd + costUsd) * 1_000_000) / 1_000_000,
  };
  const path = spendPath(dispatchRoot);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(ledger, null, 2), "utf8");
  return ledger;
}

export function seatSpendUsd(ledger: SpendLedger, seat: string): number {
  return ledger.bySeat[seat]?.cost_usd ?? 0;
}

export function totalSpendUsd(ledger: SpendLedger): number {
  return Object.values(ledger.bySeat).reduce((s, v) => s + v.cost_usd, 0);
}

export function isOverBudget(spent: number, budgetUsd: number | null | undefined): boolean {
  if (budgetUsd == null || !(budgetUsd > 0)) return false;
  return spent >= budgetUsd;
}
