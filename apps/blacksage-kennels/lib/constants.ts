export const CONTACT_EMAIL = "[CONTACT_EMAIL]";
export const CONTACT_PHONE = "[CONTACT_PHONE]";
export const LOCATION = "[LOCATION]";
export const HEALTH_TESTS = "[HEALTH_TESTS]";
export const DOG_COUNT = "1";
/** Operator-named hero subject — see also `lib/hero-subject.ts` */
export const HERO_DOG_NAME = "Shadow Vom Blacksage";
export const OPERATOR_STORY = "[OPERATOR_STORY]";
export const RESPONSE_EXPECTATION = "[RESPONSE_EXPECTATION]";

export const PROOF_BAND = [
  {
    title: "Standards-aligned",
    body: "ADRK / FCI No. 147 type",
    href: "/health#standards",
    linkLabel: "View standards →",
  },
  {
    title: "Health approach",
    body: "Testing categories overview",
    href: "/health#testing",
    linkLabel: "View health approach →",
  },
  {
    title: "Our dogs",
    body: "Shadow Vom Blacksage — profiles expanding",
    href: "/dogs",
    linkLabel: "View our dogs →",
  },
  {
    title: "Deliberate placement",
    body: "Selective inquiry process",
    href: "/health#placement",
    linkLabel: "Learn our process →",
  },
] as const;

export const HEALTH_CATEGORIES = [
  {
    title: "Hips",
    body: "Hip evaluations (HD / OFA) inform breeding decisions in responsible Rottweiler programs.",
  },
  {
    title: "Elbows",
    body: "Elbow evaluations (ED / OFA) help reduce inherited joint disease in the breed.",
  },
  {
    title: "Eyes",
    body: "Eye clearances screen for inherited ocular conditions.",
  },
  {
    title: "Cardiac",
    body: "Cardiac evaluation supports sound heart health in breeding stock.",
  },
  {
    title: "JLPP",
    body: "JLPP testing when applicable — a serious inherited condition in the breed.",
  },
] as const;

export const PROGRAM_PRINCIPLES = [
  "ADRK / FCI Standard No. 147 as our type reference",
  "Health clearances inform every pairing",
  "Even-tempered, devoted temperament — not aggression marketing",
  "Selective placement; inquiry reviewed individually",
  "Education before sale",
] as const;
