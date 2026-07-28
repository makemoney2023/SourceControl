import { getEvidenceCount, getEvidencePages } from "@/lib/analytics/evidence-session";
import type {
  InquireSubmitPayload,
  PackageMode,
} from "@/lib/analytics/types";
import type {
  InquireFormValuesA,
  InquireFormValuesB,
} from "@/lib/validations/inquire-schema";

type BuildInquireSubmitPayloadArgs = {
  packageMode: PackageMode;
  values: InquireFormValuesA | InquireFormValuesB;
  priorEvidencePages?: string[];
};

export function buildInquireSubmitPayload({
  packageMode,
  values,
  priorEvidencePages = getEvidencePages(),
}: BuildInquireSubmitPayloadArgs): InquireSubmitPayload {
  const priorEvidenceCount = priorEvidencePages.length;

  return {
    package_mode: packageMode,
    how_heard: values.howHeard,
    experience: values.experience,
    goals: values.goals,
    timeline: values.timeline,
    prior_evidence_pages: priorEvidencePages.join(","),
    prior_evidence_count: priorEvidenceCount,
    trust_path_qualified: priorEvidenceCount >= 2,
    submit_method: "mailto",
    has_phone: Boolean(values.phone?.trim()),
    has_household: Boolean(values.household?.trim()),
  };
}

export function buildInquireStartPayload(packageMode: PackageMode) {
  const pages = getEvidencePages();

  return {
    package_mode: packageMode,
    prior_evidence_pages: pages.join(","),
    prior_evidence_count: pages.length,
  };
}

export function getTrustPathQualified(priorEvidenceCount = getEvidenceCount()): boolean {
  return priorEvidenceCount >= 2;
}
