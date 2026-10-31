import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartUslugiPage } from "@/components/odart/OdartUslugiPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/uslugi/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "Usługi | Strony internetowe, WordPress, SEO — ODART Kołobrzeg",
    description:
      "Tworzenie stron WWW, domeny i poczta na zaamow.pl, migracje WordPress, SEO, social media i opieka IT. ODART — Kołobrzeg i online.",
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Usługi internetowe | ODART",
      description: "WordPress, migracje, bezpieczeństwo, SEO, obsługa social media.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
    },
  };
}

export default async function UslugiPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartUslugiPage />;
}
