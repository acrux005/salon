import type { Metadata } from "next";
import { OdartHomePageEn } from "@/components/odart/OdartHomePageEn";
import { ODART_SITE_URL } from "@/lib/odartSite";

const SITE = ODART_SITE_URL;

export const metadata: Metadata = {
  title: "ODART — websites and apps | Kolobrzeg, Poland",
  description:
    "Websites, web apps and IT support. Rafal Kowalkowski, ODART. Kolobrzeg, since 2008.",
  alternates: {
    canonical: `${SITE}/en/`,
    languages: {
      pl: `${SITE}/`,
      en: `${SITE}/en/`,
      "x-default": `${SITE}/`,
    },
  },
  openGraph: {
    title: "ODART — websites and apps",
    description:
      "Websites, web apps and IT support from Kolobrzeg, Poland.",
    url: `${SITE}/en/`,
    siteName: "ODART",
    locale: "en_US",
    alternateLocale: ["pl_PL"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ODART — websites and apps",
    description: "Websites, web apps and IT support. Kolobrzeg, Poland.",
  },
};

export default function EnglishHomePage() {
  return <OdartHomePageEn />;
}
