"use client";

import Link from "next/link";
import { useEffect } from "react";
import { getEvidenceCount } from "@/lib/analytics/evidence-session";
import { track } from "@/lib/analytics/track";
import type { InquirePackage } from "@/lib/site-config";
import { PACKAGE_COPY } from "@/lib/site-config";

type InquiryConfirmationProps = {
  packageMode: InquirePackage;
};

export function InquiryConfirmation({ packageMode }: InquiryConfirmationProps) {
  const copy = PACKAGE_COPY[packageMode];

  useEffect(() => {
    track("confirmation_view", {
      package_mode: packageMode,
      prior_evidence_count: getEvidenceCount(),
    });
  }, [packageMode]);

  return (
    <div className="space-y-4 rounded-sm border border-blacksage-border bg-blacksage-lifted p-8">
      <h2 className="font-display text-2xl font-semibold text-blacksage-text-primary">
        {copy.successTitle}
      </h2>
      <p className="prose-body">{copy.successBody}</p>
      <Link href="/" className="text-link inline-block text-sm font-medium">
        Return to home →
      </Link>
    </div>
  );
}
