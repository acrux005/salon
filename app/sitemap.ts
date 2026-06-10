import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getRestaurants } from "@/lib/restaurantDb";
import { getAllClinicRecordsAsync } from "@/lib/skinmatch/clinics";
import { getTreatmentSlugsForSitemapAsync } from "@/lib/skinmatch/treatmentsDb";
import { isRafalKowalkowskiPlHost, ODART_SITE_URL } from "@/lib/odartSite";
import { rafalKowalkowskiSitemapEntries } from "@/lib/rafalKowalkowskiSeo";
import { ODART_ENGLISH_SERVICES } from "@/lib/odartEnglishServices";
import { getSalonSitemapBase, SALON_SITE_URL } from "@/lib/salonSeo";
import { getIndexableCitySlugsForSitemap } from "@/lib/portalCitySeo";
import { isRandkiPortalHost, getRandkiSiteUrl } from "@/lib/randkiHost";

type Restaurant = Awaited<ReturnType<typeof getRestaurants>>[number];
const BASE = process.env.NEXTAUTH_URL?.trim() || SALON_SITE_URL;
const ODART_BASE = ODART_SITE_URL.replace(/\/$/, "");

const odartEnglishServiceEntries = (now: Date): MetadataRoute.Sitemap => [
  {
    url: `${ODART_BASE}/en/services/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.82,
  },
  ...ODART_ENGLISH_SERVICES.map((service) => ({
    url: `${ODART_BASE}/en/services/${service.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.76,
  })),
];

const odartMarketingEntries = (now: Date): MetadataRoute.Sitemap => [
  { url: `${ODART_BASE}/en/`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
  ...odartEnglishServiceEntries(now),
  {
    url: `${ODART_BASE}/kontakt/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  },
  {
    url: `${ODART_BASE}/polityka-prywatnosci/`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.55,
  },
  {
    url: `${ODART_BASE}/regulamin/`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  },
  {
    url: `${ODART_BASE}/administracja-stron-internetowych-wordpress/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.72,
  },
  {
    url: `${ODART_BASE}/tworzenie-stron-internetowych-na-wordpressie/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.72,
  },
  {
    url: `${ODART_BASE}/informatyk-kolobrzeg/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.78,
  },
  {
    url: `${ODART_BASE}/opieka-it-dla-firm-kolobrzeg/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.78,
  },
  {
    url: `${ODART_BASE}/informatyk-koszalin/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.78,
  },
  {
    url: `${ODART_BASE}/monitoring-i-kamery-kolobrzeg/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.78,
  },
  {
    url: `${ODART_BASE}/strony-internetowe/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.78,
  },
  {
    url: `${ODART_BASE}/strona-internetowa-koszalin/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.78,
  },
  {
    url: `${ODART_BASE}/strona-internetowa-kolobrzeg/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.78,
  },
  {
    url: `${ODART_BASE}/blog/realizacje/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  },
  {
    url: `${ODART_BASE}/produkt/migracja-strony-internetowej-na-inny-serwer/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.72,
  },
  {
    url: `${ODART_BASE}/produkt/przywracanie-strony-internetowej-wordpress/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.72,
  },
  {
    url: `${ODART_BASE}/produkt/obsluga-mediow-spolecznosciowych/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.72,
  },
  {
    url: `${ODART_BASE}/produkt/seo-optymalizacja-strony/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.72,
  },
  {
    url: `${ODART_BASE}/produkt/wycena-strony-internetowej/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.72,
  },
];

/** Slugi artykułów (zgodne z app/portal/artykuly/page.tsx). */
const ARTICLE_SLUGS = [
  "przygotowanie-skory",
  "tradzik-doroslych",
  "przebarwienia-plan",
  "anti-aging-dom",
  "naczynka-cera",
  "manicure-wybor",
  "masaz-relaksacyjny-sportowy",
];

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const host = (await headers()).get("host") ?? "";
  if (isRafalKowalkowskiPlHost(host)) {
    return rafalKowalkowskiSitemapEntries(now);
  }
  if (isRandkiPortalHost(host)) {
    const base = getRandkiSiteUrl(host);
    return [
      { url: base, lastModified: now, changeFrequency: "weekly" as const, priority: 1 },
      { url: `${base}/regulamin`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.4 },
      { url: `${base}/polityka-prywatnosci`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.4 },
    ];
  }

  const baseNorm = BASE.replace(/\/$/, "");
  const isOdartDeploy = baseNorm === ODART_BASE;

  const base: MetadataRoute.Sitemap = isOdartDeploy
    ? [
        { url: BASE, lastModified: now, changeFrequency: "daily" as const, priority: 1.0 },
        { url: `${BASE}/zabiegi`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.95 },
        { url: `${BASE}/portal`, lastModified: now, changeFrequency: "daily" as const, priority: 0.95 },
        { url: `${BASE}/portal/gabinety`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
        { url: `${BASE}/portal/problemy-skory`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.85 },
        { url: `${BASE}/portal/artykuly`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
        { url: `${BASE}/portal/faq`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
        { url: `${BASE}/kontakt`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
        { url: `${BASE}/polityka-prywatnosci`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
        { url: `${BASE}/polityka-cookies`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
        { url: `${BASE}/regulamin`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
        { url: `${BASE}/regulamin-wspolpracy`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
        { url: `${BASE}/o-nas`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
        { url: `${BASE}/analiza-skory`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
        {
          url: `${BASE}/profesjonalna-strona-internetowa-dla-ciebie-juz-od-1500-zl`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.88,
        },
        { url: `${BASE}/o-mnie`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
        { url: `${BASE}/uslugi`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
        { url: `${BASE}/pozycjonowanie-seo`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.75 },
        ...odartMarketingEntries(now),
      ]
    : getSalonSitemapBase(baseNorm, now);

  let restaurants: Restaurant[] = [];
  try {
    restaurants = await getRestaurants();
  } catch {
    // brak modelu Restaurant lub błąd DB
  }
  const restauracje: MetadataRoute.Sitemap =
    restaurants.length > 0
      ? [
          { url: `${baseNorm}/restauracje`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
          ...restaurants.map((r: Restaurant) => ({
            url: `${baseNorm}/restauracje/${r.slug}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.8,
          })),
        ]
      : [];

  const clinics = await getAllClinicRecordsAsync();
  const indexableCitySlugs = await getIndexableCitySlugsForSitemap();
  const gabinetyPages: MetadataRoute.Sitemap = [
    ...indexableCitySlugs.map((slug) => ({
      url: `${baseNorm}/portal/gabinety/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...clinics.map((c) => ({
      url: `${baseNorm}/portal/gabinet/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];

  let treatmentSlugs: string[] = [];
  try {
    treatmentSlugs = await getTreatmentSlugsForSitemapAsync();
  } catch {
    // katalog niedostępny
  }
  const zabiegiPages: MetadataRoute.Sitemap = treatmentSlugs.map((slug) => ({
    url: `${baseNorm}/portal/zabieg/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const artykulyPages: MetadataRoute.Sitemap = ARTICLE_SLUGS.map((slug) => ({
    url: `${baseNorm}/portal/artykuly/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...base, ...restauracje, ...gabinetyPages, ...zabiegiPages, ...artykulyPages];
}
