"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createStaffAction,
  updateStaffAction,
  deleteStaffAction,
  getStaffTreatmentIdsAction,
  setStaffTreatmentsAction,
} from "@/app/actions/staff";
import type { StaffRecord } from "@/lib/skinmatch/staffDb";
import type { SubCabinetRecord } from "@/lib/skinmatch/subCabinetDb";
import { Pencil, Trash2, UserPlus, X, ListChecks } from "lucide-react";

type TreatmentItem = { id: string; nazwa: string };

export function KosmetyczkiClient({
  initialStaff,
  initialSubCabinets = [],
  initialStaffTreatments = {},
  availableTreatments = [],
}: {
  initialStaff: StaffRecord[];
  initialSubCabinets?: SubCabinetRecord[];
  initialStaffTreatments?: Record<string, { id: string; nazwa: string }[]>;
  /** Zabiegi oferowane przez gabinet (z Panel → Klinika) — tylko te można przypisać pracownikowi. */
  availableTreatments?: TreatmentItem[];
}) {
  const subCabinetMap = Object.fromEntries(initialSubCabinets.map((s) => [s.id, s.name]));
  const router = useRouter();
  const [staff, setStaff] = useState<StaffRecord[]>(initialStaff);
  const [staffTreatments, setStaffTreatments] = useState<Record<string, { id: string; nazwa: string }[]>>(
    () => initialStaffTreatments
  );
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [treatmentsModalStaffId, setTreatmentsModalStaffId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [staffTreatmentSearchQuery, setStaffTreatmentSearchQuery] = useState("");
  const [selectedStaffTreatmentIds, setSelectedStaffTreatmentIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setStaffTreatments(initialStaffTreatments);
  }, [initialStaffTreatments]);

  useEffect(() => {
    if (treatmentsModalStaffId) {
      setStaffTreatmentSearchQuery("");
      getStaffTreatmentIdsAction(treatmentsModalStaffId).then((res) => {
        if (res.ok) setSelectedStaffTreatmentIds(new Set(res.treatmentIds));
        else setSelectedStaffTreatmentIds(new Set());
      });
    }
  }, [treatmentsModalStaffId]);

  const handleCreate = async (formData: FormData) => {
    setSubmitting(true);
    setMessage(null);
    const result = await createStaffAction(formData);
    setSubmitting(false);
    if (result.ok && result.item) {
      setStaff((prev) => [...prev, result.item!].sort((a, b) => a.order - b.order));
      setAddOpen(false);
      router.refresh();
    } else if (!result.ok) {
      setMessage({ type: "err", text: result.error });
    }
  };

  const handleUpdate = async (id: string, formData: FormData) => {
    setSubmitting(true);
    setMessage(null);
    const result = await updateStaffAction(id, formData);
    setSubmitting(false);
    if (result.ok && result.item) {
      setStaff((prev) => prev.map((s) => (s.id === id ? result.item! : s)));
      setEditId(null);
      router.refresh();
    } else if (!result.ok) {
      setMessage({ type: "err", text: result.error });
    }
  };

  const handleDelete = async (id: string) => {
    setSubmitting(true);
    setMessage(null);
    const result = await deleteStaffAction(id);
    setSubmitting(false);
    if (result.ok) {
      setStaff((prev) => prev.filter((s) => s.id !== id));
      setDeleteId(null);
      router.refresh();
    } else if (!result.ok) {
      setMessage({ type: "err", text: result.error });
    }
  };

  const handleSaveStaffTreatments = async () => {
    if (!treatmentsModalStaffId) return;
    setSubmitting(true);
    setMessage(null);
    const result = await setStaffTreatmentsAction(
      treatmentsModalStaffId,
      Array.from(selectedStaffTreatmentIds)
    );
    setSubmitting(false);
    if (result.ok) {
      const savedList = availableTreatments
        .filter((t) => selectedStaffTreatmentIds.has(t.id))
        .map((t) => ({ id: t.id, nazwa: t.nazwa }));
      setStaffTreatments((prev) => ({ ...prev, [treatmentsModalStaffId]: savedList }));
      setTreatmentsModalStaffId(null);
      router.refresh();
    } else if (!result.ok) {
      setMessage({ type: "err", text: result.error });
    }
  };

  const toggleStaffTreatment = (id: string) => {
    setSelectedStaffTreatmentIds((prev) => {
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
          <UserPlus className="h-4 w-4" />
          Dodaj pracownika
        </button>
      </div>

      {staff.length === 0 ? (
        <p className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-6 text-center font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          Brak pracowników. Dodaj pierwszego — każdy będzie miał swój kalendarz w panelu.
        </p>
      ) : (
        <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
          {staff.map((s) => {
            const assignedTreatments = staffTreatments[s.id] ?? [];
            return (
              <li key={s.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-[var(--font-sans)] font-medium text-[#1F1A1C]">{s.name}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[13px] text-[#6F5E64]">
                      {s.subCabinetIds.length > 0 && (
                        <span>
                          Podgabinety:{" "}
                          {s.subCabinetIds.length === initialSubCabinets.length
                            ? "wszystkie"
                            : s.subCabinetIds.map((id) => subCabinetMap[id]).filter(Boolean).join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTreatmentsModalStaffId(s.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-[13px] font-medium text-[#6F5E64] hover:bg-neutral-50"
                    >
                      <ListChecks className="h-3.5 w-3.5" />
                      Zabiegi
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditId(s.id)}
                      className="rounded-lg p-2 text-[#6F5E64] hover:bg-neutral-100 hover:text-[#1F1A1C]"
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
                  <p className="mt-2 text-[13px] text-[#6F5E64]">
                    Wykonuje zabiegi: {assignedTreatments.map((t) => t.nazwa).join(", ")}
                  </p>
                ) : (
                  <p className="mt-2 text-[13px] text-neutral-400">
                    Wszystkie zabiegi z podgabinetu (lub dowolne, jeśli brak podgabinetu)
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {addOpen && (
        <StaffModal
          title="Nowy pracownik"
          initialName=""
          initialCosmoStaffId=""
          initialSubCabinetIds={[]}
          subCabinets={initialSubCabinets}
          onClose={() => setAddOpen(false)}
          onSubmit={handleCreate}
          submitting={submitting}
        />
      )}

      {editId && (() => {
        const s = staff.find((x) => x.id === editId);
        if (!s) return null;
        return (
          <StaffModal
            title="Edytuj pracownika"
            initialName={s.name}
            initialCosmoStaffId={s.cosmoStaffId != null ? String(s.cosmoStaffId) : ""}
            initialSubCabinetIds={s.subCabinetIds ?? []}
            subCabinets={initialSubCabinets}
            onClose={() => setEditId(null)}
            onSubmit={(fd) => handleUpdate(editId, fd)}
            submitting={submitting}
          />
        );
      })()}

      {deleteId && (() => {
        const s = staff.find((x) => x.id === deleteId);
        if (!s) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
            <div className="relative z-10 w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
              <p className="font-[var(--font-sans)] text-[15px] text-[#1F1A1C]">
                Usunąć pracownika <strong>{s.name}</strong>? Jego rezerwacje w kalendarzu pozostaną w historii.
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

      {treatmentsModalStaffId && (() => {
        const s = staff.find((x) => x.id === treatmentsModalStaffId);
        const q = staffTreatmentSearchQuery.trim().toLowerCase();
        const filtered =
          q.length >= 3
            ? availableTreatments.filter((t) => t.nazwa.toLowerCase().includes(q))
            : availableTreatments;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setTreatmentsModalStaffId(null)} />
            <div className="relative z-10 flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                <h2 className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
                  Zabiegi — {s?.name ?? ""}
                </h2>
                <button
                  type="button"
                  onClick={() => setTreatmentsModalStaffId(null)}
                  className="rounded-full p-2 text-[#6F5E64] hover:bg-neutral-100"
                  aria-label="Zamknij"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="px-6 pt-2 text-[13px] text-[#6F5E64]">
                Zaznacz zabiegi, które wykonuje ten pracownik. Pusta lista = może wykonywać wszystkie z podgabinetu (lub dowolne). Tylko zabiegi oferowane przez gabinet (Panel → Klinika).
              </p>
              <div className="px-6 pt-3">
                <input
                  type="search"
                  value={staffTreatmentSearchQuery}
                  onChange={(e) => setStaffTreatmentSearchQuery(e.target.value)}
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
                    . Tylko te zabiegi można przypisać pracownikom.
                  </p>
                ) : (
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
                              checked={selectedStaffTreatmentIds.has(t.id)}
                              onChange={() => toggleStaffTreatment(t.id)}
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
                )}
              </div>
              <div className="flex gap-3 border-t border-neutral-200 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setTreatmentsModalStaffId(null)}
                  className="flex-1 rounded-full border border-neutral-200 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C] hover:bg-neutral-50"
                >
                  Anuluj
                </button>
                <button
                  type="button"
                  onClick={handleSaveStaffTreatments}
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

function StaffModal({
  title,
  initialName,
  initialCosmoStaffId,
  initialSubCabinetIds,
  subCabinets,
  onClose,
  onSubmit,
  submitting,
}: {
  title: string;
  initialName: string;
  initialCosmoStaffId: string;
  initialSubCabinetIds: string[];
  subCabinets: SubCabinetRecord[];
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
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="staff-name" className="block text-[14px] font-medium text-[#6F5E64]">
              Imię i nazwisko
            </label>
            <input
              id="staff-name"
              name="name"
              type="text"
              required
              defaultValue={initialName}
              className="mt-1.5 w-full rounded-xl border border-neutral-200 px-4 py-3 font-[var(--font-sans)] text-[15px] text-[#1F1A1C] focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
              placeholder="np. Anna Kowalska"
            />
          </div>
          {subCabinets.length > 0 && (
            <div>
              <span className="block text-[14px] font-medium text-[#6F5E64]">
                Podgabinety <span className="font-normal text-neutral-400">(opcjonalnie, można wybrać wiele)</span>
              </span>
              <ul className="mt-2 space-y-2">
                {subCabinets.map((sc) => (
                  <li key={sc.id}>
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-100 px-3 py-2 hover:bg-neutral-50">
                      <input
                        type="checkbox"
                        name="subCabinetIds"
                        value={sc.id}
                        defaultChecked={initialSubCabinetIds.includes(sc.id)}
                        className="h-4 w-4 rounded border-neutral-300 text-pink-500 focus:ring-pink-500"
                      />
                      <span className="font-[var(--font-sans)] text-[14px] text-[#1F1A1C]">{sc.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <p className="mt-1 text-[13px] text-[#6F5E64]">
                Zaznacz podgabinety, w których pracownik przyjmuje. Brak zaznaczenia = może wykonywać dowolne zabiegi z oferty.
              </p>
            </div>
          )}
          <input type="hidden" name="cosmoStaffId" defaultValue={initialCosmoStaffId} />
          <div className="flex gap-3 pt-2">
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
