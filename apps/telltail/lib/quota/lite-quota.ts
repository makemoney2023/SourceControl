import { LITE_READS_GRANT, type LiteQuota } from "@/lib/types";

const STORAGE_KEY = "telltail:lite-quota:v1";

export function defaultQuota(): LiteQuota {
  return {
    remaining: LITE_READS_GRANT,
    total: LITE_READS_GRANT,
    readsUsed: 0,
  };
}

export function loadQuota(): LiteQuota {
  if (typeof window === "undefined") return defaultQuota();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultQuota();
    const parsed = JSON.parse(raw) as LiteQuota;
    if (typeof parsed.remaining !== "number") return defaultQuota();
    return parsed;
  } catch {
    return defaultQuota();
  }
}

export function saveQuota(quota: LiteQuota): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quota));
}

export function consumeRead(quota: LiteQuota): LiteQuota {
  const next = {
    ...quota,
    remaining: Math.max(0, quota.remaining - 1),
    readsUsed: quota.readsUsed + 1,
  };
  saveQuota(next);
  return next;
}

export function canStartRead(quota: LiteQuota): boolean {
  return quota.remaining > 0;
}
