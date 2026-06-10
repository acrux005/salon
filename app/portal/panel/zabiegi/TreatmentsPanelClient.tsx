"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Treatment } from "@/lib/skinmatch/schema";
import type { ProblemId } from "@/lib/skinmatch/schema";
import {
  createTreatmentAction,
  updateTreatmentAction,
  deleteTreatmentAction,
} from "@/app/actions/treatments";
import { TreatmentModal } from "./TreatmentModal";

type Toast = { message: string; type: "success" | "error" };

type Props = {
  initialTreatments: Treatment[];
  problemLabels: Record<ProblemId, string>;
  problemIds: ProblemId[];
  initialSearch: string;
  initialProblemId: string;
};

export function TreatmentsPanelClient({
  initialTreatments,
  problemLabels,
  problemIds,
  initialSearch,
  initialProblemId,
}: Props) {
  const router = useRouter();
  const [toast, setToast] = useState<Toast | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteTreatmentAction(id);
    if (result.ok) {
      showToast("Zabieg usunięty.", "success");
      router.refresh();
    } else {
      showToast(result.error ?? "Błąd usuwania.", "error");
    }
  };

  const openAdd = () => {
    setEditingTreatment(null);
    setModalOpen(true);
  };

  const openEdit = (t: Treatment) => {
    setEditingTreatment(t);
    setModalOpen(true);
  };

  const handleModalSubmit = async (formData: FormData) => {
    if (editingTreatment) {
      const result = await updateTreatmentAction(editingTreatment.id, formData);
      if (result.ok) {
        showToast("Zabieg zaktualizowany.", "success");
        setModalOpen(false);
        setEditingTreatment(null);
        router.refresh();
      } else {
        showToast(result.error ?? "Błąd zapisu.", "error");
      }
    } else {
      const result = await createTreatmentAction(formData);
      if (result.ok) {
        showToast("Zabieg dodany.", "success");
        setModalOpen(false);
        router.refresh();
      } else {
        showToast(result.error ?? "Błąd dodawania.", "error");
      }
    }
  };

  return (
    <>
      {toast && (
        <div
          role="alert"
          className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 shadow-lg ${
            toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const q = (form.querySelector('[name="q"]') as HTMLInputElement)?.value?.trim() ?? "";
            const problem = (form.querySelector('[name="problem"]') as HTMLSelectElement)?.value ?? "";
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (problem) params.set("problem", problem);
            router.push(`/portal/panel/zabiegi${params.toString() ? `?${params}` : ""}`);
          }}
          className="flex flex-wrap items-center gap-2"
        >
          <input
            type="text"
            name="q"
            defaultValue={initialSearch}
            placeholder="Szukaj po nazwie lub ID..."
            className="rounded-lg border border-neutral-300 px-3 py-2 text-[14px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
          <select
            name="problem"
            defaultValue={initialProblemId}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-[14px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          >
            <option value="">Wszystkie problemy</option>
            {problemIds.map((p) => (
              <option key={p} value={p}>
                {problemLabels[p]}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-full bg-neutral-100 px-4 py-2 text-[14px] font-medium text-[#1F1A1C] hover:bg-neutral-200"
          >
            Szukaj
          </button>
        </form>
        <button
          type="button"
          onClick={openAdd}
          className="rounded-full bg-pink-500 px-4 py-2 text-[14px] font-medium text-white hover:bg-pink-600"
        >
          + Dodaj zabieg
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="p-3 font-semibold text-[#1F1A1C]">Nazwa</th>
              <th className="p-3 font-semibold text-[#1F1A1C]">ID</th>
              <th className="p-3 font-semibold text-[#1F1A1C]">Czas</th>
              <th className="p-3 font-semibold text-[#1F1A1C]">Cena od</th>
              <th className="p-3 font-semibold text-[#1F1A1C]">Problemy</th>
              <th className="p-3 font-semibold text-[#1F1A1C]">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {initialTreatments.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-[#6F5E64]">
                  Brak zabiegów. Dodaj pierwszy lub zmień filtr.
                </td>
              </tr>
            ) : (
              initialTreatments.map((t) => (
                <tr key={t.id} className="border-b border-neutral-100 hover:bg-neutral-50/50">
                  <td className="p-3 font-medium text-[#1F1A1C]">{t.nazwa}</td>
                  <td className="p-3">
                    <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[13px]">{t.id}</code>
                  </td>
                  <td className="p-3">{t.czas} min</td>
                  <td className="p-3">{t.cena_od} zł</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {t.problemy.map((p) => (
                        <span
                          key={p}
                          className="rounded-full bg-pink-50 px-2 py-0.5 text-[12px] text-pink-800"
                        >
                          {problemLabels[p]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(t)}
                        className="text-pink-600 hover:underline"
                      >
                        Edytuj
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(t.id)}
                        className="text-red-600 hover:underline"
                      >
                        Usuń
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <TreatmentModal
          treatment={editingTreatment}
          problemIds={problemIds}
          problemLabels={problemLabels}
          onClose={() => {
            setModalOpen(false);
            setEditingTreatment(null);
          }}
          onSubmit={handleModalSubmit}
        />
      )}
    </>
  );
}
