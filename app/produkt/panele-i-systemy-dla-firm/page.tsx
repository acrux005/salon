import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartProduktPaneleISystemyDlaFirmPage } from "@/components/odart/OdartProduktPaneleISystemyDlaFirmPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/produkt/panele-i-systemy-dla-firm/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "Panele i systemy dla firm – narzędzia wewnętrzne | ODART",
    description:
      "Panele administracyjne, systemy B2B, role, raporty, workflow — aplikacje webowe dla operacji firmy. Kołobrzeg.",
    keywords: [
      "panel administracyjny",
      "system B2B",
      "aplikacja wewnętrzna",
      "narzędzia dla firm",
      "Kołobrzeg",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Panele i systemy dla firm | ODART",
      description:
        "Wdrożenia paneli i systemów dla firm: uprawnienia, raporty, integracje z istniejącymi narzędziami.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "article",
      siteName: "ODART",
    },
  };
}

export default async function ProduktPaneleISystemyDlaFirmPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartProduktPaneleISystemyDlaFirmPage />;
}
