import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

export function listDispatchFiles(dispatchRoot: string, kind: "queue" | "claimed"): string[] {
  const dir = join(dispatchRoot, kind);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .sort();
}
