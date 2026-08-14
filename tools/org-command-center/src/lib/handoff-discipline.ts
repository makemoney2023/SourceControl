export const BRIEF_ECHO_THRESHOLD = 0.35;

const ALWAYS_ALLOWED = [
  "skills/org/HANDOFF-TEMPLATE.md",
  "skills/org/MANAGER-BRIEF-TEMPLATE.md",
  "skills/org/CSUITE-REVIEW-TEMPLATE.md",
  "skills/org/COLLABORATION.md",
];

export function tokenizeBrief(text: string): Set<string> {
  return new Set(text.toLowerCase().match(/[a-z0-9-]{4,}/g) ?? []);
}

export function briefJaccard(a: string, b: string): number {
  const A = tokenizeBrief(a);
  const B = tokenizeBrief(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter += 1;
  return inter / new Set([...A, ...B]).size;
}

export function findBriefEcho(
  candidate: string,
  others: { filename: string; brief: string }[],
  threshold = BRIEF_ECHO_THRESHOLD,
): string | null {
  for (const other of others) {
    if (briefJaccard(candidate, other.brief) > threshold) return other.filename;
  }
  return null;
}

function packKey(p: string): string {
  return p.replace(/\/SKILL\.md$/i, "").replace(/\/+$/, "").toLowerCase();
}

export function packsNotAllowed(
  used: string[],
  allowed: string[],
  alwaysAllowed = ALWAYS_ALLOWED,
): string[] {
  const ok = new Set([...allowed, ...alwaysAllowed].map(packKey));
  return used.filter((p) => {
    const key = packKey(p);
    if (ok.has(key)) return false;
    for (const a of ok) {
      if (key.startsWith(a) || a.startsWith(key)) return false;
    }
    return true;
  });
}
