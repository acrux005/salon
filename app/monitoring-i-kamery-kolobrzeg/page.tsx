import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartMonitoringKameryKolobrzegPage } from "@/components/odart/OdartMonitoringKameryKolobrzegPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/monitoring-i-kamery-kolobrzeg/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "Monitoring i kamery Kołobrzeg – Profesjonalny montaż i konfiguracja",
    description:
      "Monitoring wizyjny w Kołobrzegu: dobór kamer, montaż, Hikvision i Dahua, zdalny podgląd na telefonie, serwis. Zapytaj o wycenę.",
    keywords: [
      "monitoring Kołobrzeg",
      "kamery Kołobrzeg",
      "montaż kamer",
      "Hikvision Dahua",
      "monitoring dom firmy",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Monitoring i kamery Kołobrzeg | ODART",
      description: "Profesjonalny montaż i konfiguracja systemów CCTV w Kołobrzegu i okolicach.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
    },
  };
}

export default async function MonitoringKameryKolobrzegPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartMonitoringKameryKolobrzegPage />;
}
