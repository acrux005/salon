import type { Metadata } from "next";
import { headers } from "next/headers";
import { OdartRegulaminSerwisuPage } from "@/components/odart/OdartRegulaminSerwisuPage";
import { SalonRegulaminPage } from "@/components/SalonRegulaminPage";
import { isOdartMainHost, ODART_SITE_URL } from "@/lib/odartSite";

const SALON_SITE = "https://salon.odart.pl";
const ODART_CANONICAL = `${ODART_SITE_URL}/regulamin/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (isOdartMainHost(host)) {
    return {
      title: "Regulamin serwisu | ODART",
      description:
        "Regulamin korzystania z serwisu odart.pl. Administrator: ODART Rafał Kowalkowski, Kołobrzeg.",
      alternates: { canonical: ODART_CANONICAL },
      openGraph: {
        title: "Regulamin serwisu | ODART",
        description: "Zasady korzystania z witryny odart.pl.",
        url: ODART_CANONICAL,
        siteName: "ODART",
        locale: "pl_PL",
        type: "website",
      },
      robots: { index: true, follow: true },
    };
  }
  return {
    title: "Regulamin serwisu | Salon Odart",
    description:
      "Zasady korzystania z serwisu salon.odart.pl. Portal pośredniczy między klientami a gabinetami kosmetycznymi.",
    alternates: { canonical: `${SALON_SITE}/regulamin` },
    openGraph: {
      title: "Regulamin serwisu | Salon Odart",
      description: "Zasady korzystania z serwisu salon.odart.pl.",
      url: `${SALON_SITE}/regulamin`,
      type: "website",
      locale: "pl_PL",
    },
  };
}

export default async function RegulaminPage() {
  const host = (await headers()).get("host") ?? "";
  if (isOdartMainHost(host)) {
    return <OdartRegulaminSerwisuPage />;
  }
  return <SalonRegulaminPage />;
}
