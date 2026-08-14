import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import type { RosterEntry } from "../../src/lib/types";
import type { OrgWorkGraph, OrgWorkNode } from "../../src/jarvis/org-work-graph";
import { initiativeMocTitle } from "../../src/jarvis/graph-scope";
import type { PortfolioRegistry } from "../portfolio-registry";

export function seatMocTitle(seatTitle: string, initiativeTitle: string): string {
  return `${seatTitle} — ${initiativeTitle}`;
}

export type MocSeat = {
  title: string;
  links: string[];
  handoffAbsPaths?: string[];
};
export type MocInitiative = { title: string; seats: MocSeat[] };
export type MocCustomer = { name: string; initiatives: MocInitiative[] };
export type MocInput = { orgName: string; customers: MocCustomer[] };

export type SyncVaultGraphResult = {
  mocCount: number;
  footers: number;
  skipped: string[];
};

function writeNote(abs: string, body: string) {
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, body.endsWith("\n") ? body : `${body}\n`);
}

export function writeGraphMocs(repoRoot: string, input: MocInput): number {
  const base = join(repoRoot, "memorybank/org/GRAPH");
  let count = 0;
  writeNote(
    join(base, `${input.orgName}.md`),
    `# ${input.orgName}\n\n## Customers\n\n${input.customers.map((c) => `- [[${c.name}]]`).join("\n")}\n`,
  );
  count += 1;
  for (const c of input.customers) {
    writeNote(
      join(base, `${c.name}.md`),
      `# ${c.name}\n\n## Initiatives\n\n${c.initiatives.map((i) => `- [[${i.title}]]`).join("\n")}\n`,
    );
    count += 1;
    for (const i of c.initiatives) {
      writeNote(
        join(base, `${i.title}.md`),
        `# ${i.title}\n\n## Seats\n\n${i.seats.map((s) => `- [[${seatMocTitle(s.title, i.title)}]]`).join("\n")}\n`,
      );
      count += 1;
      for (const s of i.seats) {
        writeNote(
          join(base, "seats", `${seatMocTitle(s.title, i.title)}.md`),
          `# ${seatMocTitle(s.title, i.title)}\n\n${s.links.map((l) => `- ${l}`).join("\n")}\n`,
        );
        count += 1;
      }
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
    writeFileSync(abs, upsertGraphFooter(body, links));
  }
}

function resolveHandoffAbs(repoRoot: string, pathOrAbs: string): string {
  return isAbsolute(pathOrAbs) ? pathOrAbs : join(repoRoot, pathOrAbs);
}

/**
 * Writes GRAPH MOCs then upserts footers on existing handoff notes.
 * Never throws to the caller — failures are recorded in `skipped`.
 */
export function syncVaultGraph(
  repoRoot: string,
  _graph: OrgWorkGraph,
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

  for (const customer of meta.customers) {
    for (const initiative of customer.initiatives) {
      for (const seat of initiative.seats) {
        for (const pathOrAbs of seat.handoffAbsPaths ?? []) {
          const abs = resolveHandoffAbs(repoRoot, pathOrAbs);
          try {
            if (!existsSync(abs)) {
              skipped.push(abs);
              continue;
            }
            const body = readFileSync(abs, "utf8");
            writeFileSync(abs, upsertGraphFooter(body, seat.links));
            footers += 1;
          } catch {
            skipped.push(abs);
          }
        }
      }
    }
  }

  return { mocCount, footers, skipped };
}

const INIT_HANDOFF_RE = /^initiative:([^/]+)\/([^:]+):handoff:(.+)$/;
const INIT_SEAT_RE = /^initiative:([^/]+)\/([^:]+):seat:(.+)$/;
const BARE_HANDOFF_RE = /^handoff:(.+)$/;

function handoffFilename(node: OrgWorkNode): string | null {
  const ns = INIT_HANDOFF_RE.exec(node.id);
  if (ns) return ns[3]!.endsWith(".md") ? ns[3]! : `${ns[3]}.md`;
  const bare = BARE_HANDOFF_RE.exec(node.id);
  if (bare) return bare[1]!.endsWith(".md") ? bare[1]! : `${bare[1]}.md`;
  if (node.kind === "handoff" && node.label) {
    return node.label.endsWith(".md") ? node.label : `${node.label}.md`;
  }
  return null;
}

function parseInitiativeScope(
  nodeId: string,
): { customer: string; initiative: string } | null {
  const m = /^initiative:([^/]+)\/([^:]+):/.exec(nodeId);
  if (!m) return null;
  return { customer: m[1]!, initiative: m[2]! };
}

/**
 * Build MOC input from the active org registry + graph handoff/seat nodes.
 * Handoff paths are relative to repoRoot (`businessIdea/HANDOFFS/...`) unless
 * the caller later passes absolute paths in tests.
 */
export function mocMetaFromRegistry(
  reg: PortfolioRegistry,
  graph: OrgWorkGraph,
  roster: RosterEntry[] = [],
): MocInput {
  const orgSlug = reg.active.org;
  const orgEntry = reg.orgs[orgSlug];
  const orgName = orgEntry?.name ?? orgSlug;
  const customers = orgEntry?.customers ?? {};

  const titleBySlug = new Map(roster.map((r) => [r.slug, r.title]));
  for (const n of graph.nodes) {
    if (n.kind === "seat" && n.slug) {
      titleBySlug.set(n.slug, n.label);
    }
  }

  const nameCounts = new Map<string, number>();
  for (const customer of Object.values(customers)) {
    for (const init of Object.values(customer.initiatives)) {
      nameCounts.set(init.name, (nameCounts.get(init.name) ?? 0) + 1);
    }
  }

  type SeatAcc = {
    title: string;
    links: Set<string>;
    handoffAbsPaths: Set<string>;
  };
  const seatsByInit = new Map<string, Map<string, SeatAcc>>();

  const ensureSeat = (
    customerSlug: string,
    initiativeSlug: string,
    seatSlug: string,
  ): SeatAcc => {
    const key = `${customerSlug}/${initiativeSlug}`;
    let bySeat = seatsByInit.get(key);
    if (!bySeat) {
      bySeat = new Map();
      seatsByInit.set(key, bySeat);
    }
    let seat = bySeat.get(seatSlug);
    if (!seat) {
      seat = {
        title: titleBySlug.get(seatSlug) ?? seatSlug,
        links: new Set(),
        handoffAbsPaths: new Set(),
      };
      bySeat.set(seatSlug, seat);
    }
    return seat;
  };

  for (const n of graph.nodes) {
    if (n.kind === "seat" && n.slug) {
      const scope = parseInitiativeScope(n.id);
      const seatMatch = INIT_SEAT_RE.exec(n.id);
      if (scope) {
        ensureSeat(scope.customer, scope.initiative, n.slug);
      } else if (seatMatch) {
        ensureSeat(seatMatch[1]!, seatMatch[2]!, n.slug);
      }
    }
  }

  for (const n of graph.nodes) {
    if (n.kind !== "handoff") continue;
    const filename = handoffFilename(n);
    if (!filename) continue;
    const seatSlug = (n.slug || "").trim();
    if (!seatSlug) continue;

    const scope = parseInitiativeScope(n.id);
    const label = n.label || filename.replace(/\.md$/i, "");
    const wiki = `[[${label}]]`;

    if (scope) {
      const initEntry = customers[scope.customer]?.initiatives[scope.initiative];
      const seat = ensureSeat(scope.customer, scope.initiative, seatSlug);
      seat.links.add(wiki);
      if (initEntry?.businessIdea) {
        seat.handoffAbsPaths.add(join(initEntry.businessIdea, "HANDOFFS", filename));
      }
    } else {
      // Un-namespaced handoffs (rare / tests): attach under every initiative that has a matching businessIdea path presence is deferred; skip abs paths.
      for (const [customerSlug, customer] of Object.entries(customers)) {
        for (const initiativeSlug of Object.keys(customer.initiatives)) {
          const seat = ensureSeat(customerSlug, initiativeSlug, seatSlug);
          seat.links.add(wiki);
        }
      }
    }
  }

  // Seed roster seats so agency-only sync still writes per-initiative seat MOCs.
  if (roster.length > 0) {
    for (const [customerSlug, customer] of Object.entries(customers)) {
      for (const initiativeSlug of Object.keys(customer.initiatives)) {
        for (const r of roster) {
          ensureSeat(customerSlug, initiativeSlug, r.slug);
        }
      }
    }
  }

  const mocCustomers: MocCustomer[] = [];
  for (const [customerSlug, customer] of Object.entries(customers)) {
    const initiatives: MocInitiative[] = [];
    for (const [initiativeSlug, init] of Object.entries(customer.initiatives)) {
      const uniqueInAgency = (nameCounts.get(init.name) ?? 0) === 1;
      const title = initiativeMocTitle({
        initiativeName: init.name,
        customerName: customer.name,
        uniqueInAgency,
      });
      const seatMap = seatsByInit.get(`${customerSlug}/${initiativeSlug}`);
      const seats: MocSeat[] = [];
      if (seatMap) {
        for (const seat of seatMap.values()) {
          seats.push({
            title: seat.title,
            links: [...seat.links],
            handoffAbsPaths: [...seat.handoffAbsPaths],
          });
        }
      }
      initiatives.push({ title, seats });
    }
    mocCustomers.push({ name: customer.name, initiatives });
  }

  return { orgName, customers: mocCustomers };
}
