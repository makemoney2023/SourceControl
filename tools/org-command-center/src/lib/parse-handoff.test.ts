import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { indexHandoffs, parseHandoff, seatSlugFromHandoffFilename } from "./parse-handoff";

const dir = dirname(fileURLToPath(import.meta.url));
const sample = readFileSync(join(dir, "fixtures/sample-handoff.md"), "utf8");

describe("parseHandoff", () => {
  it("reads frontmatter and artifacts", () => {
    const h = parseHandoff("2-market-research-analyst.md", sample);
    expect(h.phase).toBe("2");
    expect(h.position).toBe("market-research-analyst");
    expect(h.status).toBe("done");
    expect(h.verdictForManager).toBe("ready_to_merge");
    expect(h.llmTier).toBe("strong-general");
    expect(h.artifacts).toEqual([
      { path: "docs/projects/passive-grid/business-idea/02-evidence-base.md", notes: "Draft evidence" },
    ]);
  });

  it("classifies kind from filename", () => {
    expect(parseHandoff("2-csuite-review.md", "---\nverdict: approve\n---\n").kind).toBe(
      "csuite",
    );
    expect(parseHandoff("2-manager-head-of-research.md", "---\nposition: head-of-research\n---\n").kind).toBe(
      "manager",
    );
    expect(parseHandoff("2-market-research-analyst.md", sample).kind).toBe("ic");
  });

  it("derives position from filename when frontmatter omits it", () => {
    expect(seatSlugFromHandoffFilename("0-manager-ceo-strategist.md")).toBe("ceo-strategist");
    expect(seatSlugFromHandoffFilename("09-manager-cto.md")).toBe("cto");
    expect(seatSlugFromHandoffFilename("10-business-analyst.md")).toBe("business-analyst");
    const h = parseHandoff(
      "0-manager-ceo-strategist.md",
      "---\nphase: \"0\"\nstatus: needs_input\n---\n## Asks\n- Confirm skip-review?\n",
    );
    expect(h.position).toBe("ceo-strategist");
  });

  it("parses production_status, production_paths, wire_owner, skip_reason", () => {
    const h = parseHandoff(
      "17-lifecycle-marketer.md",
      `---
phase: "17"
position: lifecycle-marketer
production_status: complete
production_paths:
  - docs/projects/x/business-idea/17-channels/email/html/welcome-1.html
wire_owner: operator
skip_reason: ""
---
# Handoff
`,
    );
    expect(h.productionStatus).toBe("complete");
    expect(h.productionPaths).toEqual([
      "docs/projects/x/business-idea/17-channels/email/html/welcome-1.html",
    ]);
    expect(h.wireOwner).toBe("operator");
    expect(h.skipReason).toBe("");
  });

  it("parses design_brief_path, photoreal_qa, wire_checklist_path, license_basis, generation_used", () => {
    const h = parseHandoff(
      "17-lifecycle-marketer.md",
      `---
phase: "17"
position: lifecycle-marketer
design_brief_path: docs/projects/x/business-idea/17-channels/email/design/welcome-design-brief.md
photoreal_qa: pass
wire_checklist_path: docs/projects/x/business-idea/WIRE/phase-17-email.md
license_basis: bfl-self-hosted-commercial
generation_used: local/flux-2-dev
---
# Handoff
`,
    );
    expect(h.designBriefPath).toBe(
      "docs/projects/x/business-idea/17-channels/email/design/welcome-design-brief.md",
    );
    expect(h.photorealQa).toBe("pass");
    expect(h.wireChecklistPath).toBe(
      "docs/projects/x/business-idea/WIRE/phase-17-email.md",
    );
    expect(h.licenseBasis).toBe("bfl-self-hosted-commercial");
    expect(h.generationUsed).toBe("local/flux-2-dev");
  });

  it("parses happy_path_spec and happy_path_status", () => {
    const h = parseHandoff(
      "17-verifier.md",
      `---
phase: "17"
position: verifier
verdict: pass
happy_path_status: pass
happy_path_spec: apps/sieger-show-secretary/e2e/happy-path.spec.ts
---
# Verifier
`,
    );
    expect(h.happyPathStatus).toBe("pass");
    expect(h.happyPathSpec).toBe(
      "apps/sieger-show-secretary/e2e/happy-path.spec.ts",
    );
  });

  it("extracts asks, blockers, recommendation, escalation tags", () => {
    const h = parseHandoff(
      "2-manager-head-of-research.md",
      `---
phase: "2"
position: "head-of-research"
reports_to: "ceo-strategist"
status: ready_for_csuite
recommendation: escalate
escalation_tags: [evidence, spend]
---
# Brief
## Asks for manager (\`ask_manager\`)
- Need ICP definition
## Risks / blockers
- Pricing gap
`,
    );
    expect(h.recommendation).toBe("escalate");
    expect(h.escalationTags).toEqual(["evidence", "spend"]);
    expect(h.asks[0]).toMatch(/ICP/);
    expect(h.blockers[0]).toMatch(/Pricing/);
  });

  it("extracts operator brief, next steps, and packs used", () => {
    const h = parseHandoff(
      "5-product-manager.md",
      `---
phase: "5"
position: product-manager
---
# Handoff

## Operator brief (plain English)
We drafted the PRD slice.

## Next steps
1. Head of Product — merge.
2. Operator — name first-show rulebook.

## Packs used
| Pack | Decision tied to pack |
|------|------------------------|
| \`skills/community/awesome-claude-corporate-skills/09-product-management/prd-writer/SKILL.md\` | Structured PRD |
`,
    );
    expect(h.operatorBrief).toMatch(/PRD slice/);
    expect(h.nextSteps).toMatch(/rulebook/);
    expect(h.packsUsed).toEqual([
      "skills/community/awesome-claude-corporate-skills/09-product-management/prd-writer/SKILL.md",
    ]);
  });

  it("parses Redlines table into redlines", () => {
    const h = parseHandoff(
      "5-csuite-review.md",
      `---
phase: "5"
verdict: revise
---
# C-suite review

## Redlines
| path | comment |
|------|---------|
| 05-prd.md#US-014 | Acceptance does not mention offline queue flush |
`,
    );
    expect(h.redlines).toEqual([
      {
        path: "05-prd.md#US-014",
        comment: "Acceptance does not mention offline queue flush",
      },
    ]);
  });
});

describe("indexHandoffs", () => {
  it("indexes multiple files", () => {
    const indexed = indexHandoffs([
      { name: "2-market-research-analyst.md", content: sample },
      {
        name: "2-csuite-review.md",
        content: "---\nphase: \"2\"\nverdict: revise\n---\n",
      },
    ]);
    expect(indexed).toHaveLength(2);
    expect(indexed.find((h) => h.kind === "csuite")?.verdict).toBe("revise");
  });
});
