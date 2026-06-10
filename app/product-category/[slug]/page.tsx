import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isRafalKowalkowskiPlHost } from "@/lib/odartSite";
import {
  RAFAL_WC_CATEGORY_TO_FILTER,
  rafalPublicPathCanonicalUrl,
} from "@/lib/rafalKowalkowskiLegacyRoutes";
import { OdartRafalKowalkowskiUslugiPage } from "@/components/odart/OdartRafalKowalkowskiUslugiPage";

const CATEGORY_LABELS: Record<string, string> = {
  informatyka: "Informatyka",
  foto: "Sesje fotograficzne",
  media: "Media społecznościowe",
  nagrania: "Nagrania",
  strony: "Strony internetowe",
};

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  const filter = RAFAL_WC_CATEGORY_TO_FILTER[params.slug];
  if (!isRafalKowalkowskiPlHost(host) || !filter) {
    return { title: "404" };
  }
  const hdr = await headers();
  const proto = hdr.get("x-forwarded-proto") ?? "https";
  const canonical = rafalPublicPathCanonicalUrl(`/product-category/${params.slug}`, host, proto);
  const label = CATEGORY_LABELS[filter] ?? params.slug;
  return {
    title: { absolute: `${label} — usługi | Rafał Kowalkowski | ODART` },
    description: `Katalog usług: ${label} — Rafał Kowalkowski, Kołobrzeg.`,
    alternates: { canonical },
    openGraph: { title: `${label} | Rafał Kowalkowski`, url: canonical, locale: "pl_PL", type: "website" },
  };
}

export default async function RafalProductCategoryPage({ params }: Props) {
  const host = (await headers()).get("host") ?? "";
  const filter = RAFAL_WC_CATEGORY_TO_FILTER[params.slug];
  if (!isRafalKowalkowskiPlHost(host) || !filter) {
    notFound();
  }
  return <OdartRafalKowalkowskiUslugiPage initialCategory={filter} />;
}
