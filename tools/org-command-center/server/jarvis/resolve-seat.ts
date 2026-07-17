export type SeatIdentity = {
  slug: string;
  title: string;
};

/** Normalize spoken / titled seat names toward slug form. */
export function normalizeSeatKey(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/\bfp\s*&\s*a\b/g, "fpa")
    .replace(/&/g, " and ")
    .replace(/[/_]+/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Short corporate nicknames — only win when unambiguous after roster indexing. */
const EXTRA_ALIASES: Record<string, string> = {
  ceo: "ceo-strategist",
  "chief-executive": "ceo-strategist",
  "chief-executive-officer": "ceo-strategist",
  "c-suite": "ceo-strategist",
  csuite: "ceo-strategist",
  "executive-team": "ceo-strategist",

  "chief-financial-officer": "cfo",
  "chief-marketing-officer": "cmo",
  "chief-technology-officer": "cto",
  "chief-operating-officer": "coo",
  counsel: "legal-counsel",
  legal: "legal-counsel",
  fpa: "fpa-analyst",
  "fp-a": "fpa-analyst",
  sales: "head-of-sales-cs",
  cs: "head-of-sales-cs",
  eng: "cto",
  engineering: "cto",
  research: "head-of-research",
  product: "head-of-product",
  people: "head-of-people",
  data: "head-of-data",
  creative: "creative-director",
  marketing: "cmo",
  finance: "cfo",
  ops: "ops-manager",
};

function addKey(keys: Set<string>, raw: string) {
  const key = normalizeSeatKey(raw);
  if (!key) return;
  keys.add(key);
  const withoutAnd = key.replace(/-and-/g, "-");
  if (withoutAnd) keys.add(withoutAnd);
  const compact = key.replace(/-/g, "");
  if (compact.length >= 3) keys.add(compact);
}

/** All lookup keys derived from one seat (slug + title + slash segments). */
export function seatAliasKeys(seat: SeatIdentity): string[] {
  const keys = new Set<string>();
  addKey(keys, seat.slug);
  addKey(keys, seat.title);
  for (const part of seat.title.split(/[/&]/)) {
    addKey(keys, part);
  }
  return [...keys];
}

function buildAliasIndex(roster: SeatIdentity[]): Map<string, string> {
  const candidates = new Map<string, Set<string>>();
  const add = (key: string, slug: string) => {
    if (!key) return;
    let set = candidates.get(key);
    if (!set) {
      set = new Set();
      candidates.set(key, set);
    }
    set.add(slug);
  };

  for (const seat of roster) {
    for (const key of seatAliasKeys(seat)) {
      add(key, seat.slug);
    }
  }

  // Prefer EXTRA only when that key is unused or already uniquely that slug.
  for (const [key, slug] of Object.entries(EXTRA_ALIASES)) {
    if (!roster.some((r) => r.slug === slug)) continue;
    const existing = candidates.get(key);
    if (!existing || (existing.size === 1 && existing.has(slug)) || existing.size === 0) {
      candidates.set(key, new Set([slug]));
    } else if (!existing.has(slug) && existing.size > 1) {
      // leave ambiguous
    } else if (existing.has(slug) && existing.size > 1) {
      candidates.set(key, new Set([slug]));
    }
  }

  const unique = new Map<string, string>();
  for (const [key, slugs] of candidates) {
    if (slugs.size === 1) unique.set(key, [...slugs][0]!);
  }
  return unique;
}

/**
 * Resolve a spoken name, title, or slug to a roster slug.
 * Returns null when no unique match exists.
 */
export function resolveSeatSlug(raw: string, roster: SeatIdentity[]): string | null {
  const key = normalizeSeatKey(raw);
  if (!key) return null;

  const index = buildAliasIndex(roster);

  if (index.has(key)) return index.get(key)!;

  const withoutAnd = key.replace(/-and-/g, "-");
  if (withoutAnd !== key && index.has(withoutAnd)) return index.get(withoutAnd)!;

  const compact = key.replace(/-/g, "");
  if (compact !== key && index.has(compact)) return index.get(compact)!;

  // Last resort: unique slug containment (avoid short keys like "cs").
  if (key.length >= 4) {
    const contains = roster.filter((r) => r.slug.includes(key) || key.includes(r.slug));
    if (contains.length === 1) return contains[0]!.slug;
  }

  return null;
}
