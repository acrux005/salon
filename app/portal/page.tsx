import type { Metadata } from "next";
import { PortalPageClient } from "@/components/portal/PortalPageClient";
import { getAllClinicRecordsAsync } from "@/lib/skinmatch/clinics";
import { PORTAL_SITE_URL } from "@/content/portalSeo";

export const metadata: Metadata = {
  title: "Dobierz zabieg lub gabinet kosmetyczny w Polsce",
  description:
    "Dobierz idealny zabieg lub gabinet kosmetyczny w Polsce — w kilka minut. Analiza skóry, katalog usług, lista gabinetów, artykuły eksperckie i rezerwacja online.",
  keywords: [
    "Zabiegi Odart",
    "gabinety kosmetyczne Polska",
    "zabiegi kosmetyczne Polska",
    "analiza skóry online",
    "dobór zabiegów",
    "rezerwacja kosmetyczna",
  ],
  alternates: { canonical: `${PORTAL_SITE_URL}/portal` },
  openGraph: {
    title: "Zabiegi Odart – zabiegi i gabinety kosmetyczne w Polsce",
    description:
      "Portal jakościowy: dopasowanie problemu skóry lub usługi do sprawdzonych gabinetów w wybranym mieście — bez przypadkowego katalogu.",
    url: `${PORTAL_SITE_URL}/portal`,
    siteName: "Zabiegi Odart",
    locale: "pl_PL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zabiegi Odart — Polska",
    description: "Dobierz zabieg lub gabinet kosmetyczny w Polsce — szybko i bez zgadywania.",
  },
};

export default async function PortalPage() {
  const featuredClinics = await getAllClinicRecordsAsync();
  return <PortalPageClient featuredClinics={featuredClinics} />;
}
