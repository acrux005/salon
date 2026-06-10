import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { isRafalKowalkowskiContentHost } from "@/lib/odartSite";
import { OdartRafalKowalkowskiSesjaPrzyjaciolkaPage } from "@/components/odart/OdartRafalKowalkowskiSesjaPrzyjaciolkaPage";
import { RAFAL_KOWALKOWSKI_SESJA_PRZYJACIOLKA_PATH } from "@/lib/rafalKowalkowskiGallery";
import { RAFAL_SERVICE_IMAGE } from "@/lib/rafalKowalkowskiMedia";

const OG_IMAGE = RAFAL_SERVICE_IMAGE.przyjaciolka.src;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    return { title: "404" };
  }
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_SESJA_PRZYJACIOLKA_PATH);
  return {
    title: { absolute: "Sesja fotograficzna z przyjaciółką — Rafał Kowalkowski | ODART" },
    description:
      "Sesja zdjęciowa z przyjaciółką — utrwalenie wspólnych chwil na pięknych zdjęciach. Luźna atmosfera, Kołobrzeg i okolice.",
    alternates: { canonical },
    openGraph: {
      title: "Sesja fotograficzna z przyjaciółką | ODART",
      description: "Sesja we dwoje — przyjaźń na zdjęciach. Rafał Kowalkowski, ACRUX.",
      url: canonical,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
      images: [
        {
          url: OG_IMAGE,
          width: RAFAL_SERVICE_IMAGE.przyjaciolka.w,
          height: RAFAL_SERVICE_IMAGE.przyjaciolka.h,
          alt: "Sesja fotograficzna z przyjaciółką",
        },
      ],
    },
  };
}

export default async function RafalKowalkowskiSesjaPrzyjaciolkaRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    notFound();
  }
  return <OdartRafalKowalkowskiSesjaPrzyjaciolkaPage />;
}
