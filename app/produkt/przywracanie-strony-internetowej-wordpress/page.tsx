import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartProduktPrzywracanieStronyWordpressPage } from "@/components/odart/OdartProduktPrzywracanieStronyWordpressPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/produkt/przywracanie-strony-internetowej-wordpress/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "Przywracanie strony internetowej WordPress – Ostry Dyżur Artystyczny | ODART",
    description:
      "Czyszczenie WordPress po malware i atakach: diagnoza, usunięcie złośliwego kodu, odbudowa, aktualizacje, monitoring, raport. Kołobrzeg.",
    keywords: [
      "przywracanie WordPress",
      "czyszczenie strony po malware",
      "WordPress zainfekowany",
      "usuwanie malware WordPress",
      "bezpieczeństwo WordPress Kołobrzeg",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Przywracanie strony WordPress po infekcji | ODART",
      description:
        "Diagnoza, usunięcie malware, odbudowa z kopii, zabezpieczenia i raport — przywróć działanie witryny.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "article",
      siteName: "ODART",
    },
  };
}

export default async function ProduktPrzywracanieStronyWordpressPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartProduktPrzywracanieStronyWordpressPage />;
}
