import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartStronyInternetoweDemoPage } from "@/components/odart/OdartStronyInternetoweDemoPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/strony-internetowe/`;

/** Landing z demo (treść + UI) — kanoniczny URL marketingowy ODART. */
export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: {
      absolute: "Strony internetowe Kołobrzeg od 1200 zł | wycena w 24h | ODART",
    },
    description:
      "Szukasz stron internetowych w Kołobrzegu? Wizytówka od 1200 zł, strona firmowa od 2500 zł. Lokalnie od 2008 — Rafał Kowalkowski. Zadzwoń 695 432 415.",
    keywords: [
      "strony internetowe Kołobrzeg",
      "strony www Kołobrzeg",
      "tworzenie stron internetowych Kołobrzeg",
      "projektowanie stron Kołobrzeg",
      "projektowanie stron internetowych Kołobrzeg",
      "strona firmowa Kołobrzeg",
      "WordPress Kołobrzeg",
      "ODART",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Strony internetowe Kołobrzeg od 1200 zł | ODART",
      description:
        "Szukasz stron internetowych w Kołobrzegu? Wizytówka od 1200 zł, strona firmowa od 2500 zł. Lokalnie od 2008 — Rafał Kowalkowski. Zadzwoń 695 432 415.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
    },
  };
}

export default async function StronyInternetowePage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartStronyInternetoweDemoPage jsonLdCanonicalPathname="/strony-internetowe/" />;
}
