import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartProduktNowoczesneAplikacjeWebowePage } from "@/components/odart/OdartProduktNowoczesneAplikacjeWebowePage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/produkt/nowoczesne-aplikacje-webowe/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "Nowoczesne aplikacje webowe – React, Next.js | ODART",
    description:
      "Aplikacje webowe na zamówienie: React, Next.js, TypeScript, wydajność, bezpieczeństwo, wdrożenia produkcyjne. Kołobrzeg.",
    keywords: [
      "aplikacje webowe",
      "Next.js",
      "React",
      "aplikacja na zamówienie",
      "programista web Kołobrzeg",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Nowoczesne aplikacje webowe | ODART",
      description:
        "Projektowanie i wdrożenie aplikacji webowych dopasowanych do procesów biznesowych — od UX po produkcję.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "article",
      siteName: "ODART",
    },
  };
}

export default async function ProduktNowoczesneAplikacjeWebowePage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartProduktNowoczesneAplikacjeWebowePage />;
}
