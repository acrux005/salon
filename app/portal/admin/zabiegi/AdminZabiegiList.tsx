"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Treatment } from "@/lib/skinmatch/schema";

const PROBLEM_LABELS: Record<string, string> = {
  tradzik: "Trądzik",
  przebarwienia: "Przebarwienia",
  anti_aging: "Anti-aging",
  naczynka: "Naczynka",
  sucha_skora: "Sucha skóra",
  zmarszczki: "Zmarszczki",
  jedrnost: "Jędrność",
  owal: "Owal",
  brwi_rzesy: "Brwi/rzesy",
  makijaz: "Makijaż",
  wlosy: "Włosy",
  stopy: "Stopy",
  masaze: "Masaże",
  terapia_manualna: "Terapia manualna",
  dzwiekoterapia: "Dźwiękoterapia",
};

export function AdminZabiegiList({ treatments }: { treatments: Treatment[] }) {
  const [search, setSearch] = useState("");

  const filtered = treatments.filter(
    (t) =>
      !search.trim() ||
      t.nazwa.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-6">
      <div className="mb-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Szukaj po nazwie lub ID..."
          className="w-full max-w-sm rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
        />
        <p className="mt-1 text-[13px] text-neutral-500">
          {filtered.length} zabiegów
        </p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead>
            <tr className="bg-neutral-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                Nazwa
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                Cena od
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                Czas
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                Problemy
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-neutral-50/50">
                <td className="px-4 py-3 font-mono text-[13px] text-neutral-600">
                  {t.id}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-neutral-900">
                  {t.nazwa}
                </td>
                <td className="px-4 py-3 text-sm text-neutral-600">
                  {t.cena_od} zł
                </td>
                <td className="px-4 py-3 text-sm text-neutral-600">
                  {t.czas} min
                </td>
                <td className="px-4 py-3 text-sm text-neutral-500">
                  {t.problemy.map((p) => PROBLEM_LABELS[p] ?? p).join(", ") || "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/portal/zabieg/${t.id.replace(/_/g, "-")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-pink-600"
                    title="Zobacz podstronę"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="text-[13px]">Podgląd</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <p className="py-8 text-center text-neutral-600">
          {search.trim() ? "Brak wyników wyszukiwania." : "Brak zabiegów w katalogu."}
        </p>
      )}
    </div>
  );
}
