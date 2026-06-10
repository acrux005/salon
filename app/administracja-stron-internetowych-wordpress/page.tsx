import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartAdministracjaWordpressPage } from "@/components/odart/OdartAdministracjaWordpressPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/administracja-stron-internetowych-wordpress/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "Administracja stron WordPress | Aktualizacje i bezpieczeństwo – ODART",
    description:
      "Kompleksowa administracja WordPress: aktualizacje, bezpieczeństwo, kopie zapasowe, SEO, wydajność i zgodność z RODO. ODART — Kołobrzeg.",
    keywords: [
      "administracja WordPress",
      "utrzymanie strony WordPress",
      "aktualizacje WordPress",
      "bezpieczeństwo WordPress",
      "opieka nad WordPressem",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Administracja stron WordPress | ODART",
      description:
        "Aktualizacje, monitoring, kopie zapasowe, SEO i zgodność prawna — pełna obsługa techniczna WordPress.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "article",
      publishedTime: "2023-11-14T00:00:00.000Z",
      modifiedTime: "2026-03-23T00:00:00.000Z",
      siteName: "ODART",
    },
  };
}

export default async function AdministracjaWordpressArticlePage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartAdministracjaWordpressPage />;
}
