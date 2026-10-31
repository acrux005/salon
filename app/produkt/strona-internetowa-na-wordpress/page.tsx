import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartStronyInternetoweDemoPage } from "@/components/odart/OdartStronyInternetoweDemoPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
/** Preferowany URL w indeksie — ta sama treść co /produkt/strona-internetowa-na-wordpress/ */
const CANONICAL_PREFERRED = `${ODART_SITE}/strony-internetowe/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: {
      absolute: "Strony internetowe Kołobrzeg od 1200 zł | ODART",
    },
    description:
      "Strony dla firm z Kołobrzegu i okolic. Wizytówka od 1200 zł, strona firmowa od 2500 zł. Rafał Kowalkowski, od 2008. Tel. 695 432 415.",
    keywords: [
      "strona WordPress",
      "budowa strony WWW",
      "strony internetowe Kołobrzeg",
      "ODART",
    ],
    alternates: { canonical: CANONICAL_PREFERRED },
    openGraph: {
      title: "Strony internetowe Kołobrzeg od 1200 zł | ODART",
      description:
        "Strony dla firm z Kołobrzegu i okolic. Wizytówka od 1200 zł, strona firmowa od 2500 zł. Rafał Kowalkowski, od 2008. Tel. 695 432 415.",
      url: CANONICAL_PREFERRED,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
    },
  };
}

export default async function ProduktStronaWordpressPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartStronyInternetoweDemoPage jsonLdCanonicalPathname="/strony-internetowe/" />;
}
