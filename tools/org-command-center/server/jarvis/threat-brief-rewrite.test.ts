import { describe, expect, it, vi } from "vitest";
import type { BlockedSeatDigest } from "../../src/jarvis/company-digest";
import {
  clearThreatBriefRewriteCacheForTests,
  enrichBlockedSeatsWithGrok,
  parseGrokThreatBriefJson,
} from "./threat-brief-rewrite";

const sample: BlockedSeatDigest[] = [
  {
    slug: "business-analyst",
    title: "Business Analyst",
    reason: "Confirm weekend markets?",
    headline: "Confirm weekend markets?",
    statusLabel: "Needs your input",
    phase: "2",
    status: "needs_input",
    reasons: ["Confirm weekend markets?", "Missing venue shortlist"],
    handoffFilename: "2-business-analyst.md",
    managerSlug: "head-of-product",
  },
];

describe("threat-brief-rewrite", () => {
  it("parses Grok threat JSON (fenced or raw)", () => {
    const parsed = parseGrokThreatBriefJson(`\`\`\`json
{
  "threats": [
    {
      "slug": "business-analyst",
      "headline": "Decide whether weekend markets are in scope",
      "detail": "The BA is waiting on a clear yes/no before shortlisting venues."
    }
  ]
}
\`\`\``);
    expect(parsed).toEqual([
      {
        slug: "business-analyst",
        headline: "Decide whether weekend markets are in scope",
        detail: "The BA is waiting on a clear yes/no before shortlisting venues.",
      },
    ]);
  });

  it("rewrites threat headlines via Cursor Grok and caches by content", async () => {
    clearThreatBriefRewriteCacheForTests();
    const prompt = vi.fn(async () => ({
      status: "ok",
      result: JSON.stringify({
        threats: [
          {
            slug: "business-analyst",
            headline: "Decide whether weekend markets are in scope",
            detail: "Venue shortlist cannot start until that call is made.",
          },
        ],
      }),
    }));

    const first = await enrichBlockedSeatsWithGrok(sample, {
      cwd: process.cwd(),
      apiKey: "test-key",
      runtime: { prompt },
    });
    expect(first.source).toBe("grok");
    expect(first.blockedSeats[0]?.headline).toMatch(/weekend markets/i);
    expect(first.blockedSeats[0]?.reason).toBe(first.blockedSeats[0]?.headline);
    expect(first.blockedSeats[0]?.reasons[0]).toMatch(/weekend markets/i);
    expect(prompt).toHaveBeenCalledTimes(1);

    const second = await enrichBlockedSeatsWithGrok(sample, {
      cwd: process.cwd(),
      apiKey: "test-key",
      runtime: { prompt },
    });
    expect(second.cached).toBe(true);
    expect(prompt).toHaveBeenCalledTimes(1);
  });

  it("falls back to deterministic digests without API key", async () => {
    clearThreatBriefRewriteCacheForTests();
    const out = await enrichBlockedSeatsWithGrok(sample, {
      cwd: process.cwd(),
      apiKey: "",
    });
    expect(out.source).toBe("deterministic");
    expect(out.blockedSeats[0]?.headline).toBe(sample[0]?.headline);
  });
});
