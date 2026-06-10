import Image from "next/image";
import Link from "next/link";
import { Jost } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { ODART_SITE_URL } from "@/lib/odartSite";
import {
  RAFAL_KOWALKOWSKI_NAGRANIE_PODKLAD_PATH,
  RAFAL_KOWALKOWSKI_NAGRANIE_TELEDYSK_PATH,
  RAFAL_KOWALKOWSKI_NAGRANIE_WOKALU_PATH,
  RAFAL_KOWALKOWSKI_PREZENT_WOKALNY_PATH,
  RAFAL_KOWALKOWSKI_PREZENT_WOKALNY_WP_SOURCE,
  RAFAL_KOWALKOWSKI_PROFILE_PATH,
  RAFAL_KOWALKOWSKI_TELEDYSKI_PATH,
  RAFAL_KOWALKOWSKI_TUNING_WOKALU_PATH,
  RAFAL_KOWALKOWSKI_ZAJECIA_WOKALNE_PATH,
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
const HERO = I.prezent;

const SERVICE_INCLUDES = [
  {
    title: "Konsultacja i personalizacja",
    text: "Zaczynamy od szczegółowej konsultacji, aby lepiej zrozumieć Twoje intencje i uczucia, jakie chcesz przekazać. Razem planujemy, czy chcesz wyrazić miłość, wdzięczność czy inne emocje, które chciałbyś zawrzeć w prezencie.",
  },
  {
    title: "Nagranie wokalu",
    text: "Nagrywamy głos, wykonując piosenkę, dedykacje lub życzenia. Dbamy o to, aby nagranie było klarowne, pełne emocji i dostosowane do okoliczności.",
  },
  {
    title: "Ćwiczenia wokalne",
    text: "Jeśli zdecydujesz się na dodanie elementu muzycznego, oferujemy również profesjonalne ćwiczenia wokalne dla żony. To zapewni, że prezent będzie nie tylko pełen emocji, ale także muzycznie dopracowany.",
  },
  {
    title: "Aranżacja muzyczna (opcjonalna)",
    text: "Jeśli chcesz dodać muzykę do prezentu, współpracujemy z doświadczonymi muzykami i producentami, aby stworzyć odpowiednią aranżację muzyczną. To może być oryginalna melodia lub akompaniament do słów żony.",
  },
  {
    title: "Dostarczenie materiałów",
    text: "Po zakończeniu procesu nagrywania i ewentualnej aranżacji muzycznej dostarczamy gotowe materiały w formie plików audio lub wideo, które możesz wykorzystać do przekazania prezentu.",
  },
  {
    title: "Wrażeniowe opakowanie (opcjonalne)",
    text: "Oferujemy także opcję wrażeniowego opakowania prezentu, aby zwiększyć efekt zaskoczenia i podkreślić wyjątkowość chwili.",
  },
] as const;

const TELEDYSK_STEPS = [
  {
    title: "Konsultacja kreatywna",
    text: "Rozpoczynamy od dogłębnej rozmowy, aby zrozumieć atmosferę piosenki, jej przekaz i Twoją wizję teledysku. Wspólnie określamy koncepcję, styl wizualny, lokalizacje i ewentualne efekty specjalne.",
  },
  {
    title: "Scenariusz i planowanie",
    text: "Tworzymy scenariusz teledysku, opierając się na uzyskanych informacjach i koncepcjach. Określamy, jak poszczególne ujęcia będą współgrały z danymi fragmentami piosenki, tworząc spójną narrację wizualną.",
  },
  {
    title: "Realizacja planów zdjęciowych",
    text: "Przechodzimy do etapu realizacji, wykonując plany zdjęciowe w wybranych lokalizacjach. Nasz zespół reżyserów, operatorów kamery i techników dba o to, aby każde ujęcie było estetyczne i skomponowane zgodnie z założeniami scenariusza.",
  },
  {
    title: "Montaż i postprodukcja",
    text: "Po zakończeniu zdjęć przechodzimy do montażu, dodając efekty wizualne, korekcje kolorów i wszelkie inne elementy poprawiające jakość teledysku. Dzięki postprodukcji tworzymy zjawiskowe wizualne doświadczenie.",
  },
  {
    title: "Dostarczenie gotowego teledysku",
    text: "Finalny produkt to profesjonalnie zrealizowany teledysk, gotowy do udostępnienia online, na platformach streamingowych, w mediach społecznościowych czy na innych nośnikach.",
  },
] as const;

const RELATED = [
  {
    title: "Nagranie piosenki z podkładem",
    price: "500,00 zł",
    href: RAFAL_KOWALKOWSKI_NAGRANIE_PODKLAD_PATH,
    image: I.podklad.src,
  },
  {
    title: "Nagranie piosenki z teledyskiem",
    price: "500,00 zł",
    href: RAFAL_KOWALKOWSKI_NAGRANIE_TELEDYSK_PATH,
    image: I.teledysk.src,
  },
  {
    title: "Tuning wokalu",
    price: "100,00 zł",
    href: RAFAL_KOWALKOWSKI_TUNING_WOKALU_PATH,
    image: I.tuning.src,
  },
  {
    title: "Nagranie wokalu",
    price: "200,00 zł",
    href: RAFAL_KOWALKOWSKI_NAGRANIE_WOKALU_PATH,
    image: I.wokal.src,
  },
] as const;

const jsonLd = buildRafalWebPageJsonLd(RAFAL_KOWALKOWSKI_PREZENT_WOKALNY_PATH, "Prezent wokalny — Rafał Kowalkowski");


export function OdartRafalKowalkowskiPrezentWokalnyPage() {
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
                <span className="text-neutral-400">Nagrania</span>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-neutral-600" aria-hidden />
                <span className="text-white">Prezent wokalny</span>
              </li>
            </ol>
          </nav>

          <header className="mt-8 border-b border-white/10 pb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-odart-accent">Nagrania</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Prezent wokalny na ślub lub urodziny
            </h1>
            <p className="mt-4 text-2xl font-semibold text-odart-accent">1000,00 zł</p>
            <p className="mt-2 text-sm text-neutral-500">Dostępne — zakres i termin ustalamy indywidualnie.</p>
            <p className="mt-4 text-xs text-neutral-600">
              Opis zgodny z ofertą na{" "}
              <a
                href={RAFAL_KOWALKOWSKI_PREZENT_WOKALNY_WP_SOURCE}
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
              alt="Prezent wokalny — nagrania i studio"
              width={HERO.w}
              height={HERO.h}
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>

          <p className="mt-10 text-lg leading-relaxed text-neutral-300">
            Nasza wyjątkowa usługa „Prezent wokalny na ślub, urodziny” oferuje niezapomnianą możliwość wyrażenia uczuć
            poprzez spersonalizowane nagranie głosu w połączeniu z profesjonalnymi ćwiczeniami wokalnymi. To wyjątkowy
            sposób na stworzenie prezentu, który nie tylko zaskoczy, ale także poruszy serce obdarowywanego.
          </p>

          <div className="mt-12 space-y-8">
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Co obejmuje nasza usługa?</h2>
            {SERVICE_INCLUDES.map((item, i) => (
              <section key={item.title} aria-labelledby={`svc-${i}`}>
                <h3 id={`svc-${i}`} className="text-lg font-semibold text-white">
                  {i + 1}. {item.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-neutral-400">{item.text}</p>
              </section>
            ))}
            <p className="border-t border-white/10 pt-8 text-base leading-relaxed text-neutral-400">
              Ta usługa to nie tylko prezent dźwiękowy, ale również osobisty i emocjonalny akcent, który z pewnością
              będzie wspominany przez długi czas. Skontaktuj się z nami, aby omówić szczegóły i zarezerwować ten
              niezwykły prezent wokalny na ślub, urodziny lub inną ważną okazję.
            </p>
          </div>

          <div className="mt-14 space-y-8 border-t border-white/10 pt-12">
            <p className="text-lg leading-relaxed text-neutral-300">
              Dodanie teledysku do piosenki jest doskonałym pomysłem, aby jeszcze bardziej wzmocnić przekaz artystyczny i
              skupić uwagę odbiorców. Nasze studio filmowe i nagraniowe specjalizuje się w tworzeniu teledysków, które
              idealnie komponują się z muzyką, tworząc kompleksowe wrażenia audiowizualne.
            </p>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Jak wygląda proces stworzenia teledysku do Twojej piosenki?
            </h2>
            {TELEDYSK_STEPS.map((step, i) => (
              <section key={step.title} aria-labelledby={`vid-${i}`}>
                <h3 id={`vid-${i}`} className="text-lg font-semibold text-white">
                  {i + 1}. {step.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-neutral-400">{step.text}</p>
              </section>
            ))}
            <p className="text-base leading-relaxed text-neutral-400">
              Tworzymy teledyski, które nie tylko doskonale współgrają z piosenką, ale również stanowią samodzielne dzieła
              sztuki. Nasze podejście opiera się na kreatywności, profesjonalizmie i pasji do tworzenia unikalnych
              wrażeń wizualnych. Więcej o produkcji wideo:{" "}
              <Link href={rafalPublicHref(RAFAL_KOWALKOWSKI_TELEDYSKI_PATH)} className="text-odart-accent hover:underline">
                teledyski i filmowanie
              </Link>
              . Zajęcia wokalne:{" "}
              <Link href={rafalPublicHref(RAFAL_KOWALKOWSKI_ZAJECIA_WOKALNE_PATH)} className="text-odart-accent hover:underline">
                Kołobrzeg i online
              </Link>
              .
            </p>
          </div>

          <aside className="mt-14">
            <h2 className="text-lg font-semibold text-white">Powiązane usługi</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {RELATED.map((p) => {
                const href = "href" in p ? rafalPublicHref(p.href) : `${SITE}/kontakt/`;
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
