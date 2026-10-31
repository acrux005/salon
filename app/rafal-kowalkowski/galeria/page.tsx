import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isRafalKowalkowskiContentHost, ODART_SITE_URL } from "@/lib/odartSite";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { OdartRafalKowalkowskiGalleryPage } from "@/components/odart/OdartRafalKowalkowskiGalleryPage";
import { RAFAL_KOWALKOWSKI_GALLERY, RAFAL_KOWALKOWSKI_GALLERY_PATH } from "@/lib/rafalKowalkowskiGallery";

const SITE = ODART_SITE_URL.replace(/\/$/, "");
const OG_IMAGE = RAFAL_KOWALKOWSKI_GALLERY[0]?.src ?? `${SITE}/wp-content/uploads/rafalkowalkowski.jpg`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    return { title: "404" };
  }
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_GALLERY_PATH);
  return {
    title: { absolute: "Galeria fotografii — Rafał Kowalkowski | Kołobrzeg" },
    description: "Galeria zdjęć: portrety, sesje plenerowe i studio — Rafał Kowalkowski, fotograf Kołobrzeg.",
    alternates: { canonical },
    openGraph: {
      title: "Galeria fotografii — Rafał Kowalkowski | Kołobrzeg",
      description: "Portrety, plener i studio — fotograf Kołobrzeg.",
      url: canonical,
      locale: "pl_PL",
      type: "website",
      siteName: "Rafał Kowalkowski",
      images: [{ url: OG_IMAGE, width: 1200, height: 800, alt: "Galeria Rafała Kowalkowskiego" }],
    },
  };
}

export default async function RafalKowalkowskiGalleryRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    notFound();
  }
  return <OdartRafalKowalkowskiGalleryPage />;
}
