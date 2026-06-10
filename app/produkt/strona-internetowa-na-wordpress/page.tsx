import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartStronyInternetoweDemoPage } from "@/components/odart/OdartStronyInternetoweDemoPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
/** Preferowany URL w indeksie — ta sama treść co /produkt/strona-internetowa-na-wordpress/ */
const CANONICAL_PREFERRED = `${ODART_SITE}/strony-internetowe/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "Strony internetowe Kołobrzeg | ODART — Rafał Kowalkowski",
    description:
      "Strony WWW, które zdobywają klientów: UX, SEO, pakiety od 1200 zł, WordPress i Next.js. Kołobrzeg i zdalnie.",
    keywords: [
      "strona WordPress",
      "budowa strony WWW",
      "strony internetowe Kołobrzeg",
      "ODART",
    ],
    alternates: { canonical: CANONICAL_PREFERRED },
    openGraph: {
      title: "Strony internetowe | ODART",
      description:
        "Projektuję i buduję nowoczesne strony dla firm — od wizytówki po sklep. Zapytaj o wycenę.",
      url: CANONICAL_PREFERRED,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
    },
  };
}

export default async function ProduktStronaWordpressPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartStronyInternetoweDemoPage jsonLdCanonicalPathname="/strony-internetowe/" />;
}
