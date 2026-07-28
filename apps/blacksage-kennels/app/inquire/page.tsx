import Link from "next/link";
import { PageHero } from "@/components/content/PageHero";
import { InquiryForm } from "@/components/inquire/InquiryForm";
import { PackageModeHeader } from "@/components/inquire/PackageModeHeader";
import { RESPONSE_EXPECTATION } from "@/lib/constants";
import { PAGE_META } from "@/lib/content/page-meta";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { getInquirePackage } from "@/lib/site-config";

export const metadata = buildPageMetadata("inquire", "/inquire");

export default function InquirePage() {
  const packageMode = getInquirePackage();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <PageHero
        title={PAGE_META.inquire.h1}
        subhead="We review every inquiry individually. This is the start of a conversation about fit, timing, and our program — not a reservation or checkout."
      />

      <div className="mt-12 space-y-10">
        <PackageModeHeader packageMode={packageMode} />
        <InquiryForm packageMode={packageMode} />
      </div>

      <footer className="prose-body mt-12 border-t border-blacksage-border pt-8 text-sm">
        <p>
          ADRK / FCI Standard No. 147 aligned breeding. Health clearances and
          temperament assessment inform pairings. {RESPONSE_EXPECTATION}
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link href="/" className="text-link">
            Return to home →
          </Link>
          <Link href="/health" className="text-link">
            Health &amp; education →
          </Link>
          <Link href="/health#placement" className="text-link">
            Our placement process →
          </Link>
        </div>
      </footer>
    </div>
  );
}
