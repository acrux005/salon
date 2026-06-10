import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartProjectStronaDlaDeweloperaPage } from "@/components/odart/OdartProjectStronaDlaDeweloperaPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/project/strona-dla-dewelopera/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "Strona dla dewelopera – strony WWW pod inwestycje | ODART",
    description:
      "Strony internetowe dla deweloperów: analiza, UX/UI, WordPress, testy, firewall i backup. Przykład demo inwestycji. Kołobrzeg.",
    keywords: [
      "strona dla dewelopera",
      "strona internetowa inwestycja",
      "WordPress deweloper",
      "strona WWW Kołobrzeg",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Strona dla dewelopera | ODART",
      description:
        "Profesjonalne strony pod sprzedaż lokali — planowanie, projekt, wdrożenie WordPress, bezpieczeństwo.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "article",
      siteName: "ODART",
    },
  };
}

export default async function ProjectStronaDlaDeweloperaPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartProjectStronaDlaDeweloperaPage />;
}
