import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/** Required top-level entries for `design-system/<venture>/3d/` when not skipped. */
export const REQUIRED_3D_ENTRIES = [
  "README.md",
  "object-sculpt-spec.json",
  "factory",
  "review/",
] as const;

export type DesignSystem3dValidation = {
  ok: boolean;
  missing: string[];
};

function hasFactory(dir: string): boolean {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return false;
  return readdirSync(dir).some(
    (name) =>
      /^create.+\.tsx?$/i.test(name) || name === "createObjectModel.ts",
  );
}

/**
 * Validate Layer B img2threejs SSOT layout under `design-system/<venture>/3d/`.
 */
export function validateDesignSystem3dLayout(
  threeDDir: string,
): DesignSystem3dValidation {
  const missing: string[] = [];

  if (!existsSync(join(threeDDir, "README.md"))) {
    missing.push("README.md");
  }
  if (!existsSync(join(threeDDir, "object-sculpt-spec.json"))) {
    missing.push("object-sculpt-spec.json");
  }
  if (!hasFactory(threeDDir)) {
    missing.push("factory");
  }
  const reviewDir = join(threeDDir, "review");
  if (!existsSync(reviewDir) || !statSync(reviewDir).isDirectory()) {
    missing.push("review/");
  }

  return { ok: missing.length === 0, missing };
}

/** True when a position SKILL.md skill-pack table mentions the pack path. */
export function seatSkillMentionsPack(
  skillMd: string,
  packPath: string,
): boolean {
  const normalized = packPath.replace(/\/$/, "");
  return (
    skillMd.includes(packPath) ||
    skillMd.includes(`${normalized}/`) ||
    skillMd.includes(`\`${normalized}\``) ||
    skillMd.includes(normalized)
  );
}
