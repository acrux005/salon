import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { isRafalKowalkowskiContentHost } from "@/lib/odartSite";
import { OdartRafalKowalkowskiTrojpodzialFotografiaPage } from "@/components/odart/OdartRafalKowalkowskiTrojpodzialFotografiaPage";
import { RAFAL_KOWALKOWSKI_TROJPODZIAL_FOTO_PATH } from "@/lib/rafalKowalkowskiGallery";

const OG_IMAGE = "https://rafalkowalkowski.pl/wp-content/uploads/2023/03/20230329095155.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    return { title: "404" };
  }
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_TROJPODZIAL_FOTO_PATH);
  return {
    title: { absolute: "Kompozycja w fotografii – Trójpodział — Rafał Kowalkowski | ODART" },
    description:
      "Reguła trójpodziału w fotografii — siatka kompozycji, mocne punkty kadru i przykłady zdjęć z wykadrowaniem.",
    alternates: { canonical },
    openGraph: {
      title: "Kompozycja w fotografii – Trójpodział | ODART",
      description: "Jak wykorzystać trójpodział w kompozycji fotografii — teoria i przykłady kadrów.",
      url: canonical,
      locale: "pl_PL",
      type: "article",
      publishedTime: "2023-03-07T12:00:00+01:00",
      siteName: "ODART",
      images: [{ url: OG_IMAGE, width: 609, height: 800, alt: "Siatka trójpodziału w fotografii" }],
    },
  };
}

export default async function RafalKowalkowskiTrojpodzialRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    notFound();
  }
  return <OdartRafalKowalkowskiTrojpodzialFotografiaPage />;
}
