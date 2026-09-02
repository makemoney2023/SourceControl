// src/data/cityFlight.ts
import { INCOME_DISCLOSURE, SLIDES, type Slide } from "./slides";
import { INCOME_STREAMS } from "./streamIndex";

/** vh of scroll per second of film. One pace for the whole flight (spec: 0.21-0.22). */
export const CITY_RATE = 0.215;

export type CityStopLabel = "Era" | "Opportunity" | "Skyline" | "Streams" | "Join";

export type CityLeg = {
  id: string;
  clipSeconds: number;
  /** vh of scroll this leg owns. Always clipSeconds * CITY_RATE (pace law). */
  weight: number;
  src: string;
  srcMobile: string;
  poster: string;
  waypoint?: CityStopLabel;
  /** Slide whose conceptSrc seeds the ffmpeg placeholder leg until kie legs land. */
  placeholderPlateOf: string;
};

function leg(
  id: string,
  clipSeconds: number,
  placeholderPlateOf: string,
  waypoint?: CityStopLabel,
): CityLeg {
  return {
    id,
    clipSeconds,
    weight: Number((clipSeconds * CITY_RATE).toFixed(3)),
    src: `/city/legs/${id}.mp4`,
    srcMobile: `/city/legs/${id}-m.mp4`,
    poster: `/city/posters/${id}.webp`,
    waypoint,
    placeholderPlateOf,
  };
}

/** Flight order. leg-07 is the peak: the only 10s clip, so the only ~2.15vh leg. */
export const CITY_LEGS: CityLeg[] = [
  leg("leg-01-terrace", 5, "00-era", "Era"),
  leg("leg-02-title-glass", 5, "01-title", "Opportunity"),
  leg("leg-03-overlook", 5, "00b-mission"),
  leg("leg-04-street", 5, "00c-ceo"),
  leg("leg-05-windows", 5, "02-world"),
  leg("leg-06-ascent", 5, "03-four-stacks", "Skyline"),
  leg("leg-07-skyline-lock", 10, "03b-name-stacks"),
  leg("leg-08-districts-a", 5, "08-ten-layers", "Streams"),
  leg("leg-09-districts-b", 5, "17-compounding"),
  leg("leg-10-hold", 5, "15-closing", "Join"),
];

const slideMap = new Map(SLIDES.map((s) => [s.id, s]));

export function slideById(id: string): Slide {
  const slide = slideMap.get(id);
  if (!slide) throw new Error(`cityFlight references unknown slide ${id}`);
  return slide;
}

export function trackTotalVh(): number {
  return CITY_LEGS.reduce((sum, l) => sum + l.weight, 0);
}

export function legStartVh(index: number): number {
  return CITY_LEGS.slice(0, index).reduce((sum, l) => sum + l.weight, 0);
}

/** Copy window "from to in out" (track fractions) spanning legs [start..end]. */
export function windowForLegs(
  start: number,
  end: number,
  rampIn = 0.15,
  rampOut = 0.15,
): string {
  const total = trackTotalVh();
  const from = legStartVh(start) / total;
  const to = (legStartVh(end) + CITY_LEGS[end].weight) / total;
  return `${from.toFixed(4)} ${to.toFixed(4)} ${rampIn} ${rampOut}`;
}

/** Copy window confined to a fraction of one leg (e.g. the last 30% of the peak). */
export function windowForLegSlice(
  legIndex: number,
  fromFrac: number,
  toFrac: number,
  rampIn = 0.2,
  rampOut = 0.2,
): string {
  const total = trackTotalVh();
  const start = legStartVh(legIndex);
  const w = CITY_LEGS[legIndex].weight;
  const from = (start + w * fromFrac) / total;
  const to = (start + w * toFrac) / total;
  return `${from.toFixed(4)} ${to.toFixed(4)} ${rampIn} ${rampOut}`;
}

export type CityGlass = { slideId: string; legIndex: number };

/** Approved plates that live in the city's glass. Never substituted, never redrawn. */
export const CITY_GLASS: CityGlass[] = [
  { slideId: "01-title", legIndex: 1 },
  { slideId: "00c-ceo", legIndex: 3 },
  { slideId: "02-world", legIndex: 4 },
  { slideId: "03-four-stacks", legIndex: 5 },
  { slideId: "07-retail", legIndex: 7 },
  { slideId: "09-team-overrides", legIndex: 7 },
  { slideId: "12-generations", legIndex: 8 },
  { slideId: "14-global", legIndex: 8 },
];

export type CityStop = { id: string; label: CityStopLabel; legIndex: number };

export const CITY_STOPS: CityStop[] = CITY_LEGS.flatMap((l, i) =>
  l.waypoint ? [{ id: l.id, label: l.waypoint, legIndex: i }] : [],
);

export function stopScrollY(legIndex: number, innerHeight: number): number {
  return legStartVh(legIndex) * innerHeight;
}

/** District legs where the ten-stream index lights and the disclosure stays pinned. */
export const STREAMS_WINDOW = { startLeg: 7, endLeg: 8 } as const;

export function streamsIndexLabels(): string[] {
  return INCOME_STREAMS.map((s) => s.shortLabel);
}

export const CITY_DISCLOSURE = INCOME_DISCLOSURE;
