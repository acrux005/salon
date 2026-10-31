import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { isRafalKowalkowskiContentHost } from "@/lib/odartSite";
import { OdartRafalKowalkowskiUslugiPage } from "@/components/odart/OdartRafalKowalkowskiUslugiPage";
import { RAFAL_KOWALKOWSKI_USLUGI_PATH } from "@/lib/rafalKowalkowskiGallery";

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) return { title: "404" };
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_USLUGI_PATH);
  return {
    title: { absolute: "Usługi — gitara, wokal, fotografia | Rafał Kowalkowski" },
    description:
      "Lekcje gitary, zajęcia wokalne, nagranie wokalu i sesje fotograficzne w Kołobrzegu. Katalog usług Rafała Kowalkowskiego.",
    alternates: { canonical },
    openGraph: {
      title: "Usługi — gitara, wokal, fotografia | Rafał Kowalkowski",
      url: canonical,
      locale: "pl_PL",
      type: "website",
      siteName: "Rafał Kowalkowski",
    },
  };
}

export default async function RafalKowalkowskiUslugiRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) notFound();
  return <OdartRafalKowalkowskiUslugiPage />;
}
