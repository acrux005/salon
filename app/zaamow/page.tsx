import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartZaamowPage } from "@/components/odart/OdartZaamowPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/zaamow/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "zaamow.pl — domeny, poczta firmowa, strony WWW i aplikacje",
    description:
      "Sklep ODART: rejestracja domen .pl, poczta firmowa, strony internetowe, Mini ERP, Hub, Harmonogram, gabinety i zamówienia jedzenia. Zamawiasz na zaamow.pl.",
    keywords: [
      "zaamow.pl",
      "domeny .pl",
      "poczta firmowa",
      "strony internetowe",
      "aplikacje ODART",
      "Mini ERP",
      "Hub sprzedażowy",
      "Harmonogram",
    ],
    alternates: {
      canonical: CANONICAL,
      languages: {
        pl: CANONICAL,
        "x-default": CANONICAL,
      },
    },
    openGraph: {
      title: "zaamow.pl — domeny, poczta, strony i aplikacje ODART",
      description:
        "Zamów domenę .pl, pocztę firmową, stronę WWW albo aplikację ODART. Sklep Rafała Kowalkowskiego — ODART, Kołobrzeg.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
    },
  };
}

export default async function ZaamowOfferRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartZaamowPage />;
}
