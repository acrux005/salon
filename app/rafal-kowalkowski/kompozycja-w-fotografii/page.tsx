import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { isRafalKowalkowskiContentHost } from "@/lib/odartSite";
import { OdartRafalKowalkowskiKompozycjaFotografiaPage } from "@/components/odart/OdartRafalKowalkowskiKompozycjaFotografiaPage";
import { RAFAL_KOWALKOWSKI_KOMPOZYCJA_FOTO_PATH } from "@/lib/rafalKowalkowskiGallery";

const OG_IMAGE = "https://rafalkowalkowski.pl/wp-content/uploads/2023/03/041-3x.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    return { title: "404" };
  }
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_KOMPOZYCJA_FOTO_PATH);
  return {
    title: { absolute: "Kompozycja w fotografii — Rafał Kowalkowski | ODART" },
    description:
      "Główne zasady kompozycji w fotografii — wprowadzenie do trójpodziału, złotej proporcji, trójkątów i linii wiodących.",
    alternates: { canonical },
    openGraph: {
      title: "Kompozycja w fotografii | ODART",
      description: "Kompozycja w fotografii – główne zasady i reguły kompozycyjne.",
      url: canonical,
      locale: "pl_PL",
      type: "article",
      publishedTime: "2023-03-05T12:00:00+01:00",
      siteName: "ODART",
      images: [{ url: OG_IMAGE, width: 800, height: 747, alt: "Kompozycja w fotografii" }],
    },
  };
}

export default async function RafalKowalkowskiKompozycjaFotografiaRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    notFound();
  }
  return <OdartRafalKowalkowskiKompozycjaFotografiaPage />;
}
