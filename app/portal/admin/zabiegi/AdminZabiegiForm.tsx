"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTreatmentAction } from "@/app/actions/admin";
import { PROBLEM_LABELS } from "@/content/clinicDemo";
import type { ProblemId } from "@/lib/skinmatch/schema";

const PROBLEM_IDS: ProblemId[] = [
  "tradzik",
  "przebarwienia",
  "anti_aging",
  "naczynka",
  "sucha_skora",
  "zmarszczki",
  "jedrnost",
  "owal",
  "brwi_rzesy",
  "makijaz",
  "wlosy",
  "stopy",
  "masaze",
  "terapia_manualna",
  "dzwiekoterapia",
];

export function AdminZabiegiForm({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: "",
    nazwa: "",
    opis: "",
    problemy: [] as ProblemId[],
    czas: 60,
    cena_od: 200,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData();
    fd.set("id", form.id);
    fd.set("nazwa", form.nazwa);
    fd.set("opis", form.opis);
    fd.set("problemIds", JSON.stringify(form.problemy));
    fd.set("czas", String(form.czas));
    fd.set("cena_od", String(form.cena_od));
    const result = await createTreatmentAction(fd);
    setLoading(false);
    if (result.ok) {
      setForm({ id: "", nazwa: "", opis: "", problemy: [], czas: 60, cena_od: 200 });
      router.refresh();
      return;
    }
    setError(result.error);
  }

  function toggleProblem(p: ProblemId) {
    setForm((prev) => ({
      ...prev,
      problemy: prev.problemy.includes(p) ? prev.problemy.filter((x) => x !== p) : [...prev.problemy, p],
    }));
  }

  return (
    <form onSubmit={handleSubmit} className={`rounded-xl border border-neutral-200 bg-white p-6 shadow-sm ${className}`}>
      <h2 className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">Dodaj zabieg</h2>
      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-[14px] text-red-700" role="alert">
          {error}
        </p>
      )}
      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="admin-t-id" className="block text-[14px] font-medium text-[#1F1A1C]">
            ID (slug, np. mezoterapia_beziglowa)
          </label>
          <input
            id="admin-t-id"
            type="text"
            required
            value={form.id}
            onChange={(e) => setForm((p) => ({ ...p, id: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>
        <div>
          <label htmlFor="admin-t-nazwa" className="block text-[14px] font-medium text-[#1F1A1C]">
            Nazwa
          </label>
          <input
            id="admin-t-nazwa"
            type="text"
            required
            value={form.nazwa}
            onChange={(e) => setForm((p) => ({ ...p, nazwa: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>
        <div>
          <label htmlFor="admin-t-opis" className="block text-[14px] font-medium text-[#1F1A1C]">
            Opis
          </label>
          <textarea
            id="admin-t-opis"
            rows={3}
            required
            value={form.opis}
            onChange={(e) => setForm((p) => ({ ...p, opis: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>
        <div>
          <span className="block text-[14px] font-medium text-[#1F1A1C]">Problemy (dopasowanie)</span>
          <div className="mt-2 flex flex-wrap gap-3">
            {PROBLEM_IDS.map((p) => (
              <label key={p} className="flex items-center gap-2 text-[14px]">
                <input
                  type="checkbox"
                  checked={form.problemy.includes(p)}
                  onChange={() => toggleProblem(p)}
                  className="rounded border-neutral-300 text-pink-500 focus:ring-pink-500"
                />
                {PROBLEM_LABELS[p]}
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <label htmlFor="admin-t-czas" className="block text-[14px] font-medium text-[#1F1A1C]">
              Czas (min)
            </label>
            <input
              id="admin-t-czas"
              type="number"
              min={1}
              value={form.czas}
              onChange={(e) => setForm((p) => ({ ...p, czas: Number(e.target.value) || 0 }))}
              className="mt-1 w-24 rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>
          <div>
            <label htmlFor="admin-t-cena" className="block text-[14px] font-medium text-[#1F1A1C]">
              Cena od (zł)
            </label>
            <input
              id="admin-t-cena"
              type="number"
              min={0}
              value={form.cena_od}
              onChange={(e) => setForm((p) => ({ ...p, cena_od: Number(e.target.value) || 0 }))}
              className="mt-1 w-24 rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-pink-500 py-3 px-6 font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600 disabled:opacity-60"
        >
          {loading ? "Dodawanie…" : "Dodaj zabieg"}
        </button>
      </div>
    </form>
  );
}
