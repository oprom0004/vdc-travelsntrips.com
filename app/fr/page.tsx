import type { Metadata } from "next";
import HomePage from "@/components/home-page";
import { getHomeContent } from "@/lib/content";
import { getMessages } from "@/lib/i18n";

const messages = getMessages("fr");

export const metadata: Metadata = {
  title: messages.meta.homeTitle,
  description: messages.meta.homeDescription,
  alternates: {
    canonical: "/fr",
    languages: {
      en: "/",
      fr: "/fr",
    },
  },
  openGraph: {
    title: messages.meta.ogTitle,
    description: messages.meta.ogDescription,
    url: "https://travelsntrips.com/fr",
    siteName: messages.meta.siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: messages.meta.ogTitle,
    description: messages.meta.ogDescription,
  },
};

export default function FrPage() {
  const homeContent = getHomeContent("fr");
  return <HomePage homeContent={homeContent} locale="fr" />;
}