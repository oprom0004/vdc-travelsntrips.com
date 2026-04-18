import type { Metadata } from "next";
import { notFound } from "next/navigation";
import KeywordPage from "@/components/keyword-page";
import { getKeywordContent } from "@/lib/content";
import { findKeywordPage, getFrenchKeyword, hasArabicVariant, KEYWORD_PAGES } from "@/lib/site";
import { getMessages } from "@/lib/i18n";

const messages = getMessages("fr");

export function generateStaticParams() {
  return KEYWORD_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = findKeywordPage(slug);
  if (!page) {
    return {
      title: messages.meta.notFoundTitle,
      description: messages.meta.notFoundDescription,
      robots: { index: false, follow: false },
    };
  }
  const frKeyword = getFrenchKeyword(page);

  return {
    title: `${frKeyword} | Achat en ligne`,
    description: `Acheter ${frKeyword} en ligne avec support devis industriel et livraison rapide.`,
    alternates: {
      canonical: `/fr/${page.slug}`,
      languages: {
        en: `/${page.slug}`,
        fr: `/fr/${page.slug}`,
        ...(hasArabicVariant(page.slug) ? { ar: `/ar/${page.slug}` } : {}),
      },
    },
    openGraph: {
      type: "article",
      title: `${frKeyword} | Achat en ligne`,
      description: `Specifications et commande pour ${frKeyword}.`,
      url: `https://travelsntrips.com/fr/${page.slug}`,
    },
    twitter: {
      card: "summary",
      title: `${frKeyword} | Achat en ligne`,
      description: `Specifications et commande pour ${frKeyword}.`,
    },
  };
}

export default async function FrSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = findKeywordPage(slug);
  if (!page) {
    notFound();
  }

  const content = getKeywordContent(page.baseSlug, "fr");
  return <KeywordPage pageData={page} content={content} locale="fr" />;
}
