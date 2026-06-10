import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RAFAL_ARINO_HERO } from "@/lib/rafalKowalkowskiArinoContent";
import { rafalPublicHref } from "@/lib/rafalKowalkowskiLegacyRoutes";

const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/acrux_rk/" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCOp3fAgkkXzEOY3PgBk29jA" },
  { label: "Facebook", href: "https://www.facebook.com/acruxkg/" },
] as const;

function HeroCta({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={rafalPublicHref(href)}
      className="group inline-flex items-center gap-5 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:text-odart-accent"
    >
      {label}
      <span className="inline-block h-px w-14 bg-white/50 transition group-hover:w-20 group-hover:bg-odart-accent" aria-hidden />
      <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}

/** Treść hero Arino — tło w `ArinoFixedHeroBackdrop` (position: fixed). */
export function RafalArinoHero() {
  const [line1, line2] = RAFAL_ARINO_HERO.titleLines;

  return (
    <section id="home" className="relative min-h-[100dvh] scroll-mt-24">
      <span className="pointer-events-none absolute left-[12%] top-[28%] z-[2] h-0 w-0 border-b-[10px] border-l-[6px] border-r-[6px] border-b-odart-accent border-l-transparent border-r-transparent opacity-90" aria-hidden />
      <span className="pointer-events-none absolute right-[38%] top-[22%] z-[2] h-0 w-0 border-b-[8px] border-l-[5px] border-r-[5px] border-b-odart-accent border-l-transparent border-r-transparent opacity-70" aria-hidden />
      <span className="pointer-events-none absolute bottom-[32%] left-[48%] z-[2] h-0 w-0 border-b-[6px] border-l-4 border-r-4 border-b-odart-accent border-l-transparent border-r-transparent opacity-60" aria-hidden />

      <aside className="pointer-events-none absolute right-4 top-1/2 z-[3] hidden -translate-y-1/2 lg:right-8 xl:block">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/50 [writing-mode:vertical-rl] rotate-180"
          style={{ textOrientation: "mixed" }}
        >
          Obserwuj —{" "}
          {SOCIAL.map((s, i) => (
            <span key={s.href}>
              {i > 0 ? " | " : null}
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto transition hover:text-odart-accent"
              >
                {s.label}
              </a>
            </span>
          ))}
        </p>
      </aside>

      <div className="relative z-[4] mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col px-5 pb-20 pt-28 sm:px-8 lg:px-14 lg:pt-32">
        <div className="flex flex-1 flex-col justify-center pt-8 lg:pt-16">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.4em] text-odart-accent">ACRUX · ODART</p>
          <h1 className="max-w-[14ch] text-[clamp(2.5rem,8vw,5.75rem)] font-bold leading-[0.95] tracking-tight text-white">
            {line1}
            <br />
            {line2}
          </h1>
        </div>

        <div className="mt-auto grid gap-10 pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(260px,380px)] lg:items-end lg:gap-16">
          <HeroCta href={RAFAL_ARINO_HERO.cta.href} label={RAFAL_ARINO_HERO.cta.label} />
          <p className="text-base leading-relaxed text-neutral-300 lg:text-right lg:text-[17px] lg:leading-[1.75]">
            {RAFAL_ARINO_HERO.lead}
          </p>
        </div>

        <p className="mt-10 text-center text-sm italic text-neutral-500 lg:mt-16 lg:text-left">{RAFAL_ARINO_HERO.quote}</p>
      </div>

      <div
        className="pointer-events-none absolute bottom-8 left-1/2 z-[4] hidden -translate-x-1/2 lg:block"
        aria-hidden
      >
        <div className="flex h-11 w-7 items-start justify-center rounded-full border border-white/35 p-1.5">
          <span className="block h-2 w-1 animate-bounce rounded-full bg-white/70" />
        </div>
      </div>
    </section>
  );
}
