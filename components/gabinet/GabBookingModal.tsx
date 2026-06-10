"use client";

import { useState, useEffect } from "react";
import { getVisitTypesForVertical } from "@/lib/gabinet/visitTypes";
import type { GabinetVerticalId } from "@/lib/gabinetPlatform/verticals";

const BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";

type Day = { date: string; slots: { start: string; time: string; available: boolean }[]; closed?: boolean };
type CatalogItem = { id: string; name: string; category: string; pricePln: number; durationMinutes: number };
type StaffOption = { id: string; name: string; phone: string | null };

export function GabBookingModal({
  gabSlug,
  gabName,
  vertical = "dent",
  onClose,
}: {
  gabSlug: string;
  gabName: string;
  vertical?: GabinetVerticalId | string;
  onClose: () => void;
}) {
  const defaultTypes = getVisitTypesForVertical((vertical as GabinetVerticalId) || "dent");
  const [visitOptions, setVisitOptions] = useState<{ value: string; label: string }[]>(
    defaultTypes.map((t) => ({ value: t.value, label: t.label }))
  );
  const [staff, setStaff] = useState<StaffOption[]>([]);
  const [staffId, setStaffId] = useState("");
  const [days, setDays] = useState<Day[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [visitType, setVisitType] = useState(defaultTypes[0]?.value ?? "konsultacja");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const v = (vertical as GabinetVerticalId) || "dent";
    fetch(`${BASE}/api/gabinet/public/catalog?gab_slug=${encodeURIComponent(gabSlug)}`)
      .then((r) => r.json())
      .then((data: { items?: CatalogItem[]; vertical?: string }) => {
        const resolved = (data.vertical as GabinetVerticalId) || v;
        const fallback = getVisitTypesForVertical(resolved).map((t) => ({ value: t.value, label: t.label }));
        const catalog = (data.items ?? []).map((item) => ({
          value: item.category || "konsultacja",
          label: `${item.name}${item.pricePln > 0 ? ` (${item.pricePln.toFixed(0)} PLN)` : ""}`,
        }));
        const options = catalog.length > 0 ? catalog : fallback;
        setVisitOptions(options);
        setVisitType(options[0]?.value ?? "konsultacja");
      })
      .catch(() => {
        setVisitOptions(getVisitTypesForVertical(v).map((t) => ({ value: t.value, label: t.label })));
      });
  }, [gabSlug, vertical]);

  useEffect(() => {
    fetch(`${BASE}/api/gabinet/booking/staff?gab_slug=${encodeURIComponent(gabSlug)}`)
      .then((r) => r.json())
      .then((data: { staff?: StaffOption[] }) => {
        const list = data.staff ?? [];
        setStaff(list);
        if (list.length === 1) setStaffId(list[0].id);
      })
      .catch(() => setStaff([]));
  }, [gabSlug]);

  useEffect(() => {
    const from = new Date().toISOString().slice(0, 10);
    const to = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
    const staffParam = staffId ? `&staff_id=${encodeURIComponent(staffId)}` : "";
    setLoading(true);
    fetch(`${BASE}/api/gabinet/availability?gab_slug=${encodeURIComponent(gabSlug)}&from=${from}&to=${to}${staffParam}`)
      .then((r) => r.json())
      .then((data) => {
        const parsed: Day[] = (data.days ?? []).map(
          (d: { date: string; slots: { start: string; available: boolean }[]; closed?: boolean }) => ({
            date: d.date,
            closed: d.closed,
            slots: d.slots
              .filter((s) => s.available)
              .map((s) => ({
                start: s.start,
                time: /T(\d{2}:\d{2})/.exec(s.start)?.[1] ?? "",
                available: s.available,
              })),
          })
        );
        setDays(parsed.filter((d) => d.slots.length > 0));
        setSelectedDate("");
        setSelectedTime("");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [gabSlug, staffId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !patientName || !phone) {
      setError("Uzupełnij termin, imię i telefon.");
      return;
    }
    setSubmitting(true);
    setError("");
    const res = await fetch(`${BASE}/api/gabinet/booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gabSlug,
        date: selectedDate,
        time: selectedTime,
        patientName,
        patientPhone: phone,
        ...(email.trim() ? { patientEmail: email.trim() } : {}),
        visitType,
        ...(staffId ? { gabStaffId: staffId } : {}),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Nie udało się umówić wizyty.");
      return;
    }
    setDone(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-gab-navy">Umów wizytę — {gabName}</h2>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-gab-navy" aria-label="Zamknij">
            ✕
          </button>
        </div>
        {done ? (
          <p className="mt-6 text-[15px] text-green-800">
            Wizyta zapisana. Gabinet potwierdzi termin — możesz otrzymać SMS z przypomnieniem.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{error}</p>}
            {loading ? (
              <p className="text-slate-500">Ładowanie terminów…</p>
            ) : days.length === 0 ? (
              <p className="text-slate-500">Brak wolnych terminów w najbliższych 14 dniach.</p>
            ) : (
              <>
                {staff.length > 1 && (
                  <div>
                    <label className="block text-[14px] font-medium">Personel</label>
                    <select
                      value={staffId}
                      onChange={(e) => setStaffId(e.target.value)}
                      className="gab-input"
                      required
                    >
                      <option value="">— wybierz —</option>
                      {staff.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-[14px] font-medium">Dzień</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime("");
                    }}
                    className="gab-input"
                    required
                  >
                    <option value="">— wybierz —</option>
                    {days.map((d) => (
                      <option key={d.date} value={d.date}>
                        {new Date(`${d.date}T12:00:00`).toLocaleDateString("pl-PL", {
                          weekday: "short",
                          day: "numeric",
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedDate && (
                  <div>
                    <label className="block text-[14px] font-medium">Godzina</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="gab-input"
                      required
                    >
                      <option value="">— wybierz —</option>
                      {days
                        .find((d) => d.date === selectedDate)
                        ?.slots.map((s) => (
                          <option key={s.time} value={s.time}>
                            {s.time}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </>
            )}
            <div>
              <label className="block text-[14px] font-medium">Imię i nazwisko</label>
              <input value={patientName} onChange={(e) => setPatientName(e.target.value)} className="gab-input" required />
            </div>
            <div>
              <label className="block text-[14px] font-medium">Telefon</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="gab-input" required />
            </div>
            <div>
              <label className="block text-[14px] font-medium">E-mail (opcjonalnie)</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="gab-input" placeholder="potwierdzenia i przypomnienia" />
            </div>
            <div>
              <label className="block text-[14px] font-medium">Typ wizyty</label>
              <select value={visitType} onChange={(e) => setVisitType(e.target.value)} className="gab-input">
                {visitOptions.map((t) => (
                  <option key={`${t.value}-${t.label}`} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting || days.length === 0 || (staff.length > 1 && !staffId)}
              className="gab-btn-primary w-full disabled:opacity-60"
            >
              {submitting ? "Zapisuję…" : "Potwierdź rezerwację"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
