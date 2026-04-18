import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import type { Locale } from "@/lib/i18n";
import { findKeywordPageByBaseSlug, getFrenchKeyword } from "@/lib/site";
import frHome from "@/content/fr/home.json";
import frKeywordTemplate from "@/content/fr/keyword-template.json";

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

function replaceTokens(text: string, tokens: Record<string, string>) {
  return Object.entries(tokens).reduce((acc, [key, value]) => acc.replaceAll(`{{${key}}}`, value), text);
}

function buildFrenchKeywordContent(baseSlug: string): ArticleData | null {
  const page = findKeywordPageByBaseSlug(baseSlug);
  if (!page) return null;

  const tokens = {
    keyword: getFrenchKeyword(page),
    shortTitle: page.shortTitle,
  };

  return {
    title: replaceTokens(frKeywordTemplate.title, tokens),
    summary: replaceTokens(frKeywordTemplate.summary, tokens),
    sections: frKeywordTemplate.sections.map((section) => ({
      heading: replaceTokens(section.heading, tokens),
      content: replaceTokens(section.content, tokens),
    })),
  };
}

export function getCachedContent(key: string) {
  const cacheMap = readRawCache();
  return cacheMap[key] ?? null;
}

export function getHomeContent(locale: Locale = "en") {
  if (locale === "fr") {
    return frHome as ArticleData;
  }

  return getCachedContent("home");
}

export function getKeywordContent(baseSlug: string, locale: Locale = "en") {
  if (locale === "fr") {
    return buildFrenchKeywordContent(baseSlug);
  }

  const primaryKey = `keyword_${baseSlug}`;
  const fromPrimary = getCachedContent(primaryKey);
  if (fromPrimary) {
    return fromPrimary;
  }

  if (baseSlug === "linear-variable") {
    return getCachedContent("keyword_high-precision");
  }

  if (baseSlug === "rack-mount") {
    return getCachedContent("keyword_benchtop");
  }

  if (baseSlug === "high-precision") {
    return getCachedContent("keyword_precision");
  }

  return null;
}
