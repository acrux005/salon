import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { isRafalKowalkowskiContentHost, ODART_SITE_URL } from "@/lib/odartSite";
import { OdartRafalKowalkowskiZlotaProporcjaPrzykladyPage } from "@/components/odart/OdartRafalKowalkowskiZlotaProporcjaPrzykladyPage";
import { RAFAL_KOWALKOWSKI_ZLOTA_PROPORCJA_PRZYKLADY_PATH } from "@/lib/rafalKowalkowskiGallery";

const OG_IMAGE = "https://rafalkowalkowski.pl/wp-content/uploads/2023/04/20230420172526.png";

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    return { title: "404" };
  }
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_ZLOTA_PROPORCJA_PRZYKLADY_PATH);
  return {
    title: { absolute: "Złota proporcja – przykłady — Rafał Kowalkowski | ODART" },
    description:
      "Złota spirala i trójpodział w kompozycji — przykłady zastosowania w fotografii: linie wiodące, mocne punkty kadru.",
    alternates: { canonical },
    openGraph: {
      title: "Złota proporcja – przykłady | ODART",
      description: "Praktyczne przykłady złotej spirali i trójpodziału w fotografii.",
      url: canonical,
      locale: "pl_PL",
      type: "article",
      publishedTime: "2023-04-23T12:00:00+02:00",
      siteName: "ODART",
      images: [{ url: OG_IMAGE, width: 1200, height: 800, alt: "Złota proporcja — przykłady kompozycji" }],
    },
  };
}

export default async function RafalKowalkowskiZlotaProporcjaPrzykladyRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    notFound();
  }
  return <OdartRafalKowalkowskiZlotaProporcjaPrzykladyPage />;
}
