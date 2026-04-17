import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

export interface ArticleSection {
  heading: string;
  content: string;
}

export interface ArticleData {
  title: string;
  summary?: string;
  sections: ArticleSection[];
}

const CACHE_FILE = path.join(process.cwd(), "content_cache.json");

const readRawCache = cache((): Record<string, ArticleData> => {
  if (!fs.existsSync(CACHE_FILE)) {
    return {};
  }

  try {
    const json = fs.readFileSync(CACHE_FILE, "utf8");
    return JSON.parse(json) as Record<string, ArticleData>;
  } catch {
    return {};
  }
});

export function getCachedContent(key: string) {
  const cacheMap = readRawCache();
  return cacheMap[key] ?? null;
}

export function getHomeContent() {
  return getCachedContent("home");
}

export function getKeywordContent(baseSlug: string) {
  const primaryKey = `keyword_${baseSlug}`;
  const fromPrimary = getCachedContent(primaryKey);
  if (fromPrimary) {
    return fromPrimary;
  }

  if (baseSlug === "linear-variable") {
    return getCachedContent("keyword_high-precision");
  }

  if (baseSlug === "high-precision") {
    return getCachedContent("keyword_precision");
  }

  return null;
}
