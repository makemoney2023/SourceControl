import { describe, expect, it } from "vitest";
import { parsePositionPacks } from "./parse-position-packs";
import { packsNotAllowed } from "./handoff-discipline";

const PM_SKILL = `# Product Manager

## Skill packs
| Pack path | Use for |
|-----------|---------|
| \`skills/community/awesome-claude-corporate-skills/09-product-management/feature-spec/\` | Feature specs |
| \`skills/community/business-analysis-skills/skills/moscow-prioritisation/\` | MoSCoW |

## Inputs
- x
`;

describe("parsePositionPacks", () => {
  it("reads the Skill packs table only", () => {
    expect(parsePositionPacks(PM_SKILL)).toEqual([
      "skills/community/awesome-claude-corporate-skills/09-product-management/feature-spec/",
      "skills/community/business-analysis-skills/skills/moscow-prioritisation/",
    ]);
  });
});

describe("packsNotAllowed", () => {
  it("flags prd-writer when PM allowlist is feature-spec/moscow", () => {
    const used = [
      "skills/community/awesome-claude-corporate-skills/09-product-management/prd-writer/SKILL.md",
    ];
    expect(packsNotAllowed(used, parsePositionPacks(PM_SKILL))).toEqual([
      "skills/community/awesome-claude-corporate-skills/09-product-management/prd-writer/SKILL.md",
    ]);
  });

  it("allows HANDOFF-TEMPLATE even when not on the seat list", () => {
    expect(
      packsNotAllowed(
        ["skills/org/HANDOFF-TEMPLATE.md"],
        parsePositionPacks(PM_SKILL),
      ),
    ).toEqual([]);
  });
});
