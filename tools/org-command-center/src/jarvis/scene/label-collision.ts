export type CollisionSeat = {
  slug: string;
  title: string;
  level: string;
  status: string;
};

export type VisibleSeatLabel = {
  slug: string;
  text: string;
};

const COLLISION_PX = 48;
const FIRST_WORD_DISTANCE = 16;
const CEO_SLUG = "ceo-strategist";

function isNeedsYou(status: string): boolean {
  return status === "blocked" || status === "needs_input";
}

function priorityOf(
  seat: CollisionSeat,
  selectedSlug: string | null,
  previewWakeSlug: string | null,
): number {
  if (seat.slug === selectedSlug) return 100;
  if (seat.slug === previewWakeSlug) return 90;
  if (isNeedsYou(seat.status)) return 80;
  if (seat.status === "running" || seat.status === "active") return 70;
  if (seat.level === "manager") return 60;
  return 10;
}

function firstWord(title: string): string {
  return title.trim().split(/\s+/)[0] ?? title;
}

function labelText(
  seat: CollisionSeat,
  cameraDistance: number,
  selectedSlug: string | null,
  previewWakeSlug: string | null,
): string {
  const keepFull =
    seat.slug === selectedSlug ||
    seat.slug === previewWakeSlug ||
    isNeedsYou(seat.status);
  if (cameraDistance > FIRST_WORD_DISTANCE && !keepFull) {
    return firstWord(seat.title);
  }
  return seat.title;
}

export function collideSeatLabels(input: {
  seats: CollisionSeat[];
  positions: Map<string, { x: number; y: number; z: number }>;
  project: (world: { x: number; y: number; z: number }) => { x: number; y: number } | null;
  cameraDistance: number;
  selectedSlug: string | null;
  previewWakeSlug: string | null;
}): VisibleSeatLabel[] {
  type Candidate = VisibleSeatLabel & {
    x: number;
    y: number;
    priority: number;
    isCeo: boolean;
  };

  const candidates: Candidate[] = [];
  for (const seat of input.seats) {
    const world = input.positions.get(seat.slug);
    if (!world) continue;
    const screen = input.project(world);
    if (!screen) continue;
    candidates.push({
      slug: seat.slug,
      text: labelText(seat, input.cameraDistance, input.selectedSlug, input.previewWakeSlug),
      x: screen.x,
      y: screen.y,
      priority: priorityOf(seat, input.selectedSlug, input.previewWakeSlug),
      isCeo: seat.slug === CEO_SLUG,
    });
  }

  candidates.sort((a, b) => b.priority - a.priority);

  const kept: Candidate[] = [];
  for (const candidate of candidates) {
    if (candidate.isCeo) {
      kept.push(candidate);
      continue;
    }
    const conflict = kept.find(
      (other) => Math.hypot(other.x - candidate.x, other.y - candidate.y) < COLLISION_PX,
    );
    if (!conflict) {
      kept.push(candidate);
    }
  }

  return kept.map(({ slug, text }) => ({ slug, text }));
}
