"use client";

export function DisclosureBanner() {
  return (
    <div
      role="note"
      className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)]"
    >
      <strong className="font-medium">Cloud read.</strong> Your clip leaves this device for one
      cloud vision call. We do not claim on-device AI. No clip or still → no vision card.
    </div>
  );
}
