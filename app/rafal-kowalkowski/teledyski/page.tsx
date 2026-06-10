import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { isRafalKowalkowskiContentHost, ODART_SITE_URL } from "@/lib/odartSite";
import { OdartRafalKowalkowskiTeledyskiPage } from "@/components/odart/OdartRafalKowalkowskiTeledyskiPage";
import { RAFAL_KOWALKOWSKI_TELEDYSKI_PATH } from "@/lib/rafalKowalkowskiGallery";

const SITE = ODART_SITE_URL.replace(/\/$/, "");
const OG_IMAGE = "https://rafalkowalkowski.pl/wp-content/uploads/2023/02/3P4A7847-3.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    return { title: "404" };
  }
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_TELEDYSKI_PATH);
  return {
    title: { absolute: "Teledyski — filmowanie Kołobrzeg, Koszalin, Szczecin | ODART" },
    description:
      "Teledyski ślubne i muzyczne: scenariusz, produkcja, montaż, aranżacja. Zachodniopomorskie — Rafał Kowalkowski, ACRUX / ODART.",
    alternates: { canonical },
    openGraph: {
      title: "Teledyski | Rafał Kowalkowski | ODART",
      description: "Filmy i teledyski — koncepcja, plan zdjęć, postprodukcja.",
      url: canonical,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
      images: [{ url: OG_IMAGE, width: 800, height: 800, alt: "Teledyski — produkcja filmowa" }],
    },
  };
}

export default async function RafalKowalkowskiTeledyskiRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    notFound();
  }
  return <OdartRafalKowalkowskiTeledyskiPage />;
}
