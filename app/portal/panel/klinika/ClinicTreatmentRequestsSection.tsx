"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitClinicTreatmentRequestAction } from "@/app/actions/clinicTreatmentRequest";
import { PROBLEM_LABELS } from "@/content/clinicDemo";
import type { ClinicTreatmentRequestRow } from "@/lib/clinicTreatmentRequestTypes";
import { parseRequestProblemIds } from "@/lib/clinicTreatmentRequestTypes";
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

type Props = {
  className?: string;
  initialRequests: ClinicTreatmentRequestRow[];
};

export function ClinicTreatmentRequestsSection({ className = "", initialRequests }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nazwa: "",
    opis: "",
    problemy: [] as ProblemId[],
    czas: 45,
    cena_od: 150,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const fd = new FormData();
    fd.set("nazwa", form.nazwa.trim());
    fd.set("opis", form.opis.trim());
    fd.set("problemIds", JSON.stringify(form.problemy));
    fd.set("czas", String(form.czas));
    fd.set("cena_od", String(form.cena_od));
    const result = await submitClinicTreatmentRequestAction(fd);
    setLoading(false);
    if (result.ok) {
      setMessage({ type: "ok", text: "Propozycja wysłana. Pojawi się w ofercie po akceptacji przez administratora." });
      setForm({ nazwa: "", opis: "", problemy: [], czas: 45, cena_od: 150 });
      router.refresh();
    } else {
      setMessage({ type: "err", text: result.error });
    }
  }

  function toggleProblem(p: ProblemId) {
    setForm((prev) =>
      prev.problemy.includes(p)
        ? { ...prev, problemy: prev.problemy.filter((x) => x !== p) }
        : prev.problemy.length >= 4
          ? prev
          : { ...prev, problemy: [...prev.problemy, p] }
    );
  }

  const statusLabel: Record<string, string> = {
    pending: "Oczekuje na akceptację",
    approved: "Zaakceptowano",
    rejected: "Odrzucono",
  };
  const statusClass: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <section className={className}>
      <h2 className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
        Twoje propozycje zabiegów
      </h2>
      <p className="mt-1 text-[14px] text-[#6F5E64]">
        Możesz zgłosić własny zabieg (nazwa, opis, czas, cena). Po akceptacji przez administratora trafi do katalogu i do Twojej oferty.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-[14px] font-medium text-[#1F1A1C]">Nazwa zabiegu</label>
            <input
              type="text"
              required
              value={form.nazwa}
              onChange={(e) => setForm((p) => ({ ...p, nazwa: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>
          <div className="flex gap-4 sm:col-span-2">
            <div>
              <label className="block text-[14px] font-medium text-[#1F1A1C]">Czas (min)</label>
              <input
                type="number"
                min={0}
                value={form.czas}
                onChange={(e) => setForm((p) => ({ ...p, czas: Number(e.target.value) || 0 }))}
                className="mt-1 w-24 rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-[#1F1A1C]">Cena od (zł)</label>
              <input
                type="number"
                min={0}
                value={form.cena_od}
                onChange={(e) => setForm((p) => ({ ...p, cena_od: Number(e.target.value) || 0 }))}
                className="mt-1 w-24 rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-[14px] font-medium text-[#1F1A1C]">Opis</label>
          <textarea
            required
            rows={2}
            value={form.opis}
            onChange={(e) => setForm((p) => ({ ...p, opis: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>
        <div className="mt-4">
          <span className="block text-[14px] font-medium text-[#1F1A1C]">Problemy (max 4)</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {PROBLEM_IDS.map((p) => (
              <label key={p} className="flex items-center gap-2 text-[14px]">
                <input
                  type="checkbox"
                  checked={form.problemy.includes(p)}
                  onChange={() => toggleProblem(p)}
                  disabled={!form.problemy.includes(p) && form.problemy.length >= 4}
                  className="rounded border-neutral-300 text-pink-500 focus:ring-pink-500"
                />
                {PROBLEM_LABELS[p]}
              </label>
            ))}
          </div>
        </div>
        {message && (
          <p className={`mt-3 rounded-lg px-4 py-2 text-[14px] ${message.type === "ok" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`} role="alert">
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 rounded-full bg-pink-500 px-6 py-2.5 text-[14px] font-medium text-white hover:bg-pink-600 disabled:opacity-60"
        >
          {loading ? "Wysyłanie…" : "Wyślij propozycję"}
        </button>
      </form>

      {initialRequests.length > 0 && (
        <ul className="mt-6 space-y-3">
          {initialRequests.map((r) => (
            <li key={r.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-[#1F1A1C]">{r.nazwa}</p>
                  <p className="mt-0.5 text-[13px] text-[#6F5E64]">{r.opis}</p>
                  <p className="mt-1 text-[13px] text-neutral-500">
                    {r.czas} min · od {r.cena_od} zł
                    {parseRequestProblemIds(r).length > 0 &&
                      ` · ${parseRequestProblemIds(r).map((p) => PROBLEM_LABELS[p]).join(", ")}`}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${statusClass[r.status] ?? "bg-neutral-100"}`}>
                  {statusLabel[r.status] ?? r.status}
                </span>
              </div>
              {r.status === "approved" && r.createdTreatmentId && (
                <p className="mt-2 text-[13px] text-green-700">
                  Zabieg dodany do katalogu (ID: {r.createdTreatmentId}). Możesz go wybrać w sekcji „Oferowane zabiegi” powyżej.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
