import type { Metadata } from "next";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { OdartJuraPlanLanding } from "@/components/odart/jura/OdartJuraPlanLanding";
import { faqItems, heroImageAlt, heroImageUrl, seoKeywords } from "@/lib/juraPlanData";
import { ODART_SITE_URL } from "@/lib/odartSite";

const SITE = ODART_SITE_URL.replace(/\/$/, "");
const CANONICAL_PATH = "/plan-wycieczki-jura-podzamcze";
const CANONICAL_URL = `${SITE}${CANONICAL_PATH}/`;

const title =
  "Jura w 4 dni — Podzamcze, Olsztyn, pustynia i Złoty Potok | ODART";
const description =
  "Plan 4 dni na Jurze z bazą w Podzamczu: Ogrodzieniec, Olsztyn (Sokole Góry), Bobolice/Mirów + Pustynia Błędowska, Złoty Potok (Brama Twardowskiego, źródła, stawy Amerykan, Pałac Raczyńskich; opc. Diabelskie Mosty). Harmonogramy, mapy OSM, koszty.";

export const metadata: Metadata = {
  title,
  description,
  keywords: seoKeywords,
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title,
    description,
    url: CANONICAL_URL,
    type: "article",
    locale: "pl_PL",
    siteName: "ODART",
    images: [{ url: `${heroImageUrl.split("?")[0]}?w=1200&q=80`, alt: heroImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL_URL}#webpage`,
      url: CANONICAL_URL,
      name: title,
      description,
      inLanguage: "pl-PL",
      isPartOf: { "@id": `${SITE}/#website` },
    },
    {
      "@type": "FAQPage",
      "@id": `${CANONICAL_URL}#faq`,
      mainEntity: faqItems.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ],
};

export default function PlanWycieczkiJuraPodzamczePage() {
  return (
    <OdartPublicShell jsonLd={jsonLd}>
      <OdartJuraPlanLanding />
    </OdartPublicShell>
  );
}
