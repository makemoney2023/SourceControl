import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { activeProjectSlug, businessIdeaRoot, loadRegistry, memoryRel } from "../paths";
import { createVaultFile as createVaultFileProd } from "./mcp-client";
import { repoRelToVaultPath } from "./vault-paths";

export type CreateVaultFileFn = (
  path: string,
  content: string,
) => Promise<{ ok: boolean; text: string; error?: string }>;

export type SyncFileResult = {
  ok: boolean;
  skipped?: boolean;
  vaultPath?: string;
  repoRel?: string;
  error?: string;
};

export type SyncVentureResult = {
  ok: boolean;
  venture: string;
  synced: number;
  failed: number;
  skipped: number;
  errors: string[];
  vaultRoot: string;
};

function posixRel(repoRoot: string, abs: string): string {
  return relative(repoRoot, abs).split("\\").join("/");
}

function walkMarkdownFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop()!;
    for (const name of readdirSync(cur)) {
      if (name === "node_modules" || name === ".git" || name === "DISPATCH") continue;
      const abs = join(cur, name);
      const st = statSync(abs);
      if (st.isDirectory()) stack.push(abs);
      else if (st.isFile() && name.endsWith(".md")) out.push(abs);
    }
  }
  return out;
}

/** Wrap body with OCC sync frontmatter (inject into existing YAML when present). */
export function withSyncFrontmatter(
  body: string,
  meta: { source: string; venture: string; syncedAt: string },
): string {
  const stamp = [
    `occ_source: ${meta.source}`,
    `occ_venture: ${meta.venture}`,
    `occ_synced: ${meta.syncedAt}`,
  ].join("\n");
  if (body.startsWith("---\n")) {
    const end = body.indexOf("\n---\n", 4);
    if (end !== -1) {
      const yaml = body.slice(4, end);
      const rest = body.slice(end + 5);
      const cleaned = yaml
        .split("\n")
        .filter((line) => !/^occ_(source|venture|synced):/.test(line))
        .join("\n")
        .replace(/\n+$/, "");
      const merged = cleaned ? `${cleaned}\n${stamp}` : stamp;
      return `---\n${merged}\n---\n${rest}`;
    }
  }
  return `---\n${stamp}\n---\n\n${body}`;
}

export async function syncRepoFileToObsidian(
  repoRoot: string,
  repoRel: string,
  deps?: { createVaultFile?: CreateVaultFileFn; now?: () => string },
): Promise<SyncFileResult> {
  const rel = repoRel.replace(/\\/g, "/");
  const vaultPath = repoRelToVaultPath(rel);
  if (!vaultPath) return { ok: true, skipped: true, repoRel: rel };

  const abs = join(repoRoot, rel);
  if (!existsSync(abs)) {
    return { ok: false, repoRel: rel, vaultPath, error: "file missing" };
  }
  const venture = vaultPath.split("/")[1] ?? "unknown";
  const content = withSyncFrontmatter(readFileSync(abs, "utf8"), {
    source: rel,
    venture,
    syncedAt: (deps?.now ?? (() => new Date().toISOString()))(),
  });
  const create = deps?.createVaultFile ?? createVaultFileProd;
  const result = await create(vaultPath, content);
  if (!result.ok) {
    return {
      ok: false,
      repoRel: rel,
      vaultPath,
      error: result.error || result.text || "create_vault_file failed",
    };
  }
  return { ok: true, repoRel: rel, vaultPath };
}

export async function syncVentureMarkdownToObsidian(
  repoRoot: string,
  slug?: string,
  deps?: { createVaultFile?: CreateVaultFileFn; now?: () => string },
): Promise<SyncVentureResult> {
  const reg = loadRegistry(repoRoot);
  const venture = slug || activeProjectSlug(repoRoot) || reg.active.customer;
  const customer = reg.orgs[reg.active.org]?.customers[venture];
  if (!venture || !customer) {
    return {
      ok: false,
      venture: venture || "",
      synced: 0,
      failed: 0,
      skipped: 0,
      errors: ["no active venture"],
      vaultRoot: "",
    };
  }

  const ideaRoot = businessIdeaRoot(repoRoot, venture);
  const memoryRoot = join(repoRoot, memoryRel(repoRoot, venture));
  const candidates = [
    ...walkMarkdownFiles(join(ideaRoot, "HANDOFFS")),
    ...walkMarkdownFiles(join(ideaRoot, "BRIEFINGS")),
    ...walkMarkdownFiles(join(ideaRoot, "REVIEW", "inbox")),
    ...walkMarkdownFiles(memoryRoot),
    ...walkMarkdownFiles(ideaRoot).filter((abs) => {
      const rel = posixRel(repoRoot, abs);
      return repoRelToVaultPath(rel)?.includes("/phases/") ?? false;
    }),
  ];

  const unique = [...new Set(candidates)];
  let synced = 0;
  let failed = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const abs of unique) {
    const rel = posixRel(repoRoot, abs);
    const r = await syncRepoFileToObsidian(repoRoot, rel, deps);
    if (r.skipped) skipped += 1;
    else if (r.ok) synced += 1;
    else {
      failed += 1;
      errors.push(`${rel}: ${r.error ?? "failed"}`);
    }
  }

  return {
    ok: failed === 0,
    venture,
    synced,
    failed,
    skipped,
    errors,
    vaultRoot: `org/${venture}`,
  };
}
