"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { updateVetNoOrderDaysAction } from "@/app/actions/vet";
import {
  type WetCalendarAppointment,
  addDaysYmd,
  todayYmd,
} from "@/lib/vet/appointmentDisplay";
import {
  VET_VISIT_TYPES,
  visitCalendarBlockClass,
  visitTypeBadgeClass,
  visitTypeLabel,
} from "@/lib/vet/visitTypes";
import { resolveVisitTypeFromCatalog, type VetCatalogItemDto } from "@/lib/vet/catalog";
import {
  VET_VISIT_STATUSES,
  visitStatusBadgeClass,
  visitStatusLabel,
} from "@/lib/vet/visitStatus";

const BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";

const TIME_SLOTS = (() => {
  const out: string[] = [];
  for (let h = 8; h <= 20; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 20) out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
})();

const WEEKDAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];

type DoctorOption = { id: string; name: string };
type PetOption = { id: string; name: string; ownerName: string; ownerPhone: string; label: string };

function getDaysInMonth(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = (first.getDay() + 6) % 7;
  const days: (Date | null)[] = Array(startPad).fill(null);
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

function formatDayHeading(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type QuickForm = {
  petId: string;
  catalogItemId: string;
  date: string;
  time: string;
  visitType: string;
  vetDoctorId: string;
  notes: string;
};

export function WetCalendarClient({
  vetSlug,
  staffIdParam,
  noOrderDays = [],
  onAfterUpdate,
}: {
  vetSlug: string;
  staffIdParam?: string;
  noOrderDays?: string[];
  onAfterUpdate?: () => void;
}) {
  const router = useRouter();
  const [viewDay, setViewDay] = useState(todayYmd);
  const [showMonth, setShowMonth] = useState(false);
  const [monthData, setMonthData] = useState<Record<string, WetCalendarAppointment[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [pets, setPets] = useState<PetOption[]>([]);
  const [catalogItems, setCatalogItems] = useState<VetCatalogItemDto[]>([]);
  const [selected, setSelected] = useState<{ date: string; item: WetCalendarAppointment } | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [quickError, setQuickError] = useState<string | null>(null);
  const [quickForm, setQuickForm] = useState<QuickForm>(() => ({
    petId: "",
    catalogItemId: "",
    date: todayYmd(),
    time: "09:00",
    visitType: "kontrola",
    vetDoctorId: staffIdParam ?? "",
    notes: "",
  }));
  const [editOpen, setEditOpen] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    date: "",
    time: "09:00",
    visitType: "kontrola",
    vetDoctorId: "",
    notes: "",
    status: "planned",
  });
  const [updating, setUpdating] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [blockForm, setBlockForm] = useState({ date: "", time: "09:00", wholeDay: false });
  const [blockSubmitting, setBlockSubmitting] = useState(false);
  const [blockError, setBlockError] = useState<string | null>(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [monthCursor, setMonthCursor] = useState(() => {
    const t = todayYmd();
    return { year: Number(t.slice(0, 4)), month: Number(t.slice(5, 7)) - 1 };
  });

  const activeMonthStr = showMonth
    ? `${monthCursor.year}-${String(monthCursor.month + 1).padStart(2, "0")}`
    : viewDay.slice(0, 7);

  const loadDoctorsAndPets = useCallback(() => {
    fetch(`${BASE}/api/wet/booking/staff?vet_slug=${encodeURIComponent(vetSlug)}`)
      .then((r) => r.json())
      .then((d) => setDoctors((d.staff ?? []) as DoctorOption[]))
      .catch(() => {});
    fetch(`${BASE}/api/wet/panel/patients`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const flat: PetOption[] = [];
        for (const o of d.owners ?? []) {
          for (const p of o.pets ?? []) {
            flat.push({
              id: p.id,
              name: p.name,
              ownerName: o.name,
              ownerPhone: o.phone,
              label: `${p.name} · ${o.name}`,
            });
          }
        }
        setPets(flat);
      })
      .catch(() => {});
    fetch(`${BASE}/api/wet/panel/catalog`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setCatalogItems(d.items ?? []))
      .catch(() => {});
  }, [vetSlug]);

  const fetchMonth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ month: activeMonthStr });
      if (vetSlug) params.set("vet_slug", vetSlug);
      if (staffIdParam) params.set("staff_id", staffIdParam);
      const res = await fetch(`${BASE}/api/wet/booking/calendar?${params}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error ?? "Błąd ładowania kalendarza.");
        setMonthData({});
        return;
      }
      setMonthData((json.appointments ?? {}) as Record<string, WetCalendarAppointment[]>);
    } catch {
      setError("Błąd połączenia.");
      setMonthData({});
    } finally {
      setLoading(false);
    }
  }, [activeMonthStr, vetSlug, staffIdParam]);

  useEffect(() => {
    fetchMonth();
  }, [fetchMonth]);

  useEffect(() => {
    loadDoctorsAndPets();
  }, [loadDoctorsAndPets]);

  useEffect(() => {
    setQuickForm((f) => ({
      ...f,
      date: viewDay,
      vetDoctorId: staffIdParam ?? f.vetDoctorId,
    }));
  }, [viewDay, staffIdParam]);

  const dayAppointments = useMemo(() => {
    return (monthData[viewDay] ?? [])
      .filter((a) => a.status !== "cancelled")
      .slice()
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [monthData, viewDay]);

  const openQuickAdd = () => {
    setQuickError(null);
    setQuickForm({
      petId: pets[0]?.id ?? "",
      catalogItemId: "",
      date: viewDay,
      time: "09:00",
      visitType: "kontrola",
      vetDoctorId: staffIdParam ?? doctors[0]?.id ?? "",
      notes: "",
    });
    setQuickOpen(true);
  };

  const submitQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickForm.petId) {
      setQuickError("Wybierz zwierzę z bazy.");
      return;
    }
    setQuickSubmitting(true);
    setQuickError(null);
    try {
      const res = await fetch(`${BASE}/api/wet/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vetSlug,
          date: quickForm.date,
          time: quickForm.time,
          petId: quickForm.petId,
          visitType: quickForm.visitType,
          vetDoctorId: quickForm.vetDoctorId || staffIdParam,
          notes: quickForm.notes || undefined,
          catalogItemId: quickForm.catalogItemId || undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setQuickError((json as { error?: string }).error ?? "Nie udało się dodać wizyty.");
        return;
      }
      setQuickOpen(false);
      setViewDay(quickForm.date);
      await fetchMonth();
      onAfterUpdate?.();
    } finally {
      setQuickSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`${BASE}/api/wet/booking/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert((j as { error?: string }).error ?? "Nie udało się zaktualizować.");
        return;
      }
      setSelected(null);
      await fetchMonth();
      onAfterUpdate?.();
    } finally {
      setUpdating(false);
    }
  };

  const openEdit = () => {
    if (!selected) return;
    setEditForm({
      date: selected.date,
      time: selected.item.time,
      visitType: selected.item.visitType ?? "kontrola",
      vetDoctorId: selected.item.doctorId ?? staffIdParam ?? "",
      notes: selected.item.notes ?? "",
      status: selected.item.status,
    });
    setEditError(null);
    setEditOpen(true);
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setEditSubmitting(true);
    setEditError(null);
    try {
      const res = await fetch(`${BASE}/api/wet/booking/appointments/${selected.item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: editForm.date,
          time: editForm.time,
          visitType: editForm.visitType,
          vetDoctorId: editForm.vetDoctorId || undefined,
          notes: editForm.notes,
          status: editForm.status,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setEditError((j as { error?: string }).error ?? "Nie udało się zapisać.");
        return;
      }
      setEditOpen(false);
      setSelected(null);
      setViewDay(editForm.date);
      await fetchMonth();
      onAfterUpdate?.();
    } finally {
      setEditSubmitting(false);
    }
  };

  const submitBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlockSubmitting(true);
    setBlockError(null);
    try {
      if (blockForm.wholeDay) {
        const newDays = Array.from(new Set([...noOrderDays, blockForm.date]))
          .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
          .sort();
        const result = await updateVetNoOrderDaysAction(newDays);
        if (!result.ok) {
          setBlockError(result.error ?? "Nie udało się zablokować dnia.");
          return;
        }
        setBlockOpen(false);
        router.refresh();
        onAfterUpdate?.();
        return;
      }
      const res = await fetch(`${BASE}/api/wet/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vetSlug,
          date: blockForm.date,
          time: blockForm.time,
          ownerName: "— Zablokowane —",
          phone: "—",
          staffId: staffIdParam,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setBlockError((j as { error?: string }).error ?? "Nie udało się zablokować.");
        return;
      }
      setBlockOpen(false);
      await fetchMonth();
      onAfterUpdate?.();
    } finally {
      setBlockSubmitting(false);
    }
  };

  const isBlockedDay = noOrderDays.includes(viewDay);
  const today = todayYmd();
  const days = getDaysInMonth(monthCursor.year, monthCursor.month);

  return (
    <div className="relative space-y-4 pb-20">
      {/* Nawigacja dnia */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewDay((d) => addDaysYmd(d, -1))}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-[14px] hover:bg-neutral-50"
          >
            ← Wczoraj
          </button>
          <button
            type="button"
            onClick={() => setViewDay(today)}
            className={`rounded-lg px-3 py-2 text-[14px] font-medium ${
              viewDay === today
                ? "bg-wet-teal-500 text-white"
                : "border border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            Dziś
          </button>
          <button
            type="button"
            onClick={() => setViewDay((d) => addDaysYmd(d, 1))}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-[14px] hover:bg-neutral-50"
          >
            Jutro →
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={viewDay}
            onChange={(e) => e.target.value && setViewDay(e.target.value)}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-[14px]"
          />
          <button
            type="button"
            onClick={() => setShowMonth((v) => !v)}
            className="rounded-lg border border-wet-teal-200 px-3 py-2 text-[14px] text-wet-teal-800 hover:bg-wet-teal-50"
          >
            {showMonth ? "Ukryj miesiąc" : "Widok miesiąca"}
          </button>
          <button
            type="button"
            onClick={() => {
              setBlockForm({ date: viewDay, time: "09:00", wholeDay: false });
              setBlockError(null);
              setBlockOpen(true);
            }}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-[14px] hover:bg-neutral-50"
          >
            Zablokuj
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-[14px] text-amber-800">
          {error}
        </p>
      )}

      {/* Timeline dnia */}
      <section className="rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-4 py-3">
          <h2 className="font-semibold text-wet-navy capitalize">{formatDayHeading(viewDay)}</h2>
          {isBlockedDay && (
            <p className="mt-1 text-[13px] text-neutral-500">🔒 Dzień zablokowany — brak rezerwacji online</p>
          )}
        </div>
        {loading ? (
          <p className="px-4 py-8 text-[14px] text-neutral-500">Ładowanie…</p>
        ) : dayAppointments.length === 0 ? (
          <p className="px-4 py-8 text-[14px] text-neutral-500">
            Brak wizyt{isBlockedDay ? " (dzień zablokowany)" : ""}. Użyj szybkiego dodawania poniżej.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {dayAppointments.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelected({ date: viewDay, item })}
                  className={`flex w-full items-center gap-4 px-4 py-3 text-left transition hover:opacity-90 ${visitCalendarBlockClass(item.visitType, item.status)}`}
                >
                  <span className="w-14 shrink-0 text-[15px] font-bold tabular-nums">{item.time}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{item.label}</span>
                    {item.notes && (
                      <span className="mt-0.5 block truncate text-[12px] opacity-80">{item.notes}</span>
                    )}
                  </span>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${visitTypeBadgeClass(item.visitType)}`}
                  >
                    {visitTypeLabel(item.visitType)}
                  </span>
                  {item.doctorName && (
                    <span className="hidden shrink-0 text-[12px] opacity-75 sm:block">{item.doctorName}</span>
                  )}
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${visitStatusBadgeClass(item.status)}`}>
                    {visitStatusLabel(item.status)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Legenda typów */}
      <div className="flex flex-wrap gap-2 text-[12px]">
        {VET_VISIT_TYPES.map((t) => (
          <span
            key={t.value}
            className={`rounded-full border px-2 py-0.5 font-medium ${visitTypeBadgeClass(t.value)}`}
          >
            {t.label}
          </span>
        ))}
      </div>

      {/* Widok miesiąca */}
      {showMonth && !loading && (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-center gap-3 border-b border-neutral-100 py-3">
            <button
              type="button"
              onClick={() =>
                setMonthCursor((c) =>
                  c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }
                )
              }
              className="rounded-lg border px-2 py-1"
            >
              ‹
            </button>
            <span className="w-40 text-center font-semibold capitalize">
              {new Date(monthCursor.year, monthCursor.month).toLocaleDateString("pl-PL", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              type="button"
              onClick={() =>
                setMonthCursor((c) =>
                  c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }
                )
              }
              className="rounded-lg border px-2 py-1"
            >
              ›
            </button>
          </div>
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr>
                {WEEKDAYS.map((d) => (
                  <th key={d} className="border-b bg-neutral-50 py-2 text-neutral-500">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.ceil(days.length / 7) }, (_, row) => (
                <tr key={row}>
                  {WEEKDAYS.map((_, col) => {
                    const i = row * 7 + col;
                    const day = days[i];
                    const dateStr = day
                      ? `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`
                      : "";
                    const list = dateStr
                      ? (monthData[dateStr] ?? []).filter((a) => a.status !== "cancelled").slice(0, 3)
                      : [];
                    const isSelected = dateStr === viewDay;
                    return (
                      <td
                        key={col}
                        className={`min-h-[80px] border-b border-r align-top p-1 ${noOrderDays.includes(dateStr) ? "bg-neutral-100" : ""} ${isSelected ? "ring-2 ring-inset ring-wet-teal-400" : ""}`}
                      >
                        {day ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setViewDay(dateStr);
                                setShowMonth(false);
                              }}
                              className={`mb-1 rounded px-1 font-medium ${dateStr === today ? "bg-wet-teal-500 text-white" : ""}`}
                            >
                              {day.getDate()}
                            </button>
                            <ul className="space-y-0.5">
                              {list.map((item) => (
                                <li
                                  key={item.id}
                                  className={`truncate rounded px-1 py-0.5 ${visitCalendarBlockClass(item.visitType, item.status)}`}
                                >
                                  {item.time} {item.petName ?? item.ownerName}
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Floating quick add */}
      <button
        type="button"
        onClick={openQuickAdd}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-wet-teal-500 text-white shadow-lg shadow-wet-teal/30 hover:bg-wet-teal-600"
        aria-label="Szybkie dodanie wizyty"
      >
        <Plus className="h-7 w-7" />
      </button>

      {/* Quick add modal */}
      {quickOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-wet-navy">Szybka wizyta</h3>
            <p className="mt-1 text-[13px] text-wet-navy-muted">Zwierzę · data · typ · lekarz · zapisz</p>
            <form onSubmit={submitQuickAdd} className="mt-4 space-y-3">
              {quickError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">{quickError}</p>
              )}
              <label className="block text-[13px] font-medium">
                Zwierzę *
                <select
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-[14px]"
                  value={quickForm.petId}
                  onChange={(e) => setQuickForm((f) => ({ ...f, petId: e.target.value }))}
                  required
                >
                  <option value="">— wybierz —</option>
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-[13px] font-medium">
                  Data *
                  <input
                    type="date"
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-[14px]"
                    value={quickForm.date}
                    onChange={(e) => setQuickForm((f) => ({ ...f, date: e.target.value }))}
                    required
                  />
                </label>
                <label className="block text-[13px] font-medium">
                  Godzina *
                  <select
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-[14px]"
                    value={quickForm.time}
                    onChange={(e) => setQuickForm((f) => ({ ...f, time: e.target.value }))}
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block text-[13px] font-medium">
                Usługa z katalogu (opcjonalnie)
                <select
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-[14px]"
                  value={quickForm.catalogItemId}
                  onChange={(e) => {
                    const id = e.target.value;
                    const item = catalogItems.find((c) => c.id === id);
                    if (item) {
                      setQuickForm((f) => ({
                        ...f,
                        catalogItemId: id,
                        visitType: resolveVisitTypeFromCatalog(item),
                        notes: f.notes || item.name,
                      }));
                    } else {
                      setQuickForm((f) => ({ ...f, catalogItemId: "" }));
                    }
                  }}
                >
                  <option value="">— bez katalogu —</option>
                  {catalogItems.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-[13px] font-medium">
                Typ wizyty *
                <select
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-[14px]"
                  value={quickForm.visitType}
                  onChange={(e) => setQuickForm((f) => ({ ...f, visitType: e.target.value }))}
                >
                  {VET_VISIT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
              {doctors.length > 0 && (
                <label className="block text-[13px] font-medium">
                  Lekarz
                  <select
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-[14px]"
                    value={quickForm.vetDoctorId}
                    onChange={(e) => setQuickForm((f) => ({ ...f, vetDoctorId: e.target.value }))}
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className="block text-[13px] font-medium">
                Notatka (opcjonalnie)
                <input
                  type="text"
                  placeholder="np. kontrola za 2 tyg."
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-[14px]"
                  value={quickForm.notes}
                  onChange={(e) => setQuickForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </label>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickOpen(false)}
                  className="flex-1 rounded-lg border px-4 py-2 text-[14px]"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={quickSubmitting}
                  className="flex-1 rounded-lg bg-wet-teal-500 px-4 py-2 text-[14px] font-medium text-white disabled:opacity-60"
                >
                  {quickSubmitting ? "Zapisuję…" : "Zapisz wizytę"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Karta wizyty */}
      {selected && !editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="text-lg font-semibold text-wet-navy">Wizyta</h3>
              <span className={`rounded-full border px-2.5 py-0.5 text-[12px] font-semibold ${visitTypeBadgeClass(selected.item.visitType)}`}>
                {visitTypeLabel(selected.item.visitType)}
              </span>
            </div>
            <dl className="mt-4 space-y-2 text-[14px]">
              <div>
                <dt className="text-[12px] font-medium uppercase text-neutral-500">Pacjent</dt>
                <dd className="font-semibold">{selected.item.label}</dd>
              </div>
              {selected.item.ownerPhone && (
                <div>
                  <dt className="text-[12px] font-medium uppercase text-neutral-500">Telefon</dt>
                  <dd>{selected.item.ownerPhone}</dd>
                </div>
              )}
              <div>
                <dt className="text-[12px] font-medium uppercase text-neutral-500">Termin</dt>
                <dd>
                  {selected.date} · {selected.item.time}
                </dd>
              </div>
              {selected.item.doctorName && (
                <div>
                  <dt className="text-[12px] font-medium uppercase text-neutral-500">Lekarz</dt>
                  <dd>{selected.item.doctorName}</dd>
                </div>
              )}
              <div>
                <dt className="text-[12px] font-medium uppercase text-neutral-500">Status</dt>
                <dd>
                  <span className={`rounded-full px-2 py-0.5 text-[12px] ${visitStatusBadgeClass(selected.item.status)}`}>
                    {visitStatusLabel(selected.item.status)}
                  </span>
                </dd>
              </div>
              {selected.item.catalogItemName && (
                <div>
                  <dt className="text-[12px] font-medium uppercase text-neutral-500">Z katalogu</dt>
                  <dd>{selected.item.catalogItemName}</dd>
                </div>
              )}
              {selected.item.notes && (
                <div>
                  <dt className="text-[12px] font-medium uppercase text-neutral-500">Notatka</dt>
                  <dd className="whitespace-pre-wrap">{selected.item.notes}</dd>
                </div>
              )}
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              {selected.item.petId && (
                <Link
                  href={`/wet/panel/zwierzeta/${selected.item.petId}`}
                  className="rounded-lg bg-wet-teal-500 px-4 py-2 text-[13px] font-medium text-white hover:bg-wet-teal-600"
                  onClick={() => setSelected(null)}
                >
                  Karta zwierzęcia →
                </Link>
              )}
              {selected.item.status === "planned" && (
                <>
                  <button type="button" onClick={openEdit} className="rounded-lg border border-wet-teal-200 px-4 py-2 text-[13px] text-wet-teal-800">
                    Edytuj
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => updateStatus(selected.item.id, "done")}
                    className="rounded-lg bg-green-600 px-4 py-2 text-[13px] font-medium text-white disabled:opacity-50"
                  >
                    Zrealizowana
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => updateStatus(selected.item.id, "no_show")}
                    className="rounded-lg border border-orange-300 px-4 py-2 text-[13px] text-orange-800 disabled:opacity-50"
                  >
                    Nie przyszedł
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => setCancelConfirmOpen(true)}
                    className="rounded-lg border border-red-300 px-4 py-2 text-[13px] text-red-700 disabled:opacity-50"
                  >
                    Anuluj
                  </button>
                </>
              )}
              <button type="button" onClick={() => setSelected(null)} className="rounded-lg border px-4 py-2 text-[13px]">
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelConfirmOpen && selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="font-semibold">Anulować wizytę?</h3>
            <p className="mt-2 text-[14px] text-neutral-600">
              {selected.item.label} — {selected.date} {selected.item.time}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setCancelConfirmOpen(false)} className="rounded-lg border px-4 py-2 text-[14px]">
                Nie
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={async () => {
                  setCancelConfirmOpen(false);
                  await updateStatus(selected.item.id, "cancelled");
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-[14px] text-white disabled:opacity-50"
              >
                Tak, anuluj
              </button>
            </div>
          </div>
        </div>
      )}

      {editOpen && selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="font-semibold">Edytuj wizytę</h3>
            <form onSubmit={submitEdit} className="mt-4 space-y-3">
              {editError && <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">{editError}</p>}
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-[13px]">
                  Data
                  <input type="date" className="mt-1 w-full rounded-lg border px-3 py-2" value={editForm.date} onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))} required />
                </label>
                <label className="block text-[13px]">
                  Godzina
                  <select className="mt-1 w-full rounded-lg border px-3 py-2" value={editForm.time} onChange={(e) => setEditForm((f) => ({ ...f, time: e.target.value }))}>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block text-[13px]">
                Typ
                <select className="mt-1 w-full rounded-lg border px-3 py-2" value={editForm.visitType} onChange={(e) => setEditForm((f) => ({ ...f, visitType: e.target.value }))}>
                  {VET_VISIT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </label>
              {doctors.length > 0 && (
                <label className="block text-[13px]">
                  Lekarz
                  <select className="mt-1 w-full rounded-lg border px-3 py-2" value={editForm.vetDoctorId} onChange={(e) => setEditForm((f) => ({ ...f, vetDoctorId: e.target.value }))}>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </label>
              )}
              <label className="block text-[13px]">
                Status
                <select className="mt-1 w-full rounded-lg border px-3 py-2" value={editForm.status} onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}>
                  {VET_VISIT_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </label>
              <label className="block text-[13px]">
                Notatka recepcji
                <textarea className="mt-1 w-full rounded-lg border px-3 py-2" rows={2} value={editForm.notes} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))} placeholder="krótka notatka…" />
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditOpen(false)} className="flex-1 rounded-lg border py-2 text-[14px]">Anuluj</button>
                <button type="submit" disabled={editSubmitting} className="flex-1 rounded-lg bg-wet-teal-500 py-2 text-[14px] text-white disabled:opacity-60">
                  {editSubmitting ? "Zapisuję…" : "Zapisz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {blockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="font-semibold">Zablokuj termin</h3>
            <form onSubmit={submitBlock} className="mt-4 space-y-3">
              {blockError && <p className="text-[13px] text-red-600">{blockError}</p>}
              <input type="date" className="w-full rounded-lg border px-3 py-2" value={blockForm.date} onChange={(e) => setBlockForm((f) => ({ ...f, date: e.target.value }))} required />
              <label className="flex items-center gap-2 text-[14px]">
                <input type="checkbox" checked={blockForm.wholeDay} onChange={(e) => setBlockForm((f) => ({ ...f, wholeDay: e.target.checked }))} />
                Cały dzień
              </label>
              {!blockForm.wholeDay && (
                <select className="w-full rounded-lg border px-3 py-2" value={blockForm.time} onChange={(e) => setBlockForm((f) => ({ ...f, time: e.target.value }))}>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              )}
              <div className="flex gap-2">
                <button type="button" onClick={() => setBlockOpen(false)} className="flex-1 rounded-lg border py-2">Anuluj</button>
                <button type="submit" disabled={blockSubmitting} className="flex-1 rounded-lg bg-neutral-700 py-2 text-white disabled:opacity-60">Zablokuj</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
