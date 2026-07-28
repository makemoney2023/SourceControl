import { describe, expect, it } from "vitest";
import { buildInquireSubmitPayload } from "@/lib/analytics/inquire-events";
import type { InquireFormValuesA } from "@/lib/validations/inquire-schema";

const baseValues: InquireFormValuesA = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "",
  location: "Portland, OR",
  howHeard: "referral",
  message:
    "We are looking for a family companion with strong health testing transparency and breed education.",
  experience: "pet-owner",
  household: "",
  goals: "family",
  timeline: "6-12",
  consent: true,
};

describe("buildInquireSubmitPayload", () => {
  it("returns enum-only fields without PII", () => {
    const payload = buildInquireSubmitPayload({
      packageMode: "A",
      values: baseValues,
      priorEvidencePages: ["/health", "/about"],
    });

    expect(payload).toEqual({
      package_mode: "A",
      how_heard: "referral",
      experience: "pet-owner",
      goals: "family",
      timeline: "6-12",
      prior_evidence_pages: "/health,/about",
      prior_evidence_count: 2,
      trust_path_qualified: true,
      submit_method: "mailto",
      has_phone: false,
      has_household: false,
    });

    const serialized = JSON.stringify(payload);
    expect(serialized).not.toContain("Jane Doe");
    expect(serialized).not.toContain("jane@example.com");
    expect(serialized).not.toContain("Portland");
    expect(serialized).not.toContain("family companion");
  });

  it("flags optional contact fields without sending values", () => {
    const payload = buildInquireSubmitPayload({
      packageMode: "B",
      values: {
        ...baseValues,
        phone: "555-0100",
        household: "Two adults and one child",
      },
      priorEvidencePages: ["/dogs"],
    });

    expect(payload.has_phone).toBe(true);
    expect(payload.has_household).toBe(true);
    expect(payload.trust_path_qualified).toBe(false);
    expect(JSON.stringify(payload)).not.toContain("555-0100");
    expect(JSON.stringify(payload)).not.toContain("Two adults");
  });
});
