export const THEME_TOKENS = {
  ground: "#070707",
  elevated: "#121212",
  lifted: "#1A1A1A",
  proofBand: "#101010",
  tan: "#C4A35A",
  tanDeep: "#A67C52",
  tanSoft: "#D4B87A",
  textPrimary: "#F3EFE6",
  textSecondary: "#A8A49C",
  textMuted: "#7A7670",
  ctaText: "#070707",
  sage: "#7A8F7E",
  heroFog: "#050505",
} as const;

export type SiteEnvDoc = {
  key: string;
  values?: string;
  default: string;
  effect: string;
};

export const SITE_ENV_DOCS: SiteEnvDoc[] = [
  {
    key: "NEXT_PUBLIC_INQUIRE_PACKAGE",
    values: "A | B",
    default: "A",
    effect: "Package A = interest list; Package B = waitlist + deposit acknowledgment",
  },
  {
    key: "NEXT_PUBLIC_REDUCE_3D",
    values: "true | 1",
    default: "unset",
    effect:
      "When set, disables home WebGL cinema stage — static chapter fallback for a11y",
  },
  {
    key: "NEXT_PUBLIC_HERO_GLB_READY",
    values: "true | 1",
    default: "unset",
    effect:
      "Set after licensed GLB is placed at public/models/hero-rottweiler.glb to enable 3D subject",
  },
];

export type InquirePackage = "A" | "B";

export function getInquirePackage(): InquirePackage {
  const value = process.env.NEXT_PUBLIC_INQUIRE_PACKAGE?.toUpperCase();
  return value === "B" ? "B" : "A";
}

export function isHeroGlbReady(): boolean {
  const value = process.env.NEXT_PUBLIC_HERO_GLB_READY?.toLowerCase();
  return value === "true" || value === "1";
}

export const PACKAGE_COPY = {
  A: {
    headline: "Join our interest list",
    subhead:
      "Share your contact details and interest in our program. This is not a reservation or waitlist placement.",
    expectation:
      "Joining the interest list keeps you informed as our program develops. It does not guarantee a puppy or place you on a waitlist. We review messages individually when appropriate.",
    successTitle: "Inquiry received",
    successBody:
      "Thank you. We review every submission and will respond if your inquiry is a potential fit. Response times vary — we appreciate your patience.",
  },
  B: {
    headline: "Submit inquiry for waitlist consideration",
    subhead:
      "Tell us about your home, experience, and goals. Waitlist placement is selective and not guaranteed by submitting this form.",
    expectation:
      "Submitting this inquiry begins a mutual fit review — not a reservation. If we determine alignment, we will discuss next steps individually, including any waitlist process.",
    depositAddendum:
      "A waitlist deposit may be required after approval. Terms and amounts are provided individually — not on this site.",
    successTitle: "Inquiry received — not approval or waitlist confirmation",
    successBody:
      "Thank you. We review every submission and will respond if your inquiry is a potential fit. Submitting this form does not confirm waitlist placement. Response times vary — we appreciate your patience.",
  },
} as const;
