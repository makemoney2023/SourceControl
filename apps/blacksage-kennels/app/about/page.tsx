import Link from "next/link";
import { PageHero } from "@/components/content/PageHero";
import { LOCATION, OPERATOR_STORY, PROGRAM_PRINCIPLES } from "@/lib/constants";
import { PAGE_META } from "@/lib/content/page-meta";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata("about", "/about");

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <PageHero
        title={PAGE_META.about.h1}
        subhead="A German / ADRK-aligned Rottweiler breeding program focused on structure, temperament, and verifiable health transparency."
      />

      <section className="mt-16 space-y-4">
        <h2 className="font-display text-2xl font-semibold text-blacksage-text-primary">
          Our story is being prepared.
        </h2>
        <p className="prose-body">
          Blacksage Kennels is a German / ADRK-aligned Rottweiler breeding
          program focused on structure, temperament, and verifiable health
          transparency. {OPERATOR_STORY} will appear here when provided.
        </p>
      </section>

      <section className="mt-16 space-y-4">
        <h2 className="font-display text-2xl font-semibold text-blacksage-text-primary">
          Program principles
        </h2>
        <ul className="prose-body list-disc space-y-2 pl-5">
          {PROGRAM_PRINCIPLES.map((principle) => (
            <li key={principle}>{principle}</li>
          ))}
        </ul>
        <p className="prose-body mt-4">
          We believe serious buyers should evaluate a program on proof —
          standards literacy, health transparency, and placement process — before
          they reach out. That is why our site leads with education, not urgency.
        </p>
      </section>

      <section className="mt-16 space-y-3">
        <h2 className="font-display text-2xl font-semibold text-blacksage-text-primary">
          Contact
        </h2>
        <p className="prose-body">{LOCATION} · [CONTACT]</p>
      </section>

      <section className="mt-16 border-t border-blacksage-border pt-12">
        <h2 className="font-display text-2xl font-semibold text-blacksage-text-primary">
          Questions about our program?
        </h2>
        <p className="prose-body mt-3">
          When you&apos;ve reviewed our health approach and program details,
          you&apos;re welcome to begin an inquiry. Joining the interest list keeps
          you informed as our program develops — it is not a reservation.
        </p>
        <div className="mt-4 flex flex-wrap gap-6">
          <Link href="/inquire" className="text-link text-sm font-medium">
            Begin your inquiry →
          </Link>
          <Link href="/health" className="text-link text-sm font-medium">
            Read our health &amp; education approach →
          </Link>
        </div>
      </section>
    </div>
  );
}
