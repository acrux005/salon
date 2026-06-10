import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { isRafalKowalkowskiContentHost } from "@/lib/odartSite";
import { OdartRafalKowalkowskiPrezentWokalnyPage } from "@/components/odart/OdartRafalKowalkowskiPrezentWokalnyPage";
import { RAFAL_KOWALKOWSKI_PREZENT_WOKALNY_PATH } from "@/lib/rafalKowalkowskiGallery";
import { RAFAL_SERVICE_IMAGE } from "@/lib/rafalKowalkowskiMedia";

const OG_IMAGE = RAFAL_SERVICE_IMAGE.prezent.src;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    return { title: "404" };
  }
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_PREZENT_WOKALNY_PATH);
  return {
    title: { absolute: "Prezent wokalny na ślub lub urodziny — Rafał Kowalkowski | ODART" },
    description:
      "Spersonalizowany prezent wokalny na ślub lub urodziny — nagranie, ćwiczenia wokalne, opcjonalnie aranżacja i teledysk. Studio ODART, Rafał Kowalkowski.",
    alternates: { canonical },
    openGraph: {
      title: "Prezent wokalny na ślub lub urodziny | ODART",
      description: "Niezapomniany prezent dźwiękowy — konsultacja, nagranie wokalu i opcjonalnie teledysk.",
      url: canonical,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
      images: [
        {
          url: OG_IMAGE,
          width: RAFAL_SERVICE_IMAGE.prezent.w,
          height: RAFAL_SERVICE_IMAGE.prezent.h,
          alt: "Prezent wokalny na ślub lub urodziny",
        },
      ],
    },
  };
}

export default async function RafalKowalkowskiPrezentWokalnyRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    notFound();
  }
  return <OdartRafalKowalkowskiPrezentWokalnyPage />;
}
