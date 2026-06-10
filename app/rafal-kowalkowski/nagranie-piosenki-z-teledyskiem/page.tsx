import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { isRafalKowalkowskiContentHost } from "@/lib/odartSite";
import { OdartRafalKowalkowskiNagranieTeledyskPage } from "@/components/odart/OdartRafalKowalkowskiNagranieTeledyskPage";
import { RAFAL_KOWALKOWSKI_NAGRANIE_TELEDYSK_PATH } from "@/lib/rafalKowalkowskiGallery";
import { RAFAL_SERVICE_IMAGE } from "@/lib/rafalKowalkowskiMedia";

const OG_IMAGE = RAFAL_SERVICE_IMAGE.teledysk.src;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    return { title: "404" };
  }
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_NAGRANIE_TELEDYSK_PATH);
  return {
    title: { absolute: "Nagranie piosenki z teledyskiem — Rafał Kowalkowski | ODART" },
    description:
      "Kompleksowe nagranie piosenki z teledyskiem — konsultacja, nagranie audio, scenariusz, zdjęcia, montaż i dostawa materiałów wideo.",
    alternates: { canonical },
    openGraph: {
      title: "Nagranie piosenki z teledyskiem | ODART",
      description: "Studio filmowe i nagraniowe ODART — piosenka z teledyskiem, audio i wideo gotowe do publikacji.",
      url: canonical,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
      images: [
        {
          url: OG_IMAGE,
          width: RAFAL_SERVICE_IMAGE.teledysk.w,
          height: RAFAL_SERVICE_IMAGE.teledysk.h,
          alt: "Nagranie piosenki z teledyskiem",
        },
      ],
    },
  };
}

export default async function RafalKowalkowskiNagranieTeledyskRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    notFound();
  }
  return <OdartRafalKowalkowskiNagranieTeledyskPage />;
}
