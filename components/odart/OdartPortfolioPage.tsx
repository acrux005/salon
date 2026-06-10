import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { ODART_PORTFOLIO_TIMELINE } from "@/lib/odartPortfolioTimeline";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/portfolio/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Portfolio | ODART — realizacje",
      description:
        "Portfolio ODART: aplikacje webowe, strony WWW, UI/UX, wideo i projekty dla klientów. Kołobrzeg.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "ItemList",
      itemListElement: ODART_PORTFOLIO_TIMELINE.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.title,
        description: item.description,
        ...(item.href ? { url: item.href } : {}),
      })),
    },
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "ODART — Ostry Dyżur Artystyczny",
      url: SITE,
      telephone: "+48695432415",
      email: "biuro@odart.pl",
    },
  ],
};

export function OdartPortfolioPage() {
  return (
    <OdartPublicShell activeNav="portfolio" jsonLd={jsonLd}>
      <section className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">Moje portfolio</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">Portfolio</h1>
          <p className="mt-6 text-lg text-neutral-400 leading-relaxed">
            Wybrane realizacje — od aplikacji i stron po UI, branding i produkcję wideo. Wszystko w jednym miejscu,
            bez przekierowań na zewnętrzne szablony.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 pb-24 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            {/* pionowa oś */}
            <div
              className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-odart-accent/80 via-odart-accent/35 to-transparent md:left-[19px]"
              aria-hidden
            />

            <ol className="space-y-0">
              {ODART_PORTFOLIO_TIMELINE.map((item, index) => (
                <li key={item.id} className="relative pb-14 last:pb-0">
                  <div className="flex gap-6 md:gap-10">
                    {/* węzeł na osi */}
                    <div className="relative z-10 flex w-8 shrink-0 flex-col items-center md:w-10">
                      <span
                        className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-odart-accent bg-black shadow-[0_0_0_4px_rgba(0,0,0,0.9)] md:h-5 md:w-5"
                        aria-hidden
                      />
                    </div>
                    <article className="min-w-0 flex-1 pb-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-odart-accent">
                          {item.label}
                        </span>
                        <span className="text-xs text-neutral-600">#{String(index + 1).padStart(2, "0")}</span>
                      </div>
                      <h2 className="mt-3 text-xl font-bold text-white md:text-2xl">{item.title}</h2>
                      <p className="mt-3 text-sm leading-relaxed text-neutral-400 md:text-base">{item.description}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-odart-accent hover:text-orange-300"
                        >
                          {item.href.startsWith(SITE) ? "Otwórz" : "Zobacz online"}
                          <ExternalLink className="h-4 w-4" aria-hidden />
                        </a>
                      ) : null}
                    </article>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="text-neutral-400">Masz podobny projekt?</p>
            <Link
              href={`${SITE}/kontakt/`}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-odart-accent px-8 py-3 font-semibold text-white hover:brightness-110"
            >
              Napisz — umówimy rozmowę
              <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </OdartPublicShell>
  );
}
