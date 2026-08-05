import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { indexHandoffs, parseHandoff } from "./parse-handoff";

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
