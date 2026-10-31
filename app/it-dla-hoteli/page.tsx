import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartItDlaHoteliPage } from "@/components/odart/OdartItDlaHoteliPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/it-dla-hoteli/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: {
      absolute: "IT dla hoteli i pensjonatów Kołobrzeg — Wi-Fi, sieć, POS | ODART · 695 432 415",
    },
    description:
      "IT dla hoteli i pensjonatów w Kołobrzegu: Wi-Fi gości oddzielone od recepcji, sezonowe szczyty, monitoring, POS. Rafał Kowalkowski. Tel. 695 432 415, biuro@odart.pl.",
    keywords: [
      "IT hotel Kołobrzeg",
      "Wi-Fi hotel Kołobrzeg",
      "informatyk hotel pensjonat",
      "sieć hotelowa Kołobrzeg",
      "opieka IT hotel",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "IT dla hoteli i pensjonatów Kołobrzeg | ODART",
      description:
        "Wi-Fi gości vs sieć recepcji, sezon, monitoring i POS. Rafał Kowalkowski — tel. 695 432 415.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
    },
  };
}

export default async function ItDlaHoteliRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartItDlaHoteliPage />;
}
