import Link from "next/link";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Chat" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
] as const;

export function SiteNav({ active }: { active?: string }) {
  return (
    <nav
      aria-label="Primary"
      className="flex items-center gap-4 border-b border-[var(--color-hairline)] bg-[var(--color-paper)] px-4 py-3"
    >
      <Link
        href="/"
        className="font-[family-name:var(--font-display)] text-lg text-[var(--color-ink)]"
      >
        Telltail
      </Link>
      <div className="ml-auto flex gap-1 text-sm">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-[var(--color-muted)] hover:text-[var(--color-ink)]",
              active === item.href && "bg-[var(--color-field)] text-[var(--color-ink)]"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
