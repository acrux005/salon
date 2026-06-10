import Image from "next/image";
import Link from "next/link";
import { Jost } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { RAFAL_KOWALKOWSKI_PROFILE_PATH, RAFAL_KOWALKOWSKI_USLUGI_PATH } from "@/lib/rafalKowalkowskiGallery";
import type { RafalProductOffer } from "@/lib/rafalKowalkowskiProductOffers";
import { buildRafalProductJsonLd } from "@/lib/rafalKowalkowskiSeo";
import { rafalPublicHref } from "@/lib/rafalKowalkowskiLegacyRoutes";

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE = ODART_SITE_URL.replace(/\/$/, "");

type Props = { offer: RafalProductOffer };

export function OdartRafalKowalkowskiProductOfferPage({ offer }: Props) {
  const jsonLd = buildRafalProductJsonLd(offer);
  const isBanner = offer.heroLayout === "banner";
  const heroAspect =
    offer.heroAspect ??
    (offer.hero.w > 0 && offer.hero.h > 0 ? `aspect-[${offer.hero.w}/${offer.hero.h}]` : "aspect-[3/2]");
  const heroWrapClass = isBanner
    ? `relative mt-10 w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 ${heroAspect}`
    : `relative mt-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 ${heroAspect}`;

  return (
    <OdartPublicShell jsonLd={jsonLd}>
      <div className={`${jost.className} bg-[#0f0f0f] text-neutral-300`}>
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav className="text-sm text-neutral-500" aria-label="Ścieżka nawigacji">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href={rafalPublicHref(RAFAL_KOWALKOWSKI_PROFILE_PATH)} className="transition hover:text-white">
                  Rafał Kowalkowski
                </Link>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-neutral-600" aria-hidden />
                <Link href={rafalPublicHref(RAFAL_KOWALKOWSKI_USLUGI_PATH)} className="transition hover:text-white">
                  Usługi
                </Link>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-neutral-600" aria-hidden />
                <span className="text-neutral-400">{offer.categoryLabel}</span>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-neutral-600" aria-hidden />
                <span className="text-white">{offer.breadcrumbLabel}</span>
              </li>
            </ol>
          </nav>

          <header className="mt-8 border-b border-white/10 pb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-odart-accent">{offer.categoryLabel}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">{offer.title}</h1>
            <p className="mt-4 text-2xl font-semibold text-odart-accent">{offer.priceLabel}</p>
            <p className="mt-2 text-sm text-neutral-500">Dostępne — termin i zakres ustalamy po kontakcie.</p>
            <p className="mt-4 text-xs text-neutral-600">
              Opis zgodny z ofertą na{" "}
              <a
                href={offer.wpSource}
                className="text-odart-accent/90 underline decoration-odart-accent/30 underline-offset-2 hover:decoration-odart-accent"
                rel="noopener noreferrer"
                target="_blank"
              >
                rafalkowalkowski.pl
              </a>
              .
            </p>
          </header>

          <div className={heroWrapClass}>
            <Image
              src={offer.hero.src}
              alt={offer.title}
              width={offer.hero.w}
              height={offer.hero.h}
              className="h-full w-full object-cover"
              sizes={isBanner ? "(max-width: 768px) 100vw, 768px" : "(max-width: 768px) 100vw, 448px"}
              priority
            />
          </div>

          <p className="mt-10 text-lg leading-relaxed text-neutral-300">{offer.lead}</p>

          <div className="mt-12 space-y-8">
            {offer.steps?.length ? (
              <>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  {offer.stepsHeading ?? "Szczegóły usługi"}
                </h2>
                {offer.steps.map((step, i) => (
                  <section key={step.title} aria-labelledby={`step-${offer.slug}-${i}`}>
                    <h3 id={`step-${offer.slug}-${i}`} className="text-lg font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-neutral-400">{step.text}</p>
                  </section>
                ))}
              </>
            ) : null}
            {offer.sections?.map((section) => (
              <section key={section.title} className="space-y-3 border-t border-white/10 pt-8 first:border-0 first:pt-0">
                <h2 className="text-xl font-semibold text-white sm:text-2xl">{section.title}</h2>
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)} className="text-base leading-relaxed text-neutral-400">
                    {p}
                  </p>
                ))}
              </section>
            ))}
            {offer.footerNote ? (
              <p className="border-t border-white/10 pt-8 text-base leading-relaxed text-neutral-400">{offer.footerNote}</p>
            ) : null}
          </div>

          {offer.related.length > 0 ? (
            <aside className="mt-14">
              <h2 className="text-lg font-semibold text-white">Powiązane usługi</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {offer.related.map((p) => {
                  const href =
                    "contact" in p && p.contact ? `${SITE}/kontakt/` : "href" in p ? p.href : `${SITE}/kontakt/`;
                  return (
                    <li key={p.title}>
                      <Link
                        href={href}
                        className="group flex gap-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-odart-accent/40"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-900">
                          <Image src={p.image} alt="" fill className="object-cover" sizes="64px" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-odart-accent">{p.title}</p>
                          <p className="mt-1 text-sm text-odart-accent">{p.price}</p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </aside>
          ) : null}

          <footer className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={rafalPublicHref(RAFAL_KOWALKOWSKI_USLUGI_PATH)}
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-odart-accent/50"
            >
              Wszystkie usługi
            </Link>
            <Link
              href={`${SITE}/kontakt/`}
              className="inline-flex items-center justify-center rounded-full bg-odart-accent px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-950/25 transition hover:brightness-110"
            >
              Zamów lub zapytaj
            </Link>
          </footer>
        </div>
      </div>
    </OdartPublicShell>
  );
}
