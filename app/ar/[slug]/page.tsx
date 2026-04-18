import type { Metadata } from "next";
import { notFound } from "next/navigation";
import KeywordPage from "@/components/keyword-page";
import { getKeywordContent } from "@/lib/content";
import { getMessages } from "@/lib/i18n";
import { AR_MVP_SLUGS, findKeywordPage, getArabicKeyword, hasArabicVariant, SITE_URL } from "@/lib/site";

const messages = getMessages("ar");

export function generateStaticParams() {
  return AR_MVP_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = findKeywordPage(slug);
  if (!page || !hasArabicVariant(slug)) {
    return {
      title: messages.meta.notFoundTitle,
      description: messages.meta.notFoundDescription,
      robots: { index: false, follow: false },
    };
  }

  const arKeyword = getArabicKeyword(page);

  return {
    title: `${arKeyword} | شراء عبر الإنترنت`,
    description: `شراء ${arKeyword} عبر الإنترنت مع دعم فني وطلبات أسعار للكميات.`,
    alternates: {
      canonical: `/ar/${page.slug}`,
      languages: {
        en: `/${page.slug}`,
        fr: `/fr/${page.slug}`,
        ar: `/ar/${page.slug}`,
      },
    },
    openGraph: {
      type: "article",
      title: `${arKeyword} | شراء عبر الإنترنت`,
      description: `مواصفات وطلب مباشر لـ ${arKeyword}.`,
      url: `${SITE_URL}/ar/${page.slug}`,
    },
    twitter: {
      card: "summary",
      title: `${arKeyword} | شراء عبر الإنترنت`,
      description: `مواصفات وطلب مباشر لـ ${arKeyword}.`,
    },
  };
}

export default async function ArSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = findKeywordPage(slug);
  if (!page || !hasArabicVariant(slug)) {
    notFound();
  }

  const content = getKeywordContent(page.baseSlug, "ar");
  return <KeywordPage pageData={page} content={content} locale="ar" />;
}
