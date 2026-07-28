/** Option C home scroll narrative SSOT — chapter ranges + camera keyframes. */

export type HomeScrollChapterId =
  | "presence"
  | "standards"
  | "proof"
  | "health"
  | "dogs"
  | "inquire";

export type HomeScrollChapter = {
  id: HomeScrollChapterId;
  /** Inclusive start of progress [0,1] */
  start: number;
  /** Exclusive end of progress (last chapter may be 1) */
  end: number;
  /** True when chapter is HTML proof band / CTA — must work without WebGL */
  htmlOnly: boolean;
  /** Short section label shown above the title */
  kicker?: string;
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
  ctaLabel?: string;
};

export const HOME_SCROLL_PAGES = 5;

/** Home chapter copy — kennel voice, not clinical brochure. */
export const HOME_SCROLL_CHAPTERS: HomeScrollChapter[] = [
  {
    id: "presence",
    start: 0,
    end: 0.18,
    htmlOnly: false,
    kicker: "German / ADRK Rottweilers",
    title: "Blacksage Kennels",
    body: "We're breeding for the dog that lives with you — not a brochure photo. Structure and temperament that hold up at home, and health we can actually show you. If we can't stand behind it, it doesn't go on the site.",
  },
  {
    id: "standards",
    start: 0.18,
    end: 0.36,
    htmlOnly: false,
    kicker: "The standard",
    title: "ADRK / FCI No. 147 is the yardstick",
    body: "We care about correct type and an even head. Pairings start with clearances and the standard — not a pretty photo alone.",
    href: "/health#standards",
    linkLabel: "How we read the standard",
  },
  {
    id: "proof",
    start: 0.36,
    end: 0.52,
    htmlOnly: true,
    kicker: "Look first",
    title: "See the program before you write us",
    body: "How we read the standard, how we handle health, our dogs, and how placement works. Start wherever you want — no sales funnel.",
  },
  {
    id: "health",
    start: 0.52,
    end: 0.7,
    htmlOnly: false,
    kicker: "Health & education",
    title: "Read this before you inquire",
    body: "What we test, how we think about temperament, and what selective placement means here. Take your time. We'd rather you know us first.",
    href: "/health",
    linkLabel: "Open health & education",
  },
  {
    id: "dogs",
    start: 0.7,
    end: 0.86,
    htmlOnly: false,
    kicker: "Our dogs",
    title: "Meet the kennel",
    body: "Shadow Vom Blacksage is here. Named profiles go up when they're ready — with clearances when we have them. We won't dress stock photos up as our dogs.",
    href: "/dogs",
    linkLabel: "View our dogs",
  },
  {
    id: "inquire",
    start: 0.86,
    end: 1,
    htmlOnly: true,
    kicker: "When you're ready",
    title: "Tell us about your home",
    body: "If this feels like the right fit, start an inquiry. We read every one. No checkout. No deposit button. Just a real conversation about whether the dog belongs with you.",
    href: "/inquire",
    ctaLabel: "Begin your inquiry",
  },
];

export type CameraKeyframe = {
  progress: number;
  position: readonly [number, number, number];
  target: readonly [number, number, number];
};

export const HOME_SCROLL_CAMERA: CameraKeyframe[] = [
  { progress: 0, position: [0.55, 1.15, 3.6], target: [0, 0.65, 0.1] },
  { progress: 0.18, position: [1.2, 1.0, 3.2], target: [0, 0.6, 0.1] },
  { progress: 0.36, position: [0.2, 1.4, 4.2], target: [0, 0.55, 0] },
  { progress: 0.52, position: [-0.4, 1.1, 3.4], target: [0, 0.7, 0.05] },
  { progress: 0.7, position: [0.8, 0.95, 3.0], target: [0, 0.55, 0.1] },
  { progress: 1, position: [0.35, 1.05, 3.5], target: [0, 0.6, 0.05] },
];

export function assertHomeScrollStoryValid(chapters: HomeScrollChapter[]): void {
  if (chapters.length < 2) {
    throw new Error("Home scroll story needs at least two chapters");
  }
  if (chapters[0].start !== 0) {
    throw new Error("First chapter must start at 0");
  }
  const last = chapters[chapters.length - 1];
  if (last.end !== 1) {
    throw new Error("Last chapter must end at 1");
  }
  for (let i = 0; i < chapters.length; i++) {
    const c = chapters[i];
    if (c.start >= c.end) {
      throw new Error(`Chapter ${c.id} has invalid range`);
    }
    if (i > 0 && Math.abs(c.start - chapters[i - 1].end) > 1e-9) {
      throw new Error(`Gap or overlap before chapter ${c.id}`);
    }
  }
  if (!chapters.some((c) => c.id === "proof" && c.htmlOnly)) {
    throw new Error("Proof chapter must be htmlOnly");
  }
}

export function getChapterAtProgress(p: number): HomeScrollChapter {
  const clamped = Math.min(1, Math.max(0, p));
  for (const chapter of HOME_SCROLL_CHAPTERS) {
    if (clamped >= chapter.start && (clamped < chapter.end || chapter.end === 1)) {
      if (chapter.end === 1 || clamped < chapter.end) {
        return chapter;
      }
    }
  }
  return HOME_SCROLL_CHAPTERS[HOME_SCROLL_CHAPTERS.length - 1];
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function getCameraAtProgress(p: number): {
  position: [number, number, number];
  target: [number, number, number];
} {
  const keys = HOME_SCROLL_CAMERA;
  const clamped = Math.min(1, Math.max(0, p));
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1].progress < clamped) i++;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  const span = b.progress - a.progress || 1;
  const t = (clamped - a.progress) / span;
  return {
    position: [
      lerp(a.position[0], b.position[0], t),
      lerp(a.position[1], b.position[1], t),
      lerp(a.position[2], b.position[2], t),
    ],
    target: [
      lerp(a.target[0], b.target[0], t),
      lerp(a.target[1], b.target[1], t),
      lerp(a.target[2], b.target[2], t),
    ],
  };
}

/** Map chapter index to vertical offset inside Scroll html (vh units per page). */
export function chapterTopVh(chapterIndex: number): number {
  return (chapterIndex / HOME_SCROLL_CHAPTERS.length) * HOME_SCROLL_PAGES * 100;
}
