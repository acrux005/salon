"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createSubCabinetAction,
  updateSubCabinetAction,
  deleteSubCabinetAction,
  getSubCabinetTreatmentIdsAction,
  setSubCabinetTreatmentsAction,
} from "@/app/actions/subCabinet";
import type { SubCabinetRecord } from "@/lib/skinmatch/subCabinetDb";
import { Pencil, Trash2, Plus, X, ListChecks } from "lucide-react";

type TreatmentItem = { id: string; nazwa: string };

export function PodgabinetyClient({
  initialSubCabinets,
  initialSubCabinetTreatments,
  availableTreatments,
}: {
  initialSubCabinets: SubCabinetRecord[];
  initialSubCabinetTreatments: Record<string, { id: string; nazwa: string }[]>;
  /** Zabiegi oferowane przez gabinet (z Panel → Klinika) — tylko te można przypisać do podgabinetu. */
  availableTreatments: TreatmentItem[];
}) {
  const router = useRouter();
  const [subCabinets, setSubCabinets] = useState<SubCabinetRecord[]>(initialSubCabinets);
  const [subCabinetTreatments, setSubCabinetTreatments] = useState<Record<string, { id: string; nazwa: string }[]>>(
    () => initialSubCabinetTreatments
  );
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [treatmentsModalId, setTreatmentsModalId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTreatmentIds, setSelectedTreatmentIds] = useState<Set<string>>(new Set());
  const [treatmentSearchQuery, setTreatmentSearchQuery] = useState("");

  useEffect(() => {
    setSubCabinetTreatments(initialSubCabinetTreatments);
  }, [initialSubCabinetTreatments]);

  useEffect(() => {
    if (treatmentsModalId) {
      setTreatmentSearchQuery("");
      getSubCabinetTreatmentIdsAction(treatmentsModalId).then((res) => {
        if (res.ok) setSelectedTreatmentIds(new Set(res.treatmentIds));
        else setSelectedTreatmentIds(new Set());
      });
    }
  }, [treatmentsModalId]);

  const handleCreate = async (formData: FormData) => {
    setSubmitting(true);
    setMessage(null);
    const result = await createSubCabinetAction(formData);
    setSubmitting(false);
    if (result.ok && result.item) {
      setSubCabinets((prev) => [...prev, result.item!].sort((a, b) => a.order - b.order));
      setAddOpen(false);
      router.refresh();
    } else if (!result.ok) {
      setMessage({ type: "err", text: result.error });
    }
  };

  const handleUpdate = async (id: string, formData: FormData) => {
    setSubmitting(true);
    setMessage(null);
    const result = await updateSubCabinetAction(id, formData);
    setSubmitting(false);
    if (result.ok && result.item) {
      setSubCabinets((prev) => prev.map((s) => (s.id === id ? result.item! : s)));
      setEditId(null);
      router.refresh();
    } else if (!result.ok) {
      setMessage({ type: "err", text: result.error });
    }
  };

  const handleDelete = async (id: string) => {
    setSubmitting(true);
    setMessage(null);
    const result = await deleteSubCabinetAction(id);
    setSubmitting(false);
    if (result.ok) {
      setSubCabinets((prev) => prev.filter((s) => s.id !== id));
      setDeleteId(null);
      router.refresh();
    } else if (!result.ok) {
      setMessage({ type: "err", text: result.error });
    }
  };

  const handleSaveTreatments = async () => {
    if (!treatmentsModalId) return;
    setSubmitting(true);
    setMessage(null);
    const result = await setSubCabinetTreatmentsAction(
      treatmentsModalId,
      Array.from(selectedTreatmentIds)
    );
    setSubmitting(false);
    if (result.ok) {
      const savedList = availableTreatments
        .filter((t) => selectedTreatmentIds.has(t.id))
        .map((t) => ({ id: t.id, nazwa: t.nazwa }));
      setSubCabinetTreatments((prev) => ({ ...prev, [treatmentsModalId]: savedList }));
      setTreatmentsModalId(null);
      router.refresh();
    } else if (!result.ok) {
      setMessage({ type: "err", text: result.error });
    }
  };

  const toggleTreatment = (id: string) => {
    setSelectedTreatmentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {message && (
        <p
          className={`rounded-xl px-4 py-3 text-[14px] ${message.type === "ok" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}
        >
          {message.text}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-4 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Dodaj podgabinet
        </button>
      </div>

      {subCabinets.length === 0 ? (
        <p className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-6 text-center font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          Brak podgabinetów. Dodaj pierwszy i przypisz mu zabiegi — wtedy pracownicy przypisani do podgabinetu będą mogli przyjmować tylko te zabiegi.
        </p>
      ) : (
        <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
          {subCabinets.map((s) => {
            const assignedTreatments = subCabinetTreatments[s.id] ?? [];
            return (
              <li key={s.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-[var(--font-sans)] font-medium text-[#1F1A1C]">{s.name}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTreatmentsModalId(s.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-[13px] font-medium text-[#6F5E64] hover:bg-neutral-50"
                    >
                      <ListChecks className="h-3.5 w-3.5" />
                      Zabiegi
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditId(s.id)}
                      className="rounded-lg p-2 text-[#6F5E64] hover:bg-neutral-100"
                      aria-label="Edytuj"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(s.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      aria-label="Usuń"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {assignedTreatments.length > 0 ? (
                  <p className="mt-2 pl-0 text-[13px] text-[#6F5E64]">
                    Przypisane zabiegi: {assignedTreatments.map((t) => t.nazwa).join(", ")}
                  </p>
                ) : (
                  <p className="mt-2 pl-0 text-[13px] text-neutral-400">Brak przypisanych zabiegów</p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {addOpen && (
        <NameModal
          title="Nowy podgabinet"
          initialName=""
          onClose={() => setAddOpen(false)}
          onSubmit={handleCreate}
          submitting={submitting}
        />
      )}

      {editId && (() => {
        const s = subCabinets.find((x) => x.id === editId);
        if (!s) return null;
        return (
          <NameModal
            title="Edytuj podgabinet"
            initialName={s.name}
            onClose={() => setEditId(null)}
            onSubmit={(fd) => handleUpdate(editId, fd)}
            submitting={submitting}
          />
        );
      })()}

      {deleteId && (() => {
        const s = subCabinets.find((x) => x.id === deleteId);
        if (!s) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
            <div className="relative z-10 w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
              <p className="font-[var(--font-sans)] text-[15px] text-[#1F1A1C]">
                Usunąć podgabinet <strong>{s.name}</strong>? Przypisania zabiegów i pracowników zostaną usunięte.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  className="flex-1 rounded-full border border-neutral-200 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C] hover:bg-neutral-50"
                >
                  Anuluj
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteId)}
                  disabled={submitting}
                  className="flex-1 rounded-full bg-red-500 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {submitting ? "Usuwanie…" : "Usuń"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {treatmentsModalId && (() => {
        const sub = subCabinets.find((x) => x.id === treatmentsModalId);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setTreatmentsModalId(null)} />
            <div className="relative z-10 max-h-[85vh] w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl flex flex-col">
              <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                <h2 className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
                  Zabiegi — {sub?.name ?? ""}
                </h2>
                <button
                  type="button"
                  onClick={() => setTreatmentsModalId(null)}
                  className="rounded-full p-2 text-[#6F5E64] hover:bg-neutral-100"
                  aria-label="Zamknij"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="px-6 pt-2 text-[13px] text-[#6F5E64]">
                Zaznacz zabiegi, które można wykonać w tym podgabincie. Pracownik przypisany do tego podgabinetu będzie mógł przyjmować tylko te zabiegi.
              </p>
              <div className="px-6 pt-3">
                <input
                  type="search"
                  value={treatmentSearchQuery}
                  onChange={(e) => setTreatmentSearchQuery(e.target.value)}
                  placeholder="Szukaj zabiegu (min. 3 znaki)"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 font-[var(--font-sans)] text-[14px] text-[#1F1A1C] placeholder:text-neutral-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  aria-label="Szukaj zabiegu"
                />
              </div>
              <div className="flex-1 overflow-auto px-6 py-4">
                {availableTreatments.length === 0 ? (
                  <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-4 text-[14px] text-amber-800">
                    Najpierw wybierz zabiegi oferowane przez gabinet w{" "}
                    <a href="/portal/panel/klinika" className="font-medium underline hover:no-underline">
                      Panel → Klinika
                    </a>
                    . Tylko te zabiegi można przypisać do podgabinetów.
                  </p>
                ) : (() => {
                  const q = treatmentSearchQuery.trim().toLowerCase();
                  const filtered =
                    q.length >= 3
                      ? availableTreatments.filter((t) => t.nazwa.toLowerCase().includes(q))
                      : availableTreatments;
                  return (
                    <ul className="space-y-2">
                      {filtered.length === 0 ? (
                        <li className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-4 text-center text-[14px] text-[#6F5E64]">
                          Brak zabiegów pasujących do wyszukiwania.
                        </li>
                      ) : (
                        filtered.map((t) => (
                          <li key={t.id}>
                            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-100 px-3 py-2 hover:bg-neutral-50">
                              <input
                                type="checkbox"
                                checked={selectedTreatmentIds.has(t.id)}
                                onChange={() => toggleTreatment(t.id)}
                                className="h-4 w-4 rounded border-neutral-300 text-pink-500 focus:ring-pink-500"
                              />
                              <span className="font-[var(--font-sans)] text-[14px] text-[#1F1A1C]">
                                {t.nazwa}
                              </span>
                            </label>
                          </li>
                        ))
                      )}
                    </ul>
                  );
                })()}
              </div>
              <div className="flex gap-3 border-t border-neutral-200 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setTreatmentsModalId(null)}
                  className="flex-1 rounded-full border border-neutral-200 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C] hover:bg-neutral-50"
                >
                  Anuluj
                </button>
                <button
                  type="button"
                  onClick={handleSaveTreatments}
                  disabled={submitting}
                  className="flex-1 rounded-full bg-pink-500 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-white hover:bg-pink-600 disabled:opacity-50"
                >
                  {submitting ? "Zapisywanie…" : "Zapisz"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function NameModal({
  title,
  initialName,
  onClose,
  onSubmit,
  submitting,
}: {
  title: string;
  initialName: string;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  submitting: boolean;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    onSubmit(fd);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#6F5E64] hover:bg-neutral-100"
            aria-label="Zamknij"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6">
          <label htmlFor="subcabinet-name" className="block text-[14px] font-medium text-[#6F5E64]">
            Nazwa podgabinetu
          </label>
          <input
            id="subcabinet-name"
            name="name"
            type="text"
            required
            defaultValue={initialName}
            placeholder="np. Gabinet 1 – stopy"
            className="mt-1.5 w-full rounded-xl border border-neutral-200 px-4 py-3 font-[var(--font-sans)] text-[15px] text-[#1F1A1C] focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
          />
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-neutral-200 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C] hover:bg-neutral-50"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-full bg-pink-500 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-white hover:bg-pink-600 disabled:opacity-50"
            >
              {submitting ? "Zapisywanie…" : "Zapisz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
