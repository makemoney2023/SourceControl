import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import type { RosterEntry } from "../../src/lib/types";
import type { OrgWorkGraph, OrgWorkNode } from "../../src/jarvis/org-work-graph";
import { initiativeMocTitle } from "../../src/jarvis/graph-scope";
import type { PortfolioRegistry } from "../portfolio-registry";

/**
 * Sanitize a filesystem-hostile chunk of text so the on-disk filename and the
 * `[[wiki link]]` body match. Obsidian's graph cannot resolve notes whose
 * filename contains `/` (they become nested folders), so we replace path
 * separators consistently on both sides.
 */
function sanitizePathSegment(s: string): string {
  return s.replace(/[\\/:]+/g, " - ").replace(/\s+/g, " ").trim();
}

export function seatMocTitle(seatTitle: string, initiativeTitle: string): string {
  return `${sanitizePathSegment(seatTitle)} — ${sanitizePathSegment(initiativeTitle)}`;
}

export function phaseMocTitle(phaseNumber: string, initiativeTitle: string): string {
  return `Phase ${phaseNumber} — ${sanitizePathSegment(initiativeTitle)}`;
}

export type MocSeat = {
  title: string;
  slug?: string;
  links: string[];
};

export type MocPhase = {
  number: string;
  links?: string[];
};

export type MocInitiative = {
  title: string;
  seats: MocSeat[];
  phases?: MocPhase[];
};

export type MocCustomer = { name: string; initiatives: MocInitiative[] };

export type MocSkill = { slug: string; name?: string };

export type MocFooter = { abs: string; links: string[] };

export type MocInput = {
  orgName: string;
  customers: MocCustomer[];
  skills?: MocSkill[];
  footers?: MocFooter[];
};

export type SyncVaultGraphResult = {
  mocCount: number;
  footers: number;
  skipped: string[];
};

/**
 * Write `body` to `abs` iff the on-disk content differs. Returns true if a
 * write happened. Idempotent no-op writes are how we avoid chokidar SSE churn.
 */
function writeNoteIfChanged(abs: string, body: string): boolean {
  const content = body.endsWith("\n") ? body : `${body}\n`;
  if (existsSync(abs)) {
    try {
      const current = readFileSync(abs, "utf8");
      if (current === content) return false;
    } catch {
      // fall through to write
    }
  }
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content);
  return true;
}

function renderSeatMocBody(title: string, links: string[]): string {
  const bullets = links.length > 0
    ? links.map((l) => `- ${l}`).join("\n")
    : "_No graph links yet._";
  return `# ${title}\n\n${bullets}\n`;
}

function renderPhaseMocBody(title: string, links: string[]): string {
  const bullets = links.length > 0
    ? links.map((l) => `- ${l}`).join("\n")
    : "_No graph links yet._";
  return `# ${title}\n\n${bullets}\n`;
}

function renderSkillMocBody(skill: MocSkill): string {
  const name = skill.name || skill.slug;
  return `# ${name}\n`;
}

/**
 * Rewrite structure notes (agency/customer/initiative) unconditionally.
 * Seat, phase, and skill MOCs are only overwritten when they either have
 * real links OR the file does not yet exist (empty stub is OK for first
 * create). This keeps agency-only syncs from blanking populated seat MOCs.
 */
export function writeGraphMocs(repoRoot: string, input: MocInput): number {
  const base = join(repoRoot, "memorybank/org/GRAPH");
  let count = 0;

  if (
    writeNoteIfChanged(
      join(base, `${input.orgName}.md`),
      `# ${input.orgName}\n\n## Customers\n\n${input.customers
        .map((c) => `- [[${c.name}]]`)
        .join("\n")}\n`,
    )
  ) {
    count += 1;
  }

  for (const c of input.customers) {
    if (
      writeNoteIfChanged(
        join(base, `${c.name}.md`),
        `# ${c.name}\n\n## Initiatives\n\n${c.initiatives
          .map((i) => `- [[${i.title}]]`)
          .join("\n")}\n`,
      )
    ) {
      count += 1;
    }
    for (const i of c.initiatives) {
      if (
        writeNoteIfChanged(
          join(base, `${i.title}.md`),
          `# ${i.title}\n\n## Seats\n\n${i.seats
            .map((s) => `- [[${seatMocTitle(s.title, i.title)}]]`)
            .join("\n")}\n`,
        )
      ) {
        count += 1;
      }
      for (const s of i.seats) {
        const title = seatMocTitle(s.title, i.title);
        const abs = join(base, "seats", `${title}.md`);
        const shouldWrite = s.links.length > 0 || !existsSync(abs);
        if (!shouldWrite) continue;
        if (writeNoteIfChanged(abs, renderSeatMocBody(title, s.links))) {
          count += 1;
        }
      }
      for (const p of i.phases ?? []) {
        const title = phaseMocTitle(p.number, i.title);
        const abs = join(base, "phases", `${title}.md`);
        const links = p.links ?? [];
        const shouldWrite = links.length > 0 || !existsSync(abs);
        if (!shouldWrite) continue;
        if (writeNoteIfChanged(abs, renderPhaseMocBody(title, links))) {
          count += 1;
        }
      }
    }
  }

  for (const skill of input.skills ?? []) {
    const abs = join(base, "skills", `${sanitizePathSegment(skill.slug)}.md`);
    if (writeNoteIfChanged(abs, renderSkillMocBody(skill))) {
      count += 1;
    }
  }

  return count;
}

export const FOOTER_START = "<!-- graph:start -->";
export const FOOTER_END = "<!-- graph:end -->";

export function upsertGraphFooter(markdown: string, links: string[]): string {
  const block = `${FOOTER_START}\n${links.join(" · ")}\n${FOOTER_END}\n`;
  const re = new RegExp(
    `${FOOTER_START.replace(/[<>!-]/g, "\\$&")}[\\s\\S]*?${FOOTER_END.replace(/[<>!-]/g, "\\$&")}\\n?`,
  );
  if (re.test(markdown)) return markdown.replace(re, block);
  const trimmed = markdown.endsWith("\n") ? markdown : `${markdown}\n`;
  return `${trimmed}\n${block}`;
}

export function applyFooters(
  _repoRoot: string,
  files: { abs: string; links: string[] }[],
) {
  for (const { abs, links } of files) {
    if (!existsSync(abs)) continue;
    const body = readFileSync(abs, "utf8");
    const next = upsertGraphFooter(body, links);
    if (next !== body) writeFileSync(abs, next);
  }
}

function resolveHandoffAbs(repoRoot: string, pathOrAbs: string): string {
  return isAbsolute(pathOrAbs) ? pathOrAbs : join(repoRoot, pathOrAbs);
}

/**
 * Writes GRAPH MOCs then upserts footers on existing files listed in
 * `meta.footers`. Never throws to the caller — failures are recorded in
 * `skipped`.
 */
export function syncVaultGraph(
  repoRoot: string,
  meta: MocInput,
): SyncVaultGraphResult {
  const skipped: string[] = [];
  let mocCount = 0;
  let footers = 0;

  try {
    mocCount = writeGraphMocs(repoRoot, meta);
  } catch (err) {
    skipped.push(`mocs:${err instanceof Error ? err.message : String(err)}`);
  }

  for (const { abs: pathOrAbs, links } of meta.footers ?? []) {
    const abs = resolveHandoffAbs(repoRoot, pathOrAbs);
    try {
      if (!existsSync(abs)) {
        skipped.push(abs);
        continue;
      }
      const body = readFileSync(abs, "utf8");
      const next = upsertGraphFooter(body, links);
      if (next !== body) {
        writeFileSync(abs, next);
      }
      footers += 1;
    } catch {
      skipped.push(abs);
    }
  }

  return { mocCount, footers, skipped };
}

// -----------------------------------------------------------------------------
// mocMetaFromRegistry: build MocInput from a set of per-initiative work graphs
// -----------------------------------------------------------------------------

export type InitiativeWorkInput = {
  customer: string;
  initiative: string;
  /** Full (non-namespaced) per-initiative work graph; omit for agency-only. */
  work?: OrgWorkGraph;
  /** Optional absolute path to that initiative's HANDOFFS dir. Defaults to
   *  the registry-declared businessIdea/HANDOFFS join. */
  handoffsDirAbs?: string;
  /** Optional absolute path to that initiative's REVIEW/inbox dir. */
  reviewInboxDirAbs?: string;
};

function extractHandoffFilename(node: OrgWorkNode): string | null {
  // Bare handoff:<filename> id, or `handoff:` prefix.
  const m = /^handoff:(.+)$/.exec(node.id);
  if (m) return m[1]!.endsWith(".md") ? m[1]! : `${m[1]}.md`;
  if (node.kind === "handoff" && node.label) {
    return node.label.endsWith(".md") ? node.label : `${node.label}.md`;
  }
  return null;
}

function extractSkillSlug(pathOrSlug: string): string {
  const parts = pathOrSlug.split(/[\\/]/).filter(Boolean);
  const last = parts[parts.length - 1] || pathOrSlug;
  if (/^SKILL\.md$/i.test(last) && parts.length >= 2) {
    return parts[parts.length - 2]!;
  }
  return last.replace(/\.md$/i, "");
}

/**
 * Build MOC input from the active org registry + per-initiative work.
 *
 * Callers pass the initiatives they want reflected in the vault. When `work`
 * is omitted for an initiative, we still write structure notes but do NOT
 * seed empty seat MOCs (that would clobber existing populated seat notes).
 */
export function mocMetaFromRegistry(
  reg: PortfolioRegistry,
  initiativeWork: InitiativeWorkInput[],
  roster: RosterEntry[] = [],
): MocInput {
  const orgSlug = reg.active.org;
  const orgEntry = reg.orgs[orgSlug];
  const orgName = orgEntry?.name ?? orgSlug;
  const customers = orgEntry?.customers ?? {};

  const titleBySlug = new Map(roster.map((r) => [r.slug, r.title]));

  const nameCounts = new Map<string, number>();
  for (const customer of Object.values(customers)) {
    for (const init of Object.values(customer.initiatives)) {
      nameCounts.set(init.name, (nameCounts.get(init.name) ?? 0) + 1);
    }
  }

  // key: `${customer}/${initiative}` → { seats, phases, footers, initiativeMocTitle }
  type SeatAcc = {
    title: string;
    links: Set<string>;
  };
  type PhaseAcc = {
    number: string;
    links: Set<string>;
  };
  type InitAcc = {
    customerSlug: string;
    initiativeSlug: string;
    customerName: string;
    initiativeName: string;
    mocTitle: string;
    seats: Map<string, SeatAcc>;
    phases: Map<string, PhaseAcc>;
    footers: MocFooter[];
    handoffsDir: string | null;
  };

  const initAccs = new Map<string, InitAcc>();
  const skillSlugs = new Set<string>();

  for (const iw of initiativeWork) {
    const customer = customers[iw.customer];
    const init = customer?.initiatives[iw.initiative];
    if (!customer || !init) continue;

    const uniqueInAgency = (nameCounts.get(init.name) ?? 0) === 1;
    const mocTitle = initiativeMocTitle({
      initiativeName: init.name,
      customerName: customer.name,
      uniqueInAgency,
    });
    const acc: InitAcc = {
      customerSlug: iw.customer,
      initiativeSlug: iw.initiative,
      customerName: customer.name,
      initiativeName: init.name,
      mocTitle,
      seats: new Map(),
      phases: new Map(),
      footers: [],
      handoffsDir: iw.handoffsDirAbs
        ? iw.handoffsDirAbs
        : init.businessIdea
          ? join(init.businessIdea, "HANDOFFS")
          : null,
    };
    initAccs.set(`${iw.customer}/${iw.initiative}`, acc);

    const work = iw.work;
    if (!work) continue;

    // Track seat labels from graph so we prefer live titles when available.
    for (const n of work.nodes) {
      if (n.kind === "seat" && n.slug) {
        titleBySlug.set(n.slug, n.label);
      }
    }

    const ensureSeat = (slug: string): SeatAcc => {
      let s = acc.seats.get(slug);
      if (!s) {
        s = { title: titleBySlug.get(slug) ?? slug, links: new Set() };
        acc.seats.set(slug, s);
      }
      return s;
    };
    const ensurePhase = (num: string): PhaseAcc => {
      let p = acc.phases.get(num);
      if (!p) {
        p = { number: num, links: new Set() };
        acc.phases.set(num, p);
      }
      return p;
    };

    // Register any seats that actually appear in this initiative's work.
    for (const n of work.nodes) {
      if (n.kind === "seat" && n.slug) ensureSeat(n.slug);
    }

    // Handoffs → seat links, phase links, footers, skill stubs.
    for (const n of work.nodes) {
      if (n.kind !== "handoff") continue;
      const filename = extractHandoffFilename(n);
      if (!filename) continue;
      const seatSlug = (n.slug || "").trim();
      if (!seatSlug) continue;
      const label = n.label || filename.replace(/\.md$/i, "");
      const wiki = `[[${label}]]`;

      const seat = ensureSeat(seatSlug);
      seat.links.add(wiki);

      if (n.phase) {
        const phase = ensurePhase(n.phase);
        phase.links.add(wiki);
      }

      // Skill stubs from the position's own pack + declared packs.
      skillSlugs.add(seatSlug);
      for (const p of n.packsUsed ?? []) {
        if (p) skillSlugs.add(extractSkillSlug(p));
      }

      // Footer content: initiative MOC + seat MOC + phase MOC + related work.
      const seatTitle = titleBySlug.get(seatSlug) ?? seatSlug;
      const footerLinks: string[] = [];
      footerLinks.push(`[[${acc.mocTitle}]]`);
      footerLinks.push(`[[${seatMocTitle(seatTitle, acc.mocTitle)}]]`);
      if (n.phase) {
        footerLinks.push(`[[${phaseMocTitle(n.phase, acc.mocTitle)}]]`);
      }
      // Related work: spawned IC handoffs (best-effort — look them up by
      // slug + phase in the same graph).
      const spawnedSlugs = new Set(n.icsSpawned ?? []);
      for (const other of work.nodes) {
        if (other === n) continue;
        if (other.kind !== "handoff") continue;
        if (!other.slug || !spawnedSlugs.has(other.slug)) continue;
        if (n.phase && other.phase && n.phase !== other.phase) continue;
        const otherFilename = extractHandoffFilename(other);
        if (!otherFilename) continue;
        const otherLabel = other.label || otherFilename.replace(/\.md$/i, "");
        footerLinks.push(`[[${otherLabel}]]`);
      }

      if (acc.handoffsDir) {
        acc.footers.push({
          abs: join(acc.handoffsDir, filename),
          links: footerLinks,
        });
      }
    }
  }

  const mocCustomers: MocCustomer[] = [];
  for (const [customerSlug, customer] of Object.entries(customers)) {
    const initiatives: MocInitiative[] = [];
    for (const [initSlug, init] of Object.entries(customer.initiatives)) {
      const uniqueInAgency = (nameCounts.get(init.name) ?? 0) === 1;
      const mocTitle = initiativeMocTitle({
        initiativeName: init.name,
        customerName: customer.name,
        uniqueInAgency,
      });
      const acc = initAccs.get(`${customerSlug}/${initSlug}`);
      const seats: MocSeat[] = acc
        ? [...acc.seats.entries()].map(([slug, s]) => ({
            title: s.title,
            slug,
            links: [...s.links],
          }))
        : [];
      const phases: MocPhase[] = acc
        ? [...acc.phases.values()]
            .sort((a, b) => a.number.localeCompare(b.number))
            .map((p) => ({ number: p.number, links: [...p.links] }))
        : [];
      initiatives.push({ title: mocTitle, seats, phases });
    }
    mocCustomers.push({ name: customer.name, initiatives });
  }

  const skills: MocSkill[] = [...skillSlugs].sort().map((slug) => ({
    slug,
    name: titleBySlug.get(slug),
  }));

  const footers: MocFooter[] = [];
  for (const acc of initAccs.values()) footers.push(...acc.footers);

  return { orgName, customers: mocCustomers, skills, footers };
}
