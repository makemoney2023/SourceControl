import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "ok" | "warn" | "danger" | "accent";
}) {
  const tones = {
    neutral: "bg-[var(--color-bg)] text-[var(--color-muted)] border-[var(--color-line)]",
    ok: "bg-[#e6f4ea] text-[var(--color-ok)] border-[#b7dfc4]",
    warn: "bg-[#fff1e0] text-[var(--color-warn)] border-[#efd0a8]",
    danger: "bg-[#fde8e8] text-[var(--color-danger)] border-[#f0b4b4]",
    accent: "bg-[#e3f5f1] text-[var(--color-accent)] border-[#b5ddd4]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
