import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { OdartPolitykaPrywatnosciArticles } from "@/components/odart/odartPolitykaPrywatnosciArticles";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/polityka-prywatnosci/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Polityka prywatności | ODART",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
      dateModified: "2026-03-23",
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE}/#org`,
      name: "ODART Rafał Kowalkowski",
      alternateName: "Ostry Dyżur Artystyczny",
      url: SITE,
      taxID: "5791020696",
      address: {
        "@type": "PostalAddress",
        streetAddress: "ul. Makowskiego 3",
        postalCode: "78-100",
        addressLocality: "Kołobrzeg",
        addressCountry: "PL",
      },
    },
  ],
};

export function OdartPolitykaPrywatnosciPage() {
  return (
    <OdartPublicShell jsonLd={jsonLd}>
      <article className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Polityka prywatności
          </h1>
          <div className="mt-10">
            <OdartPolitykaPrywatnosciArticles />
          </div>
        </div>
      </article>
    </OdartPublicShell>
  );
}
