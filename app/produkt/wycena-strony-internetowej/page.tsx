import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartProduktWycenaStronyInternetowejPage } from "@/components/odart/OdartProduktWycenaStronyInternetowejPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/produkt/wycena-strony-internetowej/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "Wycena strony internetowej – Ostry Dyżur Artystyczny | ODART",
    description:
      "Co wpływa na koszt strony: zakres, grafika, funkcje, integracje, hosting, domena, WordPress. Wycena indywidualna — Kołobrzeg.",
    keywords: [
      "wycena strony internetowej",
      "koszt strony WordPress",
      "ile kosztuje strona WWW",
      "wycena sklepu internetowego",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Wycena strony internetowej | ODART",
      description:
        "Checklista pod wycenę: zakres, design, funkcje, integracje, utrzymanie. Hosting, domena, WordPress.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "article",
      siteName: "ODART",
    },
  };
}

export default async function ProduktWycenaStronyInternetowejPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartProduktWycenaStronyInternetowejPage />;
}
