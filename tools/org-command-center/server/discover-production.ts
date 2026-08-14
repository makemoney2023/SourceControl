import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  extensionOf,
  isProductionAssetPath,
} from "../src/lib/file-preview";
import { loadSeatOutputPaths, mergeUniquePaths } from "../src/lib/seat-outputs";
import type { HandoffRecord } from "../src/lib/types";
import { activeArtifactSlug, businessIdeaRel } from "./paths";

const DISCOVER_EXTS = new Set([
  "html",
  "htm",
  "pdf",
  "docx",
  "doc",
  "xlsx",
  "xls",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
  "svg",
  "mp4",
  "webm",
  "mov",
]);

/** Production file (not craft notes parked under a production lease dir). */
function isDiscoverableProductionFile(rel: string): boolean {
  return isProductionAssetPath(rel) && DISCOVER_EXTS.has(extensionOf(rel));
}

/** Resolve seat ## Outputs leases to existing production file paths (shallow dir walk). */
export function discoverSeatProductionFiles(
  repoRoot: string,
  position: string,
  opts?: { ventureSlug?: string; businessIdeaRel?: string },
): string[] {
  const ventureSlug = opts?.ventureSlug ?? activeArtifactSlug(repoRoot);
  const biz = opts?.businessIdeaRel ?? businessIdeaRel(repoRoot);
  const leases = loadSeatOutputPaths(repoRoot, position, {
    ventureSlug,
    businessIdeaRel: biz,
  });
  const out: string[] = [];
  for (const rel of leases) {
    const abs = join(repoRoot, rel);
    if (!existsSync(abs)) continue;
    let st;
    try {
      st = statSync(abs);
    } catch {
      continue;
    }
    if (st.isFile()) {
      if (isDiscoverableProductionFile(rel)) out.push(rel);
      continue;
    }
    if (!st.isDirectory()) continue;
    let names: string[] = [];
    try {
      names = readdirSync(abs);
    } catch {
      continue;
    }
    for (const name of names) {
      const childRel = `${rel.replace(/\/+$/, "")}/${name}`;
      const childAbs = join(repoRoot, childRel);
      try {
        if (!statSync(childAbs).isFile()) continue;
      } catch {
        continue;
      }
      if (isDiscoverableProductionFile(childRel)) out.push(childRel);
    }
  }
  return mergeUniquePaths(out);
}

/** Merge discovered ## Outputs production files into each handoff's productionPaths. */
export function enrichHandoffsWithSeatOutputs(
  repoRoot: string,
  handoffs: HandoffRecord[],
): HandoffRecord[] {
  const ventureSlug = activeArtifactSlug(repoRoot);
  const biz = businessIdeaRel(repoRoot);
  const cache = new Map<string, string[]>();
  return handoffs.map((h) => {
    let discovered = cache.get(h.position);
    if (!discovered) {
      discovered = discoverSeatProductionFiles(repoRoot, h.position, {
        ventureSlug,
        businessIdeaRel: biz,
      });
      cache.set(h.position, discovered);
    }
    if (!discovered.length) return h;
    return {
      ...h,
      productionPaths: mergeUniquePaths(h.productionPaths, discovered),
    };
  });
}
