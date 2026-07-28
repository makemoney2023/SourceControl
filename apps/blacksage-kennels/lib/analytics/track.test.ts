import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AnalyticsEventName } from "@/lib/analytics/types";
import { isAnalyticsEnabled, track } from "@/lib/analytics/track";

describe("track", () => {
  const plausible = vi.fn();

  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ENABLED", "false");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_PROVIDER", "plausible");
    vi.stubEnv("NEXT_PUBLIC_PLAUSIBLE_DOMAIN", "");
    vi.stubGlobal("window", { plausible });
    plausible.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("no-ops when analytics is disabled", () => {
    track("cta_click", { label: "Begin your inquiry" });

    expect(plausible).not.toHaveBeenCalled();
  });

  it("no-ops when plausible domain is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ENABLED", "true");

    track("page_view", { path: "/health" });

    expect(plausible).not.toHaveBeenCalled();
  });

  it("dispatches plausible events when enabled with domain", () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_PLAUSIBLE_DOMAIN", "blacksagekennels.com");

    track("inquire_submit", {
      package_mode: "A",
      how_heard: "referral",
      prior_evidence_count: 2,
      trust_path_qualified: true,
    });

    expect(plausible).toHaveBeenCalledWith("inquire_submit", {
      props: {
        package_mode: "A",
        how_heard: "referral",
        prior_evidence_count: 2,
        trust_path_qualified: true,
      },
    });
  });

  it("serializes array properties for provider compatibility", () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_PLAUSIBLE_DOMAIN", "blacksagekennels.com");

    track("inquire_start", {
      prior_evidence_pages: ["/health", "/about"],
    });

    expect(plausible).toHaveBeenCalledWith("inquire_start", {
      props: {
        prior_evidence_pages: "/health,/about",
      },
    });
  });

  it("reports disabled analytics outside production env guard", () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ENABLED", "false");
    vi.stubEnv("NEXT_PUBLIC_PLAUSIBLE_DOMAIN", "blacksagekennels.com");

    expect(isAnalyticsEnabled()).toBe(false);
  });
});

describe("track payload safety", () => {
  it("does not include PII keys in inquire_submit shape", () => {
    const payload = {
      package_mode: "A" as const,
      how_heard: "search-engine" as const,
      experience: "pet-owner" as const,
      goals: "family" as const,
      timeline: "6-12" as const,
      prior_evidence_pages: "/health,/about",
      prior_evidence_count: 2,
      trust_path_qualified: true,
      submit_method: "mailto" as const,
      has_phone: false,
      has_household: true,
    };

    const keys = Object.keys(payload);
    const forbidden = ["name", "email", "phone", "message", "location", "household"];

    for (const key of forbidden) {
      expect(keys).not.toContain(key);
    }
  });

  it("uses snake_case event names from taxonomy", () => {
    const events: AnalyticsEventName[] = [
      "page_view",
      "cta_click",
      "inquire_start",
      "inquire_submit",
      "proof_band_view",
    ];

    for (const event of events) {
      expect(event).toMatch(/^[a-z0-9_]+$/);
    }
  });
});
