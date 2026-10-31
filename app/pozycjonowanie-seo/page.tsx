import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartPozycjonowanieSeoPage } from "@/components/odart/OdartPozycjonowanieSeoPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/pozycjonowanie-seo/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: {
      absolute: "Pozycjonowanie stron Kołobrzeg | SEO lokalne od ODART",
    },
    description:
      "Pozycjonowanie stron w Kołobrzegu: SEO lokalne, treść, linki, Search Console. Rafał Kowalkowski — ODART. Tel. 695 432 415 — zapytaj o wycenę.",
    keywords: [
      "pozycjonowanie stron Kołobrzeg",
      "pozycjonowanie SEO",
      "SEO Kołobrzeg",
      "pozycjonowanie stron internetowych Kołobrzeg",
      "optymalizacja SEO",
      "Google Search Console",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Pozycjonowanie stron Kołobrzeg | ODART",
      description:
        "SEO lokalne w Kołobrzegu — treść, linki, Search Console. Tel. 695 432 415.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "article",
      publishedTime: "2024-05-26T00:00:00.000Z",
      siteName: "ODART",
    },
  };
}

export default async function PozycjonowanieSeoArticlePage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartPozycjonowanieSeoPage />;
}
