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

function productTitle(offer: RafalProductOffer): string {
  if (offer.slug === "wokal") {
    return "Nagranie wokalu Kołobrzeg — śpiew z podkładem | Rafał Kowalkowski";
  }
  if (offer.slug === "podklad" || offer.title.toLowerCase().includes("podkładem")) {
    return "Nagranie piosenki z podkładem — Kołobrzeg | Rafał Kowalkowski";
  }
  return `${offer.title} — Rafał Kowalkowski`;
}

export async function rafalProductMetadata(offer: RafalProductOffer): Promise<Metadata> {
  const canonical = await canonicalForRafalSection(internalPathFromOdartHref(offer.odartHref));
  const title = productTitle(offer);
  return {
    title: { absolute: title },
    description: offer.jsonLdDescription,
    alternates: { canonical },
    openGraph: {
      title,
      description: offer.jsonLdDescription,
      url: canonical,
      locale: "pl_PL",
      type: "website",
      siteName: "Rafał Kowalkowski",
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
