import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartOpiekaItDlaFirmKolobrzegPage } from "@/components/odart/OdartOpiekaItDlaFirmKolobrzegPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/opieka-it-dla-firm-kolobrzeg/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "Opieka IT dla firm Kołobrzeg — zewnętrzny dział IT | ODART",
    description:
      "Zewnętrzny dział IT dla firm w Kołobrzegu: opieka nad systemami, siecią i bezpieczeństwem. Pakiety Basic, Standard, Professional — helpdesk i backup.",
    keywords: [
      "opieka IT Kołobrzeg",
      "abonament IT firma",
      "helpdesk Kołobrzeg",
      "outsourcing IT mała firma",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Opieka IT dla firm Kołobrzeg | ODART",
      description:
        "Ponad 10 lat opieki IT nad firmami. Przewidywalne pakiety wsparcia — mniej awarii, więcej spokoju.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "article",
      siteName: "ODART",
    },
  };
}

export default async function OpiekaItDlaFirmKolobrzegPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartOpiekaItDlaFirmKolobrzegPage />;
}
