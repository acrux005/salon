import type { Metadata } from "next";
import { headers } from "next/headers";
import { OdartKontaktPage } from "@/components/odart/OdartKontaktPage";
import { SalonKontaktPage } from "@/components/SalonKontaktPage";
import { isOdartMainHost, isRafalKowalkowskiPlHost, ODART_SITE_URL } from "@/lib/odartSite";
import { rafalPageCanonicalUrl } from "@/lib/rafalKowalkowskiLegacyRoutes";

const SALON_SITE = "https://salon.odart.pl";
const ODART_CANONICAL = `${ODART_SITE_URL}/kontakt/`;

export async function generateMetadata(): Promise<Metadata> {
  const hdr = await headers();
  const host = hdr.get("host") ?? "";
  if (isRafalKowalkowskiPlHost(host)) {
    const proto = hdr.get("x-forwarded-proto") ?? "https";
    const canonical = rafalPageCanonicalUrl("/kontakt", host, proto);
    return {
      title: { absolute: "Kontakt — Rafał Kowalkowski | ODART" },
      description:
        "Kontakt: biuro@odart.pl, tel. +48 695 432 415, Kołobrzeg. Zapytania o fotografię, nagrania, strony WWW i usługi IT.",
      alternates: { canonical },
      openGraph: {
        title: "Kontakt | Rafał Kowalkowski",
        description: "Napisz — wycena, konsultacja, realizacja.",
        url: canonical,
        siteName: "Rafał Kowalkowski",
        locale: "pl_PL",
        type: "website",
      },
    };
  }
  if (isOdartMainHost(host)) {
    return {
      title: "Kontakt | ODART — Ostry Dyżur Artystyczny",
      description:
        "Napisz do nas: biuro@odart.pl, tel. +48 695 432 415, Kołobrzeg. Formularz — strona, sklep, wycena.",
      alternates: { canonical: ODART_CANONICAL },
      openGraph: {
        title: "Kontakt | ODART",
        description: "Projektowanie stron WWW — kontakt, wycena, konsultacja.",
        url: ODART_CANONICAL,
        siteName: "ODART",
        locale: "pl_PL",
        type: "website",
      },
      twitter: {
        card: "summary",
        title: "Kontakt | ODART",
        description: "biuro@odart.pl · Kołobrzeg",
      },
    };
  }
  return {
    title: "Kontakt | Salon Odart — gabinet kosmetyczny",
    description:
      "Skontaktuj się z nami: biuro@odart.pl, tel. 695 432 415. Operator serwisu: ODART Rafał Kowalkowski, ul. Makowskiego 3, 78-100 Kołobrzeg.",
    alternates: { canonical: `${SALON_SITE}/kontakt` },
    openGraph: {
      title: "Kontakt | Salon Odart",
      description: "Skontaktuj się z nami — e-mail, telefon, formularz zapytań.",
      url: `${SALON_SITE}/kontakt`,
      type: "website",
      locale: "pl_PL",
    },
  };
}

export default async function KontaktPage() {
  const host = (await headers()).get("host") ?? "";
  if (isRafalKowalkowskiPlHost(host) || isOdartMainHost(host)) {
    return <OdartKontaktPage />;
  }
  return <SalonKontaktPage />;
}
