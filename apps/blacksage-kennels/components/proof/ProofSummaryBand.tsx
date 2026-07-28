import Link from "next/link";
import { PROOF_BAND } from "@/lib/constants";

export function ProofSummaryBand() {
  return (
    <section
      aria-labelledby="proof-band-heading"
      className="border-t-2 border-blacksage-tan bg-blacksage-proof-band py-10"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2 id="proof-band-heading" className="sr-only">
          Program proof summary
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROOF_BAND.map((cell) => (
            <div
              key={cell.title}
              className="space-y-2 rounded-sm bg-blacksage-lifted p-5"
            >
              <p className="section-overline text-blacksage-tan">{cell.title}</p>
              <p className="text-sm text-blacksage-text-secondary">{cell.body}</p>
              <Link href={cell.href} className="text-link text-sm font-medium">
                {cell.linkLabel}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
