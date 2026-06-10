import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isRafalKowalkowskiContentHost } from "@/lib/odartSite";
import { OdartRafalKowalkowskiProductOfferPage } from "@/components/odart/OdartRafalKowalkowskiProductOfferPage";
import { RAFAL_PRODUCT_OFFERS } from "@/lib/rafalKowalkowskiProductOffers";
import { rafalProductMetadata } from "@/lib/rafalKowalkowskiProductMetadata";

const offer = RAFAL_PRODUCT_OFFERS.wokal;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) return { title: "404" };
  return await rafalProductMetadata(offer);
}

export default async function RafalKowalkowskiNagranieWokaluRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isRafalKowalkowskiContentHost(host)) notFound();
  return <OdartRafalKowalkowskiProductOfferPage offer={offer} />;
}
