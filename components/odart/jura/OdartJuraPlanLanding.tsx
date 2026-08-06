"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Car,
  ChevronDown,
  Clock,
  Coffee,
  Footprints,
  Landmark,
  MapPinned,
  Mountain,
  Ticket,
  UtensilsCrossed,
  Users,
  Home,
  Droplets,
  Sun,
  Banknote,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  costsDisclaimer,
  costsTableRows,
  day1Attractions,
  day1Costs,
  day1DistanceLabel,
  day1Lead,
  day1MapPoints,
  day1Schedule,
  day1StepsLabel,
  day1TimeOnSiteLabel,
  day1Title,
  day2Attractions,
  day2Costs,
  day2DistanceLabel,
  day2ElevationLabel,
  day2Lead,
  day2MapPoints,
  day2OptionalExtension,
  day2Schedule,
  day2StepsLabel,
  day2TimeOnSiteLabel,
  day2Title,
  day3Attractions,
  day3Costs,
  day3DistanceLabel,
  day3Lead,
  day3MapPoints,
  day3Schedule,
  day3StepsLabel,
  day3TimeOnSiteLabel,
  day3Title,
  day4Attractions,
  day4Costs,
  day4DistanceLabel,
  day4Lead,
  day4MapPoints,
  day4Schedule,
  day4StepsLabel,
  day4TimeOnSiteLabel,
  day4Title,
  externalLinks,
  faqItems,
  heroImageAlt,
  heroImageUrl,
  history1587,
  historyEras,
  historyIntro,
  historyLogisticsNote,
  historySummary,
  introParagraphs,
  olsztynParkingName,
  overviewMapPoints,
  parkingName,
  placeHistories,
  placeHistoriesIntro,
  practicalTips,
  seoKeywords,
  sourceTrailNote,
  sourceTrailNoteDay2,
  sourceTrailNoteDay3,
  sourceTrailNoteDay4,
  zlotyPotokParkingName,
  type PracticalTip,
  type ScheduleItem,
} from "@/lib/juraPlanData";
import { LazyAthensLeafletMap } from "@/components/odart/athens/AthensLeafletMap";

const CONTACT_MAILTO =
  "mailto:biuro@odart.pl?subject=Zapytanie%20o%20plan%20wycieczki%20/%20landing%20ODART";

const NAV_LINKS = [
  { href: "#wstep", label: "Wstęp" },
  { href: "#mapa-ogolna", label: "Mapa 4 dni" },
  { href: "#dzien-1", label: "Dzień 1" },
  { href: "#mapa-dzien-1", label: "Mapa 1" },
  { href: "#dzien-2", label: "Dzień 2" },
  { href: "#mapa-dzien-2", label: "Mapa 2" },
  { href: "#dzien-3", label: "Dzień 3" },
  { href: "#mapa-dzien-3", label: "Mapa 3" },
  { href: "#dzien-4", label: "Dzień 4" },
  { href: "#mapa-dzien-4", label: "Mapa 4" },
  { href: "#historia", label: "Historia zamku" },
  { href: "#historia-miejsc", label: "Historia miejsc" },
  { href: "#praktyczne", label: "Praktyczne" },
  { href: "#koszty", label: "Koszty" },
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
    case "hill":
      return <Mountain className={cls} aria-hidden />;
    case "car":
      return <Car className={cls} aria-hidden />;
    case "coffee":
      return <Coffee className={cls} aria-hidden />;
    case "ticket":
      return <Ticket className={cls} aria-hidden />;
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

export function OdartJuraPlanLanding() {
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

      <header id="top" className="relative isolate min-h-[85vh] overflow-hidden md:min-h-[78vh]">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImageUrl}
            alt={heroImageAlt}
            fill
            priority
            fetchPriority="high"
            className="object-cover object-[center_40%]"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#1c2d44]/75 via-[#1c2d44]/45 to-[#f4f1eb]"
            aria-hidden
          />
        </div>
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col justify-end px-4 pb-16 pt-32 md:pb-20 md:pt-40 lg:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c5d9ef]">
            Plan wycieczki · 4 dni · baza Podzamcze
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-sm md:text-5xl lg:text-[3.25rem]">
            Jura w 4 dni — Podzamcze, Olsztyn, pustynia i Złoty Potok
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
            Dzień 1: Ogrodzieniec. Dzień 2: Olsztyn. Dzień 3: Bobolice, Mirów i pustynia. Dzień 4:
            Złoty Potok (Brama, źródła, stawy, pałac) — z noclegiem w Podzamczu.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#dzien-1"
              className="inline-flex items-center justify-center rounded-xl bg-[#f4f1eb] px-5 py-3.5 text-sm font-semibold text-[#1c2d44] shadow-lg transition hover:bg-white md:text-base"
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
              href="#mapa-ogolna"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/80 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 md:text-base"
            >
              Mapa 4 dni
            </a>
            <a
              href="#historia"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/80 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 md:text-base"
            >
              Historia zamku
            </a>
            <a
              href={externalLinks.zamek}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/80 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 md:text-base"
            >
              Bilety zamku
            </a>
          </div>
          <p className="mt-8 max-w-xl text-sm text-white/70">{seoKeywords.slice(0, 4).join(" · ")}</p>
        </div>
      </header>

      <section
        id="wstep"
        className="scroll-mt-28 border-t border-[#1c2d44]/5 bg-[#f4f1eb] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-[#1c2d44] md:text-4xl">
              Cztery dni Orlich Gniazd — bez zgadywania
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#3d4d5c]">
              Baza w Podzamczu. Zamki, Sokole Góry, pustynia i Złoty Potok — każdy wieczór w tej
              samej bazie.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-3xl space-y-5 text-base leading-relaxed text-[#3d4d5c]">
            {introParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="text-sm text-[#4a6fa5]">
              <a
                href={externalLinks.seniorka}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2 hover:text-[#1c2d44]"
              >
                Dzień 1 — Seniorka z plecakiem
              </a>
              {" · "}
              <a
                href={externalLinks.olsztynRoute}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2 hover:text-[#1c2d44]"
              >
                Dzień 2 — jura.travel
              </a>
              {" · "}
              <a
                href={externalLinks.bobolice}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2 hover:text-[#1c2d44]"
              >
                Dzień 3 — zamekbobolice.pl
              </a>
              {" · "}
              <a
                href={externalLinks.zlotyPotok}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2 hover:text-[#1c2d44]"
              >
                Dzień 4 — Złoty Potok
              </a>
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Dzień 1", value: day1DistanceLabel },
              { label: "Dzień 2", value: day2DistanceLabel },
              { label: "Dzień 3", value: day3DistanceLabel },
              { label: "Dzień 4", value: day4DistanceLabel },
              { label: "Dzień 1 — czas", value: day1TimeOnSiteLabel },
              { label: "Dzień 2 — czas", value: day2TimeOnSiteLabel },
              { label: "Dzień 3 — czas", value: day3TimeOnSiteLabel },
              { label: "Dzień 4 — czas", value: day4TimeOnSiteLabel },
            ].map((b) => (
              <div
                key={b.label}
                className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 text-center shadow-sm"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">{b.label}</p>
                <p className="mt-2 text-sm font-semibold leading-snug text-[#1c2d44]">{b.value}</p>
              </div>
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
                Cały wyjazd
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#1c2d44] md:text-3xl">
                Mapa ogólna — cztery dni, baza Podzamcze
              </h2>
              <p className="mt-4 text-[#3d4d5c]">
                Pinezki: Podzamcze, Olsztyn, Bobolice/Mirów, Pustynia Błędowska i Złoty Potok. To
                orientacja skali wyjazdu — nie jedna trasa do jazdy po kolei.
              </p>
              <ol className="mt-6 space-y-2 text-sm text-[#3d4d5c]">
                {overviewMapPoints.map((pt) => (
                  <li key={pt.order}>
                    <span className="font-semibold text-[#1c2d44]">{pt.order}.</span> {pt.title}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <LazyAthensLeafletMap
                mapInstanceId="map-jura-overview"
                points={overviewMapPoints}
                showRoute={false}
              />
              <p className="mt-4 text-center text-xs text-[#3d4d5c]/80">
                OpenStreetMap · bez linii trasy · opcjonalnie GPS
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section
        id="dzien-1"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-gradient-to-b from-white to-[#eef3f9] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Dzień pierwszy · Podzamcze
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-[#1c2d44] md:text-3xl">
                {day1Title}
              </h2>
              <p className="mt-4 text-[#3d4d5c]">{day1Lead}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">Baza</p>
                  <p className="mt-1 text-sm font-semibold leading-snug text-[#1c2d44]">{parkingName}</p>
                </div>
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">
                    Koszt wejść
                  </p>
                  <p className="mt-1 flex items-start gap-2 text-sm font-medium leading-snug text-[#1c2d44]">
                    <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-[#4a6fa5]" aria-hidden />
                    {day1Costs}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-6 font-display text-xl font-semibold text-[#1c2d44]">Godzina po godzinie</h3>
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
        </Reveal>
      </section>

      <section
        id="atrakcje-1"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-[#f4f1eb] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-display text-3xl font-bold text-[#1c2d44] md:text-4xl">
              Dzień 1 — co zobaczysz
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-[#3d4d5c]">
              Ogrodzieniec, skały, winnica, Birów.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {day1Attractions.map((a) => (
                <article
                  key={a.title}
                  className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-sm"
                >
                  <h3 className="font-display text-xl font-semibold text-[#1c2d44]">{a.title}</h3>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#3d4d5c]">
                    {a.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4a6fa5]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section
        id="mapa-dzien-1"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-white px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">Trasa dnia 1</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#1c2d44] md:text-3xl">
                Mapa — Podzamcze / Ogrodzieniec
              </h2>
              <p className="mt-4 text-[#3d4d5c]">
                Linia łączy punkty w kolejności dnia. To orientacja, nie GPS-track szlaku — trzymaj się
                oznakowania (czerwony / niebieski / zielony) w terenie.
              </p>
              <p className="mt-3 text-sm text-[#3d4d5c]">{sourceTrailNote}</p>
              <ol className="mt-6 space-y-2 text-sm text-[#3d4d5c]">
                {day1MapPoints.map((p) => (
                  <li key={p.order}>
                    <span className="font-semibold text-[#1c2d44]">{p.order}.</span> {p.title}
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-sm text-[#3d4d5c]">
                Przycisk „Moja pozycja (GPS)” pokazuje, gdzie jesteś względem trasy — po zgodzie w
                przeglądarce.
              </p>
            </div>
            <div>
              <LazyAthensLeafletMap
                mapInstanceId="map-jura-day1"
                points={day1MapPoints}
                showRoute
              />
              <p className="mt-4 text-center text-xs text-[#3d4d5c]/80">
                OpenStreetMap · trasa dnia · opcjonalnie Twoja pozycja z GPS
              </p>
            </div>
          </div>
        </Reveal>
      </section>


      <section
        id="dzien-2"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-gradient-to-b from-[#eef3f9] to-white px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Dzień drugi · Olsztyn
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-[#1c2d44] md:text-3xl">
                {day2Title}
              </h2>
              <p className="mt-4 text-[#3d4d5c]">{day2Lead}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">Baza</p>
                  <p className="mt-1 text-sm font-semibold leading-snug text-[#1c2d44]">
                    {olsztynParkingName}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">Dystans</p>
                  <p className="mt-1 text-sm font-semibold text-[#1c2d44]">
                    {day2DistanceLabel} · {day2ElevationLabel}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">
                    Koszt wejść
                  </p>
                  <p className="mt-1 flex items-start gap-2 text-sm font-medium leading-snug text-[#1c2d44]">
                    <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-[#4a6fa5]" aria-hidden />
                    {day2Costs}
                  </p>
                </div>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-[#3d4d5c]">{day2OptionalExtension}</p>
            </div>
            <div>
              <h3 className="mb-6 font-display text-xl font-semibold text-[#1c2d44]">
                Godzina po godzinie
              </h3>
              <ol className="space-y-0">
                {day2Schedule.map((item, idx) => (
                  <li
                    key={`${item.time}-${idx}`}
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
        </Reveal>
      </section>

      <section
        id="atrakcje-2"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-[#f4f1eb] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-display text-3xl font-bold text-[#1c2d44] md:text-4xl">
              Dzień 2 — co zobaczysz
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-[#3d4d5c]">
              Zamek Olsztyn, Kielniki, Sokole Góry, Biakło, Lipówki.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {day2Attractions.map((a) => (
                <article
                  key={a.title}
                  className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-sm"
                >
                  <h3 className="font-display text-xl font-semibold text-[#1c2d44]">{a.title}</h3>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#3d4d5c]">
                    {a.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4a6fa5]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section
        id="mapa-dzien-2"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-white px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Trasa dnia 2
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#1c2d44] md:text-3xl">
                Mapa — Olsztyn i Sokole Góry
              </h2>
              <p className="mt-4 text-[#3d4d5c]">
                Pinezki w kolejności dnia. W terenie trzymaj się żółtego szlaku i oznakowania
                rezerwatu.
              </p>
              <p className="mt-3 text-sm text-[#3d4d5c]">{sourceTrailNoteDay2}</p>
              <ol className="mt-6 space-y-2 text-sm text-[#3d4d5c]">
                {day2MapPoints.map((pt) => (
                  <li key={pt.order}>
                    <span className="font-semibold text-[#1c2d44]">{pt.order}.</span> {pt.title}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <LazyAthensLeafletMap
                mapInstanceId="map-jura-day2"
                points={day2MapPoints}
                showRoute
              />
              <p className="mt-4 text-center text-xs text-[#3d4d5c]/80">
                OpenStreetMap · trasa dnia 2 · GPS opcjonalnie
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section
        id="dzien-3"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-gradient-to-b from-white to-[#eef3f9] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Dzień trzeci · Bobolice + pustynia
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-[#1c2d44] md:text-3xl">
                {day3Title}
              </h2>
              <p className="mt-4 text-[#3d4d5c]">{day3Lead}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">Baza</p>
                  <p className="mt-1 text-sm font-semibold leading-snug text-[#1c2d44]">
                    Nocleg Podzamcze · parking Bobolice + Róża Wiatrów / Czubatka
                  </p>
                </div>
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">Dystans</p>
                  <p className="mt-1 text-sm font-semibold text-[#1c2d44]">{day3DistanceLabel}</p>
                </div>
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">
                    Koszt wejść
                  </p>
                  <p className="mt-1 flex items-start gap-2 text-sm font-medium leading-snug text-[#1c2d44]">
                    <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-[#4a6fa5]" aria-hidden />
                    {day3Costs}
                  </p>
                </div>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-[#3d4d5c]">{day3StepsLabel}</p>
            </div>
            <div>
              <h3 className="mb-6 font-display text-xl font-semibold text-[#1c2d44]">
                Godzina po godzinie
              </h3>
              <ol className="space-y-0">
                {day3Schedule.map((item, idx) => (
                  <li
                    key={`${item.time}-${idx}`}
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
        </Reveal>
      </section>

      <section
        id="atrakcje-3"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-[#f4f1eb] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-display text-3xl font-bold text-[#1c2d44] md:text-4xl">
              Dzień 3 — co zobaczysz
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-[#3d4d5c]">
              Bobolice, Mirów, Róża Wiatrów, Czubatka.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {day3Attractions.map((a) => (
                <article
                  key={a.title}
                  className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-sm"
                >
                  <h3 className="font-display text-xl font-semibold text-[#1c2d44]">{a.title}</h3>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#3d4d5c]">
                    {a.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4a6fa5]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section
        id="mapa-dzien-3"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-white px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Trasa dnia 3
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#1c2d44] md:text-3xl">
                Mapa — Bobolice, Mirów i Pustynia Błędowska
              </h2>
              <p className="mt-4 text-[#3d4d5c]">
                Pinezki w kolejności dnia. Między Bobolicami a Mirowem idź ścieżką (~1,5 km); na
                pustynię jedź autem — Róża Wiatrów albo Czubatka.
              </p>
              <p className="mt-3 text-sm text-[#3d4d5c]">{sourceTrailNoteDay3}</p>
              <ol className="mt-6 space-y-2 text-sm text-[#3d4d5c]">
                {day3MapPoints.map((pt) => (
                  <li key={pt.order}>
                    <span className="font-semibold text-[#1c2d44]">{pt.order}.</span> {pt.title}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <LazyAthensLeafletMap
                mapInstanceId="map-jura-day3"
                points={day3MapPoints}
                showRoute
              />
              <p className="mt-4 text-center text-xs text-[#3d4d5c]/80">
                OpenStreetMap · trasa dnia 3 · GPS opcjonalnie
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section
        id="dzien-4"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-gradient-to-b from-[#eef3f9] to-white px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Dzień czwarty · Złoty Potok
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-[#1c2d44] md:text-3xl">
                {day4Title}
              </h2>
              <p className="mt-4 text-[#3d4d5c]">{day4Lead}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">Baza</p>
                  <p className="mt-1 text-sm font-semibold leading-snug text-[#1c2d44]">
                    Nocleg Podzamcze · {zlotyPotokParkingName}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">Dystans</p>
                  <p className="mt-1 text-sm font-semibold text-[#1c2d44]">{day4DistanceLabel}</p>
                </div>
                <div className="rounded-2xl border border-[#1c2d44]/10 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#4a6fa5]">
                    Koszt wejść
                  </p>
                  <p className="mt-1 flex items-start gap-2 text-sm font-medium leading-snug text-[#1c2d44]">
                    <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-[#4a6fa5]" aria-hidden />
                    {day4Costs}
                  </p>
                </div>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-[#3d4d5c]">{day4StepsLabel}</p>
            </div>
            <div>
              <h3 className="mb-6 font-display text-xl font-semibold text-[#1c2d44]">
                Godzina po godzinie
              </h3>
              <ol className="space-y-0">
                {day4Schedule.map((item, idx) => (
                  <li
                    key={`${item.time}-${idx}`}
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
        </Reveal>
      </section>

      <section
        id="atrakcje-4"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-[#f4f1eb] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-display text-3xl font-bold text-[#1c2d44] md:text-4xl">
              Dzień 4 — co zobaczysz
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-[#3d4d5c]">
              Brama Twardowskiego, źródła, stawy (Amerykan), Pałac Raczyńskich; opcjonalnie Diabelskie
              Mosty.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {day4Attractions.map((a) => (
                <article
                  key={a.title}
                  className="rounded-2xl border border-[#1c2d44]/8 bg-white p-6 shadow-sm"
                >
                  <h3 className="font-display text-xl font-semibold text-[#1c2d44]">{a.title}</h3>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#3d4d5c]">
                    {a.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4a6fa5]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section
        id="mapa-dzien-4"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-white px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
                Trasa dnia 4
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#1c2d44] md:text-3xl">
                Mapa — Złoty Potok / rezerwat Parkowe
              </h2>
              <p className="mt-4 text-[#3d4d5c]">
                Pinezki w kolejności dnia: Brama → źródła → Staw Amerykan → pałac i park. Diabelskie
                Mosty na mapie jako opcja — krótki spacer dla chętnych.
              </p>
              <p className="mt-3 text-sm text-[#3d4d5c]">{sourceTrailNoteDay4}</p>
              <ol className="mt-6 space-y-2 text-sm text-[#3d4d5c]">
                {day4MapPoints.map((pt) => (
                  <li key={pt.order}>
                    <span className="font-semibold text-[#1c2d44]">{pt.order}.</span> {pt.title}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <LazyAthensLeafletMap
                mapInstanceId="map-jura-day4"
                points={day4MapPoints}
                showRoute
              />
              <p className="mt-4 text-center text-xs text-[#3d4d5c]/80">
                OpenStreetMap · trasa dnia 4 · GPS opcjonalnie
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section
        id="historia"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-white px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
              Od 1386 — z ostrożnością wobec legend
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-[#1c2d44] md:text-4xl">
              Historia Zamku Ogrodzieniec
            </h2>
            <p className="mt-4 text-[#3d4d5c]">{historyIntro}</p>
            <p className="mt-4 rounded-2xl border border-[#1c2d44]/10 bg-[#f4f1eb] px-5 py-4 text-sm font-medium leading-relaxed text-[#1c2d44]">
              {historySummary}
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {historyEras.map((era) => (
              <details
                key={era.period + era.title}
                className="group rounded-2xl border border-[#1c2d44]/10 bg-[#f4f1eb]/60 shadow-sm open:bg-white open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4">
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#4a6fa5]">
                      {era.period}
                    </span>
                    <span className="mt-1 block font-display text-lg font-semibold text-[#1c2d44]">
                      {era.title}
                    </span>
                  </span>
                  <ChevronDown
                    className="mt-1 h-5 w-5 shrink-0 text-[#4a6fa5] transition group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <div className="space-y-3 border-t border-[#1c2d44]/5 px-5 py-4 text-sm leading-relaxed text-[#3d4d5c]">
                  {era.paragraphs.map((p) => (
                    <p key={p.slice(0, 48)}>{p}</p>
                  ))}
                  {era.bullets && era.bullets.length > 0 ? (
                    <ul className="space-y-1.5 pt-1">
                      {era.bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4a6fa5]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </details>
            ))}
          </div>

          <div className="mx-auto mt-14 max-w-3xl space-y-8">
            {[history1587, historyLogisticsNote].map((block) => (
              <article
                key={block.id}
                id={block.id}
                className="scroll-mt-28 rounded-2xl border border-[#1c2d44]/10 bg-[#eef3f9] p-6 md:p-8"
              >
                <h3 className="font-display text-xl font-bold text-[#1c2d44] md:text-2xl">
                  {block.title}
                </h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-[#1c2d44]/90">
                  {block.lead}
                </p>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#3d4d5c]">
                  {block.paragraphs.map((p) => (
                    <p key={p.slice(0, 48)}>{p}</p>
                  ))}
                </div>
                {block.bullets && block.bullets.length > 0 ? (
                  <ul className="mt-4 space-y-2 text-sm text-[#3d4d5c]">
                    {block.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4a6fa5]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-5 rounded-xl border border-[#1c2d44]/10 bg-white px-4 py-3 text-sm font-medium leading-relaxed text-[#1c2d44]">
                  {block.takeaway}
                </p>
              </article>
            ))}
            <p className="text-center text-xs text-[#3d4d5c]/80">
              Oparcie m.in. o oficjalną historię zamku, NID / materiały regionalne — z rozróżnieniem faktów
              pewnych i tradycji. Szczegóły godzin i biletów:{" "}
              <a
                href={externalLinks.zamek}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#4a6fa5] underline underline-offset-2"
              >
                zamek-ogrodzieniec.pl
              </a>
              .
            </p>
          </div>
        </Reveal>
      </section>

      <section
        id="historia-miejsc"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-[#f4f1eb] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#4a6fa5]">
              Dni 2–4 · fakty i legendy
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-[#1c2d44] md:text-4xl">
              Historia miejsc na trasie
            </h2>
            <p className="mt-4 text-[#3d4d5c]">{placeHistoriesIntro}</p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {placeHistories.map((ph) => (
              <details
                key={ph.id}
                id={ph.id}
                className="group scroll-mt-28 rounded-2xl border border-[#1c2d44]/10 bg-white shadow-sm open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4">
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#4a6fa5]">
                      {ph.dayLabel}
                    </span>
                    <span className="mt-1 block font-display text-lg font-semibold text-[#1c2d44]">
                      {ph.place}
                    </span>
                    <span className="mt-2 block text-sm font-normal leading-relaxed text-[#3d4d5c]">
                      {ph.lead}
                    </span>
                  </span>
                  <ChevronDown
                    className="mt-1 h-5 w-5 shrink-0 text-[#4a6fa5] transition group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <div className="space-y-3 border-t border-[#1c2d44]/5 px-5 py-4 text-sm leading-relaxed text-[#3d4d5c]">
                  {ph.paragraphs.map((p) => (
                    <p key={p.slice(0, 48)}>{p}</p>
                  ))}
                  <p className="rounded-xl border border-[#1c2d44]/10 bg-[#eef3f9] px-4 py-3 text-sm font-medium leading-relaxed text-[#1c2d44]">
                    {ph.takeaway}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </Reveal>
      </section>

      <section
        id="praktyczne"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-[#f4f1eb] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-display text-3xl font-bold text-[#1c2d44] md:text-4xl">
              Praktyczne informacje
            </h2>
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

      <section
        id="koszty"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-gradient-to-b from-white to-[#eef3f9] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center font-display text-3xl font-bold text-[#1c2d44] md:text-4xl">
              Koszty — orientacyjnie
            </h2>
            <div className="mt-10 overflow-hidden rounded-2xl border border-[#1c2d44]/10 bg-white shadow-lg">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#1c2d44]/10 bg-[#1c2d44] text-white">
                    <th className="px-5 py-4 font-semibold">Pozycja</th>
                    <th className="hidden px-5 py-4 font-semibold sm:table-cell">Zakres</th>
                    <th className="px-5 py-4 font-semibold">Orientacja</th>
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
            <p className="mt-6 text-center text-sm">
              <a
                href={externalLinks.zamek}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#4a6fa5] underline underline-offset-2 hover:text-[#1c2d44]"
              >
                Oficjalna strona zamku — godziny i bilety
              </a>
            </p>
          </div>
        </Reveal>
      </section>

      <section
        id="faq"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-[#f4f1eb] px-4 py-16 md:py-24 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-display text-3xl font-bold text-[#1c2d44] md:text-4xl">
              FAQ
            </h2>
            <div className="mt-10 space-y-3">
              {faqItems.map((f) => (
                <details
                  key={f.question}
                  className="group rounded-2xl border border-[#1c2d44]/10 bg-white shadow-sm open:shadow-md"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-[#1c2d44]">
                    {f.question}
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-[#4a6fa5] transition group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <p className="border-t border-[#1c2d44]/5 px-5 py-4 text-sm leading-relaxed text-[#3d4d5c]">
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section
        id="kontakt-odart"
        className="scroll-mt-28 border-t border-[#1c2d44]/8 bg-[#1c2d44] px-4 py-16 text-white md:py-20 lg:px-6"
      >
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">ODART — takie plany na webie</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">
              Ten layout to ten sam wzorzec co plan Aten: harmonogram, mapa, koszty, FAQ. Możemy
              zrobić podobną stronę pod Waszą wycieczkę, firmowy wyjazd albo landing produktu.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={CONTACT_MAILTO}
                className="inline-flex rounded-xl bg-[#f4f1eb] px-5 py-3.5 text-sm font-semibold text-[#1c2d44] transition hover:bg-white"
              >
                Napisz: biuro@odart.pl
              </a>
              <Link
                href={externalLinks.athensPlan}
                className="inline-flex rounded-xl border-2 border-white/70 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Zobacz plan Aten (6 dni)
              </Link>
              <a
                href={externalLinks.stronyInternetowe}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl border-2 border-white/70 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Strony internetowe ODART
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
