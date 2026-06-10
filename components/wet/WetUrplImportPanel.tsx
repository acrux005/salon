"use client";

import { useCallback, useEffect, useState } from "react";
import { importUrplProductsAction, syncUrplRegisterAction } from "@/app/actions/vetCatalog";
import type { UrplVetProduct } from "@/lib/vet/urplProducts";

const BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";

export function WetUrplImportPanel({ onImported }: { onImported: () => void }) {
  const [query, setQuery] = useState("");
  const [vaccinesOnly, setVaccinesOnly] = useState(true);
  const [results, setResults] = useState<UrplVetProduct[]>([]);
  const [meta, setMeta] = useState<{ fetchedAt?: string; total?: number; vaccines?: number } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const search = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ q: query, limit: "30" });
      if (vaccinesOnly) params.set("vaccinesOnly", "1");
      const res = await fetch(`${BASE}/api/wet/panel/catalog/urpl?${params}`, { credentials: "include" });
      const data = await res.json();
      setResults(data.items ?? []);
      setMeta(data.meta ?? null);
    } finally {
      setLoading(false);
    }
  }, [query, vaccinesOnly]);

  useEffect(() => {
    search();
  }, [search]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleImport() {
    if (selected.size === 0) {
      setMessage("Zaznacz produkty do importu.");
      return;
    }
    setLoading(true);
    setMessage("");
    const result = await importUrplProductsAction(Array.from(selected));
    setLoading(false);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    setMessage(`Zaimportowano ${result.imported ?? 0} pozycji (pominięto ${result.skipped ?? 0} duplikatów).`);
    setSelected(new Set());
    onImported();
  }

  async function handleSyncRegister() {
    setLoading(true);
    setMessage("");
    const result = await syncUrplRegisterAction();
    setLoading(false);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    setMessage(
      `Zaktualizowano rejestr URPL: ${result.total} produktów wet. (${result.vaccines} szczepionek).`
    );
    search();
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-wet-navy">Import z URPL (oficjalny rejestr)</h2>
      <p className="mt-1 text-[13px] text-wet-navy-muted">
        Źródło: Rejestr Produktów Leczniczych —{" "}
        <a
          href="https://rejestry.ezdrowie.gov.pl/rpl/search/public"
          target="_blank"
          rel="noopener noreferrer"
          className="text-wet-teal hover:underline"
        >
          rejestry.ezdrowie.gov.pl
        </a>
        {meta?.fetchedAt && (
          <> · snapshot: {new Date(meta.fetchedAt).toLocaleDateString("pl-PL")} ({meta.total} produktów)</>
        )}
      </p>

      {message && <p className="mt-3 text-[13px] text-wet-teal-800">{message}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          type="search"
          placeholder="Szukaj preparatu, producenta, nr pozwolenia…"
          className="min-w-[200px] flex-1 rounded-lg border px-3 py-2 text-[14px]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className="flex items-center gap-2 text-[13px]">
          <input type="checkbox" checked={vaccinesOnly} onChange={(e) => setVaccinesOnly(e.target.checked)} />
          Tylko szczepionki
        </label>
        <button type="button" onClick={search} disabled={loading} className="rounded-lg border px-3 py-2 text-[13px]">
          Szukaj
        </button>
        <button
          type="button"
          onClick={handleSyncRegister}
          disabled={loading}
          className="rounded-lg border border-wet-teal-200 px-3 py-2 text-[13px] text-wet-teal-800"
        >
          Odśwież z URPL
        </button>
      </div>

      <ul className="mt-4 max-h-72 space-y-1 overflow-y-auto rounded-lg border border-slate-100">
        {results.length === 0 ? (
          <li className="px-3 py-4 text-center text-[13px] text-slate-500">
            {loading ? "Ładowanie…" : "Brak wyników — zmień frazę."}
          </li>
        ) : (
          results.map((p) => (
            <li key={p.urplId} className="flex items-start gap-2 border-b border-slate-50 px-3 py-2 last:border-0">
              <input
                type="checkbox"
                checked={selected.has(p.urplId)}
                onChange={() => toggle(p.urplId)}
                className="mt-1"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium text-wet-navy">{p.name}</p>
                <p className="text-[12px] text-slate-500">
                  {p.manufacturer ?? "—"}
                  {p.permitNumber ? ` · pozw. ${p.permitNumber}` : ""}
                  {p.isVaccine ? " · szczepionka" : ""}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>

      <button
        type="button"
        disabled={loading || selected.size === 0}
        onClick={handleImport}
        className="mt-4 wet-btn-primary disabled:opacity-60"
      >
        Dodaj zaznaczone do katalogu ({selected.size})
      </button>
    </section>
  );
}
