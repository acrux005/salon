import Image from "next/image";
import Link from "next/link";
import { Jost } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { ODART_SITE_URL } from "@/lib/odartSite";
import {
  RAFAL_KOWALKOWSKI_GALLERY_PATH,
  RAFAL_KOWALKOWSKI_MESKA_SESJA_PATH,
  RAFAL_KOWALKOWSKI_PROFILE_PATH,
  RAFAL_KOWALKOWSKI_SESJA_BIZNESOWA_PATH,
  RAFAL_KOWALKOWSKI_SESJA_DZIECIECA_PATH,
  RAFAL_KOWALKOWSKI_SESJA_PLENER_PATH,
  RAFAL_KOWALKOWSKI_SESJA_PRODUKTOWA_PATH,
  RAFAL_KOWALKOWSKI_SESJA_PRZYJACIOLKA_PATH,
  RAFAL_KOWALKOWSKI_SESJA_PRZYJACIOLKA_WP_SOURCE,
} from "@/lib/rafalKowalkowskiGallery";
import { rafalPublicHref } from "@/lib/rafalKowalkowskiLegacyRoutes";
import { RAFAL_SERVICE_IMAGE } from "@/lib/rafalKowalkowskiMedia";
import { buildRafalWebPageJsonLd } from "@/lib/rafalKowalkowskiSeo";

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE = ODART_SITE_URL.replace(/\/$/, "");

const I = RAFAL_SERVICE_IMAGE;
const HERO = I.przyjaciolka;

type RelatedItem =
  | { title: string; price: string; href: string; image: string }
  | { title: string; price: string; contact: true; image: string };

const RELATED: RelatedItem[] = [
  {
    title: "Męska sesja portretowa",
    price: "200,00 zł",
    href: RAFAL_KOWALKOWSKI_MESKA_SESJA_PATH,
    image: I.meskaSesja.src,
  },
  {
    title: "Sesja produktowa",
    price: "200,00 zł",
    href: RAFAL_KOWALKOWSKI_SESJA_PRODUKTOWA_PATH,
    image: I.produkt.src,
  },
  {
    title: "Sesja dziecięca",
    price: "200,00 zł",
    href: RAFAL_KOWALKOWSKI_SESJA_DZIECIECA_PATH,
    image: I.dziecieca.src,
  },
  {
    title: "Sesja portretowa plener",
    price: "200,00 zł",
    href: RAFAL_KOWALKOWSKI_SESJA_PLENER_PATH,
    image: I.plener.src,
  },
  {
    title: "Sesja biznesowa",
    price: "200,00 zł",
    href: RAFAL_KOWALKOWSKI_SESJA_BIZNESOWA_PATH,
    image: I.biznes.src,
  },
];

const jsonLd = buildRafalWebPageJsonLd(RAFAL_KOWALKOWSKI_SESJA_PRZYJACIOLKA_PATH, "Sesja z przyjaciółką — Rafał Kowalkowski");


export function OdartRafalKowalkowskiSesjaPrzyjaciolkaPage() {
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
                <span className="text-neutral-400">Sesje fotograficzne</span>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-neutral-600" aria-hidden />
                <span className="text-white">Sesja z przyjaciółką</span>
              </li>
            </ol>
          </nav>

          <header className="mt-8 border-b border-white/10 pb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-odart-accent">Sesje fotograficzne</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Sesja fotograficzna z przyjaciółką
            </h1>
            <p className="mt-4 text-2xl font-semibold text-odart-accent">200,00 zł</p>
            <p className="mt-2 text-sm text-neutral-500">Dostępne — termin ustalamy po kontakcie.</p>
            <p className="mt-4 text-xs text-neutral-600">
              Opis zgodny z ofertą na{" "}
              <a
                href={RAFAL_KOWALKOWSKI_SESJA_PRZYJACIOLKA_WP_SOURCE}
                className="text-odart-accent/90 underline decoration-odart-accent/30 underline-offset-2 hover:decoration-odart-accent"
                rel="noopener noreferrer"
                target="_blank"
              >
                rafalkowalkowski.pl
              </a>
              .
            </p>
          </header>

          <div className="relative mt-10 aspect-[800/533] w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
            <Image
              src={HERO.src}
              alt="Sesja fotograficzna z przyjaciółką"
              width={HERO.w}
              height={HERO.h}
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>

          <p className="mt-10 text-lg leading-relaxed text-neutral-300">
            A może sesja z przyjaciółką? Utrwalmy zwariowany czas i waszą przyjaźń na pięknych zdjęciach. Zapraszamy.
            Gwarantujemy, że to będzie miłe spotkanie i świetna zabawa.
          </p>

          <div className="mt-12 space-y-6 border-t border-white/10 pt-10">
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Opis</h2>
            <p className="text-base leading-relaxed text-neutral-400">
              A może sesja z przyjaciółką? Utrwalmy zwariowany czas i waszą przyjaźń na pięknych zdjęciach.
              Zapraszamy. Gwarantujemy, że to będzie miłe spotkanie i świetna zabawa.
            </p>
            <p className="text-base leading-relaxed text-neutral-400">
              Więcej realizacji w{" "}
              <Link href={rafalPublicHref(RAFAL_KOWALKOWSKI_GALLERY_PATH)} className="text-odart-accent hover:underline">
                galerii zdjęć
              </Link>
              . Umów termin przez formularz kontaktowy — dopasujemy lokalizację i styl do Waszej historii.
            </p>
          </div>

          <aside className="mt-14">
            <h2 className="text-lg font-semibold text-white">Powiązane usługi</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {RELATED.map((p) => {
                const href =
                  "contact" in p && p.contact ? `${SITE}/kontakt/` : "href" in p ? rafalPublicHref(p.href) : `${SITE}/kontakt/`;
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

          <footer className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={rafalPublicHref(RAFAL_KOWALKOWSKI_PROFILE_PATH)}
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-odart-accent/50"
            >
              Wróć do profilu
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
