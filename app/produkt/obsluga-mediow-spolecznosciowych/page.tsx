import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartProduktObslugaMediowSpolecznosciowychPage } from "@/components/odart/OdartProduktObslugaMediowSpolecznosciowychPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/produkt/obsluga-mediow-spolecznosciowych/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "Obsługa mediów społecznościowych – Ostry Dyżur Artystyczny | ODART",
    description:
      "Strategia social media, prowadzenie profili, treści, harmonogram, community, kampanie i raporty. Kołobrzeg i online — ODART.",
    keywords: [
      "obsługa social media",
      "media społecznościowe firma",
      "prowadzenie Facebook Instagram",
      "social media Kołobrzeg",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Obsługa mediów społecznościowych | ODART",
      description:
        "Kompleksowa obsługa social media: strategia, treści, kampanie, analiza i raporty.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "article",
      siteName: "ODART",
    },
  };
}

export default async function ProduktObslugaMediowSpolecznosciowychPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartProduktObslugaMediowSpolecznosciowychPage />;
}
