import { existsSync } from "node:fs";
import { join } from "node:path";
import { businessIdeaFile, memoryRel } from "../paths";
import { newestExtractRels } from "./store";

export function appendVentureContextReads(
  repoRoot: string,
  mustRead: string[] | undefined,
): string[] {
  const prefix: string[] = [];

  const ctxRel = `${memoryRel(repoRoot)}/context.md`;
  if (existsSync(join(repoRoot, ctxRel))) {
    prefix.push(ctxRel);
  }

  const decisionsRel = `${memoryRel(repoRoot)}/decisions.md`;
  if (existsSync(join(repoRoot, decisionsRel))) {
    prefix.push(decisionsRel);
  }

  const goodEx = "skills/org/examples/handoff-good.md";
  if (existsSync(join(repoRoot, goodEx))) {
    prefix.push(goodEx);
  }
  const badEx = "skills/org/examples/handoff-bad.md";
  if (existsSync(join(repoRoot, badEx))) {
    prefix.push(badEx);
  }

  const indexRel = businessIdeaFile(repoRoot, "SOURCES/INDEX.md");
  if (existsSync(join(repoRoot, indexRel))) {
    prefix.push(indexRel);
  }

  prefix.push(...newestExtractRels(repoRoot, 3));

  const seen = new Set<string>();
  const result: string[] = [];

  for (const path of prefix) {
    if (seen.has(path)) continue;
    seen.add(path);
    result.push(path);
  }

  for (const path of mustRead ?? []) {
    if (seen.has(path)) continue;
    seen.add(path);
    result.push(path);
  }

  return result;
}
