import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartStronyInternetoweDemoPage } from "@/components/odart/OdartStronyInternetoweDemoPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/strona-internetowa-koszalin/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "Strona internetowa Koszalin | ODART — strony WWW, WordPress, Next.js, SEO",
    description:
      "Tworzenie stron internetowych dla firm w Koszalinie: projekt, UX, SEO, WordPress i Next.js. Wycena, wdrożenie, opieka. Siedziba w Kołobrzegu, realizacje w Koszalinie i zdalnie.",
    keywords: [
      "strona internetowa Koszalin",
      "strony www Koszalin",
      "tworzenie stron Koszalin",
      "strona firmowa Koszalin",
      "WordPress Koszalin",
      "pozycjonowanie strony Koszalin",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Strona internetowa Koszalin | ODART",
      description:
        "Strony WWW, które zdobywają klientów — od wizytówki po sklep. Dopasowanie do branży, SEO, szybki kontakt.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
    },
  };
}

export default async function StronaInternetowaKoszalinPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return (
    <OdartStronyInternetoweDemoPage
      jsonLdCanonicalPathname="/strona-internetowa-koszalin/"
      localSeo={{ city: "Koszalin", cityLocative: "Koszalinie" }}
    />
  );
}
