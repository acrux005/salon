import type { Metadata } from "next";
import { OdartHomePageEn } from "@/components/odart/OdartHomePageEn";
import { ODART_SITE_URL } from "@/lib/odartSite";

const SITE = ODART_SITE_URL;

export const metadata: Metadata = {
  title: "ODART - Web applications and business websites | Poland",
  description:
    "Custom web applications, business websites, WordPress, SEO and IT support by ODART - Rafal Kowalkowski, Kolobrzeg, Poland.",
  alternates: {
    canonical: `${SITE}/en/`,
    languages: {
      pl: `${SITE}/`,
      en: `${SITE}/en/`,
      "x-default": `${SITE}/`,
    },
  },
  openGraph: {
    title: "ODART - Web applications and business websites",
    description:
      "Custom web applications, business websites, WordPress, SEO and IT support from Kolobrzeg, Poland.",
    url: `${SITE}/en/`,
    siteName: "ODART",
    locale: "en_US",
    alternateLocale: ["pl_PL"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ODART - Web applications and business websites",
    description: "Custom web applications, business websites, WordPress, SEO and IT support.",
  },
};

export default function EnglishHomePage() {
  return <OdartHomePageEn />;
}
