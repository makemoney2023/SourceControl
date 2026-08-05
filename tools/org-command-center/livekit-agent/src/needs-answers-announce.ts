/** Spoken seat label for proactive "needs answers" lines. */
export function seatLabelForAnnounce(slug: string): string {
  if (slug === "ceo-strategist") return "CEO";
  return slug.replace(/-/g, " ");
}

/**
 * Diff current needs_input seats vs announced set.
 * Marks only when spoken (or when deferSpeak is false and we would speak).
 * When deferSpeak, leave unmarked so a later tick can announce.
 * Clears announced entries that left the needing set.
 */
export function selectNeedsAnswersAnnounces(
  currentSlugs: string[],
  announced: Set<string>,
  deferSpeak: boolean,
): { speak: string[] } {
  const current = new Set(currentSlugs);
  for (const slug of [...announced]) {
    if (!current.has(slug)) announced.delete(slug);
  }

  const speak: string[] = [];
  if (deferSpeak) return { speak };

  for (const slug of current) {
    if (announced.has(slug)) continue;
    announced.add(slug);
    speak.push(`${seatLabelForAnnounce(slug)} needs answers.`);
  }
  return { speak };
}
