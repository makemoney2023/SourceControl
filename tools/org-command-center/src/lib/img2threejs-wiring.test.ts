import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import {
  REQUIRED_3D_ENTRIES,
  seatSkillMentionsPack,
  validateDesignSystem3dLayout,
} from "./designSystem3d";

/** ClaudeSkills repo root (tools/org-command-center/src/lib → ../../../..) */
const REPO_ROOT = join(import.meta.dirname, "../../../..");
const IMG2THREEJS_PACK = "skills/community/img2threejs/";

const SEATS = [
  "web-designer",
  "tech-lead",
  "creative-director",
] as const;

describe("img2threejs org wiring", () => {
  const temps: string[] = [];

  afterEach(() => {
    for (const dir of temps.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("requires README, sculpt spec, factory, and review/ in design-system 3d layout", () => {
    const root = mkdtempSync(join(tmpdir(), "ds3d-"));
    temps.push(root);
    const threeD = join(root, "3d");
    mkdirSync(threeD);

    const empty = validateDesignSystem3dLayout(threeD);
    expect(empty.ok).toBe(false);
    expect(empty.missing).toEqual(
      expect.arrayContaining([...REQUIRED_3D_ENTRIES]),
    );

    writeFileSync(join(threeD, "README.md"), "# mount\n");
    writeFileSync(join(threeD, "object-sculpt-spec.json"), "{}");
    writeFileSync(join(threeD, "createObjectModel.ts"), "export {}\n");
    mkdirSync(join(threeD, "review"));
    writeFileSync(join(threeD, "review", "pass-log.json"), "[]\n");

    const full = validateDesignSystem3dLayout(threeD);
    expect(full.ok).toBe(true);
    expect(full.missing).toEqual([]);
  });

  it("accepts a venture-named factory instead of createObjectModel.ts", () => {
    const root = mkdtempSync(join(tmpdir(), "ds3d-named-"));
    temps.push(root);
    const threeD = join(root, "3d");
    mkdirSync(threeD);
    writeFileSync(join(threeD, "README.md"), "# mount\n");
    writeFileSync(join(threeD, "object-sculpt-spec.json"), "{}");
    writeFileSync(join(threeD, "createHeroProductModel.ts"), "export {}\n");
    mkdirSync(join(threeD, "review"));

    expect(validateDesignSystem3dLayout(threeD).ok).toBe(true);
  });

  it.each(SEATS)("%s SKILL.md lists img2threejs community pack", (seat) => {
    const skillPath = join(
      REPO_ROOT,
      "skills/org/positions",
      seat,
      "SKILL.md",
    );
    const md = readFileSync(skillPath, "utf8");
    expect(seatSkillMentionsPack(md, IMG2THREEJS_PACK)).toBe(true);
  });

  it("vendored img2threejs skill entrypoint exists", () => {
    const skill = join(REPO_ROOT, "skills/community/img2threejs/SKILL.md");
    const forge = join(REPO_ROOT, "skills/community/img2threejs/forge");
    expect(existsSync(skill)).toBe(true);
    expect(readFileSync(skill, "utf8").length).toBeGreaterThan(100);
    expect(existsSync(forge)).toBe(true);
  });
});
