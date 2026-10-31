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
    title: { absolute: "Rafał Kowalkowski — lekcje gitary, wokal i fotografia | Kołobrzeg" },
    description:
      "Nauka gry na gitarze, zajęcia wokalne i fotografia w Kołobrzegu. Lekcje indywidualne (także online), nagranie wokalu i sesje portretowe — Rafał Kowalkowski.",
    keywords: [
      "Rafał Kowalkowski",
      "nauka gry na gitarze Kołobrzeg",
      "lekcje gitary Kołobrzeg",
      "zajęcia wokalne Kołobrzeg",
      "nauka śpiewu Kołobrzeg",
      "fotograf Kołobrzeg",
      "sesja zdjęciowa Kołobrzeg",
    ],
    alternates: { canonical },
    openGraph: {
      title: "Rafał Kowalkowski — lekcje gitary, wokal i fotografia",
      description:
        "Kołobrzeg: indywidualne lekcje gitary i wokalu, nagrania oraz sesje fotograficzne.",
      url: canonical,
      locale: "pl_PL",
      type: "profile",
      siteName: "Rafał Kowalkowski",
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
