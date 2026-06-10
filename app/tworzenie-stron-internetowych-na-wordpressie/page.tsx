import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartTworzenieStronWordpressPage } from "@/components/odart/OdartTworzenieStronWordpressPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/tworzenie-stron-internetowych-na-wordpressie/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "Tworzenie stron WordPress | Skuteczne i nowoczesne strony – ODART",
    description:
      "Tworzenie stron na WordPressie: design, treści, social media, responsywność i bezpieczne wtyczki. ODART — Kołobrzeg.",
    keywords: [
      "tworzenie stron WordPress",
      "strona internetowa WordPress",
      "responsywny WordPress",
      "motywy i wtyczki WordPress",
      "strony WWW Kołobrzeg",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Tworzenie stron WordPress | ODART",
      description:
        "Nowoczesne strony na WordPressie — od projektu po treści, SEO i integracje społecznościowe.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "article",
      publishedTime: "2023-11-14T00:00:00.000Z",
      modifiedTime: "2026-03-23T00:00:00.000Z",
      siteName: "ODART",
    },
  };
}

export default async function TworzenieStronWordpressArticlePage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartTworzenieStronWordpressPage />;
}
