import { UtensilsCrossed, ShoppingBag, Sparkles, Wrench, Factory } from "lucide-react";
import type { OdartLocale } from "@/components/odart/odartNav";

const COPY = {
  pl: {
    label: "Aplikacje ODART",
    food: "Jedzenie",
    store: "Sklep",
    clinics: "Gabinety",
    workshop: "Warsztat",
    production: "Produkcja",
  },
  en: {
    label: "ODART Apps",
    food: "Food",
    store: "Store",
    clinics: "Clinics",
    workshop: "Workshop",
    production: "Production",
  },
} as const;

/** Pasek szybkich linków (Zamów, app, salon, harmonogram demo) — jak na app.odart.pl. */
export function AppHubStrip({ locale = "pl" }: { locale?: OdartLocale }) {
  const copy = COPY[locale];

  return (
    <div className="border-b border-stone-200/80 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 py-2.5 text-sm sm:justify-between sm:gap-4">
        <span className="hidden font-medium text-stone-300 sm:inline">{copy.label}</span>
        <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-3" aria-label={copy.label}>
          <a
            href="https://zamow.odart.pl/"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 font-medium text-white ring-1 ring-white/15 transition hover:bg-white/20"
            rel="noopener noreferrer"
          >
            <UtensilsCrossed className="h-4 w-4 text-amber-300" aria-hidden />
            {copy.food}
          </a>
          <a
            href="https://app.odart.pl/sklep"
            className="inline-flex items-center gap-1.5 rounded-full bg-odart-accent/90 px-3 py-1.5 font-medium text-white shadow-sm transition hover:bg-odart-accent"
            rel="noopener noreferrer"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden />
            {copy.store}
          </a>
          <a
            href="https://salon.odart.pl/"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 font-medium text-white ring-1 ring-white/15 transition hover:bg-white/20"
            rel="noopener noreferrer"
          >
            <Sparkles className="h-4 w-4 text-pink-300" aria-hidden />
            {copy.clinics}
          </a>
          <a
            href="https://harmonogram.odart.pl/demo"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 font-medium text-white ring-1 ring-white/15 transition hover:bg-white/20"
            rel="noopener noreferrer"
          >
            <Wrench className="h-4 w-4 text-amber-300" aria-hidden />
            {copy.workshop}
          </a>
          <a
            href="https://harmonogram.odart.pl/demo/produkcja"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 font-medium text-white ring-1 ring-white/15 transition hover:bg-white/20"
            rel="noopener noreferrer"
          >
            <Factory className="h-4 w-4 text-sky-300" aria-hidden />
            {copy.production}
          </a>
        </nav>
      </div>
    </div>
  );
}
