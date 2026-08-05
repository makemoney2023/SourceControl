import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  formatScorecardMarkdown,
  scoreVentureProduction,
} from "./venture-production-scorecard";

describe("scoreVentureProduction", () => {
  it("scores email Layer B from inventory", () => {
    const root = mkdtempSync(join(tmpdir(), "scorecard-"));
    const biz = "docs/projects/demo/business-idea";
    mkdirSync(join(root, biz, "17-channels/email/html"), { recursive: true });
    mkdirSync(join(root, biz, "17-channels/email/design"), { recursive: true });
    mkdirSync(join(root, biz, "WIRE"), { recursive: true });
    mkdirSync(join(root, biz, "HANDOFFS"), { recursive: true });
    writeFileSync(
      join(root, biz, "17-channels/email/PRODUCTION-INVENTORY.md"),
      "count: **2**\n",
    );
    writeFileSync(join(root, biz, "17-channels/email/html/a.html"), "<html></html>");
    writeFileSync(join(root, biz, "17-channels/email/html/b.html"), "<html></html>");
    writeFileSync(
      join(root, biz, "17-channels/email/design/x-design-brief.md"),
      "# brief\n",
    );
    writeFileSync(join(root, biz, "WIRE/phase-17-email.md"), "# wire\n");
    writeFileSync(
      join(root, biz, "HANDOFFS/17-verifier.md"),
      "---\nphase: \"17\"\nposition: verifier\nverdict: pass\n---\n",
    );
    writeFileSync(
      join(root, biz, "17-channels/email/inquiry-welcome.md"),
      "# craft\n",
    );

    const card = scoreVentureProduction(root, {
      venture: "demo",
      businessIdeaRel: biz,
    });
    const p17 = card.phases.find((p) => p.phase === "17")!;
    expect(p17.layerB).toBe(100);
    expect(p17.verifierPass).toBe(100);
    expect(p17.wireChecklist).toBe(100);
    expect(formatScorecardMarkdown(card)).toContain("Production scorecard");
  });
});
