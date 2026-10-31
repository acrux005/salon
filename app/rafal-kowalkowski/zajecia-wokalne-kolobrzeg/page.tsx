import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isRafalKowalkowskiContentHost, ODART_SITE_URL } from "@/lib/odartSite";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { OdartRafalKowalkowskiZajeciaWokalnePage } from "@/components/odart/OdartRafalKowalkowskiZajeciaWokalnePage";
import { RAFAL_KOWALKOWSKI_ZAJECIA_WOKALNE_PATH } from "@/lib/rafalKowalkowskiGallery";

const SITE = ODART_SITE_URL.replace(/\/$/, "");
const OG_IMAGE = `${SITE}/wp-content/uploads/rafalkowalkowski.jpg`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    return { title: "404" };
  }
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_ZAJECIA_WOKALNE_PATH);
  return {
    title: { absolute: "Zajęcia wokalne Kołobrzeg — nauka śpiewu | Rafał Kowalkowski" },
    description:
      "Nauka śpiewu w Kołobrzegu: zajęcia wokalne dla dzieci i dorosłych, także online. Ćwiczenia, kabina, nagranie wokalu i teledysk — Rafał Kowalkowski.",
    keywords: [
      "zajęcia wokalne Kołobrzeg",
      "nauka śpiewu Kołobrzeg",
      "lekcje śpiewu",
      "nagrywanie wokalu",
      "śpiew z podkładem",
    ],
    alternates: { canonical },
    openGraph: {
      title: "Zajęcia wokalne Kołobrzeg — nauka śpiewu | Rafał Kowalkowski",
      description: "Indywidualna nauka śpiewu, nagrania i praca z podkładem — Kołobrzeg i online.",
      url: canonical,
      locale: "pl_PL",
      type: "article",
      publishedTime: "2023-03-27T12:00:00+01:00",
      siteName: "Rafał Kowalkowski",
      images: [{ url: OG_IMAGE, width: 1200, height: 1200, alt: "Rafał Kowalkowski — zajęcia wokalne" }],
    },
  };
}

export default async function RafalKowalkowskiZajeciaWokalneKolobrzegRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    notFound();
  }
  return <OdartRafalKowalkowskiZajeciaWokalnePage />;
}
