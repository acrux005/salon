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
    title: "Usługi informatyczne w Koszalinie - Ostry Dyżur Artystyczny",
    description:
      "IT dla firm w Koszalinie: serwery, sieci LAN/WAN, ERP Comarch Optima i Enova, backup w chmurze, audyt. Kontakt: biuro@odart.pl.",
    keywords: [
      "informatyk Koszalin",
      "usługi IT Koszalin",
      "serwery sieci Koszalin",
      "Comarch Optima Koszalin",
      "backup chmura",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Usługi informatyczne Koszalin | ODART",
      description:
        "Profesjonalna obsługa IT dla firm i biur: infrastruktura, bezpieczeństwo, ERP i kopie zapasowe.",
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
