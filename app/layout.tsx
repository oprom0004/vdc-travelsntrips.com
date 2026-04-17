import type { Metadata } from "next";
import LayoutShell from "@/components/layout-shell";
import "./globals.css";
import { HOME_HERO_IMAGE, SITE_URL, TARGET_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Professional Variable DC Power Supply Solutions | eTommens Official Technical Hub",
  description: "Technical resource center for variable DC power supply systems, including high-voltage, programmable, and precision lineup pages.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    title: "Professional Variable DC Power Supply Solutions",
    description: "Industrial variable DC power supply expertise and technical specifications.",
    url: SITE_URL,
    siteName: "TRAVELSNTRIPS Industrial Tech",
    images: [
      {
        url: HOME_HERO_IMAGE,
        width: 1200,
        height: 630,
        alt: "High precision linear variable DC power supply",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Variable DC Power Supply Solutions",
    description: "Industrial variable DC power supply expertise and technical specifications.",
    images: [HOME_HERO_IMAGE],
  },
};

const schemaData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "eTommens",
  url: SITE_URL,
  logo: `${TARGET_URL}/logo.png`,
  sameAs: [TARGET_URL],
  description: "Manufacturer of high-precision variable DC power supplies featuring Etomsys control technology.",
  brand: {
    "@type": "Brand",
    name: "eTommens",
  },
  knowsAbout: ["Variable DC Power Supply", "Etomsys Digital Control", "Precision Power Electronics"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
