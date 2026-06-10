import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartPortfolioPage } from "@/components/odart/OdartPortfolioPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/portfolio/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "Portfolio | ODART — realizacje i oś czasu | Kołobrzeg",
    description:
      "Portfolio ODART: aplikacje webowe, strony WWW, UI/UX, wideo, branding. Realizacje w jednym miejscu — Next.js.",
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Portfolio | ODART",
      description: "Wybrane realizacje — oś czasu projektów: od produktów webowych po design i produkcję.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
    },
  };
}

export default async function PortfolioPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartPortfolioPage />;
}
