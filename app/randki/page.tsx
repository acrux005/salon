import Link from "next/link";
import { RandkiLandingPreview } from "@/components/randki/RandkiLandingPreview";
import { RandkiLandingPeekCorridor } from "@/components/randki/RandkiLandingPeekCorridor";
import { getLandingPeekRooms } from "@/lib/randki/landingPeekRooms";
import { resolveDayPhaseMeta } from "@/lib/randki/dayRhythm";
import { randkiPublicHref } from "@/lib/randkiPaths";

const COMPARE = [
  { bad: "Setki profili dziennie", good: "Jedna osoba dziennie — jak kiedyś" },
  { bad: "Ghosting i płytkie rozmowy", good: "Powolne poznawanie — slow intimacy" },
  { bad: "Filtry, fake, stare zdjęcia", good: "Daily moment — live z aparatu" },
  { bad: "Swipe addiction", good: "Głos, prompty, dopiero potem zdjęcie" },
];

const PILLARS = [
  {
    emoji: "🎙",
    title: "Najpierw głos",
    body: "Najpierw słyszysz człowieka — sposób mówienia, humor, energia. Potem decydujesz, czy chcesz zobaczyć zdjęcie.",
  },
  {
    emoji: "📸",
    title: "Jedno prawdziwe zdjęcie",
    body: "Jedno zdjęcie dziennie, prosto z aparatu. Bez filtrów. Bez AI. Bez galerii z wakacji sprzed czterech lat.",
  },
  {
    emoji: "🌿",
    title: "Mniej hałasu",
    body: "Jedna starannie dobrana osoba dziennie. Więcej emocji, mniej zmęczenia — anty-przebodźcowanie zamiast katalogu ludzi.",
  },
];

export default function RandkiHomePage() {
  const dayPhase = resolveDayPhaseMeta();
  const peekRooms = getLandingPeekRooms(dayPhase.id);

  return (
    <main className="overflow-x-hidden">
      {/* Hero — 55/45 on desktop, headline first */}
      <section className="relative px-4 pb-10 pt-10 sm:pb-14 sm:pt-12 lg:min-h-[min(88vh,820px)] lg:pb-16 lg:pt-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="randki-landing-glow absolute -left-32 top-20 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl" />
          <div className="randki-landing-glow absolute right-0 top-1/3 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl lg:opacity-60" style={{ animationDelay: "1.5s" }} />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:items-center">
          <div className="text-center lg:flex lg:min-h-[520px] lg:flex-col lg:justify-center lg:text-left">
            <p className="inline-flex rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-300">
              Emocjonalna przestrzeń · nie katalog
            </p>
            <h1 className="mt-5 text-[2rem] font-bold leading-[1.06] tracking-tight text-white sm:text-5xl lg:mt-6 lg:text-[3.5rem] lg:leading-[1.05] xl:text-[3.75rem]">
              Spokojne miejsce,
              <br />
              <span className="bg-gradient-to-r from-rose-300 to-violet-300 bg-clip-text text-transparent">
                gdzie są inni.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-md text-[18px] leading-snug text-white/75 sm:text-[20px] lg:mx-0 lg:mt-7 lg:max-w-lg lg:text-[21px]">
              Zajrzyj do pokoju — poczuj klimat, światło, głos.
              <br />
              Bez swipe. Bez feedu. Bez presji.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:mt-10 lg:justify-start">
              <Link href={randkiPublicHref("/rejestracja")} className="randki-btn-primary px-8 py-3.5 text-[15px]">
                Wejdź głębiej
              </Link>
              <Link href={randkiPublicHref("/logowanie")} className="randki-btn-outline px-8 py-3.5 text-[15px]">
                Mam konto
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end lg:pr-4">
            <RandkiLandingPreview />
          </div>
        </div>
      </section>

      <RandkiLandingPeekCorridor phase={dayPhase.id} rooms={peekRooms} />

      {/* Emotional hook */}
      <section className="border-y border-white/5 bg-white/[0.02] px-4 py-10 sm:py-12">
        <blockquote className="mx-auto max-w-2xl text-center">
          <p className="text-xl font-medium italic leading-relaxed text-white/90 sm:text-2xl">
            „Zmęczenie swipe, fake profile, ghosting — to nie Ty. To produkt zaprojektowany na uzależnienie.”
          </p>
          <footer className="mt-4 text-[14px] text-rose-300/90">Randka Odart — anty-przebodźcowanie</footer>
        </blockquote>
      </section>

      {/* Tinder comparison */}
      <section className="mx-auto max-w-4xl px-4 py-14 sm:py-16">
        <p className="text-center text-[12px] font-semibold uppercase tracking-[0.2em] text-rose-400">Nie kolejny Tinder</p>
        <h2 className="mt-3 text-center text-2xl font-bold text-white sm:text-3xl">
          Tinder fatigue → spokojne poznawanie
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[15px] text-white/55">
          Ten sam problem, inna odpowiedź — mniej ilości, więcej człowieka.
        </p>

        <div className="randki-glass mt-10 overflow-hidden">
          <div className="grid grid-cols-2 border-b border-white/10 bg-white/[0.03] text-[11px] font-semibold uppercase tracking-wider">
            <div className="border-r border-white/10 px-4 py-3 text-white/35">Typowe appki</div>
            <div className="px-4 py-3 text-rose-300">Randka Odart</div>
          </div>
          {COMPARE.map((row, i) => (
            <div
              key={row.bad}
              className={`grid grid-cols-2 text-[13px] sm:text-[14px] ${i < COMPARE.length - 1 ? "border-b border-white/10" : ""}`}
            >
              <div className="border-r border-white/10 px-4 py-4 text-white/40 line-through decoration-white/20">{row.bad}</div>
              <div className="px-4 py-4 font-medium text-white/90">{row.good}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:py-16">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">Powolne poznawanie człowieka</h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-[15px] text-white/55">
          Mniej scrolla. Więcej skupienia na jednym człowieku.
        </p>
        <ul className="mt-10 grid gap-5 sm:grid-cols-3">
          {PILLARS.map((s) => (
            <li key={s.title} className="randki-glass randki-landing-pillar p-6 sm:p-7">
              <span className="text-3xl">{s.emoji}</span>
              <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/60">{s.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Voice spotlight */}
      <section className="mx-auto max-w-4xl px-4 py-14 sm:py-16">
        <div className="randki-glass relative overflow-hidden p-8 sm:p-10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="relative grid gap-8 sm:grid-cols-[1fr,auto] sm:items-center">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-widest text-violet-300">Głos na pierwszym planie</p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Posłuchaj, zanim ocenisz</h2>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/60">
                Krótkie intro głosem — bez perfekcyjnego zdjęcia w tle. Chemia zaczyna się w uszach, nie w kciuku na swipe.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-8 py-6">
              <button
                type="button"
                aria-label="Podgląd odtwarzania głosu"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-violet-600 text-xl text-white shadow-lg shadow-rose-500/30"
              >
                ▶
              </button>
              <div className="flex h-10 items-end gap-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span
                    key={i}
                    className="randki-wave-bar w-1 rounded-full bg-gradient-to-t from-rose-500 to-violet-400"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <p className="text-[12px] font-medium text-white/50">Posłuchaj vibe</p>
            </div>
          </div>
        </div>
      </section>

      {/* Daily moment */}
      <section className="mx-auto max-w-4xl px-4 pb-14 sm:pb-16">
        <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-transparent to-rose-500/10 p-8 sm:p-10">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-amber-300">Anty-fake</p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Daily moment</h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/70">
            Jedno prawdziwe zdjęcie dziennie — otoczenie i selfie na żywo. Bez filtrów. Bez sztucznych zdjęć. Bez galerii z wakacji sprzed lat.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {["Live z aparatu", "Selfie + otoczenie", "Świeże z dnia", "Bez filtrów"].map((tag) => (
              <li key={tag} className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[12px] text-amber-100/90">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-white/10 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-4xl">
            Poznaj człowieka
            <br />
            <span className="text-white/50">zanim ocenisz zdjęcie.</span>
          </h2>
          <p className="mt-4 text-[15px] text-white/55">
            Wolniej. Uważniej. Jedna osoba — pełna uwaga.
          </p>
          <Link href={randkiPublicHref("/rejestracja")} className="randki-btn-primary mt-8 inline-flex px-10 py-3.5 text-[16px]">
            Dzisiaj poznasz jedną osobę
          </Link>
        </div>
      </section>
    </main>
  );
}
