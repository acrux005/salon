import type { MetadataRoute } from "next";
import {
  RAFAL_KOWALKOWSKI_PROFILE_PATH,
} from "@/lib/rafalKowalkowskiGallery";
import { RAFAL_KOWALKOWSKI_PORTRAIT_URL } from "@/lib/rafalKowalkowskiMedia";
import type { RafalProductOffer } from "@/lib/rafalKowalkowskiProductOffers";
import {
  internalPathToLegacyPublic,
  RAFAL_ROOT_PAGE_SLUGS,
  RAFAL_WC_PRODUCT_SLUGS,
  rafalPublicPathCanonicalUrl,
} from "@/lib/rafalKowalkowskiLegacyRoutes";
import { ODART_SITE_URL } from "@/lib/odartSite";

/** Kanoniczna domena treści Rafała (GSC / marka). */
export const RAFAL_CANONICAL_HOST = "rafalkowalkowski.pl";
export const RAFAL_CANONICAL_ORIGIN = `https://${RAFAL_CANONICAL_HOST}`;

const ODART_ORIGIN = ODART_SITE_URL.replace(/\/$/, "");

export const RAFAL_SOCIAL_SAME_AS = [
  "https://www.instagram.com/acrux_rk/",
  "https://www.youtube.com/channel/UCOp3fAgkkXzEOY3PgBk29jA",
  "https://www.facebook.com/acruxkg/",
  "https://www.tiktok.com/@acrux_rk",
  "https://artists.spotify.com/c/artist/6K6Oz5t1sDyELfpt3zKmSx/home",
] as const;

/** Kanoniczny URL publiczny z wewnętrznej ścieżki `/rafal-kowalkowski/…`. */
export function rafalCanonicalFromInternal(internalPath: string): string {
  const legacy = internalPathToLegacyPublic(internalPath);
  const publicPath = legacy ?? (internalPath === RAFAL_KOWALKOWSKI_PROFILE_PATH ? "/" : internalPath);
  return rafalPublicPathCanonicalUrl(publicPath, RAFAL_CANONICAL_HOST);
}

export function rafalInternalPathFromOdartHref(odartHref: string): string {
  try {
    const pathname = new URL(odartHref).pathname;
    return pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  } catch {
    return odartHref;
  }
}

export function buildRafalHomeJsonLd() {
  const pageUrl = rafalCanonicalFromInternal(RAFAL_KOWALKOWSKI_PROFILE_PATH);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Rafał Kowalkowski — fotografia, nagrania, strony | ODART",
        isPartOf: { "@id": `${RAFAL_CANONICAL_ORIGIN}/#website` },
        inLanguage: "pl-PL",
      },
      {
        "@type": "Person",
        "@id": `${RAFAL_CANONICAL_ORIGIN}/#person`,
        name: "Rafał Kowalkowski",
        url: RAFAL_CANONICAL_ORIGIN,
        image: RAFAL_KOWALKOWSKI_PORTRAIT_URL,
        jobTitle: "Fotograf, producent muzyczny, programista",
        worksFor: { "@type": "Organization", name: "ODART", url: ODART_ORIGIN },
        sameAs: [...RAFAL_SOCIAL_SAME_AS],
      },
      {
        "@type": "WebSite",
        "@id": `${RAFAL_CANONICAL_ORIGIN}/#website`,
        url: RAFAL_CANONICAL_ORIGIN,
        name: "Rafał Kowalkowski — ACRUX",
        publisher: { "@id": `${RAFAL_CANONICAL_ORIGIN}/#person` },
        inLanguage: "pl-PL",
      },
    ],
  };
}

const KOLOBRZEG_PLACE = {
  "@type": "City" as const,
  name: "Kołobrzeg",
  address: {
    "@type": "PostalAddress" as const,
    addressLocality: "Kołobrzeg",
    addressRegion: "zachodniopomorskie",
    addressCountry: "PL",
  },
};

/** JSON-LD dla lekcji gitary — Course + FAQ (SEO lokalne Kołobrzeg). */
export function buildRafalGuitarLessonsJsonLd(internalPath: string) {
  const pageUrl = rafalCanonicalFromInternal(internalPath);
  const faq = [
    {
      question: "Dla kogo są lekcje gitary w Kołobrzegu?",
      answer:
        "Prowadzę zajęcia indywidualne dla dzieci, młodzieży i dorosłych — od pierwszych akordów po grę z piosenkami i nagraniami w domowym studiu.",
    },
    {
      question: "Czy można uczyć się gitary online?",
      answer:
        "Tak — część lekcji odbywa się zdalnie (kamera + wspólny materiał). Spotkania na żywo organizuję w Kołobrzegu i okolicach.",
    },
    {
      question: "Gitara akustyczna czy elektryczna?",
      answer:
        "Pracuję na gitarze akustycznej i elektrycznej. Dobór instrumentu zależy od celu: akompaniament, rock, pop lub nagrania studyjne.",
    },
    {
      question: "Jak umówić pierwszą lekcję?",
      answer:
        "Napisz przez formularz kontaktowy na stronie lub zadzwoń — ustalimy poziom, repertuar i termin pierwszego spotkania.",
    },
  ] as const;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        name: "Nauka gry na gitarze Kołobrzeg — Rafał Kowalkowski",
        url: pageUrl,
        isPartOf: { "@id": `${RAFAL_CANONICAL_ORIGIN}/#website` },
        about: { "@id": `${pageUrl}#course` },
        inLanguage: "pl-PL",
      },
      {
        "@type": "Course",
        "@id": `${pageUrl}#course`,
        name: "Nauka gry na gitarze — Kołobrzeg",
        description:
          "Indywidualne lekcje gitary akustycznej i elektrycznej w Kołobrzegu: akordy, rytm, technika, akompaniament i nagrania. Dla dzieci i dorosłych, także online.",
        provider: {
          "@type": "Person",
          name: "Rafał Kowalkowski",
          url: RAFAL_CANONICAL_ORIGIN,
        },
        educationalLevel: "Beginner to intermediate",
        inLanguage: "pl-PL",
        availableLanguage: "pl",
        areaServed: KOLOBRZEG_PLACE,
        offers: {
          "@type": "Offer",
          category: "Lekcje indywidualne",
          availability: "https://schema.org/InStock",
          url: pageUrl,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

export function buildRafalWebPageJsonLd(internalPath: string, pageName: string) {
  const pageUrl = rafalCanonicalFromInternal(internalPath);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        name: pageName,
        url: pageUrl,
        isPartOf: { "@id": `${RAFAL_CANONICAL_ORIGIN}/#website` },
        about: { "@id": `${RAFAL_CANONICAL_ORIGIN}/#person` },
        inLanguage: "pl-PL",
      },
    ],
  };
}

export function buildRafalProductJsonLd(offer: RafalProductOffer) {
  const internal = rafalInternalPathFromOdartHref(offer.odartHref);
  const pageUrl = rafalCanonicalFromInternal(internal);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `${offer.title} — Rafał Kowalkowski | ODART`,
        url: pageUrl,
        isPartOf: { "@id": `${RAFAL_CANONICAL_ORIGIN}/#website` },
        inLanguage: "pl-PL",
      },
      {
        "@type": "Service",
        name: offer.title,
        description: offer.jsonLdDescription,
        provider: {
          "@type": "Person",
          name: "Rafał Kowalkowski",
          url: RAFAL_CANONICAL_ORIGIN,
        },
        offers: {
          "@type": "Offer",
          price: offer.priceSchema,
          priceCurrency: "PLN",
          availability: "https://schema.org/InStock",
          url: pageUrl,
        },
      },
    ],
  };
}

/** Indeksowalne URL-e na rafalkowalkowski.pl (kanoniczne, bez /demo). */
export function rafalKowalkowskiSitemapEntries(now = new Date()): MetadataRoute.Sitemap {
  const urls = new Set<string>([rafalCanonicalFromInternal(RAFAL_KOWALKOWSKI_PROFILE_PATH)]);

  Array.from(RAFAL_ROOT_PAGE_SLUGS).forEach((slug) => {
    if (slug === "demo") return;
    urls.add(rafalCanonicalFromInternal(`${RAFAL_KOWALKOWSKI_PROFILE_PATH}/${slug}`));
  });

  Array.from(RAFAL_WC_PRODUCT_SLUGS).forEach((slug) => {
    urls.add(rafalPublicPathCanonicalUrl(`/produkt/${slug}`, RAFAL_CANONICAL_HOST));
  });

  return Array.from(urls).sort().map((url) => ({
    url,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: url.replace(/\/$/, "") === RAFAL_CANONICAL_ORIGIN ? 1 : 0.82,
  }));
}

export function rafalKowalkowskiRobots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/demo", "/demo/", "/rafal-kowalkowski", "/rafal-kowalkowski/", "/api/"],
      },
    ],
    sitemap: `${RAFAL_CANONICAL_ORIGIN}/sitemap.xml`,
    host: RAFAL_CANONICAL_ORIGIN,
  };
}
