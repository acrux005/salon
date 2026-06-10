import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isRafalKowalkowskiContentHost } from "@/lib/odartSite";
import { RAFAL_KOWALKOWSKI_PROFILE_PATH } from "@/lib/rafalKowalkowskiGallery";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { RAFAL_KOWALKOWSKI_PORTRAIT_URL } from "@/lib/rafalKowalkowskiMedia";
import { OdartRafalKowalkowskiLanding } from "@/components/odart/OdartRafalKowalkowskiLanding";

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    return { title: "404" };
  }
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_PROFILE_PATH);
  return {
    title: { absolute: "Rafał Kowalkowski — fotografia, nagrania, strony | ODART" },
    description:
      "ACRUX: fotografia, nagrania, teledyski, strony WWW i usługi IT — Rafał Kowalkowski, ODART Kołobrzeg. Portfolio, social, kontakt.",
    alternates: { canonical },
    openGraph: {
      title: "Rafał Kowalkowski — ACRUX | ODART",
      description:
        "Fotografia, nagrania, strony internetowe i IT — jedna strona podsumowująca ofertę artystyczną i techniczną.",
      url: canonical,
      locale: "pl_PL",
      type: "profile",
      siteName: "ODART",
      images: [
        {
          url: RAFAL_KOWALKOWSKI_PORTRAIT_URL,
          width: 1200,
          height: 1200,
          alt: "Rafał Kowalkowski",
        },
      ],
    },
  };
}

export default async function RafalKowalkowskiPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    notFound();
  }
  return <OdartRafalKowalkowskiLanding />;
}
