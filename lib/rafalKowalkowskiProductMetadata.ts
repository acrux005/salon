import type { Metadata } from "next";
import type { RafalProductOffer } from "@/lib/rafalKowalkowskiProductOffers";
import { canonicalForRafalSection } from "@/lib/rafalKowalkowskiCanonical";

function internalPathFromOdartHref(odartHref: string): string {
  try {
    const pathname = new URL(odartHref).pathname;
    return pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  } catch {
    return odartHref;
  }
}

export async function rafalProductMetadata(offer: RafalProductOffer): Promise<Metadata> {
  const canonical = await canonicalForRafalSection(internalPathFromOdartHref(offer.odartHref));
  return {
    title: { absolute: `${offer.title} — Rafał Kowalkowski | ODART` },
    description: offer.jsonLdDescription,
    alternates: { canonical },
    openGraph: {
      title: `${offer.title} | ODART`,
      description: offer.jsonLdDescription,
      url: canonical,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
      images: [
        {
          url: offer.hero.src,
          width: offer.hero.w,
          height: offer.hero.h,
          alt: offer.title,
        },
      ],
    },
  };
}
