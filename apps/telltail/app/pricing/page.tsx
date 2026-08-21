import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/layout/SiteNav";

export default function PricingPage() {
  return (
    <>
      <SiteNav active="/pricing" />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
          Sixty honest reads. A hard stop when the next right thing is to stop.
        </h1>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-[var(--card-radius)] border border-[var(--color-hairline)] bg-[var(--color-field)] p-6">
            <h2 className="font-[family-name:var(--font-display)] text-xl">Lite (explore)</h2>
            <p className="mt-2 text-[var(--color-ink)]">3–5 cheap-model reads. Gates always on.</p>
            <p className="mt-4 font-[family-name:var(--font-mono)] text-sm text-[var(--color-muted)]">
              First scare completes — card or refuse — before any paywall.
            </p>
          </section>
          <section className="rounded-[var(--card-radius)] border border-[var(--color-hairline)] bg-[var(--color-paper)] p-6">
            <h2 className="font-[family-name:var(--font-display)] text-xl">Plus (stubbed)</h2>
            <p className="mt-2 text-[var(--color-ink)]">$12/mo · $99/yr · 60 Flash + credits</p>
            <p className="mt-4 text-sm text-[var(--color-muted)]">
              Not shipped this pass. Refuse cannot skip the gate. No unlimited. K1 bite-risk eval
              still open.
            </p>
          </section>
        </div>
        <Button asChild className="mt-8">
          <Link href="/">Open the thread</Link>
        </Button>
      </div>
    </>
  );
}
