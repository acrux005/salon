import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartInformatykKoszalinPage } from "@/components/odart/OdartInformatykKoszalinPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/informatyk-koszalin/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: {
      absolute: "Informatyk Koszalin — sieci, ERP, opieka IT | ODART",
    },
    description:
      "IT dla firm z Koszalina: sieci, Comarch Optima, backup i opieka. Rafał Kowalkowski, od 2008. Tel. 695 432 415.",
    keywords: [
      "informatyk Koszalin",
      "usługi informatyczne Koszalin",
      "usługi IT Koszalin",
      "opieka IT Koszalin",
      "Comarch Optima Koszalin",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Informatyk Koszalin — sieci, ERP, opieka IT | ODART",
      description:
        "IT dla firm z Koszalina: sieci, Comarch Optima, backup i opieka. Rafał Kowalkowski, od 2008. Tel. 695 432 415.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
    },
  };
}

export default async function InformatykKoszalinPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartInformatykKoszalinPage />;
}
