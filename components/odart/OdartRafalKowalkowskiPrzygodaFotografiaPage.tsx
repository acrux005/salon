import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Jost } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { ODART_SITE_URL } from "@/lib/odartSite";
import {
  RAFAL_KOWALKOWSKI_GALLERY_PATH,
  RAFAL_KOWALKOWSKI_KOMPOZYCJA_FOTO_PATH,
  RAFAL_KOWALKOWSKI_PROFILE_PATH,
  RAFAL_KOWALKOWSKI_PRZYGODA_FOTO_ODART_HREF,
  RAFAL_KOWALKOWSKI_PRZYGODA_FOTO_WP_SOURCE,

  RAFAL_KOWALKOWSKI_PRZYGODA_FOTO_PATH,} from "@/lib/rafalKowalkowskiGallery";
import { buildRafalWebPageJsonLd } from "@/lib/rafalKowalkowskiSeo";

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE = ODART_SITE_URL.replace(/\/$/, "");
const UP = "https://rafalkowalkowski.pl/wp-content/uploads/2023/02";

const POWERSHOT_IMAGES = [
  {
    src: `${UP}/odart_canon_powershot_a60_e85a22fa-e076-4bc4-9462-8b26f44fe62e.jpg`,
    w: 256,
    h: 256,
    alt: "Zdjęcie z aparatu Canon Powershot — wczesna fotografia cyfrowa",
  },
  {
    src: `${UP}/odart_canon_powershot_a60_deea3a16-cb4e-4fa5-83a9-4b39ce272ba2.jpg`,
    w: 256,
    h: 256,
    alt: "Canon Powershot — kadry z początków przygody z fotografią",
  },
  {
    src: `${UP}/odart_canon_powershot_a60_817cb218-45e1-490f-a28a-1bc35c76d2fc.jpg`,
    w: 256,
    h: 256,
    alt: "Canon Powershot — zdjęcia z archiwum",
  },
  {
    src: `${UP}/odart_canon_powershot_a60_a1739400-9672-40b6-a82a-90a4964206be.jpg`,
    w: 256,
    h: 256,
    alt: "Canon Powershot — kolejny kadr z wczesnych lat",
  },
] as const;

const jsonLd = buildRafalWebPageJsonLd(RAFAL_KOWALKOWSKI_PRZYGODA_FOTO_PATH, "Przygoda z fotografią — Rafał Kowalkowski");


function Figure({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-white/10 bg-black/30 p-3 sm:p-4">
      {children}
      {caption ? <figcaption className="mt-3 text-center text-sm text-neutral-500">{caption}</figcaption> : null}
    </figure>
  );
}

export function OdartRafalKowalkowskiPrzygodaFotografiaPage() {
  return (
    <OdartPublicShell jsonLd={jsonLd}>
      <div className={`${jost.className} bg-[#0f0f0f] text-neutral-300`}>
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav className="text-sm text-neutral-500" aria-label="Ścieżka nawigacji">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href={RAFAL_KOWALKOWSKI_PROFILE_PATH} className="transition hover:text-white">
                  Rafał Kowalkowski
                </Link>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-neutral-600" aria-hidden />
                <span className="text-neutral-400">Edukacja</span>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-neutral-600" aria-hidden />
                <span className="text-white">Przygoda z fotografią</span>
              </li>
            </ol>
          </nav>

          <header className="mt-8 border-b border-white/10 pb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-odart-accent">Edukacja</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Jak zaczęła się moja przygoda z fotografią?
            </h1>
            <time className="mt-4 block text-sm text-neutral-500" dateTime="2023-02-16">
              16 lutego 2023
            </time>
            <p className="mt-2 text-xs text-neutral-600">
              Treść zgodna z wpisem na{" "}
              <a
                href={RAFAL_KOWALKOWSKI_PRZYGODA_FOTO_WP_SOURCE}
                className="text-odart-accent/90 underline decoration-odart-accent/30 underline-offset-2 hover:decoration-odart-accent"
                rel="noopener noreferrer"
                target="_blank"
              >
                rafalkowalkowski.pl
              </a>
              .
            </p>
          </header>

          <article className="prose prose-invert prose-neutral mt-12 max-w-none prose-p:text-neutral-400 prose-p:leading-relaxed prose-headings:font-semibold prose-headings:text-white prose-strong:text-neutral-200">
            <p>
              Pierwszym moim aparatem był Zenit, ale nie były to dobre zdjęcia. Przede wszystkim robiłem wszystko
              nieświadomie i bardziej chodziło o pamiątkowe foty, które i tak były nieostre z racji nieumiejętnego
              ustawiania czasu i ogólnej braku wiedzy. W tej chwili żałuję, że w tamtych czasach, kiedy zaczynałem swoją
              pracę na statkach, nie było dostępnych jak dzisiaj aparatów. Uczestniczyłem w rejsie do Osaki na Darze
              Młodzieży i choć mam trochę pamiątkowych zdjęć, to jednak nie jest to co miałbym dzisiaj. Do dziś pamiętam,
              jak kolega wypstrykał ponad 50 zdjęć w Zenicie i cieszył się, że ma tak pojemną kliszę. Okazało się potem,
              że po prostu nie zainstalował kliszy w aparacie. Dziś wydaje się być to niemożliwe — po pierwsze 36 zdjęć
              robimy bez zastanawiania się czy mamy na nie miejsce, po drugie wraz z telefonem otrzymujemy wszystko co
              potrzeba do fotografii pamiątkowej, rodzinnej czy okazjonalnej.
            </p>

            <p>
              Po wejściu aparatów cyfrowych na rynek kupiłem swój pierwszy aparat kompaktowy Canona Powershot. To były
              czasy kiedy jeszcze były problemy z pojemnością, bo nie było jak tych zdjęć przechowywać. Na wyjazdach nie
              miałem laptopa, dysku zewnętrznego ani banku pamięci czy chociażby chmury lub serwera, żeby te zdjęcia z
              karty przegrać. W roku 2003 obszedłem wszystkie sklepy fotograficzne z pytaniem czy jest możliwość zgrania
              zdjęć na płytę. Bez szans. To jeszcze nie był ten czas fotografii cyfrowej w Polsce:) W roku 2000 fotografia
              cyfrowa stanowiła 1 procent światowego rynku, żeby za 10 lat dominować w 99 procentach.
            </p>

            <Figure caption="Wczesne zdjęcia z aparatu Canon Powershot A60">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {POWERSHOT_IMAGES.map((img) => (
                  <Image
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    width={img.w}
                    height={img.h}
                    className="h-auto w-full rounded-lg object-cover"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ))}
              </div>
            </Figure>

            <p>
              Dopiero w roku 2006 zdecydowałem wziąć się za fotografię na poważnie, miałem większy budżet i mogłem sobie
              pozwolić na droższy aparat. Stwierdziłem właśnie wtedy, że fotografia nauczy mnie wielu nowych rzeczy. Kupiłem
              lustrzankę, tzn. myślałem, że to jest lustrzanka:) Jechałem wtedy do pracy przez Singapur i poszedłem do
              sklepu wybrać aparat. Wziąłem do ręki lustrzankę Nikona i nawet za nią zapłaciłem. Zacząłem robić zdjęcia
              jeszcze w sklepie i były poruszone… Nie wiedziałem wtedy jak obsłużyć aparat i po prostu myślałem, że jest
              popsuty. Mówię do sprzedawcy, że nie chcę tego aparatu i żeby oddał mi pieniądze. A on to: „A Ty w ogóle tu
              u nas kupowałeś aparat?” Nie zdążyłem nawet wyjść ze sklepu i mocno się wystraszyłem, że zostanę bez aparatu i
              bez pieniędzy. Skończyło się na tym, że wyszedłem ze sklepu z kompaktem o wyglądzie lustrzanki, do tego
              przepłaconym, bo w Polsce był tańszy:) Interes życia.
            </p>

            <p>
              Zacząłem robić zdjęcia, czytać i przeglądać różne portale fotograficzne. Początkowo robiłem zdjęcia
              krajobrazowe i często chodziłem na kołobrzeską plażę o zachodzie i wschodzie słońca.
            </p>
            <p>
              Potem zacząłem jeździć dalej, nawet do Międzyzdrojów w poszukiwaniu kadrów na plaży. Zwiedziłem wszystkie
              okoliczne lasy w poszukiwaniu miejscówek, wsie, zjeździłem wszystkie drogi żeby znaleźć stare budynki, pałace,
              stare drogi ze szpalerem lasów, czy cokolwiek innego co mogłoby nadawać się do zdjęć.
            </p>
            <p>
              Potem jeździłem też jeszcze dalej, byłem na Islandii czy odwiedziłem Grand Canyon o wschodzie słońca, tylko po
              to, żeby zrobić „zdjęcie”.
            </p>
            <p>Przerobiłem garaż na studio fotograficzne i zacząłem robić zdjęcia studyjne.</p>
            <p>
              W końcu trafiłem na portal 1x, którego forma bardzo mi odpowiadała, jeśli chodzi o kulturę wypowiedzi i jakość
              zdjęć. Ponieważ ja, jak coś robię, to nie potrafię robić czegoś byle jak, to stwierdziłem, że taki portal mogę
              mieć i ja:) I tak powstała{" "}
              <a
                href="https://fotoferia.pl/"
                className="text-odart-accent hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                Fotoferia
              </a>
              . To był rok 2008.
            </p>
          </article>

          <aside className="mt-12 rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm font-semibold text-white">Dalej w serii</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href={RAFAL_KOWALKOWSKI_KOMPOZYCJA_FOTO_PATH} className="font-semibold text-odart-accent hover:underline">
                  Kompozycja w fotografii →
                </Link>
              </li>
              <li>
                <Link href={RAFAL_KOWALKOWSKI_GALLERY_PATH} className="font-semibold text-odart-accent hover:underline">
                  Galeria zdjęć →
                </Link>
              </li>
            </ul>
          </aside>

          <footer className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={RAFAL_KOWALKOWSKI_PROFILE_PATH}
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-odart-accent/50"
            >
              Wróć do profilu
            </Link>
            <Link
              href={`${SITE}/kontakt/`}
              className="inline-flex items-center justify-center rounded-full bg-odart-accent px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-950/25 transition hover:brightness-110"
            >
              Zapytaj o fotografię
            </Link>
          </footer>
        </div>
      </div>
    </OdartPublicShell>
  );
}
