"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { recordEvidencePage } from "@/lib/analytics/evidence-session";
import { pathToRouteName } from "@/lib/analytics/routes";
import { track } from "@/lib/analytics/track";
import { getInquirePackage } from "@/lib/site-config";

export function PageViewTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === lastPath.current) {
      return;
    }

    lastPath.current = pathname;
    recordEvidencePage(pathname);

    const routeName = pathToRouteName(pathname);
    if (!routeName) {
      return;
    }

    track("page_view", {
      path: pathname,
      route_name: routeName,
      referrer: typeof document !== "undefined" ? document.referrer : undefined,
      ...(pathname === "/inquire"
        ? { package_mode: getInquirePackage() }
        : {}),
    });
  }, [pathname]);

  return null;
}
