import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { isRafalKowalkowskiContentHost, ODART_SITE_URL } from "@/lib/odartSite";
import { OdartRafalKowalkowskiZlotyPodzialFotografiaPage } from "@/components/odart/OdartRafalKowalkowskiZlotyPodzialFotografiaPage";
import { RAFAL_KOWALKOWSKI_ZLOTY_PODZIAL_FOTO_PATH } from "@/lib/rafalKowalkowskiGallery";

const SITE = ODART_SITE_URL.replace(/\/$/, "");
const OG_IMAGE =
  "https://rafalkowalkowski.pl/wp-content/uploads/2023/03/odart_show_golden_proportion_in_composition_photography_art_262bbd9d-7f02-45cf-b7a9-dab25263264e.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    return { title: "404" };
  }
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_ZLOTY_PODZIAL_FOTO_PATH);
  return {
    title: { absolute: "Złota proporcja w fotografii — Rafał Kowalkowski | ODART" },
    description:
      "Złota liczba Φ, ciąg Fibonacciego, złoty prostokąt i spirala w kompozycji — od Euklidesa po zastosowania w naturze i fotografii.",
    alternates: { canonical },
    openGraph: {
      title: "Złota proporcja w fotografii | ODART",
      description: "Fibonacci, złoty prostokąt, spirala i przykłady w przyrodzie.",
      url: canonical,
      locale: "pl_PL",
      type: "article",
      publishedTime: "2023-03-07T12:00:00+01:00",
      siteName: "ODART",
      images: [{ url: OG_IMAGE, width: 800, height: 462, alt: "Złota proporcja w kompozycji fotograficznej" }],
    },
  };
}

export default async function RafalKowalkowskiZlotyPodzialFotografiaRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    notFound();
  }
  return <OdartRafalKowalkowskiZlotyPodzialFotografiaPage />;
}
