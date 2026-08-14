import { describe, expect, it } from "vitest";
import { parsePackProcedures, procedureFailures } from "./pack-procedures";

const MD = `# Pack procedures

| pack | required_headings |
|------|-------------------|
| skills/community/awesome-claude-corporate-skills/09-product-management/feature-spec | User stories, Functional requirements |
| skills/community/business-analysis-skills/skills/moscow-prioritisation | MoSCoW |
`;

const FEATURE_SPEC =
  "skills/community/awesome-claude-corporate-skills/09-product-management/feature-spec/";

describe("procedureFailures", () => {
  it("returns pack_procedure:feature-spec when used pack body lacks User stories", () => {
    const procedures = parsePackProcedures(MD);
    const missing = procedureFailures([FEATURE_SPEC], procedures, [
      "# Spec\n## Functional requirements\n",
    ]);
    expect(missing).toEqual(["pack_procedure:feature-spec"]);
  });

  it("returns empty when the body has every required heading", () => {
    const procedures = parsePackProcedures(MD);
    const missing = procedureFailures([FEATURE_SPEC], procedures, [
      "# Spec\n## User stories\n## Functional requirements\n",
    ]);
    expect(missing).toEqual([]);
  });

  it("returns empty when the used pack is not in the map", () => {
    const procedures = parsePackProcedures(MD);
    const missing = procedureFailures(
      ["skills/community/some-other-pack/"],
      procedures,
      ["# Spec\n"],
    );
    expect(missing).toEqual([]);
  });
});
