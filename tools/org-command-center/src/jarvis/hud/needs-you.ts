export interface NeedsYouSeat {
  slug: string;
  status: string;
}

export function needsYouSlugs(blocked: NeedsYouSeat[]): string[] {
  const blockedSlugs = blocked
    .filter((seat) => seat.status === "blocked")
    .map((seat) => seat.slug);
  const needsInputSlugs = blocked
    .filter((seat) => seat.status === "needs_input")
    .map((seat) => seat.slug);
  return [...blockedSlugs, ...needsInputSlugs];
}

export function nextNeedsYouSlug(
  slugs: string[],
  current: string | null,
  direction: number,
): string | null {
  if (slugs.length === 0) {
    return null;
  }

  const index = current === null ? -1 : slugs.indexOf(current);
  if (index === -1) {
    return slugs[0] ?? null;
  }

  const nextIndex = (index + direction + slugs.length) % slugs.length;
  return slugs[nextIndex] ?? null;
}
