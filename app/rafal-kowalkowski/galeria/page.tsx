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
    title: { absolute: "Galeria — Rafał Kowalkowski | ODART" },
    description: "Galeria zdjęć Rafała Kowalkowskiego (ACRUX) — portrety, sesje, plener.",
    alternates: { canonical },
    openGraph: {
      title: "Galeria — Rafał Kowalkowski | ODART",
      description: "Wybrane realizacje fotograficzne.",
      url: canonical,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
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
