import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Jost } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { ODART_SITE_URL } from "@/lib/odartSite";
import {
  RAFAL_KOWALKOWSKI_KOMPOZYCJA_FOTO_ODART_HREF,
  RAFAL_KOWALKOWSKI_KOMPOZYCJA_FOTO_WP_SOURCE,
  RAFAL_KOWALKOWSKI_PRZYGODA_FOTO_PATH,
  RAFAL_KOWALKOWSKI_PROFILE_PATH,
  RAFAL_KOWALKOWSKI_TROJPODZIAL_FOTO_PATH,
  RAFAL_KOWALKOWSKI_ZLOTY_PODZIAL_FOTO_PATH,

  RAFAL_KOWALKOWSKI_KOMPOZYCJA_FOTO_PATH,} from "@/lib/rafalKowalkowskiGallery";
import { buildRafalWebPageJsonLd } from "@/lib/rafalKowalkowskiSeo";

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE = ODART_SITE_URL.replace(/\/$/, "");

const IMG_INTRO = {
  src: "https://rafalkowalkowski.pl/wp-content/uploads/2023/03/041-3x.jpg",
  w: 800,
  h: 747,
} as const;

const IMG_PHONE = {
  src: "https://rafalkowalkowski.pl/wp-content/uploads/2023/03/045x-1.jpg",
  w: 717,
  h: 717,
} as const;

const IMG_GOLDEN = {
  src: "https://rafalkowalkowski.pl/wp-content/uploads/2023/04/20230425063043.png",
  w: 1272,
  h: 882,
} as const;

const IMG_TRIANGLE = {
  src: "https://rafalkowalkowski.pl/wp-content/uploads/2023/04/20230423151626.png",
  w: 1726,
  h: 1004,
} as const;

const IMG_LEADING = {
  src: "https://rafalkowalkowski.pl/wp-content/uploads/2023/04/20230423151103.png",
  w: 1234,
  h: 887,
} as const;

const jsonLd = buildRafalWebPageJsonLd(RAFAL_KOWALKOWSKI_KOMPOZYCJA_FOTO_PATH, "Kompozycja w fotografii — Rafał Kowalkowski");


function Figure({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-white/10 bg-black/30 p-3 sm:p-4">
      {children}
      {caption ? <figcaption className="mt-3 text-center text-sm text-neutral-500">{caption}</figcaption> : null}
    </figure>
  );
}

function ArticleImage({
  src,
  w,
  h,
  alt,
  priority,
}: {
  src: string;
  w: number;
  h: number;
  alt: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      className="mx-auto h-auto w-full max-w-full object-contain"
      sizes="(max-width: 768px) 100vw, 768px"
      priority={priority}
    />
  );
}

export function OdartRafalKowalkowskiKompozycjaFotografiaPage() {
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
                <span className="text-white">Kompozycja w fotografii</span>
              </li>
            </ol>
          </nav>

          <header className="mt-8 border-b border-white/10 pb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-odart-accent">Edukacja</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Kompozycja w fotografii
            </h1>
            <time className="mt-4 block text-sm text-neutral-500" dateTime="2023-03-05">
              5 marca 2023
            </time>
            <p className="mt-2 text-xs text-neutral-600">
              Treść zgodna z wpisem na{" "}
              <a
                href={RAFAL_KOWALKOWSKI_KOMPOZYCJA_FOTO_WP_SOURCE}
                className="text-odart-accent/90 underline decoration-odart-accent/30 underline-offset-2 hover:decoration-odart-accent"
                rel="noopener noreferrer"
                target="_blank"
              >
                rafalkowalkowski.pl
              </a>
              .
            </p>
          </header>

          <article className="prose prose-invert prose-neutral mt-12 max-w-none prose-p:text-neutral-400 prose-p:leading-relaxed prose-headings:font-semibold prose-headings:text-white prose-li:text-neutral-400 prose-strong:text-neutral-200">
            <h2>Kompozycja w fotografii – główne zasady</h2>
            <p>
              Kompozycja to takie rozmieszczenie elementów w kadrze, które sprawia przyciągnięcie i zatrzymania uwagi
              odbiorcy. W sieci są w tej chwili miliardy zdjęć, ale ile z nich tak naprawdę zapamiętaliśmy, że możemy je
              odtworzyć w wyobraźni? Oczywiście wiele zdjęć będzie miało mocny temat albo przedstawiało coś, co
              interesuje daną osobę i będzie chętnie do tego wracać. Wiele osób wystawia zdjęcia np. na Instagramie, a
              nie ma pojęcia o kompozycji, bo nie jest im to do niczego potrzebne. Tu właśnie liczy się temat lub
              „ładna/ładny” dziewczyna czy chłopak. Wielu z odbiorców też nie ma świadomości kompozycji, lecz potrafią
              intuicyjnie określić, czy dane zdjęcie im się podoba czy nie. Jest też różnica w oglądaniu zdjęcia na małym
              ekranie telefonu, w porównaniu do monitora np. 24 cali czy też powieszonego na ścianie.
            </p>

            <Figure>
              <ArticleImage
                src={IMG_INTRO.src}
                w={IMG_INTRO.w}
                h={IMG_INTRO.h}
                alt="Przykład kompozycji w fotografii"
                priority
              />
            </Figure>

            <p>
              Ocenianie zdjęcia na kilkucalowym ekranie jest karkołomnym zadaniem i przynajmniej dla mnie nie ma sensu.
              Często zastanawiam się kadrując telefonem, czy czasami nie profanuję tego co wiem na temat fotografii, ale
              jest różnica w pokazywaniu zdjęcia znajomym, a takim ludziom, którzy się na tym znają. Zdjęcia przeznaczone
              do mediów społecznościowych rządzą się swoimi prawami i wcale nie muszą być poprawne pod względem
              kompozycyjnym, jakościowym czy jakikolwiek innym. Jednakże dobrze jest wiedzieć i znać podstawy kompozycji,
              bo jeżeli ktoś z Was będzie edytował zdjęcie w telefonie to okaże się, że może je wykadrować trochę lepiej.
              Problem też polega na tym, że będąc na plaży o zachodzie słońca, fotografując to zjawisko otrzymamy fotę
              podobną do wielu innych, a warto jednak wyróżnić się z tłumu i zadbać o poszczególne elementy w kadrze.
            </p>

            <Figure>
              <ArticleImage
                src={IMG_PHONE.src}
                w={IMG_PHONE.w}
                h={IMG_PHONE.h}
                alt="Oglądanie zdjęć na małym ekranie telefonu"
              />
            </Figure>

            <p className="text-center font-medium text-neutral-300">Ładna fotka, a dobre zdjęcie to spora różnica.</p>

            <p>
              Termin kompozycja oznacza „zestawienie” i może odnosić się do każdego dzieła sztuki (muzyki, fotografii,
              rzeźby, dekoracji, architektury, malarstwa, grafiki, literatury itp.), które zostało zaaranżowane lub
              zestawione świadomie i celowo. W sztukach wizualnych kompozycja jest często używana z różnymi terminami,
              takimi jak projekt, forma, wizualizacja, struktura. W projektowaniu graficznym kompozycja jest powszechnie
              określana jako układ strony, layout.
            </p>
            <p>
              Kompozycja wymaga uporządkowania rzeczy w obrębie obrazu, tak aby miał on sens dla każdego odbiorcy. Chodzi o
              to, aby przemówić na najbardziej elementarnym poziomie do naszej podświadomości. To jest to, co generuje
              czynnik „Wow!”, który przyciąga naszą uwagę.
            </p>
            <p>
              Kompozycja jest jednym z najważniejszych elementów fotografii. Odpowiednie wykorzystanie kompozycji może
              wpłynąć na sukces zdjęcia, ale to wcale nie oznacza, że nie można świadomie łamać zasad kompozycji. Na moim
              blogu przedstawię kilka reguł kompozycji, można zastosować w tworzeniu obrazów:
            </p>

            <ul>
              <li>
                <strong>zasada trójpodziału.</strong> Polega ona na podzieleniu zdjęcia na trzy równe części, w pionie i
                poziomie. Często w literaturze nazywana złotym podziałem i tak też jest określona w opcji kadrowania w
                Adobe Photoshop.{" "}
                <Link href={RAFAL_KOWALKOWSKI_TROJPODZIAL_FOTO_PATH} className="text-odart-accent hover:underline">
                  Czytaj więcej o trójpodziale →
                </Link>
              </li>
              <li>
                <strong>zasada złotej proporcji.</strong> Często nazywana boską proporcją, jest poparta matematycznym
                modelem, który opisuję w{" "}
                <Link href={RAFAL_KOWALKOWSKI_ZLOTY_PODZIAL_FOTO_PATH} className="text-odart-accent hover:underline">
                  innym artykule
                </Link>
                .
              </li>
            </ul>

            <Figure caption="Złota proporcja w kompozycji">
              <ArticleImage
                src={IMG_GOLDEN.src}
                w={IMG_GOLDEN.w}
                h={IMG_GOLDEN.h}
                alt="Ilustracja zasady złotej proporcji"
              />
            </Figure>

            <ul>
              <li>
                <strong>zasada trójkątów.</strong> Przekątna od jednego rogu zdjęcia do drugiego rogu zdjęcia z
                wyprowadzonymi liniami z pozostałych rogów przecinającymi przekątną pod kątem prostym tworzą trójkąty.
              </li>
            </ul>

            <Figure caption="Zasada trójkątów w kadrze">
              <ArticleImage src={IMG_TRIANGLE.src} w={IMG_TRIANGLE.w} h={IMG_TRIANGLE.h} alt="Schemat trójkątów w kompozycji" />
            </Figure>

            <ul>
              <li>
                <strong>linie wiodące</strong> w fotografii to elementy kompozycyjne, które kierują oko widza w stronę
                głównego tematu lub punktu zainteresowania na zdjęciu. Linie te są zazwyczaj proste lub zakrzywione i mogą
                być tworzone przez różne obiekty, takie jak drogi, budynki, drzewa, ogrodzenia lub inne elementy, które
                tworzą naturalną linię lub kształt.
              </li>
            </ul>

            <Figure caption="Linie wiodące w fotografii">
              <ArticleImage
                src={IMG_LEADING.src}
                w={IMG_LEADING.w}
                h={IMG_LEADING.h}
                alt="Przykład linii wiodących w kompozycji"
              />
            </Figure>
          </article>

          <aside className="mt-12 rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm font-semibold text-white">Szczegółowe artykuły</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href={RAFAL_KOWALKOWSKI_PRZYGODA_FOTO_PATH} className="font-semibold text-odart-accent hover:underline">
                  Przygoda z fotografią →
                </Link>
              </li>
              <li>
                <Link href={RAFAL_KOWALKOWSKI_TROJPODZIAL_FOTO_PATH} className="font-semibold text-odart-accent hover:underline">
                  Kompozycja – Trójpodział →
                </Link>
              </li>
              <li>
                <Link href={RAFAL_KOWALKOWSKI_ZLOTY_PODZIAL_FOTO_PATH} className="font-semibold text-odart-accent hover:underline">
                  Złota proporcja w fotografii →
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
