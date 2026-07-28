"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import type { CtaPlacement } from "@/lib/analytics/types";
import { track } from "@/lib/analytics/track";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  label: string;
  placement: CtaPlacement;
  sourcePage: string;
  priority?: number;
};

function hrefToDestination(href: TrackedLinkProps["href"]): string {
  if (typeof href === "string") {
    return href;
  }

  if (href && typeof href === "object" && "pathname" in href) {
    return href.pathname ?? "";
  }

  return "";
}

export function TrackedLink({
  label,
  placement,
  sourcePage,
  priority,
  href,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      href={href}
      onClick={(event) => {
        track("cta_click", {
          label,
          placement,
          source_page: sourcePage,
          destination: hrefToDestination(href),
          ...(priority !== undefined ? { priority } : {}),
        });
        onClick?.(event);
      }}
      {...props}
    />
  );
}

export function trackCtaClick(args: {
  label: string;
  placement: CtaPlacement;
  sourcePage: string;
  destination: string;
  priority?: number;
}) {
  track("cta_click", {
    label: args.label,
    placement: args.placement,
    source_page: args.sourcePage,
    destination: args.destination,
    ...(args.priority !== undefined ? { priority: args.priority } : {}),
  });
}
