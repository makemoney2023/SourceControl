import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/layout/SiteNav";

export default function HowItWorksPage() {
  return (
    <>
      <SiteNav active="/how-it-works" />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
          Tell the scare. Attach a clip. Get a next step — or a stop.
        </h1>
        <ol className="mt-8 list-decimal space-y-4 pl-5 text-base text-[var(--color-ink)]">
          <li>Open the thread and describe what happened — kids, food, doorbell, visitor.</li>
          <li>Attach a clip or still in the same thread when you want a vision read.</li>
          <li>
            One cloud vision call runs. Refuse-first: kids-in-frame, bite-risk, medical, or low
            confidence → stop card. Otherwise → moment card with signals, confidence, 1–3 actions,
            stop-rule.
          </li>
          <li>No clip → no vision card. Chat is context, not PetGPT.</li>
        </ol>
        <Button asChild className="mt-8">
          <Link href="/">Film this moment</Link>
        </Button>
      </div>
    </>
  );
}
