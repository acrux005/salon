import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { isRafalKowalkowskiContentHost } from "@/lib/odartSite";
import { OdartRafalKowalkowskiMeskaSesjaPage } from "@/components/odart/OdartRafalKowalkowskiMeskaSesjaPage";
import { RAFAL_KOWALKOWSKI_MESKA_SESJA_PATH } from "@/lib/rafalKowalkowskiGallery";
import { RAFAL_SERVICE_IMAGE } from "@/lib/rafalKowalkowskiMedia";

const OG_IMAGE = RAFAL_SERVICE_IMAGE.meskaSesja.src;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    return { title: "404" };
  }
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_MESKA_SESJA_PATH);
  return {
    title: { absolute: "Męska sesja portretowa — Rafał Kowalkowski | ODART" },
    description:
      "Męska sesja portretowa — studio lub plener, zdjęcia które przykuwają uwagę. Rafał Kowalkowski, Kołobrzeg.",
    alternates: { canonical },
    openGraph: {
      title: "Męska sesja portretowa | ODART",
      description: "Portret męski w studiu lub plenerze — profesjonalna sesja zdjęciowa.",
      url: canonical,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
      images: [
        {
          url: OG_IMAGE,
          width: RAFAL_SERVICE_IMAGE.meskaSesja.w,
          height: RAFAL_SERVICE_IMAGE.meskaSesja.h,
          alt: "Męska sesja portretowa",
        },
      ],
    },
  };
}

export default async function RafalKowalkowskiMeskaSesjaRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    notFound();
  }
  return <OdartRafalKowalkowskiMeskaSesjaPage />;
}
