import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isRafalKowalkowskiContentHost } from "@/lib/odartSite";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { OdartRafalKowalkowskiNaukaGitaryPage } from "@/components/odart/OdartRafalKowalkowskiNaukaGitaryPage";
import { RAFAL_KOWALKOWSKI_NAUKA_GITARY_PATH } from "@/lib/rafalKowalkowskiGallery";
import { rafalMediaUrl } from "@/lib/rafalKowalkowskiMedia";

const OG_IMAGE = rafalMediaUrl(
  "https://rafalkowalkowski.pl/wp-content/uploads/2023/12/odart._A_guitarist_is_making_chords_by_looking_at_his_guitar__c43550c8-dc58-48f3-8ae8-20d37cc6374e_1.jpg",
);

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    return { title: "404" };
  }
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_NAUKA_GITARY_PATH);
  return {
    title: { absolute: "Nauka gry na gitarze Kołobrzeg — lekcje gitary | Rafał Kowalkowski" },
    description:
      "Lekcje gitary w Kołobrzegu — gitara akustyczna i elektryczna, dla dzieci i dorosłych, także online. Indywidualna nauka, akordy, rytm, akompaniament i nagrania — Rafał Kowalkowski, ACRUX.",
    keywords: [
      "nauka gry na gitarze Kołobrzeg",
      "lekcje gitary Kołobrzeg",
      "gitara Kołobrzeg",
      "nauka gitary dla dzieci Kołobrzeg",
      "lekcje gitary online",
    ],
    alternates: { canonical },
    openGraph: {
      title: "Nauka gry na gitarze Kołobrzeg | Rafał Kowalkowski",
      description:
        "Indywidualne lekcje gitary akustycznej i elektrycznej w Kołobrzegu — dla początkujących i średnio zaawansowanych, także online.",
      url: canonical,
      locale: "pl_PL",
      type: "article",
      siteName: "Rafał Kowalkowski",
      images: [{ url: OG_IMAGE, width: 400, height: 400, alt: "Nauka gry na gitarze — Kołobrzeg" }],
    },
  };
}

export default async function RafalKowalkowskiNaukaGitaryKolobrzegRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    notFound();
  }
  return <OdartRafalKowalkowskiNaukaGitaryPage />;
}
