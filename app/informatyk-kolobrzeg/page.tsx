import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartInformatykKolobrzegPage } from "@/components/odart/OdartInformatykKolobrzegPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/informatyk-kolobrzeg/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: {
      absolute: "Informatyk Kołobrzeg — sieci, ERP, opieka IT | ODART",
    },
    description:
      "IT dla firm z Kołobrzegu: sieci, Comarch Optima, backup i opieka. Rafał Kowalkowski, od 2008. Tel. 695 432 415.",
    keywords: [
      "informatyk Kołobrzeg",
      "usługi informatyczne Kołobrzeg",
      "usługi IT Kołobrzeg",
      "opieka IT Kołobrzeg",
      "Comarch Optima Kołobrzeg",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Informatyk Kołobrzeg — sieci, ERP, opieka IT | ODART",
      description:
        "IT dla firm z Kołobrzegu: sieci, Comarch Optima, backup i opieka. Rafał Kowalkowski, od 2008. Tel. 695 432 415.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
    },
  };
}

export default async function InformatykKolobrzegPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartInformatykKolobrzegPage />;
}
