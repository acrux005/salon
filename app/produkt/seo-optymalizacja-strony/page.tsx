import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartProduktSeoOptymalizacjaStronyPage } from "@/components/odart/OdartProduktSeoOptymalizacjaStronyPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/produkt/seo-optymalizacja-strony/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "SEO – optymalizacja strony – Ostry Dyżur Artystyczny | ODART",
    description:
      "Usługa SEO: audyt techniczny, treści, linki, słowa kluczowe, raporty. Wyższa widoczność w Google i ruch organiczny. Kołobrzeg.",
    keywords: [
      "SEO optymalizacja strony",
      "pozycjonowanie WordPress",
      "audyt SEO",
      "słowa kluczowe",
      "SEO Kołobrzeg",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "SEO – optymalizacja strony | ODART",
      description:
        "Profesjonalne SEO: audyt, optymalizacja treści i techniczna, analiza konkurencji, raporty.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "article",
      siteName: "ODART",
    },
  };
}

export default async function ProduktSeoOptymalizacjaStronyPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartProduktSeoOptymalizacjaStronyPage />;
}
