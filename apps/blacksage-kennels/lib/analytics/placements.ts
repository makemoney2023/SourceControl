import type { CtaPlacement } from "@/lib/analytics/types";

export const CTA_PLACEMENT = {
  headerNavDesktop: "header_nav_desktop",
  headerNavMobile: "header_nav_mobile",
  footerNav: "footer_nav",
  homeProofTeaser: "home_proof_teaser",
  homeEducationBand: "home_education_band",
  homeAboutTeaser: "home_about_teaser",
  homeInquireBand: "home_inquire_band",
  dogsEmptyPrimary: "dogs_empty_primary",
  dogsEmptySecondary: "dogs_empty_secondary",
  healthPlacementCardA: "health_placement_card_a",
  healthPlacementCardB: "health_placement_card_b",
  healthExternalResource: "health_external_resource",
  aboutInquireBand: "about_inquire_band",
  inquireFooter: "inquire_footer",
} as const satisfies Record<string, CtaPlacement>;
