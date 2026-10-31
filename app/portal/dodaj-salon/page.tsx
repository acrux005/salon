"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { clinicClaimPath } from "@/lib/catalogListing";
import { splitCatalogClinicName } from "@/lib/catalog/clinicDisplayName";

type SearchClinicItem = { id: string; slug: string; name: string; city: string };

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Krok 1: wyszukaj istniejący wpis → przejmij. Krok 2: dodaj nowy, jeśli brak. */
export default function DodajSalonPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [clinics, setClinics] = useState<SearchClinicItem[]>([]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setClinics([]);
      setLoading(false);
      return;
    }
    const ctrl = new AbortController();
    const id = window.setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE}/api/search?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        const data = (await res.json().catch(() => ({}))) as { clinics?: SearchClinicItem[] };
        setClinics(Array.isArray(data.clinics) ? data.clinics : []);
      } catch {
        setClinics([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      ctrl.abort();
      window.clearTimeout(id);
    };
  }, [query]);

  return (
    <>
      <HeaderPortal />
      <main className="min-h-screen bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <h1 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
            Dodaj lub przejmij profil
          </h1>
          <p className="mt-3 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
            Najpierw sprawdź, czy Twój salon jest już w katalogu Salon Odart. Jeśli tak — przejmij
            profil i uzupełnij dane. Jeśli nie — dodaj nowy.
          </p>

          <label className="relative mt-8 block">
            <span className="mb-2 block font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C]">
              Szukaj nazwy salonu lub miasta
            </span>
            <Search className="pointer-events-none absolute bottom-3.5 left-3.5 h-4 w-4 text-[#6F5E64]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Np. CALL OF BEAUTY, Wrocław…"
              className="h-12 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-[15px] text-[#1F1A1C] outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
              autoFocus
            />
          </label>

          <div className="mt-4 min-h-[8rem]">
            {loading ? (
              <p className="text-[14px] text-[#6F5E64]">Szukam…</p>
            ) : query.trim().length >= 2 && clinics.length === 0 ? (
              <p className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-[14px] text-[#6F5E64]">
                Nie znaleziono podobnego wpisu. Możesz dodać nowy salon.
              </p>
            ) : (
              <ul className="space-y-2">
                {clinics.map((c) => {
                  const { displayName } = splitCatalogClinicName(c.name);
                  const title = displayName || c.name;
                  return (
                    <li
                      key={c.id}
                      className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C]">
                          {title}
                        </p>
                        <p className="text-[13px] text-[#6F5E64]">{c.city}</p>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <Link
                          href={`/portal/gabinet/${c.slug}`}
                          className="rounded-full border border-neutral-300 px-3 py-1.5 text-[13px] font-medium text-[#1F1A1C] hover:bg-neutral-50"
                        >
                          Zobacz
                        </Link>
                        <Link
                          href={clinicClaimPath(c.slug)}
                          className="rounded-full bg-pink-500 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-pink-600"
                        >
                          Przejmij profil
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="mt-10 border-t border-neutral-200 pt-8">
            <p className="font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
              Nie ma Twojego salonu na liście?
            </p>
            <Link
              href="/portal/register"
              className="mt-3 inline-flex rounded-full border border-pink-300 bg-white px-5 py-3 font-[var(--font-sans)] text-[14px] font-medium text-pink-600 hover:bg-pink-50"
            >
              Dodaj nowy salon
            </Link>
          </div>
        </div>
      </main>
      <FooterPortal />
    </>
  );
}
