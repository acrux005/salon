"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updateClinicNoOrderDaysAction } from "@/app/actions/clinic";

const BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";

type AppointmentItem = {
  id: number | string;
  client: string;
  phone: string | null;
  service: string | null;
  staff: string | null;
  time: string;
  status: string;
  notes?: string | null;
};

type CalendarResponse = {
  ok?: boolean;
  month?: string;
  appointments?: Record<string, AppointmentItem[]>;
};

const WEEKDAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
const STATUS_LABELS: Record<string, string> = {
  planned: "Zaplanowana",
  done: "Zrealizowana",
  cancelled: "Anulowana",
  archived: "Archiwum",
};

const TIME_SLOTS = (() => {
  const out: string[] = [];
  for (let h = 8; h <= 20; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 20) out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
})();

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

type ServiceItem = { id: number; name: string; duration?: number; price?: number | null };
type StaffItem = { id: number; name: string; phone?: string | null };

export function ClinicCalendarClient({
  clinicSlug,
  staffIdParam,
  noOrderDays = [],
  onAfterUpdate,
}: {
  clinicSlug: string;
  staffIdParam?: string;
  noOrderDays?: string[];
  onAfterUpdate?: () => void;
}) {
  const router = useRouter();
  const [now] = useState(() => new Date());
  const [current, setCurrent] = useState(() => ({ year: now.getFullYear(), month: now.getMonth() }));
  const [data, setData] = useState<CalendarResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorHint, setErrorHint] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ date: string; item: AppointmentItem } | null>(null);
  const [viewDay, setViewDay] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [addForm, setAddForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "09:00",
    serviceId: "" as number | "",
    staffId: "" as number | "",
  });
  const [addNewClient, setAddNewClient] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ date: "", time: "09:00", name: "", phone: "", serviceId: "" as number | "" });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [blockOpen, setBlockOpen] = useState(false);
  const [blockForm, setBlockForm] = useState({
    date: "",
    time: "09:00",
    wholeDay: false,
    timeFrom: "08:00",
    timeTo: "18:00",
  });
  const [blockSubmitting, setBlockSubmitting] = useState(false);
  const [blockError, setBlockError] = useState<string | null>(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  const monthStr = `${current.year}-${String(current.month + 1).padStart(2, "0")}`;

  const fetchCalendar = useCallback(async () => {
    setLoading(true);
    setError(null);
    setErrorHint(null);
    try {
      const params = new URLSearchParams({ month: monthStr });
      if (clinicSlug) params.set("clinic_slug", clinicSlug);
      if (staffIdParam) params.set("staff_id", staffIdParam);
      const res = await fetch(`${BASE}/api/booking/calendar?${params}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error ?? "Błąd ładowania kalendarza.");
        setErrorHint(typeof json?.hint === "string" ? json.hint : null);
        setData(null);
        return;
      }
      setData(json);
    } catch {
      setError("Błąd połączenia.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [monthStr, clinicSlug, staffIdParam]);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  const loadServicesAndStaff = useCallback(() => {
    const staffUrl = clinicSlug ? `${BASE}/api/booking/staff?clinic_slug=${encodeURIComponent(clinicSlug)}` : `${BASE}/api/booking/staff`;
    Promise.all([
      fetch(`${BASE}/api/booking/services`).then((r) => r.json()),
      fetch(staffUrl).then((r) => r.json()),
    ]).then(([sRes, stRes]) => {
      if (sRes?.items) setServices(sRes.items);
      if (stRes?.items) setStaff(stRes.items);
    }).catch(() => {});
  }, [clinicSlug]);

  useEffect(() => {
    if (!addOpen) return;
    setAddError(null);
    loadServicesAndStaff();
  }, [addOpen, loadServicesAndStaff]);

  useEffect(() => {
    if (!editOpen) return;
    loadServicesAndStaff();
  }, [editOpen, loadServicesAndStaff]);

  const openAddModal = () => {
    setAddForm({
      name: "",
      phone: "",
      date: now.toISOString().slice(0, 10),
      time: "09:00",
      serviceId: "",
      staffId: "",
    });
    setAddNewClient(false);
    setAddOpen(true);
  };

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = addForm.name.trim();
    const phone = addNewClient ? addForm.phone.trim() : (name || "-");
    if (!name || !addForm.date || !addForm.time) {
      setAddError(addNewClient ? "Uzupełnij imię, telefon, datę i godzinę." : "Wpisz nazwisko lub telefon klientki oraz wybierz datę i godzinę.");
      return;
    }
    if (addNewClient && !phone) {
      setAddError("Uzupełnij telefon nowej klientki.");
      return;
    }
    setAddSubmitting(true);
    setAddError(null);
    try {
      const res = await fetch(`${BASE}/api/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicSlug,
          date: addForm.date,
          time: addForm.time,
          name,
          phone: phone || "-",
          ...(addForm.serviceId !== "" && { serviceId: addForm.serviceId }),
          staffId: addForm.staffId !== "" ? addForm.staffId : (staffIdParam ?? undefined),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAddError((json as { error?: string }).error ?? "Nie udało się dodać wizyty.");
        return;
      }
      setAddOpen(false);
      await fetchCalendar();
      onAfterUpdate?.();
    } finally {
      setAddSubmitting(false);
    }
  };

  const prevMonth = () => {
    setCurrent((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }));
    setSelected(null);
    setViewDay(null);
  };

  const nextMonth = () => {
    setCurrent((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }));
    setSelected(null);
    setViewDay(null);
  };

  const updateStatus = async (id: number | string, status: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`${BASE}/api/booking/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(j?.error ?? "Nie udało się zaktualizować.");
        return;
      }
      setSelected(null);
      await fetchCalendar();
      onAfterUpdate?.();
    } finally {
      setUpdating(false);
    }
  };

  const [deleting, setDeleting] = useState(false);
  const deleteAppointment = async (id: number | string) => {
    if (!confirm("Czy na pewno usunąć tę wizytę z kalendarza? Zostanie anulowana i zwolni termin.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`${BASE}/api/booking/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert((j as { error?: string }).error ?? "Nie udało się usunąć wizyty.");
        return;
      }
      setSelected(null);
      await fetchCalendar();
      onAfterUpdate?.();
    } finally {
      setDeleting(false);
    }
  };

  const openEdit = () => {
    if (!selected) return;
    setEditForm({
      date: selected.date,
      time: selected.item.time,
      name: selected.item.client,
      phone: selected.item.phone ?? "",
      serviceId: "",
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
      const body: Record<string, unknown> = {
        date: editForm.date,
        time: editForm.time,
        new_name: editForm.name.trim(),
        new_phone: editForm.phone.trim() || undefined,
      };
      if (editForm.serviceId !== "") body.service_id = editForm.serviceId;
      const res = await fetch(`${BASE}/api/booking/appointments/${selected.item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setEditError((j as { error?: string }).error ?? "Nie udało się zapisać zmian.");
        return;
      }
      setEditOpen(false);
      setSelected(null);
      await fetchCalendar();
      onAfterUpdate?.();
    } finally {
      setEditSubmitting(false);
    }
  };

  const openBlockModal = () => {
    const today = new Date();
    const dateStr = viewDay ?? `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    setBlockForm({ date: dateStr, time: "09:00", wholeDay: false, timeFrom: "08:00", timeTo: "18:00" });
    setBlockError(null);
    setBlockOpen(true);
  };

  /** Zwraca listę slotów co 30 min od timeFrom do timeTo (bez timeTo). */
  const getSlotsBetween = (timeFrom: string, timeTo: string): string[] => {
    const idxFrom = TIME_SLOTS.indexOf(timeFrom);
    const idxTo = TIME_SLOTS.indexOf(timeTo);
    if (idxFrom === -1 || idxTo === -1 || idxFrom >= idxTo) return [];
    return TIME_SLOTS.slice(idxFrom, idxTo);
  };

  const submitBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlockSubmitting(true);
    setBlockError(null);
    try {
      if (blockForm.wholeDay) {
        const newDays = Array.from(new Set([...noOrderDays, blockForm.date])).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
        const result = await updateClinicNoOrderDaysAction(newDays);
        if (!result.ok) {
          setBlockError(result.error ?? "Nie udało się zablokować dnia.");
          setBlockSubmitting(false);
          return;
        }
        setBlockOpen(false);
        router.refresh();
        onAfterUpdate?.();
        return;
      }

      const slotsToBlock = [blockForm.time];
      if (slotsToBlock.length === 0) {
        setBlockError("Wybierz godzinę.");
        setBlockSubmitting(false);
        return;
      }

      const res = await fetch(`${BASE}/api/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicSlug,
          date: blockForm.date,
          time: blockForm.time,
          name: "— Zablokowane —",
          phone: "—",
          staffId: staffIdParam ?? undefined,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setBlockError((j as { error?: string }).error ?? "Nie udało się zablokować godziny.");
        setBlockSubmitting(false);
        return;
      }
      setBlockOpen(false);
      await fetchCalendar();
      onAfterUpdate?.();
    } finally {
      setBlockSubmitting(false);
    }
  };

  const days = getDaysInMonth(current.year, current.month);
  const appointments = data?.appointments ?? {};
  const filterOutCancelled = <T extends { status?: string }>(arr: T[]) => arr.filter((x) => x.status !== "cancelled");
  const appointmentsForViewDay = viewDay
    ? filterOutCancelled((appointments[viewDay] ?? []).slice().sort((a, b) => a.time.localeCompare(b.time)))
    : [];

  return (
    <div className="space-y-3">
      {/* Rząd 1: przyciski akcji */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={openAddModal}
          className="rounded-full bg-pink-500 px-4 py-2 font-[var(--font-sans)] text-[14px] font-medium text-white hover:bg-pink-600"
        >
          + Dodaj wizytę
        </button>
        <button
          type="button"
          onClick={openBlockModal}
          className="rounded-full border border-neutral-300 bg-white px-4 py-2 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C] hover:bg-neutral-50"
        >
          Zablokuj godzinę
        </button>
      </div>

      {/* Rząd 2: nawigacja miesiąca */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={prevMonth}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-[18px] font-medium text-[#1F1A1C] hover:bg-neutral-50"
        >
          ‹
        </button>
        <h2 className="w-44 text-center font-[var(--font-sans)] text-[17px] font-semibold capitalize text-[#1F1A1C]">
          {new Date(current.year, current.month).toLocaleDateString("pl-PL", { month: "long", year: "numeric" })}
        </h2>
        <button
          type="button"
          onClick={nextMonth}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-[18px] font-medium text-[#1F1A1C] hover:bg-neutral-50"
        >
          ›
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-[15px] text-amber-800">
          <p>{error}</p>
          {errorHint && (
            <p className="mt-2 text-[14px] opacity-90">{errorHint}</p>
          )}
        </div>
      )}

      {loading && (
        <p className="text-[15px] text-[#6F5E64]">Ładowanie kalendarza…</p>
      )}

      {!loading && data?.ok && (
        <>
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
            <table className="w-full border-collapse" role="grid" aria-label="Kalendarz wizyt">
              <thead>
                <tr>
                  {WEEKDAYS.map((d) => (
                    <th
                      key={d}
                      className="border-b border-neutral-200 bg-neutral-50 px-2 py-2 text-center font-[var(--font-sans)] text-[13px] font-medium text-[#6F5E64]"
                    >
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
                      const list = dateStr ? filterOutCancelled((appointments[dateStr] ?? []).slice().sort((a, b) => a.time.localeCompare(b.time))) : [];
                      const isBlockedDay = dateStr ? noOrderDays.includes(dateStr) : false;
                      const isToday =
                        day &&
                        day.getDate() === now.getDate() &&
                        day.getMonth() === now.getMonth() &&
                        day.getFullYear() === now.getFullYear();
                      const isViewDay = dateStr === viewDay;
                      return (
                        <td
                          key={i}
                          className={`min-h-[100px] border-b border-r border-neutral-100 align-top p-1.5 text-[13px] ${isBlockedDay ? "bg-neutral-100 text-neutral-500" : ""} ${isViewDay && !isBlockedDay ? "ring-2 ring-inset ring-pink-400 bg-pink-50/30" : ""}`}
                        >
                          {day ? (
                            <>
                              {isBlockedDay ? (
                                <span className="mb-1 block w-full rounded px-1.5 py-0.5 text-left font-medium text-neutral-500">
                                  {day.getDate()} 🔒
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setViewDay(viewDay === dateStr ? null : dateStr ?? null)}
                                  className={`mb-1 block w-full rounded px-1.5 py-0.5 text-left font-medium hover:bg-white/60 ${isToday ? "rounded-full bg-pink-500 px-1.5 py-0.5 text-white hover:bg-pink-600" : "text-[#1F1A1C]"}`}
                                >
                                  {day.getDate()}
                                </button>
                              )}
                              <ul className="space-y-1">
                                {!isBlockedDay && list.map((item) => (
                                  <li key={item.id}>
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); setSelected({ date: dateStr, item }); }}
                                      className={`w-full rounded-r px-2 py-1 text-left text-[12px] transition-colors hover:opacity-90 border-l-[3px] ${
                                        item.status === "cancelled"
                                          ? "border-neutral-300 bg-neutral-100 text-neutral-500 line-through"
                                          : item.status === "done"
                                            ? "border-green-500 bg-green-50 text-green-800"
                                            : "border-pink-500 bg-pink-50 text-pink-800"
                                      }`}
                                    >
                                      <span className="font-medium">{item.time}</span> {item.client}
                                      {item.service ? <span className="block truncate text-[11px] opacity-90">{item.service}</span> : null}
                                    </button>
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

          <div className="flex flex-wrap gap-4 text-[13px] text-[#6F5E64]">
            <span><span className="inline-block h-3 w-3 rounded border-l-[3px] border-pink-500 bg-pink-50 align-middle" /> Zaplanowana</span>
            <span><span className="inline-block h-3 w-3 rounded border-l-[3px] border-green-500 bg-green-50 align-middle" /> Zrealizowana</span>
            <span><span className="inline-block h-3 w-3 rounded border-l-[3px] border-neutral-300 bg-neutral-100 align-middle" /> Anulowana</span>
          </div>

          {viewDay && (
            <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-[var(--font-sans)] text-base font-semibold text-[#1F1A1C]">
                  Plan dnia — {new Date(viewDay + "T12:00:00").toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </h3>
                <button
                  type="button"
                  onClick={() => setViewDay(null)}
                  className="rounded-full p-1.5 text-[#6F5E64] hover:bg-neutral-100"
                  aria-label="Zamknij plan dnia"
                >
                  ×
                </button>
              </div>
              {appointmentsForViewDay.length === 0 ? (
                <p className="mt-3 text-[14px] text-[#6F5E64]">Brak wizyt w tym dniu.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {appointmentsForViewDay.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setSelected({ date: viewDay, item })}
                        className={`flex w-full items-center gap-4 rounded-lg border-l-[4px] px-4 py-3 text-left transition-colors hover:opacity-90 ${
                          item.status === "cancelled"
                            ? "border-neutral-300 bg-neutral-50 text-neutral-500 line-through"
                            : item.status === "done"
                              ? "border-green-500 bg-green-50 text-green-800"
                              : "border-pink-500 bg-pink-50 text-pink-800"
                        }`}
                      >
                        <span className="w-14 shrink-0 font-semibold">{item.time}</span>
                        <span className="min-w-0 flex-1 font-medium">{item.client}</span>
                        {item.service && <span className="hidden shrink-0 text-[13px] text-[#6F5E64] sm:block">{item.service}</span>}
                        <span className="text-[13px] opacity-80">{STATUS_LABELS[item.status] ?? item.status}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}

      {addOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-appointment-title"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
            <h3 id="add-appointment-title" className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
              Nowa wizyta
            </h3>
            <form onSubmit={submitAdd} className="mt-4 space-y-4">
              {addError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700" role="alert">
                  {addError}
                </p>
              )}
              <div>
                <label className="block">
                  <span className="mb-1 block text-[14px] font-medium text-[#6F5E64]">👤 Klientka (wpisz nazwisko lub telefon)</span>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Wyszukaj klientkę..."
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px] placeholder:text-neutral-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setAddNewClient((v) => !v)}
                  className="mt-2 text-[14px] text-pink-600 hover:underline"
                >
                  ➕ Lub dodaj nową
                </button>
                {addNewClient && (
                  <div className="mt-3 space-y-3 rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                    <label className="block">
                      <span className="mb-1 block text-[14px] font-medium text-[#6F5E64]">Imię i nazwisko</span>
                      <input
                        type="text"
                        value={addForm.name}
                        onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        placeholder="Imię i nazwisko"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[14px] font-medium text-[#6F5E64]">📱 Telefon (nowa klientka)</span>
                      <input
                        type="tel"
                        value={addForm.phone}
                        onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="+48 600 000 000"
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[15px] placeholder:text-neutral-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </label>
                  </div>
                )}
              </div>
              <label className="block">
                <span className="mb-1 block text-[14px] font-medium text-[#6F5E64]">Data *</span>
                <input
                  type="date"
                  value={addForm.date}
                  onChange={(e) => setAddForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[14px] font-medium text-[#6F5E64]">Godzina *</span>
                <select
                  value={addForm.time}
                  onChange={(e) => setAddForm((f) => ({ ...f, time: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                >
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[14px] font-medium text-[#6F5E64]">💆 Zabieg</span>
                <select
                  value={addForm.serviceId === "" ? "" : addForm.serviceId}
                  onChange={(e) => setAddForm((f) => ({ ...f, serviceId: e.target.value === "" ? "" : Number(e.target.value) }))}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                >
                  <option value="">— wybierz zabieg —</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[14px] font-medium text-[#6F5E64]">👩‍⚕️ Kosmetyczka</span>
                <select
                  value={addForm.staffId === "" ? "" : addForm.staffId}
                  onChange={(e) => setAddForm((f) => ({ ...f, staffId: e.target.value === "" ? "" : Number(e.target.value) }))}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                >
                  <option value="">— wybierz —</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </label>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="rounded-full border border-neutral-200 px-4 py-2 font-[var(--font-sans)] text-[14px] text-[#6F5E64] hover:bg-neutral-50"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={addSubmitting}
                  className="rounded-full bg-pink-500 px-4 py-2 font-[var(--font-sans)] text-[14px] font-medium text-white hover:bg-pink-600 disabled:opacity-50"
                >
                  {addSubmitting ? "Zapisywanie…" : "Zapisz wizytę"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {blockOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="block-hour-title"
        >
          <div className="relative w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
            <h3 id="block-hour-title" className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
              Zablokuj godziny
            </h3>
            <p className="mt-1 text-[14px] text-[#6F5E64]">
              Zaznaczone godziny będą niedostępne dla rezerwacji (np. przerwa, szkolenie, cały dzień).
            </p>
            <form onSubmit={submitBlock} className="mt-4 space-y-4">
              {blockError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700" role="alert">{blockError}</p>
              )}
              <label className="block">
                <span className="mb-1 block text-[14px] font-medium text-[#6F5E64]">Data *</span>
                <input
                  type="date"
                  value={blockForm.date}
                  onChange={(e) => setBlockForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  required
                />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={blockForm.wholeDay}
                  onChange={(e) => setBlockForm((f) => ({ ...f, wholeDay: e.target.checked }))}
                  className="h-4 w-4 rounded border-neutral-300 text-pink-500 focus:ring-pink-500"
                />
                <span className="text-[14px] font-medium text-[#1F1A1C]">Zablokuj cały dzień</span>
              </label>
              {blockForm.wholeDay ? (
                <p className="text-[14px] text-[#6F5E64]">
                  Dzień będzie wyszarzony w kalendarzu i niedostępny do rezerwacji (np. święto, urlop).
                </p>
              ) : (
                <label className="block">
                  <span className="mb-1 block text-[14px] font-medium text-[#6F5E64]">Godzina *</span>
                  <select
                    value={blockForm.time}
                    onChange={(e) => setBlockForm((f) => ({ ...f, time: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBlockOpen(false)}
                  className="rounded-full border border-neutral-200 px-4 py-2 font-[var(--font-sans)] text-[14px] text-[#6F5E64] hover:bg-neutral-50"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={blockSubmitting}
                  className="rounded-full bg-neutral-700 px-4 py-2 font-[var(--font-sans)] text-[14px] font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
                >
                  {blockSubmitting
                    ? "Zapisywanie…"
                    : blockForm.wholeDay
                      ? "Zablokuj dzień"
                      : "Zablokuj"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selected && !editOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="appointment-detail-title"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
            <h3 id="appointment-detail-title" className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
              Wizyta #{selected.item.id}
            </h3>
            <dl className="mt-4 space-y-2 text-[14px]">
              <div><dt className="font-medium text-[#6F5E64]">Klientka</dt><dd>{selected.item.client}</dd></div>
              {selected.item.phone && (
                <div><dt className="font-medium text-[#6F5E64]">Telefon</dt><dd>{selected.item.phone}</dd></div>
              )}
              <div><dt className="font-medium text-[#6F5E64]">Termin</dt><dd>{selected.date} {selected.item.time}</dd></div>
              {selected.item.service && (
                <div><dt className="font-medium text-[#6F5E64]">Zabieg</dt><dd>{selected.item.service}</dd></div>
              )}
              {selected.item.staff && (
                <div><dt className="font-medium text-[#6F5E64]">Kosmetyczka</dt><dd>{selected.item.staff}</dd></div>
              )}
              <div><dt className="font-medium text-[#6F5E64]">Status</dt><dd>{STATUS_LABELS[selected.item.status] ?? selected.item.status}</dd></div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              {selected.item.status === "planned" && (
                <>
                  <button
                    type="button"
                    onClick={openEdit}
                    className="rounded-full border border-pink-300 bg-white px-4 py-2 font-[var(--font-sans)] text-[14px] font-medium text-pink-700 hover:bg-pink-50"
                  >
                    Edytuj
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => updateStatus(selected!.item.id, "done")}
                    className="rounded-full bg-green-600 px-4 py-2 font-[var(--font-sans)] text-[14px] font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    Zrealizowana
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => setCancelConfirmOpen(true)}
                    className="rounded-full border border-red-300 bg-white px-4 py-2 font-[var(--font-sans)] text-[14px] font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    Anuluj
                  </button>
                </>
              )}
              <button
                type="button"
                disabled={updating || deleting}
                onClick={() => deleteAppointment(selected.item.id)}
                className="rounded-full border border-neutral-300 bg-white px-4 py-2 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C] hover:bg-red-50 hover:border-red-200 hover:text-red-700 disabled:opacity-50"
                title="Trwale usuń wizytę z kalendarza"
              >
                {deleting ? "Usuwanie…" : "Usuń z kalendarza"}
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full border border-neutral-200 px-4 py-2 font-[var(--font-sans)] text-[14px] text-[#6F5E64] hover:bg-neutral-50"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelConfirmOpen && selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-confirm-title"
        >
          <div className="relative w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
            <h3 id="cancel-confirm-title" className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
              Anulować rezerwację?
            </h3>
            <p className="mt-2 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
              Rezerwacja {selected.item.client} ({selected.date} {selected.item.time}) zostanie oznaczona jako anulowana. Klient zobaczy zmianę w „Moje rezerwacje”.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                onClick={() => setCancelConfirmOpen(false)}
                className="rounded-full border border-neutral-200 px-4 py-2 font-[var(--font-sans)] text-[14px] text-[#6F5E64] hover:bg-neutral-50"
              >
                Nie, cofnij
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={async () => {
                  setCancelConfirmOpen(false);
                  await updateStatus(selected.item.id, "cancelled");
                }}
                className="rounded-full bg-red-600 px-4 py-2 font-[var(--font-sans)] text-[14px] font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {updating ? "Anulowanie…" : "Tak, anuluj"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editOpen && selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-appointment-title"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
            <h3 id="edit-appointment-title" className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
              Edytuj wizytę #{selected.item.id}
            </h3>
            <form onSubmit={submitEdit} className="mt-4 space-y-4">
              {editError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700" role="alert">{editError}</p>
              )}
              <label className="block">
                <span className="mb-1 block text-[14px] font-medium text-[#6F5E64]">Klientka *</span>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[14px] font-medium text-[#6F5E64]">Telefon</span>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[14px] font-medium text-[#6F5E64]">Data *</span>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[14px] font-medium text-[#6F5E64]">Godzina *</span>
                <select
                  value={editForm.time}
                  onChange={(e) => setEditForm((f) => ({ ...f, time: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                >
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
              {String(selected.item.id).startsWith("cb-") ? (
                <p className="text-[14px] text-[#6F5E64]">
                  Zabieg: <strong>{selected.item.service ?? "—"}</strong> (rezerwacja z formularza — nie można zmienić)
                </p>
              ) : (
                <label className="block">
                  <span className="mb-1 block text-[14px] font-medium text-[#6F5E64]">Zabieg</span>
                  <select
                    value={editForm.serviceId === "" ? "" : editForm.serviceId}
                    onChange={(e) => setEditForm((f) => ({ ...f, serviceId: e.target.value === "" ? "" : Number(e.target.value) }))}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  >
                    <option value="">— wybierz —</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </label>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="rounded-full border border-neutral-200 px-4 py-2 font-[var(--font-sans)] text-[14px] text-[#6F5E64] hover:bg-neutral-50"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="rounded-full bg-pink-500 px-4 py-2 font-[var(--font-sans)] text-[14px] font-medium text-white hover:bg-pink-600 disabled:opacity-50"
                >
                  {editSubmitting ? "Zapisywanie…" : "Zapisz zmiany"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
