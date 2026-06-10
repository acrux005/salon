import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";
import { isRafalKowalkowskiContentHost, ODART_SITE_URL } from "@/lib/odartSite";
import { OdartRafalKowalkowskiUslugiInformatycznePage } from "@/components/odart/OdartRafalKowalkowskiUslugiInformatycznePage";
import { RAFAL_KOWALKOWSKI_USLUGI_INFORMATYCZNE_PATH } from "@/lib/rafalKowalkowskiGallery";

const SITE = ODART_SITE_URL.replace(/\/$/, "");
const OG_IMAGE = `${SITE}/wp-content/uploads/rafalkowalkowski.jpg`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    return { title: "404" };
  }
  const canonical = await canonicalForRafalSection(RAFAL_KOWALKOWSKI_USLUGI_INFORMATYCZNE_PATH);
  return {
    title: { absolute: "Usługi informatyczne Kołobrzeg — Rafał Kowalkowski | ODART" },
    description:
      "Sieci LAN, routery i switche, bezpieczeństwo, integracja Comarch Optima i Enova, backup w chmurze (AWS, Azure, GCP), audyt sieci — Rafał Kowalkowski, ODART.",
    alternates: { canonical },
    openGraph: {
      title: "Usługi informatyczne Kołobrzeg | ODART",
      description: "Kompleksowe wsparcie IT: infrastruktura, ERP, kopie zapasowe, audyt.",
      url: canonical,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
      images: [{ url: OG_IMAGE, width: 1200, height: 1200, alt: "Rafał Kowalkowski — usługi IT" }],
    },
  };
}

export default async function RafalKowalkowskiUslugiInformatycznePage() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) {
    notFound();
  }
  return <OdartRafalKowalkowskiUslugiInformatycznePage />;
}
