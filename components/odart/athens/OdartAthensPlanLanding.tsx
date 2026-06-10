"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Car,
  ChevronDown,
  Clock,
  Coffee,
  Euro,
  Footprints,
  Landmark,
  MapPinned,
  Mountain,
  Package,
  Ship,
  ShoppingBag,
  Sun,
  Ticket,
  UtensilsCrossed,
  Users,
  Waves,
  Home,
  Droplets,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import {
  costsDisclaimer,
  costsTableRows,
  day1Attractions,
  day1Costs,
  day1Lead,
  day1MapPoints,
  day1Schedule,
  day1StepsLabel,
  day1Title,
  day2Attractions,
  day2Costs,
  day2Lead,
  day2MapPoints,
  day2Schedule,
  day2StepsLabel,
  day2Title,
  day2TicketNote,
  day3Attractions,
  day3BringItems,
  day3Costs,
  day3Lead,
  day3MapPoints,
  day3OnSiteBuying,
  day3Restaurants,
  day3Schedule,
  day3StepsLabel,
  day3Title,
  day3TransportSteps,
  day3TransportSummary,
  day4Attractions,
  day4Costs,
  day4DelphiOnSiteTips,
  day4DelphiTransportTips,
  day4Lead,
  day4MapPoints,
  day4Schedule,
  day4StepsLabel,
  day4Title,
  day5Beaches,
  day5Costs,
  day5HowToGet,
  day5Lead,
  day5Lunch,
  day5MapPoints,
  day5OnIsland,
  day5Schedule,
  day5StepsLabel,
  day5Title,
  day6AreopagusNote,
  day6Attractions,
  day6Costs,
  day6Lead,
  day6LikavitosHow,
  day6MapPoints,
  day6Schedule,
  day6StepsLabel,
  day6Title,
  day6WhyFinale,
  externalLinks,
  faqItems,
  heroImageAlt,
  heroImageUrl,
  hotelArea,
  hotelStreetLine,
  introParagraphs,
  overviewMapPoints,
  practicalTips,
  seoKeywords,
  type PracticalTip,
  type ScheduleItem,
} from "@/lib/athensPlanData";
import { LazyAthensLeafletMap } from "./AthensLeafletMap";

const SITE = ODART_SITE_URL.replace(/\/$/, "");

/** EDIT: adres e-mail w przycisku CTA */
const CONTACT_MAILTO =
  "mailto:biuro@odart.pl?subject=Zapytanie%20o%20stron%C4%99%20%2F%20landing%20ODART";

const NAV_LINKS = [
  { href: "#wstep", label: "Wstęp" },
  { href: "#mapa-ogolna", label: "Mapa ogólna" },
  { href: "#dzien-1", label: "Dzień 1" },
  { href: "#mapa-dzien-1", label: "Mapa 1" },
  { href: "#dzien-2", label: "Dzień 2" },
  { href: "#mapa-dzien-2", label: "Mapa 2" },
  { href: "#dzien-3", label: "Dzień 3" },
  { href: "#mapa-dzien-3", label: "Mapa 3" },
  { href: "#dzien-4", label: "Dzień 4" },
  { href: "#mapa-dzien-4", label: "Mapa 4" },
  { href: "#dzien-5", label: "Dzień 5" },
  { href: "#mapa-dzien-5", label: "Mapa 5" },
  { href: "#dzien-6", label: "Dzień 6" },
  { href: "#mapa-dzien-6", label: "Mapa 6" },
  { href: "#praktyczne", label: "Praktyczne" },
  { href: "#koszty", label: "Koszty" },
  { href: "#kroki", label: "Kroki" },
  { href: "#faq", label: "FAQ" },
  { href: "#kontakt-odart", label: "ODART" },
] as const;

function scheduleIcon(item: ScheduleItem) {
  const k = item.icon ?? "default";
  const cls = "h-5 w-5 shrink-0 text-[#4a6fa5]";
  switch (k) {
    case "walk":
      return <Footprints className={cls} aria-hidden />;
    case "sight":
      return <Landmark className={cls} aria-hidden />;
    case "food":
      return <UtensilsCrossed className={cls} aria-hidden />;
    case "museum":
      return <Building2 className={cls} aria-hidden />;
    case "hill":
      return <Mountain className={cls} aria-hidden />;
    case "car":
      return <Car className={cls} aria-hidden />;
    case "waves":
      return <Waves className={cls} aria-hidden />;
    case "coffee":
      return <Coffee className={cls} aria-hidden />;
    case "ship":
      return <Ship className={cls} aria-hidden />;
    default:
      return <Clock className={cls} aria-hidden />;
  }
}

function practicalIcon(tip: PracticalTip["icon"]) {
  const cls = "h-6 w-6 text-[#2a4a6e]";
  switch (tip) {
    case "home":
      return <Home className={cls} aria-hidden />;
    case "footprints":
      return <Footprints className={cls} aria-hidden />;
    case "droplet":
      return <Droplets className={cls} aria-hidden />;
    case "ticket":
      return <Ticket className={cls} aria-hidden />;
    case "sun":
      return <Sun className={cls} aria-hidden />;
    case "users":
      return <Users className={cls} aria-hidden />;
    default:
      return <MapPinned className={cls} aria-hidden />;
  }
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const n = ref.current;
    if (!n) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setOn(true);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(n);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        on ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function OdartAthensPlanLanding() {
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    return () => {
      html.style.scrollBehavior = prev;
    };
  }, []);

  return (
    <main className="bg-[#f4f1eb] text-[#1a2433] antialiased">
      {/* Sticky in-page nav — EDIT: top-* jeśli nachodzi na globalny header ODART */}
      <nav
        className="sticky z-40 border-b border-[#1c2d44]/10 bg-[#f4f1eb]/95 shadow-sm backdrop-blur-md"
        style={{ top: "var(--athens-subnav-top, 5.5rem)" }}
        aria-label="Nawigacja po sekcjach planu"
      >
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-3 scrollbar-thin lg:px-6">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-[#1c2d44]/80 transition-colors hover:bg-[#dfe9f4] hover:text-[#1c2d44] md:text-sm"
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <header
        id="top"
        className="relative isolate min-h-[85vh] overflow-hidden md:min-h-[78vh]"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImageUrl}
            alt={heroImageAlt}
            fill
            priority
            fetchPriority="high"
            className="object-cover object-[center_35%]"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#1c2d44]/75 via-[#1c2d44]/45 to-[#f4f1eb]"
            aria-hidden
          />
        </div>
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col justify-end px-4 pb-16 pt-32 md:pb-20 md:pt-40 lg:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c5d9ef]">
            Plan wycieczki · grupa ok. 11 osób · ul. {hotelStreetLine}, {hotelArea}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-sm md:text-5xl lg:text-[3.25rem]">
            Ateny w 6 dni – gotowy plan zwiedzania dzień po dniu
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
            Ateny, Delfy, Vouliagmeni, Aegina i finał z Agorą oraz Likavitos o zachodzie — mapy, koszty
            i logistyka pod grupę ok. 11 osób.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#mapa-ogolna"
              className="inline-flex items-center justify-center rounded-xl bg-[#f4f1eb] px-5 py-3.5 text-sm font-semibold text-[#1c2d44] shadow-lg transition hover:bg-white md:text-base"
            >
              Mapa ogólna
            </a>
            <a
              href="#dzien-1"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/80 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 md:text-base"
            >
              Dzień 1
            </a>
            <a
              href="#dzien-2"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/80 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 md:text-base"
            >
              Dzień 2
            </a>
            <a
              href="#dzien-3"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/80 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 md:text-base"
            >
              Dzień 3
            </a>
            <a
              href="#dzien-4"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/80 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 md:text-base"
            >
              Dzień 4
            </a>
            <a
              href="#dzien-5"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/80 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 md:text-base"
            >
              Dzień 5
            </a>
            <a
              href="#dzien-6"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/80 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 md:text-base"
            >
              Dzień 6
            </a>
          </div>
          <p className="mt-8 max-w-xl text-sm text-white/70">
            {seoKeywords.slice(0, 4).join(" · ")}
          </p>
        </div>
      </header>

      {/* Wstęp */}
      <section
        id="wstep"
        className="scroll-mt-28 border-t border-[#1c2d44]/5 bg-[#f4f1eb] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-[#1c2d44] md:text-4xl">
              Sześć dni: miasto, Delfy, relaks i finał z widokiem
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#3d4d5c]">
              Od lekkiego startu i Akropolu po{" "}
              <strong className="font-semibold text-[#1c2d44]">Delfy, wodę, wyspę i zamknięcie na Agorze</strong>{" "}
              — jeden spójny rytm dla grupy.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-3xl space-y-5 text-base leading-relaxed text-[#3d4d5c]">
            {introParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>
      </section>

      <section
        id="mapa-ogolna"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-white px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Cały plan w skrócie
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#1c2d44] md:text-3xl">
                Mapa ogólna — baza i główne kierunki
              </h2>
              <p className="mt-4 text-[#3d4d5c]">
                Pinezki: adres{" "}
                <strong className="font-semibold text-[#1c2d44]">
                  ul. {hotelStreetLine}, {hotelArea}
                </strong>
                , Akropol, Vouliagmeni, porty, Aegina oraz Delfy. To nie jest trasa do jazdy po
                kolei — chodzi o orientację w skali całego wyjazdu. Współrzędne bazy możesz
                doprecyzować w pliku danych strony.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#3d4d5c]">
                Przycisk „Moja pozycja (GPS)” prosi przeglądarkę o lokalizację i dokłada na mapie
                przybliżony punkt, w którym jesteś (np. z telefonu w Atenach). Ten sam przycisk jest
                na mapach dni 1–6 — w każdej sekcji możesz odświeżyć widok względem trasy dnia. Działa
                tylko po wyrażeniu zgody; pozycja zależy od GPS i może odbiegać od rzeczywistości o
                kilka do kilkudziesięciu metrów.
              </p>
              <ol className="mt-6 space-y-2 text-sm text-[#3d4d5c]">
                {overviewMapPoints.map((p) => (
                  <li key={p.order}>
                    <span className="font-semibold text-[#1c2d44]">{p.order}.</span> {p.title}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <LazyAthensLeafletMap
                mapInstanceId="map-athens-overview"
                points={overviewMapPoints}
                showRoute={false}
              />
              <p className="mt-4 text-center text-xs text-[#3d4d5c]/80">
                OpenStreetMap · bez linii trasy · opcjonalnie Twoja pozycja z GPS
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Dzień 1 */}
      <section
        id="dzien-1"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-gradient-to-b from-white to-[#eef3f9] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Dzień pierwszy
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-[#1c2d44] md:text-3xl">
                {day1Title}
              </h2>
              <p className="mt-4 text-[#3d4d5c]">{day1Lead}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">Kroki</p>
                  <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-[#1c2d44]">
                    <Footprints className="h-5 w-5 text-[#4a6fa5]" aria-hidden />
                    {day1StepsLabel}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">
                    Koszt wejść
                  </p>
                  <p className="mt-1 flex items-start gap-2 text-sm font-medium leading-snug text-[#1c2d44]">
                    <Euro className="mt-0.5 h-5 w-5 shrink-0 text-[#4a6fa5]" aria-hidden />
                    {day1Costs}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-6 font-display text-xl font-semibold text-[#1c2d44]">
                Harmonogram
              </h3>
              <ol className="space-y-0">
                {day1Schedule.map((item, idx) => (
                  <li
                    key={`${item.time}-${idx}`}
                    className="relative flex gap-4 border-l-2 border-[#c5d9ef] pb-8 pl-6 last:border-transparent last:pb-0"
                  >
                    <span
                      className="absolute -left-[9px] top-1 flex h-4 w-4 rounded-full border-2 border-[#4a6fa5] bg-white"
                      aria-hidden
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-[#1c2d44]/5 sm:flex-row sm:items-center">
                      <div className="flex shrink-0 items-center gap-2 sm:w-36">
                        {scheduleIcon(item)}
                        <time className="font-mono text-sm font-bold text-[#1c2d44]">{item.time}</time>
                      </div>
                      <span className="text-sm leading-snug text-[#3d4d5c] md:text-base">
                        {item.label}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="mx-auto mt-16 max-w-6xl">
            <h3 className="font-display text-xl font-semibold text-[#1c2d44] md:text-2xl">
              Atrakcje dnia 1
            </h3>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {day1Attractions.map((a) => (
                <article
                  key={a.title}
                  className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-[0_12px_40px_-16px_rgba(28,45,68,0.15)] transition hover:shadow-[0_20px_50px_-16px_rgba(28,45,68,0.2)]"
                >
                  <h4 className="font-display text-lg font-semibold text-[#1c2d44]">{a.title}</h4>
                  <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-[#3d4d5c]">
                    {a.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Mapa dzień 1 — naprzemiennie: na desktopie mapa po prawej */}
      <section
        id="mapa-dzien-1"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-[#f4f1eb] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="order-2 lg:order-1">
              <LazyAthensLeafletMap mapInstanceId="map-athens-day-1" points={day1MapPoints} />
              <p className="mt-4 text-center text-xs text-[#3d4d5c]/80">
                OpenStreetMap · trasa orientacyjna · kliknij pinezkę, by zobaczyć opis
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Mapa dnia 1
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#1c2d44] md:text-3xl">
                Trasa: Petralona (baza) → centrum → antyki → zakupy
              </h2>
              <p className="mt-4 text-[#3d4d5c]">
                Lekki dzień 1 bez muzeum i bez Likavitos — numery to kolejność dnia. Likavitos jest w
                planie dnia 6. Współrzędne i sklep do zakupów edytujesz w pliku danych.
              </p>
              <ol className="mt-6 space-y-2 text-sm text-[#3d4d5c]">
                {day1MapPoints.map((p) => (
                  <li key={p.order}>
                    <span className="font-semibold text-[#1c2d44]">{p.order}.</span> {p.title}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Dzień 2 */}
      <section
        id="dzien-2"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-gradient-to-b from-[#eef3f9] to-white px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
            <div className="lg:order-2">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Dzień drugi
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-[#1c2d44] md:text-3xl">
                {day2Title}
              </h2>
              <p className="mt-4 text-[#3d4d5c]">{day2Lead}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">Kroki</p>
                  <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-[#1c2d44]">
                    <Footprints className="h-5 w-5 text-[#4a6fa5]" aria-hidden />
                    {day2StepsLabel}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">
                    Bilety dzień 2
                  </p>
                  <p className="mt-1 text-sm font-medium leading-snug text-[#1c2d44]">{day2Costs}</p>
                </div>
              </div>
              <p className="mt-4 rounded-xl bg-[#dfe9f4]/60 px-4 py-3 text-sm text-[#3d4d5c]">
                {day2TicketNote}
              </p>
            </div>
            <div className="lg:order-1">
              <h3 className="mb-6 font-display text-xl font-semibold text-[#1c2d44]">
                Harmonogram
              </h3>
              <ol className="space-y-0">
                {day2Schedule.map((item, idx) => (
                  <li
                    key={`${item.time}-d2-${idx}`}
                    className="relative flex gap-4 border-l-2 border-[#c5d9ef] pb-8 pl-6 last:border-transparent last:pb-0"
                  >
                    <span
                      className="absolute -left-[9px] top-1 flex h-4 w-4 rounded-full border-2 border-[#4a6fa5] bg-white"
                      aria-hidden
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-[#1c2d44]/5 sm:flex-row sm:items-center">
                      <div className="flex shrink-0 items-center gap-2 sm:w-36">
                        {scheduleIcon(item)}
                        <time className="font-mono text-sm font-bold text-[#1c2d44]">{item.time}</time>
                      </div>
                      <span className="text-sm leading-snug text-[#3d4d5c] md:text-base">
                        {item.label}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="mx-auto mt-16 max-w-6xl">
            <h3 className="font-display text-xl font-semibold text-[#1c2d44] md:text-2xl">
              Atrakcje dnia 2
            </h3>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {day2Attractions.map((a) => (
                <article
                  key={a.title}
                  className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-[0_12px_40px_-16px_rgba(28,45,68,0.15)] transition hover:shadow-[0_20px_50px_-16px_rgba(28,45,68,0.2)]"
                >
                  <h4 className="font-display text-lg font-semibold text-[#1c2d44]">{a.title}</h4>
                  <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-[#3d4d5c]">
                    {a.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Mapa dzień 2 */}
      <section
        id="mapa-dzien-2"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-white px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Mapa dnia 2
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#1c2d44] md:text-3xl">
                Akropol, muzeum i serce starego miasta
              </h2>
              <p className="mt-4 text-[#3d4d5c]">
                Od wzgórza przez muzeum po Plakę i Monastiraki — wieczorem zostawiamy miejsce na
                rooftop z widokiem na oświetlony Akropol.
              </p>
              <ol className="mt-6 space-y-2 text-sm text-[#3d4d5c]">
                {day2MapPoints.map((p) => (
                  <li key={p.order}>
                    <span className="font-semibold text-[#1c2d44]">{p.order}.</span> {p.title}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <LazyAthensLeafletMap mapInstanceId="map-athens-day-2" points={day2MapPoints} />
              <p className="mt-4 text-center text-xs text-[#3d4d5c]/80">
                OpenStreetMap · trasa orientacyjna
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Dzień 3 */}
      <section
        id="dzien-3"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-gradient-to-b from-white to-[#eef3f9] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Dzień trzeci
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-[#1c2d44] md:text-3xl">
                {day3Title}
              </h2>
              <p className="mt-4 text-[#3d4d5c]">{day3Lead}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">Kroki</p>
                  <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-[#1c2d44]">
                    <Footprints className="h-5 w-5 text-[#4a6fa5]" aria-hidden />
                    {day3StepsLabel}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">
                    Koszt orientacyjny
                  </p>
                  <p className="mt-1 flex items-start gap-2 text-sm font-medium leading-snug text-[#1c2d44]">
                    <Euro className="mt-0.5 h-5 w-5 shrink-0 text-[#4a6fa5]" aria-hidden />
                    {day3Costs}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-6 font-display text-xl font-semibold text-[#1c2d44]">
                Harmonogram
              </h3>
              <ol className="space-y-0">
                {day3Schedule.map((item, idx) => (
                  <li
                    key={`d3-${item.time}-${idx}`}
                    className="relative flex gap-4 border-l-2 border-[#c5d9ef] pb-8 pl-6 last:border-transparent last:pb-0"
                  >
                    <span
                      className="absolute -left-[9px] top-1 flex h-4 w-4 rounded-full border-2 border-[#4a6fa5] bg-white"
                      aria-hidden
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-[#1c2d44]/5 sm:flex-row sm:items-center">
                      <div className="flex shrink-0 items-center gap-2 sm:w-40">
                        {scheduleIcon(item)}
                        <time className="font-mono text-sm font-bold text-[#1c2d44]">{item.time}</time>
                      </div>
                      <span className="text-sm leading-snug text-[#3d4d5c] md:text-base">
                        {item.label}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="mx-auto mt-16 max-w-6xl">
            <h3 className="font-display text-xl font-semibold text-[#1c2d44] md:text-2xl">
              Atrakcje dnia 3
            </h3>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {day3Attractions.map((a) => (
                <article
                  key={a.title}
                  className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-[0_12px_40px_-16px_rgba(28,45,68,0.15)]"
                >
                  <h4 className="font-display text-lg font-semibold text-[#1c2d44]">{a.title}</h4>
                  <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-[#3d4d5c]">
                    {a.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
          <div className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dfe9f4]">
                  <Car className="h-6 w-6 text-[#2a4a6e]" aria-hidden />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#1c2d44]">
                  Jak dojechać (11 osób)
                </h3>
              </div>
              <p className="mt-4 text-sm font-medium text-[#1c2d44]">{day3TransportSummary}</p>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[#3d4d5c]">
                {day3TransportSteps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dfe9f4]">
                  <Package className="h-6 w-6 text-[#2a4a6e]" aria-hidden />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#1c2d44]">Co zabrać</h3>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {day3BringItems.map((x) => (
                  <li
                    key={x}
                    className="rounded-full border border-[#1c2d44]/15 bg-[#f4f1eb] px-3 py-1.5 text-sm text-[#1c2d44]"
                  >
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dfe9f4]">
                  <ShoppingBag className="h-6 w-6 text-[#2a4a6e]" aria-hidden />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#1c2d44]">
                  Czy coś kupisz na miejscu?
                </h3>
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-relaxed text-[#3d4d5c]">
                {day3OnSiteBuying.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dfe9f4]">
                  <UtensilsCrossed className="h-6 w-6 text-[#2a4a6e]" aria-hidden />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#1c2d44]">Restauracje</h3>
              </div>
              <ul className="mt-4 space-y-3">
                {day3Restaurants.map((r) => (
                  <li key={r.name} className="border-b border-[#1c2d44]/10 pb-3 last:border-0 last:pb-0">
                    <span className="font-semibold text-[#1c2d44]">{r.name}</span>
                    <p className="mt-1 text-sm text-[#3d4d5c]">{r.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      <section
        id="mapa-dzien-3"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-[#f4f1eb] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="order-2 lg:order-1">
              <LazyAthensLeafletMap mapInstanceId="map-athens-day-3" points={day3MapPoints} />
              <p className="mt-4 text-center text-xs text-[#3d4d5c]/80">
                OpenStreetMap · baza (Petralona) → Vouliagmeni i okolica (trasa orientacyjna)
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Mapa dnia 3
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#1c2d44] md:text-3xl">
                Jezioro, morze i lokale
              </h2>
              <p className="mt-4 text-[#3d4d5c]">
                Punkty obejmują start przy ul. {hotelStreetLine}, jezioro Vouliagmeni, orientacyjną
                plażę oraz trzy wybrane restauracje — współrzędne edytujesz w pliku danych.
              </p>
              <ol className="mt-6 space-y-2 text-sm text-[#3d4d5c]">
                {day3MapPoints.map((p) => (
                  <li key={p.order}>
                    <span className="font-semibold text-[#1c2d44]">{p.order}.</span> {p.title}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Dzień 4 */}
      <section
        id="dzien-4"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-gradient-to-b from-[#eef3f9] to-white px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
            <div className="lg:order-2">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Dzień czwarty
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-[#1c2d44] md:text-3xl">
                {day4Title}
              </h2>
              <p className="mt-4 text-[#3d4d5c]">{day4Lead}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">Kroki</p>
                  <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-[#1c2d44]">
                    <Footprints className="h-5 w-5 text-[#4a6fa5]" aria-hidden />
                    {day4StepsLabel}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">
                    Koszt orientacyjny
                  </p>
                  <p className="mt-1 text-sm font-medium leading-snug text-[#1c2d44]">{day4Costs}</p>
                </div>
              </div>
            </div>
            <div className="lg:order-1">
              <h3 className="mb-6 font-display text-xl font-semibold text-[#1c2d44]">
                Harmonogram
              </h3>
              <ol className="space-y-0">
                {day4Schedule.map((item, idx) => (
                  <li
                    key={`d4-${item.time}-${idx}`}
                    className="relative flex gap-4 border-l-2 border-[#c5d9ef] pb-8 pl-6 last:border-transparent last:pb-0"
                  >
                    <span
                      className="absolute -left-[9px] top-1 flex h-4 w-4 rounded-full border-2 border-[#4a6fa5] bg-white"
                      aria-hidden
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-[#1c2d44]/5 sm:flex-row sm:items-center">
                      <div className="flex shrink-0 items-center gap-2 sm:w-40">
                        {scheduleIcon(item)}
                        <time className="font-mono text-sm font-bold text-[#1c2d44]">{item.time}</time>
                      </div>
                      <span className="text-sm leading-snug text-[#3d4d5c] md:text-base">
                        {item.label}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="mx-auto mt-16 max-w-6xl">
            <h3 className="font-display text-xl font-semibold text-[#1c2d44] md:text-2xl">
              Atrakcje dnia 4
            </h3>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {day4Attractions.map((a) => (
                <article
                  key={a.title}
                  className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-[0_12px_40px_-16px_rgba(28,45,68,0.15)]"
                >
                  <h4 className="font-display text-lg font-semibold text-[#1c2d44]">{a.title}</h4>
                  <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-[#3d4d5c]">
                    {a.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
          <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dfe9f4]">
                  <Car className="h-6 w-6 text-[#2a4a6e]" aria-hidden />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#1c2d44]">Transport do Delf</h3>
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-relaxed text-[#3d4d5c]">
                {day4DelphiTransportTips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dfe9f4]">
                  <MapPinned className="h-6 w-6 text-[#2a4a6e]" aria-hidden />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#1c2d44]">W Delfach</h3>
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-relaxed text-[#3d4d5c]">
                {day4DelphiOnSiteTips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      <section
        id="mapa-dzien-4"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-white px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Mapa dnia 4
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#1c2d44] md:text-3xl">
                Ateny → Delfy (schemat trasy)
              </h2>
              <p className="mt-4 text-[#3d4d5c]">
                Linia łączy bazę z głównymi punktami w Delfach — to uproszczenie; realnie pokonujecie
                trasę autokarem. Współrzędne i godziny edytujesz w pliku danych.
              </p>
              <ol className="mt-6 space-y-2 text-sm text-[#3d4d5c]">
                {day4MapPoints.map((p) => (
                  <li key={p.order}>
                    <span className="font-semibold text-[#1c2d44]">{p.order}.</span> {p.title}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <LazyAthensLeafletMap mapInstanceId="map-athens-day-4" points={day4MapPoints} />
              <p className="mt-4 text-center text-xs text-[#3d4d5c]/80">
                OpenStreetMap · długi odcinek drogowy — orientacyjnie
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Dzień 5 */}
      <section
        id="dzien-5"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-gradient-to-b from-white to-[#eef3f9] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Dzień piąty
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-[#1c2d44] md:text-3xl">
                {day5Title}
              </h2>
              <p className="mt-4 text-[#3d4d5c]">{day5Lead}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">Kroki</p>
                  <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-[#1c2d44]">
                    <Footprints className="h-5 w-5 text-[#4a6fa5]" aria-hidden />
                    {day5StepsLabel}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">
                    Koszt orientacyjny
                  </p>
                  <p className="mt-1 flex items-start gap-2 text-sm font-medium leading-snug text-[#1c2d44]">
                    <Euro className="mt-0.5 h-5 w-5 shrink-0 text-[#4a6fa5]" aria-hidden />
                    {day5Costs}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-6 font-display text-xl font-semibold text-[#1c2d44]">
                Harmonogram
              </h3>
              <ol className="space-y-0">
                {day5Schedule.map((item, idx) => (
                  <li
                    key={`d5-${item.time}-${idx}`}
                    className="relative flex gap-4 border-l-2 border-[#c5d9ef] pb-8 pl-6 last:border-transparent last:pb-0"
                  >
                    <span
                      className="absolute -left-[9px] top-1 flex h-4 w-4 rounded-full border-2 border-[#4a6fa5] bg-white"
                      aria-hidden
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-[#1c2d44]/5 sm:flex-row sm:items-center">
                      <div className="flex shrink-0 items-center gap-2 sm:w-44">
                        {scheduleIcon(item)}
                        <time className="font-mono text-sm font-bold text-[#1c2d44]">{item.time}</time>
                      </div>
                      <span className="text-sm leading-snug text-[#3d4d5c] md:text-base">
                        {item.label}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dfe9f4]">
                  <Car className="h-6 w-6 text-[#2a4a6e]" aria-hidden />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#1c2d44]">Jak się dostać</h3>
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-relaxed text-[#3d4d5c]">
                {day5HowToGet.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
              <p className="mt-4 rounded-lg bg-[#dfe9f4]/50 px-3 py-2 text-sm text-[#1c2d44]">
                Ubery: 3 auta · prom ok. 10–20 € (sprawdź aktualne taryfy) · rejs ok. 40–60 min.
              </p>
            </div>
            <div className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dfe9f4]">
                  <MapPinned className="h-6 w-6 text-[#2a4a6e]" aria-hidden />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#1c2d44]">
                  Co robić na wyspie
                </h3>
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-relaxed text-[#3d4d5c]">
                {day5OnIsland.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dfe9f4]">
                  <Waves className="h-6 w-6 text-[#2a4a6e]" aria-hidden />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#1c2d44]">Plaże</h3>
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-relaxed text-[#3d4d5c]">
                {day5Beaches.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dfe9f4]">
                  <UtensilsCrossed className="h-6 w-6 text-[#2a4a6e]" aria-hidden />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#1c2d44]">Lunch</h3>
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-relaxed text-[#3d4d5c]">
                {day5Lunch.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      <section
        id="mapa-dzien-5"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-[#f4f1eb] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="order-2 lg:order-1">
              <LazyAthensLeafletMap mapInstanceId="map-athens-day-5" points={day5MapPoints} />
              <p className="mt-4 text-center text-xs text-[#3d4d5c]/80">
                OpenStreetMap · linia obejmuje też prom (schematycznie) — Aegina na zachód od Pireusu
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Mapa dnia 5
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#1c2d44] md:text-3xl">
                Baza (Petralona), Pireus i Aegina
              </h2>
              <p className="mt-4 text-[#3d4d5c]">
                Punkty: baza, port w Pireusie, Aegina i plaże. Odcinek morski na mapie jest
                uproszczony — w praktyce pokonujecie go promem.
              </p>
              <ol className="mt-6 space-y-2 text-sm text-[#3d4d5c]">
                {day5MapPoints.map((p) => (
                  <li key={p.order}>
                    <span className="font-semibold text-[#1c2d44]">{p.order}.</span> {p.title}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Dzień 6 */}
      <section
        id="dzien-6"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-gradient-to-b from-[#eef3f9] to-white px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
            <div className="lg:order-2">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Dzień szósty
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-[#1c2d44] md:text-3xl">
                {day6Title}
              </h2>
              <p className="mt-4 text-[#3d4d5c]">{day6Lead}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">Kroki</p>
                  <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-[#1c2d44]">
                    <Footprints className="h-5 w-5 text-[#4a6fa5]" aria-hidden />
                    {day6StepsLabel}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">
                    Koszt orientacyjny
                  </p>
                  <p className="mt-1 text-sm font-medium leading-snug text-[#1c2d44]">{day6Costs}</p>
                </div>
              </div>
            </div>
            <div className="lg:order-1">
              <h3 className="mb-6 font-display text-xl font-semibold text-[#1c2d44]">
                Harmonogram
              </h3>
              <ol className="space-y-0">
                {day6Schedule.map((item, idx) => (
                  <li
                    key={`d6-${item.time}-${idx}`}
                    className="relative flex gap-4 border-l-2 border-[#c5d9ef] pb-8 pl-6 last:border-transparent last:pb-0"
                  >
                    <span
                      className="absolute -left-[9px] top-1 flex h-4 w-4 rounded-full border-2 border-[#4a6fa5] bg-white"
                      aria-hidden
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-[#1c2d44]/5 sm:flex-row sm:items-center">
                      <div className="flex shrink-0 items-center gap-2 sm:w-44">
                        {scheduleIcon(item)}
                        <time className="font-mono text-sm font-bold text-[#1c2d44]">{item.time}</time>
                      </div>
                      <span className="text-sm leading-snug text-[#3d4d5c] md:text-base">
                        {item.label}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="mx-auto mt-16 max-w-6xl">
            <h3 className="font-display text-xl font-semibold text-[#1c2d44] md:text-2xl">
              Atrakcje dnia 6
            </h3>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {day6Attractions.map((a) => (
                <article
                  key={a.title}
                  className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-[0_12px_40px_-16px_rgba(28,45,68,0.15)]"
                >
                  <h4 className="font-display text-lg font-semibold text-[#1c2d44]">{a.title}</h4>
                  <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-[#3d4d5c]">
                    {a.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
          <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dfe9f4]">
                  <Mountain className="h-6 w-6 text-[#2a4a6e]" aria-hidden />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#1c2d44]">
                  Jak wejść na Likavitos
                </h3>
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-relaxed text-[#3d4d5c]">
                {day6LikavitosHow.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dfe9f4]">
                  <Sun className="h-6 w-6 text-[#2a4a6e]" aria-hidden />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#1c2d44]">
                  Dlaczego to dobry finał
                </h3>
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-relaxed text-[#3d4d5c]">
                {day6WhyFinale.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mx-auto mt-6 max-w-6xl">
            <div className="rounded-2xl border border-[#1c2d44]/8 bg-[#dfe9f4]/40 p-6">
              <h3 className="font-display text-base font-semibold text-[#1c2d44]">Areopag — uwagi</h3>
              <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-[#3d4d5c]">
                {day6AreopagusNote.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      <section
        id="mapa-dzien-6"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-white px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Mapa dnia 6
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#1c2d44] md:text-3xl">
                Psiri, Agora, Monastiraki, Likavitos
              </h2>
              <p className="mt-4 text-[#3d4d5c]">
                Kolejność spacerowa w centrum — linia łączy kluczowe punkty do finału na szczycie.
              </p>
              <ol className="mt-6 space-y-2 text-sm text-[#3d4d5c]">
                {day6MapPoints.map((p) => (
                  <li key={p.order}>
                    <span className="font-semibold text-[#1c2d44]">{p.order}.</span> {p.title}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <LazyAthensLeafletMap mapInstanceId="map-athens-day-6" points={day6MapPoints} />
              <p className="mt-4 text-center text-xs text-[#3d4d5c]/80">OpenStreetMap</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Praktyczne */}
      <section
        id="praktyczne"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-[#f4f1eb] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-display text-3xl font-bold text-[#1c2d44] md:text-4xl">
              Praktyczne informacje
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-[#3d4d5c]">
              Krótkie przypomnienia przed wyjazdem — żeby dzień płynął spokojnie, także w większej
              grupie.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {practicalTips.map((tip) => (
                <div
                  key={tip.title}
                  className="flex gap-4 rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#dfe9f4]">
                    {practicalIcon(tip.icon)}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[#1c2d44]">{tip.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#3d4d5c]">{tip.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Koszty */}
      <section
        id="koszty"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-gradient-to-b from-white to-[#eef3f9] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center font-display text-3xl font-bold text-[#1c2d44] md:text-4xl">
              Koszty — orientacyjnie
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-[#3d4d5c]">
              Zestawienie ułatwia budżet grupowy. Kwoty w euro są szacunkowe —{" "}
              <strong className="font-semibold text-[#1c2d44]">zaktualizuj je przed wyjazdem</strong>.
            </p>
            <div className="mt-10 overflow-hidden rounded-2xl border border-[#1c2d44]/10 bg-white shadow-lg">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#1c2d44]/10 bg-[#1c2d44] text-white">
                    <th className="px-5 py-4 font-semibold">Dzień</th>
                    <th className="hidden px-5 py-4 font-semibold sm:table-cell">Zakres</th>
                    <th className="px-5 py-4 font-semibold">Orientacja kosztów</th>
                  </tr>
                </thead>
                <tbody>
                  {costsTableRows.map((row) => (
                    <tr
                      key={row.day}
                      className="border-b border-[#1c2d44]/8 last:border-0 odd:bg-[#f4f1eb]/40"
                    >
                      <td className="px-5 py-4 font-semibold text-[#1c2d44]">{row.day}</td>
                      <td className="hidden max-w-md px-5 py-4 text-[#3d4d5c] sm:table-cell">
                        {row.items}
                      </td>
                      <td className="px-5 py-4 text-[#1c2d44]">{row.estimate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-[#1c2d44]/8 bg-[#dfe9f4]/40 px-5 py-4 text-sm text-[#3d4d5c]">
                {costsDisclaimer}
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Ile kroków */}
      <section
        id="kroki"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-[#1c2d44] px-4 py-16 text-white md:py-20 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-display text-3xl font-bold md:text-4xl">
              Ile kroków dziennie?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-white/80">
              Widełki orientacyjne — dni przy wodzie i z promem mogą mieć mniej kroków, dni
              zabytkowe więcej.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
              {[
                { label: "Dzień 1", v: day1StepsLabel },
                { label: "Dzień 2", v: day2StepsLabel },
                { label: "Dzień 3", v: day3StepsLabel },
                { label: "Dzień 4", v: day4StepsLabel },
                { label: "Dzień 5", v: day5StepsLabel },
                { label: "Dzień 6", v: day6StepsLabel },
              ].map((d) => (
                <div
                  key={d.label}
                  className="rounded-3xl border border-white/15 bg-white/5 p-6 text-center backdrop-blur-sm sm:p-8"
                >
                  <Footprints className="mx-auto h-10 w-10 text-[#9ec5e8]" aria-hidden />
                  <p className="mt-3 text-xs uppercase tracking-wider text-white/70 sm:text-sm">
                    {d.label}
                  </p>
                  <p className="mt-2 font-display text-lg font-bold leading-tight text-white sm:text-xl md:text-2xl">
                    {d.v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-[#f4f1eb] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-display text-3xl font-bold text-[#1c2d44] md:text-4xl">
              Najczęstsze pytania
            </h2>
            <div className="mt-10 space-y-3">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-[#1c2d44]/10 bg-white shadow-sm open:shadow-md"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-[#1c2d44] marker:content-none [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-[#4a6fa5] transition group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <div className="border-t border-[#1c2d44]/8 px-5 py-4 text-sm leading-relaxed text-[#3d4d5c]">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA ODART */}
      <section
        id="kontakt-odart"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-gradient-to-br from-[#eef3f9] via-white to-[#dfe9f4] px-4 py-20 md:py-28 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-[#1c2d44] md:text-4xl">
              Chcesz podobnie przygotowaną stronę lub landing dla swojej firmy?
            </h2>
            <p className="mt-6 text-lg text-[#3d4d5c]">
              ODART projektuje i wdraża strony WWW z dbałością o treść, UX i techniczne detale —
              także pod konkretne wyjazdy, produkty lub kampanie.
            </p>
            <a
              href={CONTACT_MAILTO}
              className="mt-10 inline-flex items-center justify-center rounded-xl bg-[#1c2d44] px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-[#2a4a6e]"
            >
              Skontaktuj się z ODART
            </a>
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm font-medium">
              <Link
                href={externalLinks.stronyInternetowe}
                className="text-[#2a4a6e] underline decoration-[#4a6fa5]/50 underline-offset-4 hover:decoration-[#2a4a6e]"
              >
                Strony internetowe
              </Link>
              <Link
                href={externalLinks.opiekaIt}
                className="text-[#2a4a6e] underline decoration-[#4a6fa5]/50 underline-offset-4 hover:decoration-[#2a4a6e]"
              >
                Opieka IT dla firm — Kołobrzeg
              </Link>
              <Link
                href={`${SITE}/kontakt/`}
                className="text-[#2a4a6e] underline decoration-[#4a6fa5]/50 underline-offset-4 hover:decoration-[#2a4a6e]"
              >
                Kontakt na odart.pl
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
