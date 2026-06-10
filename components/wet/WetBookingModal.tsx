"use client";

import { useState, useEffect } from "react";
import { VET_VISIT_TYPES } from "@/lib/vet/visitTypes";

const BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";

type Day = { date: string; slots: { start: string; time: string; available: boolean }[]; closed?: boolean };

export function WetBookingModal({
  vetSlug,
  vetName,
  onClose,
}: {
  vetSlug: string;
  vetName: string;
  onClose: () => void;
}) {
  const [days, setDays] = useState<Day[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [petName, setPetName] = useState("");
  const [visitType, setVisitType] = useState("kontrola");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const from = new Date().toISOString().slice(0, 10);
    const to = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
    fetch(`${BASE}/api/wet/availability?vet_slug=${encodeURIComponent(vetSlug)}&from=${from}&to=${to}`)
      .then((r) => r.json())
      .then((data) => {
        const parsed: Day[] = (data.days ?? []).map((d: { date: string; slots: { start: string; available: boolean }[]; closed?: boolean }) => ({
          date: d.date,
          closed: d.closed,
          slots: d.slots
            .filter((s) => s.available)
            .map((s) => ({
              start: s.start,
              time: /T(\d{2}:\d{2})/.exec(s.start)?.[1] ?? "",
              available: s.available,
            })),
        }));
        setDays(parsed.filter((d) => d.slots.length > 0));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [vetSlug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !ownerName || !phone) {
      setError("Uzupełnij termin, imię i telefon.");
      return;
    }
    setSubmitting(true);
    setError("");
    const res = await fetch(`${BASE}/api/wet/booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vetSlug,
        date: selectedDate,
        time: selectedTime,
        ownerName,
        phone,
        petName: petName || undefined,
        visitType,
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
          <h2 className="text-xl font-bold text-wet-navy">Umów wizytę — {vetName}</h2>
          <button type="button" onClick={onClose} className="text-wet-navy-muted hover:text-wet-navy" aria-label="Zamknij">
            ✕
          </button>
        </div>
        {done ? (
          <p className="mt-6 text-[15px] text-green-800">
            Wizyta zapisana. Przychodnia potwierdzi termin — możesz otrzymać SMS z przypomnieniem.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{error}</p>}
            {loading ? (
              <p className="text-wet-navy-muted">Ładowanie terminów…</p>
            ) : (
              <>
                <div>
                  <label className="block text-[14px] font-medium">Dzień</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime("");
                    }}
                    className="wet-input"
                    required
                  >
                    <option value="">— wybierz —</option>
                    {days.map((d) => (
                      <option key={d.date} value={d.date}>
                        {d.date}
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
                      className="wet-input"
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
              <label className="block text-[14px] font-medium">Imię i nazwisko właściciela</label>
              <input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="wet-input" required />
            </div>
            <div>
              <label className="block text-[14px] font-medium">Telefon</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="wet-input" required />
            </div>
            <div>
              <label className="block text-[14px] font-medium">Imię zwierzęcia (opcjonalnie)</label>
              <input value={petName} onChange={(e) => setPetName(e.target.value)} className="wet-input" />
            </div>
            <div>
              <label className="block text-[14px] font-medium">Typ wizyty</label>
              <select value={visitType} onChange={(e) => setVisitType(e.target.value)} className="wet-input">
                {VET_VISIT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={submitting} className="wet-btn-primary w-full disabled:opacity-60">
              {submitting ? "Zapisuję…" : "Potwierdź rezerwację"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
