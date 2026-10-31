"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import {
  type GabCalendarAppointment,
  addDaysYmd,
  todayYmd,
} from "@/lib/gabinet/appointmentDisplay";
import {
  getVisitTypesForVertical,
  visitTypeBadgeClass,
  visitTypeLabel,
} from "@/lib/gabinet/visitTypes";
import { useGabinetVerticalId } from "@/contexts/GabVerticalContext";
import { GAB_VISIT_STATUSES, visitStatusBadgeClass, visitStatusLabel } from "@/lib/gabinet/visitStatus";

const BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";
const TIME_SLOTS = (() => {
  const out: string[] = [];
  for (let h = 8; h <= 20; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 20) out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
})();

type PatientOption = { id: string; name: string; phone: string; label: string };
type StaffOption = { id: string; name: string };
type CatalogOption = { id: string; name: string; category: string; durationMinutes: number };

export function GabCalendarClient({
  gabSlug,
  staffIdParam,
  onAfterUpdate,
}: {
  gabSlug: string;
  staffIdParam?: string;
  onAfterUpdate?: () => void;
}) {
  const [viewDay, setViewDay] = useState(todayYmd());
  const [monthData, setMonthData] = useState<Record<string, GabCalendarAppointment[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [staff, setStaff] = useState<StaffOption[]>([]);
  const [selected, setSelected] = useState<GabCalendarAppointment | null>(null);
  const [editForm, setEditForm] = useState({
    date: "",
    time: "09:00",
    visitType: "konsultacja",
    notes: "",
    gabStaffId: "",
  });
  const [addOpen, setAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    patientId: "",
    patientName: "",
    patientPhone: "",
    date: todayYmd(),
    time: "09:00",
    visitType: "konsultacja",
    gabStaffId: staffIdParam ?? "",
    notes: "",
  });

  const verticalId = useGabinetVerticalId();
  const visitTypes = getVisitTypesForVertical(verticalId);
  const [catalog, setCatalog] = useState<CatalogOption[]>([]);
  const activeMonth = viewDay.slice(0, 7);

  const loadMeta = useCallback(() => {
    fetch(`${BASE}/api/gabinet/booking/staff?gab_slug=${encodeURIComponent(gabSlug)}`)
      .then((r) => r.json())
      .then((d) => setStaff((d.staff ?? []) as StaffOption[]))
      .catch(() => {});
    fetch(`${BASE}/api/gabinet/panel/patients`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setPatients(
          (d.patients ?? []).map((p: { id: string; name: string; phone: string }) => ({
            id: p.id,
            name: p.name,
            phone: p.phone,
            label: `${p.name} · ${p.phone}`,
          }))
        );
      })
      .catch(() => {});
    fetch(`${BASE}/api/gabinet/panel/catalog`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setCatalog((d.items ?? []).filter((i: { active: boolean }) => i.active)))
      .catch(() => {});
  }, [gabSlug]);

  const fetchMonth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ month: activeMonth, gab_slug: gabSlug });
      if (staffIdParam) params.set("staff_id", staffIdParam);
      const res = await fetch(`${BASE}/api/gabinet/booking/calendar?${params}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error ?? "Błąd ładowania kalendarza.");
        setMonthData({});
        return;
      }
      setMonthData((json.appointments ?? {}) as Record<string, GabCalendarAppointment[]>);
    } catch {
      setError("Błąd połączenia.");
      setMonthData({});
    } finally {
      setLoading(false);
    }
  }, [activeMonth, gabSlug, staffIdParam]);

  useEffect(() => {
    fetchMonth();
  }, [fetchMonth]);

  useEffect(() => {
    loadMeta();
  }, [loadMeta]);

  useEffect(() => {
    setForm((f) => ({ ...f, date: viewDay, gabStaffId: staffIdParam ?? f.gabStaffId }));
  }, [viewDay, staffIdParam]);

  const dayAppointments = useMemo(
    () => (monthData[viewDay] ?? []).slice().sort((a, b) => a.time.localeCompare(b.time)),
    [monthData, viewDay]
  );

  const monthDays = useMemo(() => {
    const [y, m] = activeMonth.split("-").map(Number);
    const daysInMonth = new Date(y, m, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const d = String(i + 1).padStart(2, "0");
      const date = `${activeMonth}-${d}`;
      return { date, count: (monthData[date] ?? []).length };
    });
  }, [activeMonth, monthData]);

  async function submitAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    const res = await fetch(`${BASE}/api/gabinet/booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gabSlug,
        date: form.date,
        time: form.time,
        gabStaffId: form.gabStaffId || undefined,
        patientId: form.patientId || undefined,
        patientName: form.patientId ? undefined : form.patientName,
        patientPhone: form.patientId ? undefined : form.patientPhone,
        visitType: form.visitType,
        notes: form.notes || undefined,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) {
      setFormError(data.error ?? "Nie udało się dodać wizyty.");
      return;
    }
    setAddOpen(false);
    await fetchMonth();
    onAfterUpdate?.();
  }

  async function updateStatus(status: string) {
    if (!selected) return;
    setSubmitting(true);
    const res = await fetch(`${BASE}/api/gabinet/booking/appointments/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSubmitting(false);
    if (res.ok) {
      setSelected(null);
      await fetchMonth();
      onAfterUpdate?.();
    }
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    const res = await fetch(`${BASE}/api/gabinet/booking/appointments/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: editForm.date,
        time: editForm.time,
        visitType: editForm.visitType,
        notes: editForm.notes,
        gabStaffId: editForm.gabStaffId || null,
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      setSelected(null);
      await fetchMonth();
      onAfterUpdate?.();
    }
  }

  async function cancelAppointment() {
    if (!selected || !confirm("Anulować wizytę?")) return;
    setSubmitting(true);
    const res = await fetch(`${BASE}/api/gabinet/booking/appointments/${selected.id}`, {
      method: "DELETE",
    });
    setSubmitting(false);
    if (res.ok) {
      setSelected(null);
      await fetchMonth();
      onAfterUpdate?.();
    }
  }

  function applyCatalogToForm(catalogId: string) {
    const item = catalog.find((c) => c.id === catalogId);
    if (!item) return;
    setForm((f) => ({ ...f, visitType: item.category || f.visitType, notes: item.name }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setViewDay((d) => addDaysYmd(d, -1))}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
            aria-label="Poprzedni dzień"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <input
            type="date"
            value={viewDay}
            onChange={(e) => setViewDay(e.target.value)}
            className="min-h-11 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-base sm:flex-none"
          />
          <button
            type="button"
            onClick={() => setViewDay((d) => addDaysYmd(d, 1))}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
            aria-label="Następny dzień"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewDay(todayYmd())}
            className="min-h-11 px-2 text-[13px] font-medium text-gab-sky hover:underline"
          >
            Dziś
          </button>
        </div>
        <button type="button" onClick={() => setAddOpen(true)} className="gab-btn-primary inline-flex w-full gap-2 sm:w-auto">
          <Plus className="h-4 w-4" /> Wizyta
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white p-3">
        <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-slate-500">
          {new Date(`${activeMonth}-01T12:00:00`).toLocaleDateString("pl-PL", { month: "long", year: "numeric" })}
        </p>
        <div className="flex gap-1">
          {monthDays.map((d) => (
            <button
              key={d.date}
              type="button"
              onClick={() => setViewDay(d.date)}
              className={`min-w-[2.25rem] rounded-lg px-1 py-2 text-[12px] ${
                d.date === viewDay
                  ? "bg-gab-sky text-white"
                  : d.count > 0
                    ? "bg-sky-50 text-gab-navy hover:bg-sky-100"
                    : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {d.date.slice(8)}
              {d.count > 0 && <span className="mt-0.5 block text-[10px] opacity-80">{d.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{error}</p>}
      {loading ? (
        <p className="text-slate-500">Ładowanie…</p>
      ) : dayAppointments.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gab-sky/30 bg-sky-50/40 p-6 text-center text-[14px] text-slate-600">
          Brak wizyt w tym dniu.
        </p>
      ) : (
        <ul className="space-y-2">
          {dayAppointments.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => {
                  setSelected(a);
                  setEditForm({
                    date: a.date ?? viewDay,
                    time: a.time,
                    visitType: a.visitType ?? "konsultacja",
                    notes: a.notes ?? "",
                    gabStaffId: a.staffId ?? "",
                  });
                }}
                className="flex w-full items-start gap-3 rounded-xl border border-gab-sky/15 bg-white p-4 text-left transition hover:border-gab-sky/40"
              >
                <span className="font-mono text-[15px] font-semibold text-gab-navy">{a.time}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gab-navy">{a.label}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${visitTypeBadgeClass(a.visitType)}`}>
                      {visitTypeLabel(a.visitType)}
                    </span>
                    <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${visitStatusBadgeClass(a.status)}`}>
                      {visitStatusLabel(a.status)}
                    </span>
                    {a.staff && <span className="text-[12px] text-slate-500">{a.staff}</span>}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={submitAdd} className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gab-navy">Nowa wizyta</h2>
            {formError && <p className="mt-2 text-[14px] text-red-700">{formError}</p>}
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[13px] font-medium">Pacjent z kartoteki</label>
                <select
                  className="gab-input"
                  value={form.patientId}
                  onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))}
                >
                  <option value="">— nowy / bez kartoteki —</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
              {!form.patientId && (
                <>
                  <div>
                    <label className="block text-[13px] font-medium">Imię i nazwisko</label>
                    <input
                      className="gab-input"
                      required
                      value={form.patientName}
                      onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium">Telefon</label>
                    <input
                      className="gab-input"
                      required
                      value={form.patientPhone}
                      onChange={(e) => setForm((f) => ({ ...f, patientPhone: e.target.value }))}
                    />
                  </div>
                </>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[13px] font-medium">Data</label>
                  <input
                    type="date"
                    className="gab-input"
                    required
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium">Godzina</label>
                  <select
                    className="gab-input"
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              {staff.length > 0 && (
                <div>
                  <label className="block text-[13px] font-medium">Personel</label>
                  <select
                    className="gab-input"
                    value={form.gabStaffId}
                    onChange={(e) => setForm((f) => ({ ...f, gabStaffId: e.target.value }))}
                  >
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {catalog.length > 0 && (
                <div>
                  <label className="block text-[13px] font-medium">Z katalogu zabiegów</label>
                  <select className="gab-input" defaultValue="" onChange={(e) => e.target.value && applyCatalogToForm(e.target.value)}>
                    <option value="">— wybierz opcjonalnie —</option>
                    {catalog.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-[13px] font-medium">Typ wizyty</label>
                <select
                  className="gab-input"
                  value={form.visitType}
                  onChange={(e) => setForm((f) => ({ ...f, visitType: e.target.value }))}
                >
                  {visitTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium">Notatka</label>
                <textarea
                  className="gab-input"
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button type="button" onClick={() => setAddOpen(false)} className="flex-1 rounded-lg border px-4 py-2 text-[14px]">
                Anuluj
              </button>
              <button type="submit" disabled={submitting} className="gab-btn-primary flex-1 disabled:opacity-60">
                {submitting ? "Zapisuję…" : "Zapisz"}
              </button>
            </div>
          </form>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={saveEdit} className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gab-navy">Edycja wizyty</h2>
            <p className="mt-1 text-[14px] text-slate-600">{selected.label}</p>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input type="date" className="gab-input" required value={editForm.date} onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))} />
                <select className="gab-input" value={editForm.time} onChange={(e) => setEditForm((f) => ({ ...f, time: e.target.value }))}>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              {staff.length > 0 && (
                <select className="gab-input" value={editForm.gabStaffId} onChange={(e) => setEditForm((f) => ({ ...f, gabStaffId: e.target.value }))}>
                  <option value="">— personel —</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              )}
              <select className="gab-input" value={editForm.visitType} onChange={(e) => setEditForm((f) => ({ ...f, visitType: e.target.value }))}>
                {visitTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <textarea className="gab-input" rows={2} value={editForm.notes} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {GAB_VISIT_STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  disabled={submitting || selected.status === s.value}
                  onClick={() => updateStatus(s.value)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] hover:bg-slate-50 disabled:opacity-40"
                >
                  {s.label}
                </button>
              ))}
            </div>
            {selected.patientId && (
              <GabLink href={`/panel/pacjenci/${selected.patientId}`} className="mt-3 inline-block text-[14px] font-medium text-gab-sky hover:underline">
                Kartoteka pacjenta →
              </GabLink>
            )}
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" onClick={() => setSelected(null)} className="flex-1 rounded-lg border px-4 py-2 text-[14px]">
                Zamknij
              </button>
              <button type="button" onClick={cancelAppointment} disabled={submitting} className="rounded-lg border border-red-200 px-4 py-2 text-[14px] text-red-700">
                Anuluj wizytę
              </button>
              <button type="submit" disabled={submitting} className="gab-btn-primary flex-1 disabled:opacity-60">
                Zapisz zmiany
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
