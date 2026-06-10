import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isRafalKowalkowskiContentHost, ODART_SITE_URL } from "@/lib/odartSite";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { OdartRafalKowalkowskiZajeciaWokalnePage } from "@/components/odart/OdartRafalKowalkowskiZajeciaWokalnePage";
import { RAFAL_KOWALKOWSKI_ZAJECIA_WOKALNE_PATH } from "@/lib/rafalKowalkowskiGallery";

const SITE = ODART_SITE_URL.replace(/\/$/, "");
const OG_IMAGE = `${SITE}/wp-content/uploads/rafalkowalkowski.jpg`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    return { title: "404" };
  }
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_ZAJECIA_WOKALNE_PATH);
  return {
    title: { absolute: "Zajęcia wokalne Kołobrzeg — Rafał Kowalkowski | ODART" },
    description:
      "Zajęcia wokalno-muzyczne dla dzieci i dorosłych, także online: ćwiczenia, kabina wokalna, Melodyne, nagrania i teledysk — Rafał Kowalkowski, ACRUX, Kołobrzeg.",
    alternates: { canonical },
    openGraph: {
      title: "Zajęcia wokalne Kołobrzeg | ODART",
      description: "Ćwiczenia wokalne, praca w kabinie, nagrania coverów i teledysk — opis zajęć.",
      url: canonical,
      locale: "pl_PL",
      type: "article",
      publishedTime: "2023-03-27T12:00:00+01:00",
      siteName: "ODART",
      images: [{ url: OG_IMAGE, width: 1200, height: 1200, alt: "Rafał Kowalkowski — zajęcia wokalne" }],
    },
  };
}

export default async function RafalKowalkowskiZajeciaWokalneKolobrzegRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    notFound();
  }
  return <OdartRafalKowalkowskiZajeciaWokalnePage />;
}
