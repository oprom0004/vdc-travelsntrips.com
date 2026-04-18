import type { MetadataRoute } from "next";
import { KEYWORD_PAGES, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const keywordEntries = KEYWORD_PAGES.map((page) => ({
    url: `${SITE_URL}/${page.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const frKeywordEntries = KEYWORD_PAGES.map((page) => ({
    url: `${SITE_URL}/fr/${page.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/fr`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...keywordEntries,
    ...frKeywordEntries,
  ];
}
