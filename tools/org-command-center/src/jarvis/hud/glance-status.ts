export interface BlockedSeatDigest {
  title: string;
  slug: string;
  headline: string;
  status: string;
}

export interface GlanceStatusInput {
  blockedSeats: BlockedSeatDigest[];
  nextAction: string;
}

function truncateStatusLine(line: string): string {
  if (line.length <= 96) {
    return line;
  }
  return `${line.slice(0, 95)}…`;
}

export function glanceStatusLine({ blockedSeats, nextAction }: GlanceStatusInput): string {
  const top = blockedSeats[0];
  const line = top
    ? `${top.title || top.slug}: ${top.headline}`
    : nextAction;
  return truncateStatusLine(line);
}
