import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isRafalKowalkowskiContentHost } from "@/lib/odartSite";
import { RAFAL_KOWALKOWSKI_DEMO_PATH } from "@/lib/rafalKowalkowskiGallery";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { OdartRafalKowalkowskiArinoLanding } from "@/components/odart/OdartRafalKowalkowskiArinoLanding";

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    return { title: "404" };
  }
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_DEMO_PATH);
  return {
    title: { absolute: "Demo układu Arino — Rafał Kowalkowski" },
    description: "Podgląd modułów strony w stylu szablonu Arino (fotografia, nagrania, strony WWW).",
    alternates: { canonical },
    robots: { index: false, follow: false },
  };
}

export default async function RafalKowalkowskiDemoPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    notFound();
  }
  return <OdartRafalKowalkowskiArinoLanding />;
}
