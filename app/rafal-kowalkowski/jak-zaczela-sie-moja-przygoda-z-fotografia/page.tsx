import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { isRafalKowalkowskiContentHost } from "@/lib/odartSite";
import { OdartRafalKowalkowskiPrzygodaFotografiaPage } from "@/components/odart/OdartRafalKowalkowskiPrzygodaFotografiaPage";
import { RAFAL_KOWALKOWSKI_PRZYGODA_FOTO_PATH } from "@/lib/rafalKowalkowskiGallery";

const OG_IMAGE =
  "https://rafalkowalkowski.pl/wp-content/uploads/2023/02/odart_canon_powershot_a60_e85a22fa-e076-4bc4-9462-8b26f44fe62e.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    return { title: "404" };
  }
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_PRZYGODA_FOTO_PATH);
  return {
    title: { absolute: "Jak zaczęła się moja przygoda z fotografią? — Rafał Kowalkowski | ODART" },
    description:
      "Od Zenitu i statków po Canon Powershot, Singapur i Fotoferię — historia fotograficznej pasji Rafała Kowalkowskiego.",
    alternates: { canonical },
    openGraph: {
      title: "Jak zaczęła się moja przygoda z fotografią? | ODART",
      description: "Zenit, Powershot, rejs do Osaki i powstanie portalu Fotoferia w 2008 roku.",
      url: canonical,
      locale: "pl_PL",
      type: "article",
      publishedTime: "2023-02-16T12:00:00+01:00",
      siteName: "ODART",
      images: [{ url: OG_IMAGE, width: 256, height: 256, alt: "Wczesne zdjęcia Canon Powershot" }],
    },
  };
}

export default async function RafalKowalkowskiPrzygodaFotografiaRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    notFound();
  }
  return <OdartRafalKowalkowskiPrzygodaFotografiaPage />;
}
