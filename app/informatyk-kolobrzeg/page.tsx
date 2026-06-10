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
    title: "Usługi informatyczne Kołobrzeg",
    description:
      "Projektowanie sieci, konfiguracja routerów i firewalli, ERP Comarch Optima i Enova, backup w chmurze AWS/Azure/GCP, audyt IT. Kołobrzeg.",
    keywords: [
      "informatyk Kołobrzeg",
      "usługi IT Kołobrzeg",
      "sieci komputerowe",
      "Comarch Optima",
      "backup chmura",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Usługi informatyczne Kołobrzeg | ODART",
      description:
        "Wsparcie IT dla firm: sieci, bezpieczeństwo, ERP, kopie zapasowe i audyt infrastruktury.",
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
