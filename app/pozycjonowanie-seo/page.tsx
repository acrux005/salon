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
    title: "Zasady pozycjonowania SEO stron internetowych | ODART",
    description:
      "SEO: słowa kluczowe, URL, treść, linki, multimedia, LSI, Search Console i więcej. Poradnik ODART — Kołobrzeg.",
    keywords: [
      "pozycjonowanie SEO",
      "SEO strony internetowej",
      "optymalizacja SEO",
      "Google Search Console",
      "słowa kluczowe",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Zasady pozycjonowania SEO | ODART",
      description: "Praktyczny przegląd działań SEO dla stron WWW.",
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
