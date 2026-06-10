"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { PortalSeoCity } from "@/content/portalCities";

type Props = {
  cities: PortalSeoCity[];
};

export function PortalCitiesPicker({ cities }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.includes(q) ||
        c.locative.toLowerCase().includes(q)
    );
  }, [cities, query]);

  return (
    <div>
      <div className="relative mt-4 max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F5E64]"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Szukaj miasta…"
          className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-[14px] text-[#1F1A1C] outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
          aria-label="Szukaj miasta"
        />
      </div>
      <p className="mt-3 font-[var(--font-sans)] text-[13px] text-[#6F5E64]">
        {filtered.length} z {cities.length} miast
        {query.trim() ? ` pasujących do „${query.trim()}”` : ""}
      </p>
      <ul className="mt-4 max-h-[min(28rem,60vh)] overflow-y-auto rounded-xl border border-neutral-200/80 bg-white p-3">
        <li className="flex flex-wrap gap-2">
          {filtered.map((city) => (
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
      {filtered.length === 0 && (
        <p className="mt-4 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">Brak miasta w katalogu.</p>
      )}
    </div>
  );
}
