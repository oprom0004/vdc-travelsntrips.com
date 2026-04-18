import type { Metadata } from "next";
import { notFound } from "next/navigation";
import KeywordPage from "@/components/keyword-page";
import { getKeywordContent } from "@/lib/content";
import { findKeywordPage, hasArabicVariant, KEYWORD_PAGES, SITE_URL } from "@/lib/site";
import { getMessages } from "@/lib/i18n";

export function generateStaticParams() {
  return KEYWORD_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const messages = getMessages("en");
  const { slug } = await params;
  const page = findKeywordPage(slug);
  if (!page) {
    return {
      title: messages.meta.notFoundTitle,
      description: messages.meta.notFoundDescription,
      robots: { index: false, follow: false },
    };
  }

  return {
    title: page.seoTitle,
    description: page.description,
    alternates: {
      canonical: `/${page.slug}`,
      languages: {
        en: `/${page.slug}`,
        fr: `/fr/${page.slug}`,
        ...(hasArabicVariant(page.slug) ? { ar: `/ar/${page.slug}` } : {}),
      },
    },
    openGraph: {
      type: "article",
      title: page.seoTitle,
      description: page.description,
      url: `${SITE_URL}/${page.slug}`,
    },
    twitter: {
      card: "summary",
      title: page.seoTitle,
      description: page.description,
    },
  };
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = findKeywordPage(slug);
  if (!page) {
    notFound();
  }

  const content = getKeywordContent(page.baseSlug, "en");
  return <KeywordPage pageData={page} content={content} locale="en" />;
}
