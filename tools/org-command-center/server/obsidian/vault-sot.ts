import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import type { ActiveRef } from "../portfolio-registry";
import {
  DEFAULT_ORG_SLUG,
  getCustomerMain,
  getInitiative,
  loadRegistry,
} from "../paths";

/** Folders under business-idea that live in the Obsidian vault (source of truth). */
export const VAULT_IDEA_LINKS = ["HANDOFFS", "BRIEFINGS", "REVIEW"] as const;

export type VaultSotResult = {
  ok: boolean;
  venture: string;
  vaultRoot: string;
  linked: string[];
  alreadyLinked: number;
  moved: string[];
  errors: string[];
};

export type VaultSotStatus = {
  ok: boolean;
  venture: string;
  vaultRoot: string;
  /** Labels that are already symlinks into the vault. */
  linked: string[];
  /** Labels that still need migration (real dirs/files under docs). */
  pending: string[];
  ready: boolean;
};

export function vaultOrgRootRel(venture: string): string {
  return `memorybank/org/${venture}`;
}

/** Nested vault for new initiatives; wrapped `main` keeps `memorybank/org/<customer>`. */
export function vaultRootForInitiative(ref: ActiveRef, businessIdeaRel: string): string {
  if (businessIdeaRel.startsWith("docs/projects/")) {
    return vaultOrgRootRel(ref.customer);
  }
  return `memorybank/org/${ref.org}/${ref.customer}/${ref.initiative}`;
}

function isSymlink(abs: string): boolean {
  try {
    return lstatSync(abs).isSymbolicLink();
  } catch {
    return false;
  }
}

function ensureDir(abs: string) {
  mkdirSync(abs, { recursive: true });
}

/** Merge src dir into dest (files: prefer src). Does not follow dest if symlink. */
function mergeDirInto(src: string, dest: string) {
  ensureDir(dest);
  for (const name of readdirSync(src)) {
    const from = join(src, name);
    const to = join(dest, name);
    const st = lstatSync(from);
    if (st.isDirectory()) {
      if (existsSync(to) && lstatSync(to).isDirectory() && !lstatSync(to).isSymbolicLink()) {
        mergeDirInto(from, to);
      } else if (!existsSync(to)) {
        cpSync(from, to, { recursive: true });
      }
    } else if (st.isFile()) {
      // Prefer OCC/docs content when migrating away from stale vault copies.
      writeFileSync(to, readFileSync(from));
    }
  }
}

function replaceWithSymlink(linkAbs: string, targetAbs: string) {
  const relTarget = relative(dirname(linkAbs), targetAbs);
  if (existsSync(linkAbs) || isSymlink(linkAbs)) {
    rmSync(linkAbs, { recursive: true, force: true });
  }
  ensureDir(dirname(linkAbs));
  symlinkSync(relTarget, linkAbs);
}

function linkOne(opts: {
  repoRoot: string;
  occAbs: string;
  vaultAbs: string;
  label: string;
  result: VaultSotResult;
}) {
  const { occAbs, vaultAbs, label, result } = opts;
  ensureDir(dirname(vaultAbs));

  if (isSymlink(occAbs)) {
    try {
      ensureDir(vaultAbs);
      const pointsTo = resolve(dirname(occAbs), readlinkSync(occAbs));
      if (realpathSync(pointsTo) === realpathSync(vaultAbs)) {
        result.alreadyLinked += 1;
        result.linked.push(label);
        return;
      }
    } catch {
      /* fall through and repair */
    }
  }

  if (existsSync(occAbs) && !isSymlink(occAbs)) {
    if (existsSync(vaultAbs) && !isSymlink(vaultAbs)) {
      mergeDirInto(occAbs, vaultAbs);
    } else if (!existsSync(vaultAbs)) {
      ensureDir(dirname(vaultAbs));
      renameSync(occAbs, vaultAbs);
    } else {
      mergeDirInto(occAbs, vaultAbs);
    }
    result.moved.push(label);
  } else if (!existsSync(vaultAbs)) {
    ensureDir(vaultAbs);
  }

  replaceWithSymlink(occAbs, vaultAbs);
  result.linked.push(label);
}

function pointsAtVault(occAbs: string, vaultAbs: string): boolean {
  if (!isSymlink(occAbs) || !existsSync(vaultAbs)) return false;
  try {
    const pointsTo = resolve(dirname(occAbs), readlinkSync(occAbs));
    return realpathSync(pointsTo) === realpathSync(vaultAbs);
  } catch {
    return false;
  }
}

/** Read-only: whether OCC note paths already symlink into the vault. */
export function inspectVentureVaultSourceOfTruth(
  repoRoot: string,
  venture?: string,
): VaultSotStatus {
  const reg = loadRegistry(repoRoot);
  const slug = venture || reg.active.customer;
  let resolved;
  try {
    resolved = venture
      ? getCustomerMain(reg, slug, DEFAULT_ORG_SLUG)
      : getInitiative(reg);
  } catch {
    return {
      ok: false,
      venture: slug,
      vaultRoot: vaultOrgRootRel(slug),
      linked: [],
      pending: ["unknown-venture"],
      ready: false,
    };
  }
  const vaultRootRel = vaultRootForInitiative(resolved.ref, resolved.entry.businessIdea);
  const vaultRootAbs = join(repoRoot, vaultRootRel);
  const ideaAbs = join(repoRoot, resolved.entry.businessIdea);
  const memOccAbs = join(repoRoot, resolved.entry.memory);
  const linked: string[] = [];
  const pending: string[] = [];

  for (const name of VAULT_IDEA_LINKS) {
    const occAbs = join(ideaAbs, name);
    const vaultAbs = join(vaultRootAbs, name);
    if (pointsAtVault(occAbs, vaultAbs)) linked.push(name);
    else pending.push(name);
  }
  if (pointsAtVault(memOccAbs, join(vaultRootAbs, "MEMORY"))) linked.push("MEMORY");
  else pending.push("MEMORY");

  if (existsSync(ideaAbs)) {
    let phasePending = false;
    for (const name of readdirSync(ideaAbs)) {
      if (!name.endsWith(".md") || !/^\d/.test(name)) continue;
      const occFile = join(ideaAbs, name);
      if (!isSymlink(occFile) && existsSync(occFile) && lstatSync(occFile).isFile()) {
        phasePending = true;
        break;
      }
    }
    if (phasePending) pending.push("phases");
    else if (existsSync(join(vaultRootAbs, "phases"))) linked.push("phases");
  }

  return {
    ok: true,
    venture: slug,
    vaultRoot: vaultRootRel,
    linked,
    pending,
    ready: pending.length === 0,
  };
}

/**
 * Make `memorybank/org/<venture>` the source of truth for role notes.
 * OCC keeps stable paths under docs/projects/... as relative symlinks into the vault.
 */
function linkWorkspaceToVault(
  repoRoot: string,
  opts: {
    label: string;
    businessIdeaRel: string;
    memoryRel: string;
    vaultRootRel: string;
  },
): VaultSotResult {
  const vaultRootAbs = join(repoRoot, opts.vaultRootRel);
  const ideaAbs = join(repoRoot, opts.businessIdeaRel);
  const memOccAbs = join(repoRoot, opts.memoryRel);

  const result: VaultSotResult = {
    ok: true,
    venture: opts.label,
    vaultRoot: opts.vaultRootRel,
    linked: [],
    alreadyLinked: 0,
    moved: [],
    errors: [],
  };

  try {
    ensureDir(vaultRootAbs);

    for (const name of VAULT_IDEA_LINKS) {
      linkOne({
        repoRoot,
        occAbs: join(ideaAbs, name),
        vaultAbs: join(vaultRootAbs, name),
        label: name,
        result,
      });
    }

    linkOne({
      repoRoot,
      occAbs: memOccAbs,
      vaultAbs: join(vaultRootAbs, "MEMORY"),
      label: "MEMORY",
      result,
    });

    const phasesVault = join(vaultRootAbs, "phases");
    ensureDir(phasesVault);
    if (existsSync(ideaAbs)) {
      for (const name of readdirSync(ideaAbs)) {
        if (!name.endsWith(".md")) continue;
        if (!/^\d/.test(name) && !/^(00-intake)/i.test(name)) continue;
        const occFile = join(ideaAbs, name);
        const vaultFile = join(phasesVault, name);
        if (isSymlink(occFile)) {
          result.alreadyLinked += 1;
          continue;
        }
        if (existsSync(occFile) && lstatSync(occFile).isFile()) {
          if (existsSync(vaultFile)) {
            writeFileSync(vaultFile, readFileSync(occFile));
          } else {
            renameSync(occFile, vaultFile);
          }
          replaceWithSymlink(occFile, vaultFile);
          result.moved.push(`phases/${name}`);
          result.linked.push(`phases/${name}`);
        }
      }
    }
  } catch (e) {
    result.ok = false;
    result.errors.push(e instanceof Error ? e.message : String(e));
  }

  return result;
}

export function ensureInitiativeVaultSourceOfTruth(
  repoRoot: string,
  ref: ActiveRef,
): VaultSotResult {
  const reg = loadRegistry(repoRoot);
  let resolved;
  try {
    resolved = getInitiative(reg, ref);
  } catch (e) {
    return {
      ok: false,
      venture: `${ref.customer}/${ref.initiative}`,
      vaultRoot: "",
      linked: [],
      alreadyLinked: 0,
      moved: [],
      errors: [e instanceof Error ? e.message : String(e)],
    };
  }
  return linkWorkspaceToVault(repoRoot, {
    label: `${ref.customer}/${ref.initiative}`,
    businessIdeaRel: resolved.entry.businessIdea,
    memoryRel: resolved.entry.memory,
    vaultRootRel: vaultRootForInitiative(resolved.ref, resolved.entry.businessIdea),
  });
}

export function ensureVentureVaultSourceOfTruth(
  repoRoot: string,
  venture?: string,
): VaultSotResult {
  const reg = loadRegistry(repoRoot);
  const slug = venture || reg.active.customer;
  let resolved;
  try {
    resolved = venture
      ? getCustomerMain(reg, slug, DEFAULT_ORG_SLUG)
      : getInitiative(reg);
  } catch {
    return {
      ok: false,
      venture: slug,
      vaultRoot: "",
      linked: [],
      alreadyLinked: 0,
      moved: [],
      errors: [`unknown venture: ${slug}`],
    };
  }

  return linkWorkspaceToVault(repoRoot, {
    label: slug,
    businessIdeaRel: resolved.entry.businessIdea,
    memoryRel: resolved.entry.memory,
    vaultRootRel: vaultRootForInitiative(resolved.ref, resolved.entry.businessIdea),
  });
}
