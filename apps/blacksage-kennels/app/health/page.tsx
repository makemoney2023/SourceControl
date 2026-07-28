import Link from "next/link";
import { PageHero } from "@/components/content/PageHero";
import { HEALTH_CATEGORIES } from "@/lib/constants";
import { PAGE_META } from "@/lib/content/page-meta";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata("health", "/health");

export default function HealthPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <PageHero
        title={PAGE_META.health.h1}
        subhead="Standards, health testing, temperament, and how we place dogs — transparent from the start."
      />

      <section id="standards" className="mt-16 scroll-mt-24 space-y-6">
        <p className="section-overline">Breed standard</p>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-3xl font-semibold text-blacksage-text-primary">
            ADRK / FCI Standard No. 147
          </h2>
          <span className="rounded-sm border border-blacksage-border px-2 py-1 text-xs font-medium text-blacksage-sage">
            Standard reference
          </span>
        </div>
        <div className="prose-body space-y-4">
          <p>
            The Rottweiler was defined in Germany. FCI Standard No. 147 remains
            the reference for ADRK-aligned breeding — the origin club standard
            that describes correct type, temperament, and structure.
          </p>
          <p className="font-medium text-blacksage-text-primary">Correct type includes:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Black coat with clearly defined rich tan markings</li>
            <li>Compact, powerful build — strength without exaggeration</li>
            <li>
              Natural tail in natural condition under German/ADRK breeding
              philosophy
            </li>
          </ul>
          <div className="overflow-x-auto">
            <table className="mt-4 w-full max-w-md border-collapse text-sm">
              <caption className="mb-2 text-left font-medium text-blacksage-text-primary">
                Size reference (education)
              </caption>
              <thead>
                <tr className="border-b border-blacksage-border text-left">
                  <th className="py-2 pr-4 font-medium">Sex</th>
                  <th className="py-2 pr-4 font-medium">Height</th>
                  <th className="py-2 font-medium">Weight</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-blacksage-border">
                  <td className="py-2 pr-4">Males</td>
                  <td className="py-2 pr-4">61–68 cm</td>
                  <td className="py-2">~50 kg</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Females</td>
                  <td className="py-2 pr-4">56–63 cm</td>
                  <td className="py-2">~42 kg</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Blacksage breeding decisions reference this standard. Structure and
            temperament come before trend. We breed toward type integrity — not
            toward oversized, exotic, or marketing-driven extremes.
          </p>
          <p>
            ADRK-aligned does not mean imported marketing language. It means our
            pairings are informed by the origin standard.
          </p>
        </div>
      </section>

      <section id="testing" className="mt-20 scroll-mt-24 space-y-6">
        <p className="section-overline">Health clearances</p>
        <h2 className="font-display text-3xl font-semibold text-blacksage-text-primary">
          Health testing approach
        </h2>
        <div className="prose-body space-y-4">
          <p>
            Health clearances inform every pairing in responsible Rottweiler
            breeding. We test across categories that matter for the breed&apos;s
            long-term soundness — and we share our approach before you inquire.
          </p>
          <p>
            When operator inventory is verified, per-dog results link to OFA and
            related registries for independent review. Until then, this page
            describes our testing philosophy and the categories we prioritize.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {HEALTH_CATEGORIES.map((category) => (
            <div
              key={category.title}
              className="rounded-sm border border-blacksage-border bg-blacksage-lifted p-6"
            >
              <h3 className="font-medium text-blacksage-text-primary">
                {category.title}
              </h3>
              <p className="prose-body mt-2 text-sm">{category.body}</p>
            </div>
          ))}
        </div>
        <p className="prose-body text-sm">
          External resources:{" "}
          <a
            href="https://www.adrk.de"
            className="text-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more at ADRK and OFA →
          </a>{" "}
          ·{" "}
          <a
            href="https://www.ofa.org"
            className="text-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            OFA →
          </a>
        </p>
      </section>

      <section id="temperament" className="mt-20 scroll-mt-24 space-y-6">
        <p className="section-overline">Temperament</p>
        <h2 className="font-display text-3xl font-semibold text-blacksage-text-primary">
          Temperament within the standard
        </h2>
        <div className="prose-body space-y-4">
          <p>
            A Rottweiler should be good-natured, placid in basic disposition,
            and devoted to its owner. The FCI standard describes a dog that is
            obedient, eager to work, and self-assured — fearless and
            even-tempered, not nervous or aggressive.
          </p>
          <p>
            <span className="font-medium text-blacksage-text-primary">
              Plain-English gloss:
            </span>{" "}
            Calm baseline, devoted to family, confident without being reactive.
            Willing to work when asked.
          </p>
          <p>
            That is the temperament we breed toward. These dogs live as family
            companions with working capability — not props for intimidation or
            status.
          </p>
          <p>
            Power requires responsible ownership. We place by fit, not by hype.
            If you&apos;re looking for guard-dog marketing or aggression as a
            selling point, we may not be the right program.
          </p>
          <p>Our dogs are powerful, devoted companions — not status symbols.</p>
        </div>
      </section>

      <section id="placement" className="mt-20 scroll-mt-24 space-y-8">
        <p className="section-overline">Deliberate placement</p>
        <h2 className="font-display text-3xl font-semibold text-blacksage-text-primary">
          Our placement process
        </h2>
        <div className="prose-body space-y-4">
          <p>
            Blacksage is a selective breeding program — not a volume kennel. We
            review every inquiry individually. Placement follows mutual fit, not
            first payment or checkout urgency.
          </p>
          <p>
            We do not list prices or deposit amounts on this site. Ethical
            breeders discuss investment and terms after qualification — when
            both parties understand fit and timing.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-sm border border-blacksage-border bg-blacksage-lifted p-6">
            <h3 className="font-display text-xl font-semibold text-blacksage-text-primary">
              Join our interest list
            </h3>
            <p className="prose-body mt-3 text-sm">
              When our program is in development, you can share your contact
              details and interest. Joining the interest list keeps you informed
              as our program develops. It does not guarantee a puppy or place
              you on a waitlist. This is not a reservation.
            </p>
            <Link href="/inquire" className="text-link mt-4 inline-block text-sm">
              Begin your inquiry →
            </Link>
          </article>
          <article className="rounded-sm border border-blacksage-border bg-blacksage-elevated p-6">
            <h3 className="font-display text-xl font-semibold text-blacksage-text-primary">
              Submit inquiry for waitlist consideration
            </h3>
            <p className="prose-body mt-3 text-sm">
              When our program is active, you can submit an inquiry for waitlist
              consideration. Submitting begins a mutual fit review — not a
              reservation. If we determine alignment, we discuss next steps
              individually, including any waitlist process.
            </p>
            <p className="prose-body mt-3 text-sm">
              A waitlist deposit may be required after approval. Terms and amounts
              are provided individually — not on this site.
            </p>
            <Link href="/inquire" className="text-link mt-4 inline-block text-sm">
              Begin your inquiry →
            </Link>
          </article>
          <article className="rounded-sm border border-blacksage-border bg-blacksage-lifted p-6">
            <h3 className="font-display text-xl font-semibold text-blacksage-text-primary">
              How placement works
            </h3>
            <p className="prose-body mt-3 text-sm">
              Placement follows mutual fit, contract, and operator process.
              There is no on-site payment or checkout. After inquiry review,
              approved buyers receive terms, timeline, and next steps directly
              — not through this website.
            </p>
            <ul className="prose-body mt-4 list-disc space-y-2 pl-5 text-sm">
              <li>We place by fit, not by first payment.</li>
              <li>
                If you&apos;re looking for instant availability or guard-dog
                hype, we may not be the right program.
              </li>
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
}
