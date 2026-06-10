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
    title: { absolute: "Usługi — Rafał Kowalkowski | ODART" },
    description: "Fotografia, nagrania, teledyski, strony WWW i informatyka — katalog usług Rafała Kowalkowskiego.",
    alternates: { canonical },
    openGraph: {
      title: "Usługi Rafała Kowalkowskiego | ODART",
      url: canonical,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
    },
  };
}

export default async function RafalKowalkowskiUslugiRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) notFound();
  return <OdartRafalKowalkowskiUslugiPage />;
}
