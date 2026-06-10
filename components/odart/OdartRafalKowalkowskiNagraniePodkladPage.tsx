import Image from "next/image";
import Link from "next/link";
import { Jost } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { ODART_SITE_URL } from "@/lib/odartSite";
import {
  RAFAL_KOWALKOWSKI_NAGRANIE_PODKLAD_PATH,
  RAFAL_KOWALKOWSKI_NAGRANIE_PODKLAD_WP_SOURCE,
  RAFAL_KOWALKOWSKI_PREZENT_WOKALNY_PATH,
  RAFAL_KOWALKOWSKI_NAGRANIE_TELEDYSK_PATH,
  RAFAL_KOWALKOWSKI_NAGRANIE_WOKALU_PATH,
  RAFAL_KOWALKOWSKI_PROFILE_PATH,
  RAFAL_KOWALKOWSKI_TUNING_WOKALU_PATH,
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
const HERO = I.podklad;

const STEPS = [
  {
    title: "Konsultacja i planowanie",
    text: "Rozpoczynamy od konsultacji, aby lepiej zrozumieć Twoją wizję i oczekiwania co do piosenki. Omawiamy styl muzyczny, aranżację, tempo i wszelkie inne szczegóły.",
  },
  {
    title: "Wybór podkładu muzycznego",
    text: "Razem z Tobą wybieramy odpowiedni podkład muzyczny, który będzie doskonale komponować się z Twoją wokalizą i podkreślać emocje piosenki.",
  },
  {
    title: "Nagrywanie wokalu",
    text: "Przechodzimy do nagrywania wokalu, gdzie nasz doświadczony inżynier dźwięku zadba o to, aby uchwycić każdy niuans Twojego wykonania. Oferujemy profesjonalne podejście, które sprawi, że Twój głos zabrzmi klarownie i pełen ekspresji.",
  },
  {
    title: "Miksowanie i mastering",
    text: "Po zakończeniu nagrania przystępujemy do procesu miksowania, gdzie dostosowujemy poziomy dźwięku, dodajemy efekty i harmonizujemy elementy muzyczne. Następnie przechodzimy do masteringu, aby uzyskać ostateczne, doskonałe brzmienie piosenki.",
  },
  {
    title: "Dostarczenie gotowego produktu",
    text: "Gotową piosenkę dostarczamy w formacie audio, gotową do udostępnienia, dzielenia się z innymi lub wykorzystania w dowolny sposób.",
  },
] as const;

type RelatedItem =
  | { title: string; price: string; href: string; image: string }
  | { title: string; price: string; contact: true; image: string };

const RELATED: RelatedItem[] = [
  {
    title: "Nagranie wokalu",
    price: "200,00 zł",
    href: RAFAL_KOWALKOWSKI_NAGRANIE_WOKALU_PATH,
    image: I.wokal.src,
  },
  {
    title: "Tuning wokalu",
    price: "100,00 zł",
    href: RAFAL_KOWALKOWSKI_TUNING_WOKALU_PATH,
    image: I.tuning.src,
  },
  {
    title: "Prezent wokalny na ślub lub urodziny",
    price: "1000,00 zł",
    href: RAFAL_KOWALKOWSKI_PREZENT_WOKALNY_PATH,
    image: I.prezent.src,
  },
  {
    title: "Nagranie piosenki z teledyskiem",
    price: "500,00 zł",
    href: RAFAL_KOWALKOWSKI_NAGRANIE_TELEDYSK_PATH,
    image: I.teledysk.src,
  },
];

const jsonLd = buildRafalWebPageJsonLd(RAFAL_KOWALKOWSKI_NAGRANIE_PODKLAD_PATH, "Nagranie piosenki z podkładem — Rafał Kowalkowski");


export function OdartRafalKowalkowskiNagraniePodkladPage() {
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
                <span className="text-white">Nagranie z podkładem</span>
              </li>
            </ol>
          </nav>

          <header className="mt-8 border-b border-white/10 pb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-odart-accent">Nagrania</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Nagranie piosenki z podkładem
            </h1>
            <p className="mt-4 text-2xl font-semibold text-odart-accent">500,00 zł</p>
            <p className="mt-2 text-sm text-neutral-500">Dostępne — termin i zakres ustalamy po kontakcie.</p>
            <p className="mt-4 text-xs text-neutral-600">
              Opis zgodny z ofertą na{" "}
              <a
                href={RAFAL_KOWALKOWSKI_NAGRANIE_PODKLAD_WP_SOURCE}
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
              alt="Studio nagraniowe — nagranie piosenki z podkładem"
              width={HERO.w}
              height={HERO.h}
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>

          <p className="mt-10 text-lg leading-relaxed text-neutral-300">
            Oferujemy profesjonalną usługę nagrywania piosenki z podkładem muzycznym, dostosowaną do Twoich
            indywidualnych potrzeb i wizji artystycznej. Nasze doświadczone studio nagraniowe wyposażone jest w
            nowoczesny sprzęt i zespół inżynierów dźwięku, co pozwala nam zapewnić wysoką jakość nagrań.
          </p>

          <div className="mt-12 space-y-8">
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Jak wygląda nasza usługa nagrania piosenki z podkładem?
            </h2>
            {STEPS.map((step, i) => (
              <section key={step.title} aria-labelledby={`step-${i}`}>
                <h3 id={`step-${i}`} className="text-lg font-semibold text-white">
                  {i + 1}. {step.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-neutral-400">{step.text}</p>
              </section>
            ))}
            <p className="border-t border-white/10 pt-8 text-base leading-relaxed text-neutral-400">
              Nasza usługa nagrania piosenki z podkładem to nie tylko techniczne aspekty produkcji, ale również dbałość o
              artystyczne wyrażenie Twojej muzyki. Bez względu na to, czy jesteś solowym artystą, zespołem czy wokalistą
              sesyjnym, nasze studio nagraniowe jest gotowe podkreślić i uwiecznić Twoje muzyczne talenty.
            </p>
            <p className="text-base leading-relaxed text-neutral-400">
              Skorzystaj z naszej usługi, aby stworzyć profesjonalne nagranie, które zachwyci słuchaczy i w pełni odda
              Twoją artystyczną wizję. Skontaktuj się z nami, aby rozpocząć tworzenie wyjątkowej piosenki!
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
