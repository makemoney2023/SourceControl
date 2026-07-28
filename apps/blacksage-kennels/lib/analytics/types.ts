export type AnalyticsEventName =
  | "page_view"
  | "proof_band_view"
  | "proof_band_click"
  | "cta_click"
  | "health_section_view"
  | "inquire_start"
  | "inquire_field_error"
  | "inquire_submit"
  | "inquire_submit_fail"
  | "confirmation_view";

export type RouteName = "home" | "dogs" | "health" | "about" | "inquire";

export type PackageMode = "A" | "B";

export type CtaPlacement =
  | "header_nav_desktop"
  | "header_nav_mobile"
  | "footer_nav"
  | "home_proof_teaser"
  | "home_education_band"
  | "home_about_teaser"
  | "home_inquire_band"
  | "dogs_empty_primary"
  | "dogs_empty_secondary"
  | "health_placement_card_a"
  | "health_placement_card_b"
  | "health_external_resource"
  | "about_inquire_band"
  | "inquire_footer";

export type ProofBandCellId =
  | "standards"
  | "health"
  | "dogs"
  | "placement";

export type HowHeard =
  | "referral"
  | "search-engine"
  | "social-media"
  | "breed-club"
  | "other";

export type Experience =
  | "none"
  | "pet-owner"
  | "working-sport"
  | "breeder-experienced";

export type Goals = "companion" | "family" | "sport-working" | "show-structure";

export type Timeline = "0-6" | "6-12" | "12-plus" | "flexible";

export type SubmitMethod = "mailto" | "api";

export type AnalyticsProperties = Record<
  string,
  string | number | boolean | string[] | undefined
>;

export type InquireSubmitPayload = {
  package_mode: PackageMode;
  how_heard: HowHeard;
  experience: Experience;
  goals: Goals;
  timeline: Timeline;
  prior_evidence_pages: string;
  prior_evidence_count: number;
  trust_path_qualified: boolean;
  submit_method: SubmitMethod;
  has_phone: boolean;
  has_household: boolean;
};
