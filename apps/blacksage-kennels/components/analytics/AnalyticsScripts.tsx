import Script from "next/script";
import { getPlausibleDomain, isAnalyticsEnabled } from "@/lib/analytics/track";

export function AnalyticsScripts() {
  if (!isAnalyticsEnabled()) {
    return null;
  }

  const domain = getPlausibleDomain();
  if (!domain) {
    return null;
  }

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
