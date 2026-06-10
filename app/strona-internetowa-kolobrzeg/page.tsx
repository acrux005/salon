import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartStronyInternetoweDemoPage } from "@/components/odart/OdartStronyInternetoweDemoPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/strona-internetowa-kolobrzeg/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "Strona internetowa Kołobrzeg | ODART — strony WWW, WordPress, Next.js, SEO",
    description:
      "Tworzenie stron internetowych w Kołobrzegu: projekt, UX, SEO, WordPress i Next.js. Wycena, wdrożenie, opieka. Siedziba ODART w Kołobrzegu — realizacje lokalnie i zdalnie w całej Polsce.",
    keywords: [
      "strona internetowa Kołobrzeg",
      "strony www Kołobrzeg",
      "tworzenie stron Kołobrzeg",
      "strona firmowa Kołobrzeg",
      "WordPress Kołobrzeg",
      "pozycjonowanie strony Kołobrzeg",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Strona internetowa Kołobrzeg | ODART",
      description:
        "Strony WWW dla firm z Kołobrzegu — od wizytówki po rozbudowany serwis. SEO, szybki kontakt, dopasowanie do branży.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
    },
  };
}

export default async function StronaInternetowaKolobrzegPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return (
    <OdartStronyInternetoweDemoPage
      jsonLdCanonicalPathname="/strona-internetowa-kolobrzeg/"
      localSeo={{ city: "Kołobrzeg", cityLocative: "Kołobrzegu" }}
    />
  );
}
