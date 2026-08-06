import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartProjectTablicaPage } from "@/components/odart/OdartProjectTablicaPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/project/tablica/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "Tablica — ogłoszenia w całej Polsce | realizacja ODART",
    description:
      "Case study: portal ogłoszeniowy Next.js — chat, escrow PayU, InPost/Orlen, porównywarka, AI i i18n PL/EN. Live: tablica.odart.pl.",
    keywords: [
      "tablica odart",
      "portal ogłoszeniowy",
      "marketplace Next.js",
      "aplikacja webowa Kołobrzeg",
      "escrow PayU",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Tablica — ogłoszenia | ODART",
      description:
        "Własny marketplace ODART: rzeczy, usługi i praca — z ochroną płatności i dostawą.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "article",
      siteName: "ODART",
    },
  };
}

export default async function ProjectTablicaPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartProjectTablicaPage />;
}
