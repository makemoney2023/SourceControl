const LOCAL_DEV_FALLBACK = "http://localhost:3000";

/**
 * Production origin for metadataBase, sitemap, and robots.
 * Set NEXT_PUBLIC_SITE_URL in production (no trailing slash).
 * Falls back to localhost for local dev when unset — see 16-eng handoff.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    return LOCAL_DEV_FALLBACK;
  }
  return raw.replace(/\/$/, "");
}
