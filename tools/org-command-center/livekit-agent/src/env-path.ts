import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Walk up from this package until ClaudeSkills root (has skills/org). */
export function resolveRepoRoot(from = fileURLToPath(import.meta.url)): string {
  let dir = dirname(from);
  for (let i = 0; i < 10; i++) {
    if (existsSync(join(dir, "skills/org/ORG-REGISTRY.md"))) {
      return dir;
    }
    dir = dirname(dir);
  }
  throw new Error("Could not locate ClaudeSkills repo root from " + from);
}

export function resolveRepoEnvLocal(from = fileURLToPath(import.meta.url)): string {
  return join(resolveRepoRoot(from), ".env.local");
}
