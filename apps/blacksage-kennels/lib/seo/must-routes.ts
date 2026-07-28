import type { MetadataRoute } from "next";

type MustRoute = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

export const MUST_ROUTES: readonly MustRoute[] = [
  { path: "/", priority: 1.0, changeFrequency: "monthly" },
  { path: "/health", priority: 0.9, changeFrequency: "monthly" },
  { path: "/dogs", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/inquire", priority: 0.6, changeFrequency: "yearly" },
] as const;

export const MUST_ROUTE_PATHS = MUST_ROUTES.map((route) => route.path);

export function buildSitemapUrl(baseUrl: string, path: string): string {
  return path === "/" ? `${baseUrl}/` : `${baseUrl}${path}`;
}
