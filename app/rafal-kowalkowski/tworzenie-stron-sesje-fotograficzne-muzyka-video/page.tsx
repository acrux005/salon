import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { isRafalKowalkowskiContentHost } from "@/lib/odartSite";
import { OdartRafalKowalkowskiOfertaPage } from "@/components/odart/OdartRafalKowalkowskiOfertaPage";
import { RAFAL_KOWALKOWSKI_OFERTA_PATH } from "@/lib/rafalKowalkowskiGallery";

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) return { title: "404" };
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_OFERTA_PATH);
  return {
    title: { absolute: "Strony, foto, muzyka, video — Rafał Kowalkowski | ODART" },
    description:
      "Tworzenie stron internetowych, sesje fotograficzne, studio nagrań i teledyski — Rafał Kowalkowski, Kołobrzeg.",
    alternates: { canonical },
    openGraph: {
      title: "Oferta — Rafał Kowalkowski | ODART",
      url: canonical,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
    },
  };
}

export default async function RafalKowalkowskiOfertaRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) notFound();
  return <OdartRafalKowalkowskiOfertaPage />;
}
