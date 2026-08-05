import { JarvisExecError } from "./errors";

export function significantTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3);
}

/** Best open ask for a freeform answer, or null if no unique overlap. */
export function fuzzyMatchOpenAsk(
  answer: string,
  openAsks: string[],
): string | null {
  const answerTokens = new Set(significantTokens(answer));
  if (!answerTokens.size || !openAsks.length) return null;
  const tokenHit = (askToken: string): boolean => {
    if (answerTokens.has(askToken)) return true;
    for (const at of answerTokens) {
      if (
        askToken.length >= 4 &&
        at.length >= 4 &&
        (at.startsWith(askToken) || askToken.startsWith(at))
      ) {
        return true;
      }
    }
    return false;
  };

  let best: string | null = null;
  let bestScore = 0;
  let ties = 0;
  for (const ask of openAsks) {
    const askTokens = significantTokens(ask);
    let score = 0;
    for (const t of askTokens) {
      if (tokenHit(t)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = ask;
      ties = 1;
    } else if (score === bestScore && score > 0) {
      ties += 1;
    }
  }
  if (bestScore < 1 || ties !== 1) return null;
  return best;
}

export function normalizeSeatAnswers(args: {
  answers?: Record<string, string>;
  answer?: string;
  question?: string;
  openAsks: string[];
}): Record<string, string> {
  const fromMap = Object.fromEntries(
    Object.entries(args.answers ?? {})
      .map(([k, v]) => [String(k).trim(), String(v ?? "").trim()] as const)
      .filter(([k, v]) => k && v),
  );
  if (Object.keys(fromMap).length) return fromMap;

  const answer = String(args.answer ?? "").trim();
  if (!answer) {
    throw new JarvisExecError("No usable answers", "invalid_args");
  }
  const question = String(args.question ?? "").trim();
  if (question) return { [question]: answer };

  const fuzzy = fuzzyMatchOpenAsk(answer, args.openAsks);
  if (fuzzy) return { [fuzzy]: answer };
  if (args.openAsks[0]) return { [args.openAsks[0]]: answer };
  return { "Operator answer": answer };
}
