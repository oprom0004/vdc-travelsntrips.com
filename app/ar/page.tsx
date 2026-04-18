import type { Metadata } from "next";
import HomePage from "@/components/home-page";
import { getHomeContent } from "@/lib/content";
import { getMessages } from "@/lib/i18n";

const messages = getMessages("ar");

export const metadata: Metadata = {
  title: messages.meta.homeTitle,
  description: messages.meta.homeDescription,
  alternates: {
    canonical: "/ar",
    languages: {
      en: "/",
      fr: "/fr",
      ar: "/ar",
    },
  },
  openGraph: {
    title: messages.meta.ogTitle,
    description: messages.meta.ogDescription,
    url: "https://travelsntrips.com/ar",
    siteName: messages.meta.siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: messages.meta.ogTitle,
    description: messages.meta.ogDescription,
  },
};

export default function ArPage() {
  const homeContent = getHomeContent("ar");
  return <HomePage homeContent={homeContent} locale="ar" />;
}
