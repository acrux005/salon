import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartProduktMigracjaStronyPage } from "@/components/odart/OdartProduktMigracjaStronyPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/produkt/migracja-strony-internetowej-na-inny-serwer/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "Migracja strony internetowej na inny serwer – Ostry Dyżur Artystyczny | ODART",
    description:
      "Migracja WordPress na nowy hosting: pliki, baza danych, ustawienia, testy, optymalizacja i wsparcie. Bezpiecznie i bez przestojów. Kołobrzeg.",
    keywords: [
      "migracja WordPress",
      "przeniesienie strony na inny serwer",
      "zmiana hostingu WordPress",
      "migracja strony Kołobrzeg",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Migracja strony WordPress na inny serwer | ODART",
      description:
        "Płynna migracja WordPress — pliki, baza, optymalizacja po przeniesieniu i wsparcie techniczne.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "article",
      siteName: "ODART",
    },
  };
}

export default async function ProduktMigracjaStronyPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartProduktMigracjaStronyPage />;
}
