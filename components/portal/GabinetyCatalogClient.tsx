"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { PortalSeoCity } from "@/content/portalCities";
import type { ClinicRecord } from "@/lib/skinmatch/schema";
import { ClinicList } from "@/components/portal/ClinicList";

function normalizePl(value: string): string {
  return value
    .toLowerCase()
    .replace(/ą/g, "a")
    .replace(/ć/g, "c")
    .replace(/ę/g, "e")
    .replace(/ł/g, "l")
    .replace(/ń/g, "n")
    .replace(/ó/g, "o")
    .replace(/ś/g, "s")
    .replace(/ź|ż/g, "z")
    .trim();
}

type Props = {
  cities: PortalSeoCity[];
  clinics: ClinicRecord[];
};

/** Wspólne wyszukiwanie: filtruje chipy miast i listę gabinetów na /portal/gabinety. */
export function GabinetyCatalogClient({ cities, clinics }: Props) {
  const [query, setQuery] = useState("");

  const q = normalizePl(query);

  const filteredCities = useMemo(() => {
    if (!q) return cities;
    return cities.filter(
      (c) =>
        normalizePl(c.name).includes(q) ||
        c.slug.includes(q) ||
        normalizePl(c.locative).includes(q)
    );
  }, [cities, q]);

  const filteredClinics = useMemo(() => {
    if (!q) return clinics;
    return clinics.filter((clinic) => {
      const city = normalizePl(clinic.city);
      const name = normalizePl(clinic.name);
      return city.includes(q) || name.includes(q) || q.includes(city);
    });
  }, [clinics, q]);

  const exactCity = useMemo(() => {
    if (!q) return null;
    return (
      filteredCities.find((c) => normalizePl(c.name) === q) ??
      (filteredCities.length === 1 ? filteredCities[0] : null)
    );
  }, [filteredCities, q]);

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-neutral-200/80 bg-neutral-50/60 p-6 sm:p-8">
        <h2 className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
          Gabinety kosmetyczne wg miasta
        </h2>
        <p className="mt-2 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
          Wpisz miasto — zawężymy listę miejscowości i gabinetów poniżej. Albo kliknij miasto, żeby
          otworzyć jego stronę.
        </p>

        <div className="relative mt-4 max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F5E64]"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Np. Warszawa, Kraków, Kołobrzeg…"
            className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-[14px] text-[#1F1A1C] outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
            aria-label="Szukaj miasta lub gabinetu"
            autoComplete="off"
          />
        </div>

        <p className="mt-3 font-[var(--font-sans)] text-[13px] text-[#6F5E64]">
          {filteredCities.length} z {cities.length} miast
          {query.trim() ? ` pasujących do „${query.trim()}”` : ""}
          {query.trim() ? ` · gabinety na liście: ${filteredClinics.length}` : ""}
        </p>

        {exactCity && (
          <p className="mt-3 font-[var(--font-sans)] text-[14px]">
            <Link
              href={`/portal/gabinety/${exactCity.slug}`}
              className="font-medium text-pink-600 hover:underline"
            >
              Przejdź do gabinetów w {exactCity.locativeManual ? exactCity.locative : exactCity.name} →
            </Link>
          </p>
        )}

        <ul className="mt-4 max-h-[min(28rem,60vh)] overflow-y-auto rounded-xl border border-neutral-200/80 bg-white p-3">
          <li className="flex flex-wrap gap-2">
            {filteredCities.slice(0, q ? 80 : 48).map((city) => (
              <Link
                key={city.slug}
                href={`/portal/gabinety/${city.slug}`}
                className="inline-flex rounded-full border border-pink-200/90 bg-pink-50/40 px-3.5 py-1.5 font-[var(--font-sans)] text-[13px] font-medium text-[#4a3f42] transition-colors hover:border-pink-400 hover:bg-pink-50 hover:text-pink-700"
              >
                {city.name}
              </Link>
            ))}
          </li>
        </ul>
        {!q && cities.length > 48 && (
          <p className="mt-3 font-[var(--font-sans)] text-[13px] text-[#6F5E64]">
            Pokazano 48 miast — wpisz nazwę, żeby znaleźć pozostałe ({cities.length - 48}+).
          </p>
        )}
        {filteredCities.length === 0 && (
          <p className="mt-4 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
            Brak miasta w katalogu.
          </p>
        )}
      </section>

      <section aria-labelledby="lista-gabinetow">
        <h2 id="lista-gabinetow" className="font-[var(--font-sans)] text-xl font-semibold text-[#1F1A1C]">
          {q
            ? filteredClinics.length > 0
              ? `${filteredClinics.length} gabinetów pasujących do „${query.trim()}”`
              : `Brak gabinetów dla „${query.trim()}”`
            : "Wszystkie gabinety z ofertą"}
        </h2>
        <p className="mt-1 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
          {q
            ? "Lista poniżej jest zawężona do wybranego wyszukiwania. Kliknij miasto powyżej, aby otworzyć pełną stronę lokalną."
            : "Wybierz gabinet albo najpierw zawęż listę miastem w wyszukiwarce powyżej."}
        </p>
        <div className="mt-6">
          <ClinicList clinics={filteredClinics} city={q ? query.trim() : null} />
        </div>
      </section>
    </div>
  );
}
