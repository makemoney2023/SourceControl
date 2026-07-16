const MAP: Record<string, string> = {
  legal: "coo",
  brand: "creative-director",
  spend: "cfo",
  scope: "head-of-product",
  evidence: "head-of-research",
};

/** Map ESCALATION.md tags → secondary reviewer slugs (deduped, stable order). */
export function resolveEscalationSecondaries(tags: string[]): string[] {
  const out: string[] = [];
  for (const t of tags) {
    const s = MAP[t.toLowerCase()];
    if (s && !out.includes(s)) out.push(s);
  }
  return out;
}
