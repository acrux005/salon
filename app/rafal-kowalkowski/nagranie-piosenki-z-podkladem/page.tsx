import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { isRafalKowalkowskiContentHost } from "@/lib/odartSite";
import { OdartRafalKowalkowskiNagraniePodkladPage } from "@/components/odart/OdartRafalKowalkowskiNagraniePodkladPage";
import { RAFAL_KOWALKOWSKI_NAGRANIE_PODKLAD_PATH } from "@/lib/rafalKowalkowskiGallery";
import { RAFAL_SERVICE_IMAGE } from "@/lib/rafalKowalkowskiMedia";

const OG_IMAGE = RAFAL_SERVICE_IMAGE.podklad.src;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    return { title: "404" };
  }
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_NAGRANIE_PODKLAD_PATH);
  return {
    title: { absolute: "Nagranie piosenki z podkładem — Rafał Kowalkowski | ODART" },
    description:
      "Profesjonalne nagranie piosenki z podkładem muzycznym — konsultacja, wybór podkładu, nagranie wokalu, miks i mastering.",
    alternates: { canonical },
    openGraph: {
      title: "Nagranie piosenki z podkładem | ODART",
      description: "Studio nagraniowe ODART — nagranie wokalu do podkładu, wysoka jakość produkcji.",
      url: canonical,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
      images: [
        {
          url: OG_IMAGE,
          width: RAFAL_SERVICE_IMAGE.podklad.w,
          height: RAFAL_SERVICE_IMAGE.podklad.h,
          alt: "Nagranie piosenki z podkładem",
        },
      ],
    },
  };
}

export default async function RafalKowalkowskiNagraniePodkladRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    notFound();
  }
  return <OdartRafalKowalkowskiNagraniePodkladPage />;
}
