import Link from "next/link";
import { CONTACT_EMAIL, CONTACT_PHONE, LOCATION } from "@/lib/constants";
import { NAV_ITEMS } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer className="relative z-20 border-t border-white/10 bg-black px-6 py-14 text-white">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 md:flex-row md:items-end md:justify-between md:px-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.35em] text-blacksage-tan uppercase">
            Blacksage · Kennels
          </p>
          <p className="mt-3 max-w-sm text-sm text-white/45">
            ADRK / FCI Standard No. 147 — evidence before inquiry.
          </p>
        </div>
        <div className="space-y-5 text-sm text-white/55">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] tracking-[0.2em] uppercase">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-blacksage-tan">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="text-xs text-white/40">
            <p>{LOCATION}</p>
            <p className="mt-1">{CONTACT_EMAIL}</p>
            <p>{CONTACT_PHONE}</p>
          </div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-white/25 uppercase">
            © 2026 Blacksage Kennels
          </p>
        </div>
      </div>
    </footer>
  );
}
