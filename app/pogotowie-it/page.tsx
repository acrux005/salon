import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartPogotowieItPage } from "@/components/odart/OdartPogotowieItPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/pogotowie-it/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: {
      absolute: "Pogotowie IT Kołobrzeg — awaria, praca stoi? Dzwoń 695 432 415 | ODART",
    },
    description:
      "Awaria IT w firmie lub hotelu w Kołobrzegu? Zgłoś online: Wi-Fi, komputer, kasa/POS — albo dzwoń 695 432 415. Rafał Kowalkowski, ODART.",
    keywords: [
      "pogotowie IT Kołobrzeg",
      "awaria IT",
      "informatyk awaria",
      "pomoc IT pilna",
      "serwis komputerowy awaria Kołobrzeg",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Pogotowie IT — praca stoi? Dzwoń 695 432 415 | ODART",
      description:
        "Awaria sieci, Wi-Fi lub stanowiska? Rafał Kowalkowski — tel. 695 432 415, biuro@odart.pl. Kołobrzeg i okolice.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
    },
  };
}

export default async function PogotowieItRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartPogotowieItPage />;
}
