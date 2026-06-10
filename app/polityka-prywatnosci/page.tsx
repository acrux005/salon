import type { Metadata } from "next";
import { headers } from "next/headers";
import { OdartPolitykaPrywatnosciPage } from "@/components/odart/OdartPolitykaPrywatnosciPage";
import { SalonPolitykaPrywatnosciPage } from "@/components/SalonPolitykaPrywatnosciPage";
import { isOdartMainHost, ODART_SITE_URL } from "@/lib/odartSite";

const SALON_SITE = "https://salon.odart.pl";
const ODART_CANONICAL = `${ODART_SITE_URL}/polityka-prywatnosci/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (isOdartMainHost(host)) {
    return {
      title: "Polityka prywatności | ODART — Ostry Dyżur Artystyczny",
      description:
        "Polityka prywatności serwisu www.odart.pl — administrator: ODART Rafał Kowalkowski (jednoosobowa działalność). RODO, cookies, prawa użytkownika. Wersja 1.1 (aktualizacja opisu Administratora 23.03.2026).",
      alternates: { canonical: ODART_CANONICAL },
      openGraph: {
        title: "Polityka prywatności | ODART",
        description: "Zasady przetwarzania danych osobowych w serwisie odart.pl.",
        url: ODART_CANONICAL,
        siteName: "ODART",
        locale: "pl_PL",
        type: "website",
      },
      robots: { index: true, follow: true },
    };
  }
  return {
    title: "Polityka prywatności | Salon Odart",
    description:
      "Zasady przetwarzania danych osobowych w serwisie salon.odart.pl. Administrator: ODART Rafał Kowalkowski, Kołobrzeg.",
    alternates: { canonical: `${SALON_SITE}/polityka-prywatnosci` },
    openGraph: {
      title: "Polityka prywatności | Salon Odart",
      description: "Zasady przetwarzania danych osobowych w serwisie salon.odart.pl.",
      url: `${SALON_SITE}/polityka-prywatnosci`,
      type: "website",
      locale: "pl_PL",
    },
  };
}

export default async function PolitykaPrywatnosciPage() {
  const host = (await headers()).get("host") ?? "";
  if (isOdartMainHost(host)) {
    return <OdartPolitykaPrywatnosciPage />;
  }
  return <SalonPolitykaPrywatnosciPage />;
}
