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

export function glanceKeyAction(
  key: string,
  opts: { inputFocused: boolean; dialogOpen: boolean },
): "escape" | "next" | "prev" | null {
  if (opts.inputFocused || opts.dialogOpen) return null;
  if (key === "Escape") return "escape";
  if (key === "j") return "next";
  if (key === "k") return "prev";
  return null;
}
