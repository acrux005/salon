"use client";

import { useState, useEffect } from "react";
import type { Treatment } from "@/lib/skinmatch/schema";
import type { ProblemId } from "@/lib/skinmatch/schema";

type Props = {
  treatment: Treatment | null;
  problemIds: ProblemId[];
  problemLabels: Record<ProblemId, string>;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
};

export function TreatmentModal({
  treatment,
  problemIds,
  problemLabels,
  onClose,
  onSubmit,
}: Props) {
  const isEdit = !!treatment;
  const [nazwa, setNazwa] = useState(treatment?.nazwa ?? "");
  const [opis, setOpis] = useState(treatment?.opis ?? "");
  const [problemy, setProblemy] = useState<ProblemId[]>(treatment?.problemy ?? []);
  const [czas, setCzas] = useState(treatment?.czas ?? 45);
  const [cena_od, setCena_od] = useState(treatment?.cena_od ?? 150);
  const [idRaw, setIdRaw] = useState(treatment?.id ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (treatment) {
      setNazwa(treatment.nazwa);
      setOpis(treatment.opis);
      setProblemy(treatment.problemy);
      setCzas(treatment.czas);
      setCena_od(treatment.cena_od);
      setIdRaw(treatment.id);
    } else {
      setNazwa("");
      setOpis("");
      setProblemy([]);
      setCzas(45);
      setCena_od(150);
      setIdRaw("");
    }
  }, [treatment]);

  const toggleProblem = (p: ProblemId) => {
    setProblemy((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : prev.length >= 4 ? prev : [...prev, p]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    if (!isEdit) {
      const id = idRaw.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
      fd.set("id", id);
    }
    fd.set("nazwa", nazwa.trim());
    fd.set("opis", opis.trim());
    fd.set("problemIds", JSON.stringify(problemy));
    fd.set("czas", String(czas));
    fd.set("cena_od", String(cena_od));
    await onSubmit(fd);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-neutral-200 bg-white p-4">
          <h2 className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
            {isEdit ? "Edytuj zabieg" : "Dodaj zabieg"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:text-[#1F1A1C]"
            aria-label="Zamknij"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {!isEdit && (
            <div>
              <label htmlFor="modal-id" className="block text-[14px] font-medium text-[#1F1A1C]">
                ID (snake_case, np. mezoterapia_beziglowa)
              </label>
              <input
                id="modal-id"
                type="text"
                required
                value={idRaw}
                onChange={(e) => setIdRaw(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
          )}
          {isEdit && (
            <div>
              <span className="block text-[14px] font-medium text-[#1F1A1C]">ID</span>
              <p className="mt-1 rounded bg-neutral-100 px-3 py-2 text-[14px]">{treatment.id}</p>
            </div>
          )}
          <div>
            <label htmlFor="modal-nazwa" className="block text-[14px] font-medium text-[#1F1A1C]">
              Nazwa
            </label>
            <input
              id="modal-nazwa"
              type="text"
              required
              value={nazwa}
              onChange={(e) => setNazwa(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>
          <div>
            <label htmlFor="modal-opis" className="block text-[14px] font-medium text-[#1F1A1C]">
              Opis
            </label>
            <textarea
              id="modal-opis"
              rows={3}
              required
              value={opis}
              onChange={(e) => setOpis(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>
          <div>
            <span className="block text-[14px] font-medium text-[#1F1A1C]">
              Problemy (max 4)
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {problemIds.map((p) => (
                <label key={p} className="flex items-center gap-2 text-[14px]">
                  <input
                    type="checkbox"
                    checked={problemy.includes(p)}
                    onChange={() => toggleProblem(p)}
                    disabled={!problemy.includes(p) && problemy.length >= 4}
                    className="rounded border-neutral-300 text-pink-500 focus:ring-pink-500"
                  />
                  {problemLabels[p]}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <label htmlFor="modal-czas" className="block text-[14px] font-medium text-[#1F1A1C]">
                Czas (min)
              </label>
              <input
                id="modal-czas"
                type="number"
                min={0}
                value={czas}
                onChange={(e) => setCzas(Number(e.target.value) || 0)}
                className="mt-1 w-24 rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <div>
              <label htmlFor="modal-cena" className="block text-[14px] font-medium text-[#1F1A1C]">
                Cena od (zł)
              </label>
              <input
                id="modal-cena"
                type="number"
                min={0}
                value={cena_od}
                onChange={(e) => setCena_od(Number(e.target.value) || 0)}
                className="mt-1 w-24 rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-neutral-300 px-4 py-2 text-[14px] font-medium text-[#1F1A1C] hover:bg-neutral-50"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-pink-500 px-4 py-2 text-[14px] font-medium text-white hover:bg-pink-600 disabled:opacity-60"
            >
              {loading ? "Zapisywanie…" : isEdit ? "Zapisz" : "Dodaj"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
