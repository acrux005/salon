import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { isRafalKowalkowskiContentHost } from "@/lib/odartSite";
import { OdartRafalKowalkowskiGatunkiMuzykiPage } from "@/components/odart/OdartRafalKowalkowskiGatunkiMuzykiPage";
import { RAFAL_KOWALKOWSKI_GATUNKI_MUZYKI_PATH } from "@/lib/rafalKowalkowskiGallery";

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) return { title: "404" };
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_GATUNKI_MUZYKI_PATH);
  return {
    title: { absolute: "Gatunki muzyki — Rafał Kowalkowski | ODART" },
    description: "Przegląd głównych gatunków muzycznych — klasyka, jazz, rock, pop, hip-hop, blues, country, reggae, metal, funk.",
    alternates: { canonical },
    openGraph: {
      title: "Gatunki muzyki | ODART",
      url: canonical,
      locale: "pl_PL",
      type: "article",
      siteName: "ODART",
    },
  };
}

export default async function RafalKowalkowskiGatunkiMuzykiRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) notFound();
  return <OdartRafalKowalkowskiGatunkiMuzykiPage />;
}
