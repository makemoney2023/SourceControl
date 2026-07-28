import type { MetadataRoute } from "next";
import {
  buildSitemapUrl,
  MUST_ROUTES,
} from "@/lib/seo/must-routes";
import { getSiteUrl } from "@/lib/seo/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  return MUST_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: buildSitemapUrl(baseUrl, path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
