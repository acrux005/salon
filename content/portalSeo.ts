/** Wspólne stałe SEO dla hosta salon.odart.pl (portal Zabiegi Odart). */
export const PORTAL_SITE_URL = "https://salon.odart.pl";
export const PORTAL_BRAND = "Zabiegi Odart";

export function buildPortalJsonLdGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${PORTAL_SITE_URL}/portal#website`,
        name: PORTAL_BRAND,
        url: `${PORTAL_SITE_URL}/portal`,
        publisher: { "@id": `${PORTAL_SITE_URL}/portal#organization` },
        inLanguage: "pl-PL",
      },
      {
        "@type": "Organization",
        "@id": `${PORTAL_SITE_URL}/portal#organization`,
        name: PORTAL_BRAND,
        url: `${PORTAL_SITE_URL}/portal`,
        logo: `${PORTAL_SITE_URL}/images/icon-192.png`,
      },
    ],
  };
}
