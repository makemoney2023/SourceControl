/** Hard-reload the seat report UI only when switching seats. */
export function shouldHardReloadSeatReport(
  selectedSlug: string | null | undefined,
  loadedSlug: string | null | undefined,
): boolean {
  if (!selectedSlug) return false;
  return selectedSlug !== loadedSlug;
}

/**
 * Preserve in-progress operator answers across soft report refreshes
 * (snapshot polls, Grok brief enrichment) where question wording may change.
 */
export function mergeReportAnswerDrafts(
  previousAnswers: Record<string, string>,
  previousQuestions: string[],
  nextQuestions: string[],
): Record<string, string> {
  const next: Record<string, string> = {};
  for (let i = 0; i < nextQuestions.length; i++) {
    const q = nextQuestions[i]!;
    const byKey = previousAnswers[q];
    if (typeof byKey === "string" && byKey.length > 0) {
      next[q] = byKey;
      continue;
    }
    const prevQ = previousQuestions[i];
    if (prevQ != null) {
      const byIndex = previousAnswers[prevQ];
      if (typeof byIndex === "string") {
        next[q] = byIndex;
        continue;
      }
    }
    next[q] = typeof byKey === "string" ? byKey : "";
  }
  return next;
}
