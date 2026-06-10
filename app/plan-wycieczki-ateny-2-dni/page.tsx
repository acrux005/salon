import type { Metadata } from "next";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { OdartAthensPlanLanding } from "@/components/odart/athens/OdartAthensPlanLanding";
import { faqItems, heroImageAlt, seoKeywords } from "@/lib/athensPlanData";
import { ODART_SITE_URL } from "@/lib/odartSite";

const SITE = ODART_SITE_URL.replace(/\/$/, "");
const CANONICAL_PATH = "/plan-wycieczki-ateny-2-dni";
const CANONICAL_URL = `${SITE}${CANONICAL_PATH}/`;

const title =
  "Ateny w 6 dni — plan wycieczki dzień po dniu | Delfy, Aegina, mapy | ODART";
const description =
  "Plan 6 dni w Atenach i okolicy: lekki dzień 1, Akropol, Vouliagmeni, wyjazd do Delf, Aegina, finał w centrum (Agora, Monastiraki, Likavitos o zachodzie). Mapy OSM, harmonogramy, koszty — baza ul. Mirmidonon 20 (Petralona), ok. 11 osób.";

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
    images: [{ url: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1200&q=80", alt: heroImageAlt }],
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

export default function PlanWycieczkiAteny2DniPage() {
  return (
    <OdartPublicShell jsonLd={jsonLd}>
      <OdartAthensPlanLanding />
    </OdartPublicShell>
  );
}
