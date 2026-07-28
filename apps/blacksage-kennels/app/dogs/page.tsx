import Link from "next/link";
import { PageHero } from "@/components/content/PageHero";
import { PAGE_META } from "@/lib/content/page-meta";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata("dogs", "/dogs");

export default function DogsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <PageHero title={PAGE_META.dogs.h1} />

      <section className="mt-12 max-w-2xl space-y-4 rounded-sm border border-blacksage-border bg-blacksage-lifted p-8">
        <h2 className="font-display text-2xl font-semibold text-blacksage-text-primary">
          Breeding stock profiles are coming soon.
        </h2>
        <p className="prose-body">
          Our program is developing. Explore our health and education resources
          to understand our standards and approach before you inquire.
        </p>
        <div className="flex flex-wrap gap-6 pt-2">
          <Link href="/health" className="text-link text-sm font-medium">
            Health &amp; testing →
          </Link>
          <Link
            href="/inquire"
            className="text-sm text-blacksage-text-muted underline underline-offset-4 hover:text-blacksage-text-primary"
          >
            Begin your inquiry →
          </Link>
        </div>
      </section>
    </div>
  );
}
