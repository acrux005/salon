import type { Metadata } from "next";
import { OdartEnglishServicePage } from "@/components/odart/OdartEnglishServicePage";
import { ODART_SITE_URL } from "@/lib/odartSite";

const SITE = ODART_SITE_URL;

export const metadata: Metadata = {
  title: "Services | ODART - Web applications and business websites",
  description:
    "English overview of ODART services: web applications, business websites, WordPress, SEO, automation, IT support and monitoring.",
  alternates: {
    canonical: `${SITE}/en/services/`,
  },
  openGraph: {
    title: "ODART services",
    description:
      "Web applications, business websites, WordPress, SEO, automation, IT support and monitoring.",
    url: `${SITE}/en/services/`,
    siteName: "ODART",
    locale: "en_US",
    type: "website",
  },
};

export default function EnglishServicesIndexPage() {
  return <OdartEnglishServicePage />;
}
