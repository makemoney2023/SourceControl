import { describe, expect, it } from "vitest";
import {
  extractOperatorSummary,
  formatOperatorSummarySpoken,
} from "./operator-summary";

const SAMPLE = `---
status: pending_review
position: cfo
---

# Deliverable

## In plain English
We sized a seasonal lemonade booth for cash-only events.
Startup cash need is roughly five hundred to twenty-five hundred dollars.
Pricing is still an open question for the operator.

## What we found
- Mid COGS about $1.30 per cup
- Break-even near 61 cups at $5

## Next steps
1. Operator names geography and first events.
2. CFO locks a price band in Phase 4 once geography is known.
3. Do not mark Phase 0 complete until CEO merge finishes.

## Model audit
| Seat | model |
`;

describe("extractOperatorSummary", () => {
  it("pulls plain English and next steps", () => {
    const s = extractOperatorSummary(SAMPLE);
    expect(s.plainEnglish.join(" ")).toMatch(/lemonade booth/i);
    expect(s.plainEnglish.join(" ")).not.toMatch(/Model audit/i);
    expect(s.nextSteps[0]).toMatch(/geography/i);
    expect(s.nextSteps).toHaveLength(3);
  });

  it("returns empty when sections missing", () => {
    const s = extractOperatorSummary("# No sections\n\nJust prose.");
    expect(s.plainEnglish).toEqual([]);
    expect(s.nextSteps).toEqual([]);
  });
});

describe("formatOperatorSummarySpoken", () => {
  it("speaks plain English then next step without markdown", () => {
    const spoken = formatOperatorSummarySpoken(extractOperatorSummary(SAMPLE));
    expect(spoken).toMatch(/lemonade booth/i);
    expect(spoken).toMatch(/Next:/i);
    expect(spoken).not.toMatch(/\*\*|##|`/);
    expect(spoken.length).toBeLessThan(500);
  });

  it("returns null when nothing useful", () => {
    expect(formatOperatorSummarySpoken(extractOperatorSummary("# x"))).toBeNull();
  });
});
