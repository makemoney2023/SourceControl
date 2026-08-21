"use client";

import { Button } from "@/components/ui/button";
import type { LiteQuota } from "@/lib/types";

interface PaywallStubProps {
  quota: LiteQuota;
}

export function PaywallStub({ quota }: PaywallStubProps) {
  return (
    <article className="rounded-[var(--card-radius)] border border-[var(--color-hairline)] bg-[var(--color-field)] p-4">
      <h2 className="font-[family-name:var(--font-display)] text-lg text-[var(--color-ink)]">
        Sixty honest reads. A hard stop when the next right thing is to stop.
      </h2>
      <p className="mt-2 text-base text-[var(--color-ink)]">
        Plus is stubbed in this explore build. You used {quota.readsUsed} of {quota.total} Lite
        reads. A real paywall would disclose: 60 Flash-class reads per month, refuse cannot skip
        the gate, no unlimited — $12/mo / $99/yr.
      </p>
      <Button className="mt-4" disabled type="button" variant="secondary">
        Get Plus — $12/mo (stubbed)
      </Button>
    </article>
  );
}
