import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { OdartLocale } from "@/components/odart/odartNav";
import { ODART_SITE_URL } from "@/lib/odartSite";
import {
  ZAAMOW_FEATURED,
  ZAAMOW_ODART_PATH,
  ZAAMOW_ORIGIN,
  type ZaamowOffer,
} from "@/lib/zaamowOffer";

const SITE = ODART_SITE_URL;

const COPY = {
  pl: {
    kicker: "zaamow.pl",
    heading: "Domena, poczta, strona i aplikacje",
    lead:
      "Na zaamow.pl zamawiasz domenę .pl, skrzynki firmowe, stronę z katalogu albo gotową aplikację. Indywidualny projekt zostaje tutaj, na odart.pl.",
    more: "Pełna oferta zaamow.pl",
    shop: "Otwórz zaamow.pl",
  },
  en: {
    kicker: "zaamow.pl",
    heading: "Domain, email, website and apps",
    lead:
      "On zaamow.pl you order a .pl domain, business mail, a catalogue website or a ready ODART app. Custom work stays here on odart.pl.",
    more: "Full zaamow.pl offer",
    shop: "Open zaamow.pl",
  },
} as const;

function offerCopy(item: ZaamowOffer, locale: OdartLocale) {
  return locale === "en"
    ? { title: item.titleEn, description: item.descriptionEn, cta: item.ctaEn }
    : { title: item.title, description: item.description, cta: item.cta };
}

/** Sekcja homepage: 8 kart z kotwicami na konkretne URL-e zaamow.pl. */
export function OdartZaamowSection({ locale = "pl" }: { locale?: OdartLocale }) {
  const copy = COPY[locale];
  const moreHref = locale === "en" ? ZAAMOW_ORIGIN : `${SITE}${ZAAMOW_ODART_PATH}`;

  return (
    <section
      id="zaamow"
      className="border-b border-white/10 bg-neutral-950 px-4 py-16 lg:px-6"
      aria-labelledby="zaamow-tytul"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-odart-accent">{copy.kicker}</p>
        <h2 id="zaamow-tytul" className="mx-auto mt-3 max-w-3xl text-center text-2xl font-bold text-white sm:text-3xl">
          {copy.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-neutral-400 sm:text-base">
          {copy.lead}
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ZAAMOW_FEATURED.map((item) => {
            const text = offerCopy(item, locale);
            return (
              <article
                key={item.id}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6"
              >
                <h3 className="text-lg font-semibold text-white">{text.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-400">{text.description}</p>
                <a
                  href={item.href}
                  className="mt-6 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300"
                  rel="noopener noreferrer"
                >
                  {text.cta}
                  <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
                </a>
              </article>
            );
          })}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={moreHref}
            className="inline-flex items-center rounded-lg bg-odart-accent px-6 py-3 font-semibold text-white hover:brightness-110"
          >
            {copy.more}
            <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
          </Link>
          <a
            href={ZAAMOW_ORIGIN}
            className="inline-flex items-center rounded-lg border border-white/10 px-6 py-3 font-semibold text-white hover:bg-neutral-800"
            rel="noopener noreferrer"
          >
            {copy.shop}
          </a>
        </div>
      </div>
    </section>
  );
}
