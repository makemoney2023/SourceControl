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

export type CityPlateMoment = {
  slideId: string;
  legId: string;
  /** Omni prompt hint: where the plate sits in frame. */
  note: string;
};

export type CityPackageAccent = {
  id: string;
  legId: string;
  src: string;
  note: string;
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

/**
 * Expanded flight order (~20vh). leg-08-skyline-lock is the peak: the only 10s clip.
 * Additional 5s legs carry all 26 plate moments without strobing.
 */
export const CITY_LEGS: CityLeg[] = [
  leg("leg-01-terrace", 5, "00-era", "Era"),
  leg("leg-02-title-glass", 5, "01-title", "Opportunity"),
  leg("leg-03-overlook", 5, "00b-mission"),
  leg("leg-04-street", 5, "00c-ceo"),
  leg("leg-05-windows", 5, "02-world"),
  leg("leg-06-ascent", 5, "03-four-stacks", "Skyline"),
  leg("leg-07-name-stacks", 5, "03b-name-stacks"),
  leg("leg-08-skyline-lock", 10, "04-flywheel"),
  leg("leg-09-product", 5, "05-product"),
  leg("leg-10-science", 5, "05b-science"),
  leg("leg-11-market-brand", 5, "05c-market"),
  leg("leg-12-development", 5, "07-development"),
  leg("leg-13-ten-layers", 5, "08-ten-layers", "Streams"),
  leg("leg-14-districts-a", 5, "07-retail"),
  leg("leg-15-districts-b", 5, "10-md-depth"),
  leg("leg-16-districts-c", 5, "13-executive"),
  leg("leg-17-bridge", 5, "17-compounding"),
  leg("leg-18-hold", 5, "15-closing", "Join"),
];

/** Every approved plate appears once in-world across the expanded flight. */
export const CITY_PLATE_MOMENTS: CityPlateMoment[] = [
  { slideId: "00-era", legId: "leg-01-terrace", note: "Era plate on terrace facade; logo reveal first seconds" },
  { slideId: "01-title", legId: "leg-02-title-glass", note: "Title plate as neon storefront glass" },
  { slideId: "00b-mission", legId: "leg-03-overlook", note: "Mission plate on horizon skyboard" },
  { slideId: "00c-ceo", legId: "leg-04-street", note: "CEO plate on wet street-level facade" },
  { slideId: "02-world", legId: "leg-05-windows", note: "World plate in tower window grid" },
  { slideId: "03-four-stacks", legId: "leg-06-ascent", note: "Four stacks plate on ascent-facing billboard" },
  { slideId: "03b-name-stacks", legId: "leg-07-name-stacks", note: "Name stacks plate on mid-rise facade" },
  { slideId: "04-flywheel", legId: "leg-08-skyline-lock", note: "Flywheel plate locked in skyline peak" },
  { slideId: "05-product", legId: "leg-09-product", note: "Product plate on wellness kiosk skyboard" },
  { slideId: "05b-science", legId: "leg-10-science", note: "VTT science plate on lab facade — consecutive VTT beat" },
  { slideId: "05c-market", legId: "leg-11-market-brand", note: "Market plate on district marquee" },
  { slideId: "06-brand", legId: "leg-11-market-brand", note: "Brand plate on adjacent media tower" },
  { slideId: "07-development", legId: "leg-12-development", note: "Development plate on training-center facade" },
  { slideId: "08-ten-layers", legId: "leg-13-ten-layers", note: "Ten layers plate over income district" },
  { slideId: "07-retail", legId: "leg-14-districts-a", note: "Retail stream plate on corner storefront" },
  { slideId: "08-fast-start", legId: "leg-14-districts-a", note: "Fast Start plate on district LED board" },
  { slideId: "09-team-overrides", legId: "leg-14-districts-a", note: "Team overrides plate on wet reflection" },
  { slideId: "10-md-depth", legId: "leg-15-districts-b", note: "MD depth plate on mid-district facade" },
  { slideId: "11-vp-override", legId: "leg-15-districts-b", note: "VP override plate on tower skyboard" },
  { slideId: "12-generations", legId: "leg-15-districts-b", note: "Generations plate on bridge-facing wall" },
  { slideId: "13-executive", legId: "leg-16-districts-c", note: "Executive plate on executive-tier signage" },
  { slideId: "14-global", legId: "leg-16-districts-c", note: "Global pool plate on upper district skyboard" },
  { slideId: "17-compounding", legId: "leg-17-bridge", note: "Compounding plate on bridge approach" },
  { slideId: "18-different", legId: "leg-17-bridge", note: "Different plate on bridge mid-span" },
  { slideId: "19-future", legId: "leg-17-bridge", note: "Future plate on bridge exit facade" },
  { slideId: "15-closing", legId: "leg-18-hold", note: "Closing plate on resolve hold — city stays" },
];

/** Sparse product accents — never a catalog wall. */
export const CITY_PACKAGE_ACCENTS: CityPackageAccent[] = [
  {
    id: "freedom-30pk",
    legId: "leg-09-product",
    src: "/concepts/refs/packages/_preview_Pack_NA_Freedom_30PK_Front_RGB.png",
    note: "Freedom 30-pack beside the product-stack kiosk",
  },
  {
    id: "freedom-peel",
    legId: "leg-10-science",
    src: "/concepts/refs/packages/Patch_Freedom_PeelTopLeft_RGB.png",
    note: "Single Freedom patch accent near the VTT science facade",
  },
  {
    id: "rem-patch",
    legId: "leg-11-market-brand",
    src: "/concepts/refs/patches/rem.png",
    note: "REM patch in a wellness storefront window",
  },
  {
    id: "focus-patch",
    legId: "leg-14-districts-a",
    src: "/concepts/refs/patches/focus.png",
    note: "Focus patch on a district retail ledge",
  },
  {
    id: "boost-patch",
    legId: "leg-17-bridge",
    src: "/concepts/refs/patches/boost.png",
    note: "Boost patch on the bridge railing — sparse accent",
  },
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

/**
 * Copy window "from to in out" (track fractions) spanning legs [start..end].
 * Soft ramps (0.08) keep plateau readable — 0.15 ramps on ~1vh legs left most
 * of each beat fading and felt like missing copy.
 */
export function windowForLegs(
  start: number,
  end: number,
  rampIn = 0.08,
  rampOut = 0.08,
): string {
  const total = trackTotalVh();
  const from = legStartVh(start) / total;
  const to = (legStartVh(end) + CITY_LEGS[end].weight) / total;
  return `${from.toFixed(4)} ${to.toFixed(4)} ${rampIn} ${rampOut}`;
}

/** Copy window confined to a fraction of one leg. */
export function windowForLegSlice(
  legIndex: number,
  fromFrac: number,
  toFrac: number,
  rampIn = 0.1,
  rampOut = 0.1,
): string {
  const total = trackTotalVh();
  const start = legStartVh(legIndex);
  const w = CITY_LEGS[legIndex].weight;
  const from = (start + w * fromFrac) / total;
  const to = (start + w * toFrac) / total;
  return `${from.toFixed(4)} ${to.toFixed(4)} ${rampIn} ${rampOut}`;
}

/**
 * Copy window spanning fractional positions across legs.
 * Used to sequence Range beats so mobile (shared bottom band) does not stack
 * ten-layers on top of the streams index / "See every stream" link.
 */
export function windowAcross(
  startLeg: number,
  startFrac: number,
  endLeg: number,
  endFrac: number,
  rampIn = 0.08,
  rampOut = 0.08,
): string {
  const total = trackTotalVh();
  const from =
    (legStartVh(startLeg) + CITY_LEGS[startLeg].weight * startFrac) / total;
  const to = (legStartVh(endLeg) + CITY_LEGS[endLeg].weight * endFrac) / total;
  return `${from.toFixed(4)} ${to.toFixed(4)} ${rampIn} ${rampOut}`;
}

/** Sequenced copy windows — one readable plateau per slide, brief crossfade only. */
function buildCopyWindows(): Record<string, string> {
  const ramp = 0.08;
  /** Target track overlap between adjacent slides in deck order. */
  const overlap = 0.025;

  const legIndexById = new Map(CITY_LEGS.map((l, i) => [l.id, i]));
  const momentBySlide = new Map(CITY_PLATE_MOMENTS.map((m) => [m.slideId, m]));

  /** Slides per leg in deck story order. */
  const perLeg = new Map<string, string[]>();
  for (const slide of SLIDES) {
    const legId = momentBySlide.get(slide.id)!.legId;
    const list = perLeg.get(legId) ?? [];
    list.push(slide.id);
    perLeg.set(legId, list);
  }

  const total = trackTotalVh();
  const bounds: Record<string, { from: number; to: number }> = {};

  for (const [legId, slideIds] of perLeg) {
    const legIndex = legIndexById.get(legId)!;
    const legW = CITY_LEGS[legIndex].weight;
    const n = slideIds.length;
    /** Leg-fraction overlap budget so track overlap stays under ~0.03. */
    const halfLegPad = (overlap * total) / (2 * legW);

    for (let i = 0; i < n; i++) {
      const centerFrac = (i + 0.5) / n;
      const halfLegFrac = 0.5 / n + halfLegPad;
      const fromFrac = Math.max(0, centerFrac - halfLegFrac);
      const toFrac = Math.min(1, centerFrac + halfLegFrac);
      const [from, to] = windowForLegSlice(legIndex, fromFrac, toFrac, ramp, ramp)
        .split(" ")
        .map(Number);
      bounds[slideIds[i]!] = { from: from!, to: to! };
    }
  }

  /** Nudge adjacent deck-order pairs to crossfade without gaps or long dual-hold. */
  const storyIds = SLIDES.map((s) => s.id);
  for (let i = 0; i < storyIds.length - 1; i++) {
    const prev = bounds[storyIds[i]!]!;
    const next = bounds[storyIds[i + 1]!]!;
    if (next.from >= prev.to) {
      const gap = next.from - prev.to;
      const meet = gap / 2 + overlap / 2;
      prev.to += meet;
      next.from -= meet;
    }
    const dual = prev.to - next.from;
    if (dual > 0.03) {
      const trim = (dual - 0.028) / 2;
      prev.to -= trim;
      next.from += trim;
    }
  }

  const out: Record<string, string> = {};
  for (const slide of SLIDES) {
    const { from, to } = bounds[slide.id]!;
    out[slide.id] = `${from.toFixed(4)} ${to.toFixed(4)} ${ramp} ${ramp}`;
  }
  return out;
}

export const COPY_WINDOWS: Record<string, string> = buildCopyWindows();

export function copyWindowFor(slideId: string): string {
  const win = COPY_WINDOWS[slideId];
  if (!win) throw new Error(`cityFlight missing copy window for ${slideId}`);
  return win;
}

export type CityStop = { id: string; label: CityStopLabel; legIndex: number };

export const CITY_STOPS: CityStop[] = CITY_LEGS.flatMap((l, i) =>
  l.waypoint ? [{ id: l.id, label: l.waypoint, legIndex: i }] : [],
);

export function stopScrollY(legIndex: number, innerHeight: number): number {
  return legStartVh(legIndex) * innerHeight;
}

/** District legs where the ten-stream index lights and the disclosure stays pinned. */
export const STREAMS_WINDOW = { startLeg: 12, endLeg: 15 } as const;

/**
 * Range copy windows — sequenced so 08 finishes before streams dominates.
 * Bridge on leg 17 starts after streams yields (see CityFlightShell).
 */
export const RANGE_TEN_LAYERS_WINDOW = windowForLegSlice(12, 0, 0.48);
export const RANGE_STREAMS_WINDOW = windowAcross(12, 0.45, 15, 0.42);
export const BRIDGE_WINDOWS = {
  compounding: windowForLegSlice(16, 0.4, 0.62),
  different: windowForLegSlice(16, 0.58, 0.8),
  future: windowForLegSlice(16, 0.76, 1),
} as const;

export function streamsIndexLabels(): string[] {
  return INCOME_STREAMS.map((s) => s.shortLabel);
}

export const CITY_DISCLOSURE = INCOME_DISCLOSURE;
