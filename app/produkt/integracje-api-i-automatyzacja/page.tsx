import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartProduktIntegracjeApiIAutomatyzacjaPage } from "@/components/odart/OdartProduktIntegracjeApiIAutomatyzacjaPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/produkt/integracje-api-i-automatyzacja/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "Integracje API i automatyzacja – łączenie systemów | ODART",
    description:
      "REST, webhooki, płatności, magazyn, CRM: integracje API i automatyzacja przepływu danych między systemami. Kołobrzeg.",
    keywords: [
      "integracja API",
      "webhook",
      "automatyzacja",
      "REST API",
      "łączenie systemów",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Integracje API i automatyzacja | ODART",
      description:
        "Projektowanie i wdrożenie integracji między sklepami, CRM, kurierami i systemami księgowymi.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "article",
      siteName: "ODART",
    },
  };
}

export default async function ProduktIntegracjeApiIAutomatyzacjaPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartProduktIntegracjeApiIAutomatyzacjaPage />;
}
