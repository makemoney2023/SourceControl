import type {
  AnalyticsEventName,
  AnalyticsProperties,
} from "@/lib/analytics/types";

type PlausibleFn = (
  event: string,
  options?: { props?: Record<string, string | number | boolean> },
) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

export function isAnalyticsEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true") {
    return false;
  }

  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? "none";
  if (provider === "none") {
    return false;
  }

  if (provider === "plausible") {
    return Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);
  }

  return false;
}

function serializeProperties(
  properties: AnalyticsProperties,
): Record<string, string | number | boolean> {
  const serialized: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(properties)) {
    if (value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      serialized[key] = value.join(",");
      continue;
    }

    serialized[key] = value;
  }

  return serialized;
}

export function track(
  event: AnalyticsEventName,
  properties: AnalyticsProperties = {},
): void {
  if (!isAnalyticsEnabled() || typeof window === "undefined") {
    return;
  }

  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? "none";
  const props = serializeProperties(properties);

  if (provider === "plausible" && typeof window.plausible === "function") {
    window.plausible(event, { props });
  }
}

export function getPlausibleDomain(): string | undefined {
  return process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
}
