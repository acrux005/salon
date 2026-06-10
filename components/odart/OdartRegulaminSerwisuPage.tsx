import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { OdartRegulaminSerwisuContent } from "@/components/odart/odartRegulaminSerwisuContent";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/regulamin/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Regulamin serwisu | ODART",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
  ],
};

export function OdartRegulaminSerwisuPage() {
  return (
    <OdartPublicShell jsonLd={jsonLd}>
      <article className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Regulamin serwisu
          </h1>
          <p className="mt-4 text-neutral-400">
            Serwis <span className="text-neutral-300">odart.pl</span> — zasady korzystania z witryny.
          </p>
          <div className="mt-10">
            <OdartRegulaminSerwisuContent />
          </div>
        </div>
      </article>
    </OdartPublicShell>
  );
}
