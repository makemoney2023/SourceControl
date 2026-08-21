import { describe, expect, it } from "vitest";
import { canStartRead, consumeRead, defaultQuota } from "@/lib/quota/lite-quota";

describe("lite quota", () => {
  it("starts with 5 reads", () => {
    expect(defaultQuota().remaining).toBe(5);
  });

  it("consumes one read per vision call", () => {
    const q = defaultQuota();
    const next = consumeRead(q);
    expect(next.remaining).toBe(4);
    expect(next.readsUsed).toBe(1);
  });

  it("blocks when exhausted", () => {
    const exhausted = { remaining: 0, total: 5, readsUsed: 5 };
    expect(canStartRead(exhausted)).toBe(false);
  });
});
