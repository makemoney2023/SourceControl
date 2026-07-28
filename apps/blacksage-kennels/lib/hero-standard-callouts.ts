/** ADRK / FCI No. 147 body pointers — coords are % inside the dog image box. */

export type HeroStandardCallout = {
  id: string;
  label: string;
  detail: string;
  /** Percent positions within the hero image frame (0–100) */
  x: number;
  y: number;
  /** Label sits left or right of the anchor — prefer inward over the dog */
  side: "left" | "right";
  href: string;
};

/**
 * Tuned for Shadow profile facing left in `shadow-vom-blacksage-hero.png`.
 * Spread vertically so labels don't stack on the neck.
 */
export const HERO_STANDARD_CALLOUTS: HeroStandardCallout[] = [
  {
    id: "head",
    label: "That head",
    detail: "Broad skull, honest muzzle",
    x: 20,
    y: 18,
    side: "right",
    href: "/health#standards",
  },
  {
    id: "temperament",
    label: "The look",
    detail: "Steady, confident, bonded",
    x: 14,
    y: 36,
    side: "right",
    href: "/health#temperament",
  },
  {
    id: "markings",
    label: "Those marks",
    detail: "Clean tan where it belongs",
    x: 28,
    y: 68,
    side: "right",
    href: "/health#standards",
  },
  {
    id: "structure",
    label: "The build",
    detail: "Compact power, balanced frame",
    x: 58,
    y: 28,
    side: "right",
    href: "/health#standards",
  },
  {
    id: "tail",
    label: "Natural tail",
    detail: "Undocked — the way we prefer",
    x: 90,
    y: 58,
    side: "left",
    href: "/health#standards",
  },
];
