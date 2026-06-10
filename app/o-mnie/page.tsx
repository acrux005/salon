import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartAboutPage } from "@/components/odart/OdartAboutPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/o-mnie/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "O mnie | Aplikacje webowe i strony WWW — ODART Kołobrzeg",
    description:
      "Rafał Kowalkowski — product manager, web developer, WordPress, Next.js, UX/UI. ODART, Kołobrzeg. Ponad 10 lat doświadczenia: m.in. fotoferia, projekty dla klientów i home.pl.",
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "O mnie | ODART — Ostry Dyżur Artystyczny",
      description: "Aplikacje webowe, strony WWW, WordPress, Next.js — produkty cyfrowe. Kołobrzeg.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
    },
  };
}

export default async function OMniePage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartAboutPage />;
}
