"use client";

import { useState, useEffect, useCallback } from "react";

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

type ReservationRow = { date: string; item: AppointmentItem };

const STATUS_LABELS: Record<string, string> = {
  planned: "Zaplanowana",
  done: "Zrealizowana",
  cancelled: "Anulowana",
  archived: "Archiwum",
};

const STATUS_FILTERS = [
  { key: "planned", label: "Zaplanowana" },
  { key: "done", label: "Zrealizowana" },
  { key: "cancelled", label: "Anulowana" },
] as const;

function getMonthsToFetch(back: number, forward: number): string[] {
  const now = new Date();
  const months: string[] = [];
  for (let i = -back; i <= forward; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

export function ReservationsList({
  clinicSlug,
  staffIdParam,
  refreshTrigger = 0,
}: {
  clinicSlug: string;
  staffIdParam?: string;
  refreshTrigger?: number;
}) {
  const [rows, setRows] = useState<ReservationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Record<string, boolean>>({
    planned: true,
    done: true,
    cancelled: false,
  });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    const months = getMonthsToFetch(2, 4);
    const params = (month: string) => {
      const p = new URLSearchParams({ month });
      if (clinicSlug) p.set("clinic_slug", clinicSlug);
      if (staffIdParam) p.set("staff_id", staffIdParam);
      return p.toString();
    };
    try {
      const results = await Promise.all(
        months.map((month) =>
          fetch(`${BASE}/api/booking/calendar?${params(month)}`).then((r) => r.json())
        )
      );
      const flat: ReservationRow[] = [];
      for (const data of results) {
        const appointments = (data as CalendarResponse)?.appointments ?? {};
        for (const [date, items] of Object.entries(appointments)) {
          for (const item of items) {
            flat.push({ date, item });
          }
        }
      }
      flat.sort((a, b) => {
        const d = b.date.localeCompare(a.date);
        if (d !== 0) return d;
        return b.item.time.localeCompare(a.item.time);
      });
      setRows(flat);
    } catch {
      setError("Błąd ładowania rezerwacji.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [clinicSlug, staffIdParam]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll, refreshTrigger]);

  const filtered = rows.filter((r) => statusFilter[r.item.status] !== false);
  const toggleStatus = (key: string) =>
    setStatusFilter((s) => ({ ...s, [key]: !s[key] }));

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-[var(--font-serif)] text-xl text-[#1F1A1C]">
          Wszystkie rezerwacje
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          {STATUS_FILTERS.map(({ key, label }) => (
            <label key={key} className="flex cursor-pointer items-center gap-2 text-[14px] text-[#6F5E64]">
              <input
                type="checkbox"
                checked={statusFilter[key] !== false}
                onChange={() => toggleStatus(key)}
                className="h-4 w-4 rounded border-neutral-300 text-pink-500 focus:ring-pink-500"
              />
              {label}
            </label>
          ))}
          <button
            type="button"
            onClick={() => fetchAll()}
            disabled={loading}
            className="rounded-full border border-neutral-200 px-3 py-1.5 text-[13px] text-[#6F5E64] hover:bg-neutral-50 disabled:opacity-50"
          >
            {loading ? "Ładowanie…" : "Odśwież"}
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700" role="alert">
          {error}
        </p>
      )}

      {!error && (
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-[14px] text-[#6F5E64]">
              {loading ? "Ładowanie…" : "Brak rezerwacji w wybranym zakresie lub przy wybranych filtrach."}
            </p>
          ) : (
            <table className="w-full min-w-[520px] border-collapse text-[14px]">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-[13px] font-medium uppercase tracking-wide text-[#6F5E64]">
                  <th className="py-3 pr-4">Data</th>
                  <th className="py-3 pr-4">Godzina</th>
                  <th className="py-3 pr-4">Klient</th>
                  <th className="py-3 pr-4">Zabieg</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(({ date, item }) => (
                  <tr
                    key={`${date}-${item.id}`}
                    className={`border-b border-neutral-100 ${
                      item.status === "cancelled"
                        ? "text-neutral-500 line-through"
                        : item.status === "done"
                          ? "text-green-800"
                          : "text-[#1F1A1C]"
                    }`}
                  >
                    <td className="py-3 pr-4">{date}</td>
                    <td className="py-3 pr-4 font-medium">{item.time}</td>
                    <td className="py-3 pr-4">{item.client}</td>
                    <td className="py-3 pr-4">{item.service ?? "—"}</td>
                    <td className="py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[12px] ${
                          item.status === "cancelled"
                            ? "bg-neutral-100 text-neutral-600"
                            : item.status === "done"
                              ? "bg-green-100 text-green-800"
                              : "bg-pink-100 text-pink-800"
                        }`}
                      >
                        {STATUS_LABELS[item.status] ?? item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
}
