import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { isRafalKowalkowskiContentHost, ODART_SITE_URL } from "@/lib/odartSite";
import { OdartRafalKowalkowskiMuzykaPage } from "@/components/odart/OdartRafalKowalkowskiMuzykaPage";
import { RAFAL_KOWALKOWSKI_MUZYKA_PATH } from "@/lib/rafalKowalkowskiMuzyka";

const SITE = ODART_SITE_URL.replace(/\/$/, "");
const OG_IMAGE = "https://i.ytimg.com/vi/RJ2fJSN5QE0/sddefault.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    return { title: "404" };
  }
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_MUZYKA_PATH);
  return {
    title: { absolute: "Muzyka autorska — Rafał Kowalkowski | ODART" },
    description:
      "Muzyka autorska ACRUX: teledyski Pan Kot, Aż do śmierci, Od H, album Fotografia. Spotify, YouTube — Rafał Kowalkowski, Kołobrzeg.",
    alternates: { canonical },
    openGraph: {
      title: "Muzyka autorska | Rafał Kowalkowski | ODART",
      description: "Autorskie utwory, teledyski i album Fotografia.",
      url: canonical,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
      images: [{ url: OG_IMAGE, width: 1200, height: 800, alt: "Muzyka autorska — Rafał Kowalkowski" }],
    },
  };
}

export default async function RafalKowalkowskiMuzykaAutorskaRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    notFound();
  }
  return <OdartRafalKowalkowskiMuzykaPage />;
}
