"use client";

import type { RefuseReason } from "@/lib/types";

const REASON_COPY: Record<RefuseReason, string> = {
  "kids-in-frame": "A child appears in this clip. We will not coach frames with kids in them.",
  "bite-risk": "This clip looks like bite-risk or snapping. We will not coach this moment.",
  medical: "This may be a medical emergency. We will not coach this clip.",
  "confidence-floor": "We cannot hold an honest read on this clip.",
  "no-media": "Attach a clip or still to unlock a vision read.",
  "quota-exhausted": "Lite reads are used for this explore period.",
  "api-unavailable": "Vision read is unavailable right now.",
};

interface RefuseCardProps {
  title?: string;
  reason: RefuseReason;
  escalate: string;
}

export function RefuseCard({
  title = "We will not coach this clip.",
  reason,
  escalate,
}: RefuseCardProps) {
  return (
    <article
      aria-live="polite"
      className="rounded-[var(--card-radius)] border border-[var(--color-hairline)] bg-[var(--color-paper)] p-4 shadow-sm"
    >
      <div className="mb-2 h-1 w-12 rounded-full bg-[var(--color-refuse)]" />
      <h2 className="font-[family-name:var(--font-display)] text-lg text-[var(--color-refuse)]">
        {title}
      </h2>
      <p className="mt-2 text-base text-[var(--color-ink)]">{REASON_COPY[reason]}</p>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{escalate}</p>
      <p className="mt-3 text-xs text-[var(--color-muted)]">
        Telltail is not a diagnosis and does not replace a vet or credentialed trainer.
      </p>
    </article>
  );
}
