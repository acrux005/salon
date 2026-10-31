import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import {
  ZAAMOW_FAQ,
  ZAAMOW_GROUPS,
  ZAAMOW_OFFERS,
  ZAAMOW_ORIGIN,
  zaamowItemListJsonLd,
} from "@/lib/zaamowOffer";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/zaamow/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "zaamow.pl — domeny, poczta, strony WWW i aplikacje ODART",
      description:
        "Sklep ODART: rejestracja domen .pl, poczta firmowa, strony internetowe i katalog aplikacji. Zamawiasz na zaamow.pl, utrzymuję ja.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
      about: { "@id": `${SITE}/#org` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ODART", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "zaamow.pl", item: CANONICAL },
      ],
    },
    zaamowItemListJsonLd(),
    {
      "@type": "FAQPage",
      mainEntity: ZAAMOW_FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "ODART — Ostry Dyżur Artystyczny",
      url: SITE,
      sameAs: [ZAAMOW_ORIGIN],
    },
  ],
};

export function OdartZaamowPage() {
  return (
    <OdartPublicShell activeNav="uslugi" jsonLd={jsonLd}>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(249,115,22,0.12),transparent)]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-16 lg:px-6 lg:py-20">
          <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">zaamow.pl · sklep ODART</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Domena, poczta, strona i aplikacje — do zamówienia online
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-300">
            zaamow.pl to mój sklep, nie cudza platforma. Bierzesz domenę .pl, skrzynki firmowe, stronę WWW albo gotową
            aplikację. Większy, szyty na miarę projekt nadal robimy na{" "}
            <Link href={`${SITE}/`} className="text-odart-accent hover:text-orange-300">
              odart.pl
            </Link>
            .
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={`${ZAAMOW_ORIGIN}/domeny/sprawdz`}
              className="inline-flex items-center rounded-lg bg-odart-accent px-6 py-3 font-semibold text-white hover:brightness-110"
              rel="noopener noreferrer"
            >
              Sprawdź domenę
              <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
            </a>
            <a
              href={`${ZAAMOW_ORIGIN}/strony`}
              className="inline-flex items-center rounded-lg border border-white/10 px-6 py-3 font-semibold text-white hover:bg-neutral-800"
              rel="noopener noreferrer"
            >
              Zamów stronę WWW
            </a>
            <a
              href={`${ZAAMOW_ORIGIN}/aplikacje`}
              className="inline-flex items-center rounded-lg border border-odart-accent/35 bg-odart-accent/10 px-6 py-3 font-semibold text-white hover:bg-odart-accent/20"
              rel="noopener noreferrer"
            >
              Katalog aplikacji
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-neutral-950 px-4 py-12 lg:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <p className="text-xs font-medium uppercase tracking-wider text-odart-accent">Dla firm</p>
            <h2 className="mt-3 text-xl font-bold text-white">Start w internecie bez trzech dostawców</h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">
              Jedna domena, poczta biuro@ i strona z formularzem. Biuro, gabinet, warsztat, lokalne usługi — bez
              składania tego z trzech kont.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-neutral-500">
              {["Domena .pl albo .com z DNS", "Skrzynki firmowe", "Strona z kontaktem na wierzchu"].map((line) => (
                <li key={line} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
            <a
              href={`${ZAAMOW_ORIGIN}/domeny`}
              className="mt-8 inline-flex items-center font-semibold text-odart-accent hover:text-orange-300"
              rel="noopener noreferrer"
            >
              Zamów domenę i stronę na zaamow.pl
              <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
            </a>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <p className="text-xs font-medium uppercase tracking-wider text-odart-accent">Dla restauracji</p>
            <h2 className="mt-3 text-xl font-bold text-white">Menu online i własne zamówienia</h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">
              Domena i wizytówka na zaamow.pl. Do zamówień z dostawą — aplikacja na{" "}
              <a href="https://zamow.odart.pl/" className="text-odart-accent hover:text-orange-300" rel="noopener noreferrer">
                zamow.odart.pl
              </a>
              .
            </p>
            <ul className="mt-6 space-y-2 text-sm text-neutral-500">
              {["Strona z menu i godzinami", "Poczta rezerwacje@ / kontakt@", "Panel, dostawy, płatności"].map((line) => (
                <li key={line} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
            <a
              href={`${ZAAMOW_ORIGIN}/zamowienia`}
              className="mt-8 inline-flex items-center font-semibold text-odart-accent hover:text-orange-300"
              rel="noopener noreferrer"
            >
              Platforma zamówień na zaamow.pl
              <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
            </a>
          </article>
        </div>
      </section>

      {ZAAMOW_GROUPS.map((group) => {
        const items = ZAAMOW_OFFERS.filter((item) => item.group === group.id);
        return (
          <section
            key={group.id}
            id={group.id}
            className="border-b border-white/10 px-4 py-16 lg:px-6"
            aria-labelledby={`zaamow-${group.id}`}
          >
            <div className="mx-auto max-w-6xl">
              <h2 id={`zaamow-${group.id}`} className="text-3xl font-bold text-white sm:text-4xl">
                {group.heading}
              </h2>
              <p className="mt-4 max-w-2xl text-neutral-400">{group.intro}</p>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6"
                  >
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-400">{item.description}</p>
                    <a
                      href={item.href}
                      className="mt-6 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300"
                      rel="noopener noreferrer"
                    >
                      {item.cta}
                      <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="border-b border-white/10 bg-neutral-950/50 px-4 py-16 lg:px-6" aria-labelledby="zaamow-faq">
        <div className="mx-auto max-w-3xl">
          <h2 id="zaamow-faq" className="text-center text-3xl font-bold text-white">
            Kiedy zaamow.pl, kiedy odart.pl
          </h2>
          <div className="mt-10 space-y-3">
            {ZAAMOW_FAQ.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 open:bg-neutral-900/60"
              >
                <summary className="cursor-pointer list-none font-medium text-white marker:content-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-8 lg:flex lg:items-center lg:justify-between lg:p-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Potrzebujesz czegoś poza katalogiem?</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
              Napisz — ustalimy zakres jak na każdej innej realizacji ODART. Katalog zostawiam na rzeczy, które da się
              zamówić od razu.
            </p>
          </div>
          <Link
            href={`${SITE}/kontakt/`}
            className="mt-6 inline-flex items-center rounded-lg bg-odart-accent px-6 py-3 font-semibold text-white hover:brightness-110 lg:mt-0"
          >
            Kontakt ODART
            <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
          </Link>
        </div>
      </section>
    </OdartPublicShell>
  );
}
