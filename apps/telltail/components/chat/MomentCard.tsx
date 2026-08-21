"use client";

interface MomentCardProps {
  signals: string[];
  confidence: "low" | "medium" | "high";
  confidenceNote: string;
  actions: string[];
  stopRule: string;
}

export function MomentCard({
  signals,
  confidence,
  confidenceNote,
  actions,
  stopRule,
}: MomentCardProps) {
  return (
    <article
      aria-live="polite"
      className="rounded-[var(--card-radius)] border border-[var(--color-hairline)] bg-[var(--color-paper)] p-4 shadow-sm"
    >
      <div className="mb-2 h-2 w-2 rounded-sm bg-[var(--color-sign)]" />
      <h2 className="font-[family-name:var(--font-display)] text-lg text-[var(--color-ink)]">
        What we notice
      </h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-base text-[var(--color-ink)]">
        {signals.map((signal) => (
          <li key={signal}>{signal}</li>
        ))}
      </ul>
      <p className="mt-3 font-[family-name:var(--font-mono)] text-sm text-[var(--color-muted)]">
        Confidence: {confidence} — {confidenceNote}
      </p>
      {actions.length > 0 ? (
        <>
          <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-ink)]">
            Next 60 seconds
          </h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-base text-[var(--color-ink)]">
            {actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ol>
        </>
      ) : null}
      <p className="mt-4 border-t border-[var(--color-hairline)] pt-3 text-sm font-medium text-[var(--color-ink)]">
        Stop rule: {stopRule}
      </p>
    </article>
  );
}
