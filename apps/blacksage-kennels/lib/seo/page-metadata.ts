import type { Metadata } from "next";
import { PAGE_META } from "@/lib/content/page-meta";

type PageMetaKey = keyof typeof PAGE_META;

export function buildPageMetadata(
  key: PageMetaKey,
  canonicalPath: string,
): Metadata {
  const meta = PAGE_META[key];
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: canonicalPath },
  };
}
