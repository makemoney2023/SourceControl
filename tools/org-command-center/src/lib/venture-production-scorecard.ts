import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { indexHandoffs } from "./parse-handoff";

export type PhaseProductionScore = {
  phase: string;
  craft: number;
  designBrief: number;
  layerB: number;
  verifierPass: number;
  wireChecklist: number;
};

export type VentureProductionScorecard = {
  venture: string;
  businessIdeaRel: string;
  phases: PhaseProductionScore[];
  scoredAt: string;
};

function clampPct(n: number): number {
  if (n < 0) return 0;
  if (n > 100) return 100;
  return Math.round(n);
}

function countHtml(dir: string): number {
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((f) => f.endsWith(".html")).length;
}

function inventoryExpected(bizAbs: string): number {
  const inv = join(bizAbs, "17-channels/email/PRODUCTION-INVENTORY.md");
  if (!existsSync(inv)) return 0;
  const body = readFileSync(inv, "utf8");
  const total = body.match(/\|\s*\*\*Total\*\*\s*\|[^|]*\|\s*\*\*(\d+)\*\*/i);
  if (total) return Number(total[1]);
  const countLine = body.match(/count:\s*\*?\*?(\d+)/i);
  if (countLine) return Number(countLine[1]);
  return (body.match(/`html\/[^`]+\.html`/g) ?? []).length;
}

/**
 * Score Blacksage-style venture production completeness for key shippable phases.
 */
export function scoreVentureProduction(
  repoRoot: string,
  opts: { venture: string; businessIdeaRel: string },
): VentureProductionScorecard {
  const bizAbs = join(repoRoot, opts.businessIdeaRel);
  const handoffsDir = join(bizAbs, "HANDOFFS");
  const handoffs = existsSync(handoffsDir)
    ? indexHandoffs(
        readdirSync(handoffsDir)
          .filter((n) => n.endsWith(".md"))
          .map((name) => ({
            name,
            content: readFileSync(join(handoffsDir, name), "utf8"),
          })),
      )
    : [];

  const emailHtml = countHtml(join(bizAbs, "17-channels/email/html"));
  const expected = inventoryExpected(bizAbs) || 15;
  const designBriefs = existsSync(join(bizAbs, "17-channels/email/design"))
    ? readdirSync(join(bizAbs, "17-channels/email/design")).filter((f) =>
        f.endsWith("-design-brief.md"),
      ).length
    : 0;

  const v17 = handoffs.find(
    (h) => h.phase === "17" && h.position === "verifier",
  );
  const wire17 = join(bizAbs, "WIRE/phase-17-email.md");
  const wire9 = join(bizAbs, "WIRE/phase-9-vercel.md");
  const wire14 = join(bizAbs, "WIRE/phase-14-pages.md");
  const ds = join(repoRoot, "design-system", opts.venture, "MASTER.md");
  const app = join(repoRoot, "apps", opts.venture);

  const phases: PhaseProductionScore[] = [
    {
      phase: "9",
      craft: existsSync(join(bizAbs, "05-prd.md")) ? 100 : 40,
      designBrief: existsSync(ds) ? 100 : 0,
      layerB: existsSync(app) ? 80 : 0,
      verifierPass: handoffs.some(
        (h) => h.phase === "9" && h.verdict.toLowerCase() === "pass",
      )
        ? 100
        : 0,
      wireChecklist: existsSync(wire9) ? 100 : 0,
    },
    {
      phase: "11",
      craft: existsSync(join(bizAbs, "11-brand-system.md")) ? 100 : 50,
      designBrief: existsSync(
        join(bizAbs, "11-brand/design/brand-hero-design-brief.md"),
      )
        ? 100
        : 0,
      layerB: existsSync(
        join(bizAbs, "11-brand/assets/blacksage-brand-hero-1920x1080.png"),
      )
        ? 70
        : 0,
      verifierPass: 0,
      wireChecklist: 0,
    },
    {
      phase: "14",
      craft: existsSync(join(bizAbs, "14-pages/inquire.md")) ? 100 : 40,
      designBrief: existsSync(
        join(bizAbs, "14-pages/design/inquire-design-brief.md"),
      )
        ? 100
        : 0,
      layerB: existsSync(
        join(bizAbs, "14-pages/assets/blacksage-inquire-hero-1920x1080.png"),
      )
        ? 70
        : 0,
      verifierPass: 0,
      wireChecklist: existsSync(wire14) ? 100 : 0,
    },
    {
      phase: "17",
      craft: existsSync(join(bizAbs, "17-channels/email/inquiry-welcome.md"))
        ? 100
        : 40,
      designBrief: clampPct((designBriefs / 4) * 100),
      layerB: clampPct((emailHtml / expected) * 100),
      verifierPass:
        v17?.verdict.toLowerCase() === "pass" ? 100 : 0,
      wireChecklist: existsSync(wire17) ? 100 : 0,
    },
  ];

  return {
    venture: opts.venture,
    businessIdeaRel: opts.businessIdeaRel,
    phases,
    scoredAt: new Date().toISOString(),
  };
}

export function formatScorecardMarkdown(card: VentureProductionScorecard): string {
  const lines = [
    `# Production scorecard — ${card.venture}`,
    "",
    `Scored at: ${card.scoredAt}`,
    "",
    "| Phase | Craft | Design brief | Layer B | Verifier | Wire checklist |",
    "|-------|------:|-------------:|--------:|---------:|---------------:|",
  ];
  for (const p of card.phases) {
    lines.push(
      `| ${p.phase} | ${p.craft}% | ${p.designBrief}% | ${p.layerB}% | ${p.verifierPass}% | ${p.wireChecklist}% |`,
    );
  }
  lines.push("");
  return lines.join("\n");
}
