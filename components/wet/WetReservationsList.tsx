"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { WetCalendarAppointment } from "@/lib/vet/appointmentDisplay";
import { visitTypeBadgeClass, visitTypeLabel } from "@/lib/vet/visitTypes";
import { VET_VISIT_STATUSES, visitStatusBadgeClass, visitStatusLabel } from "@/lib/vet/visitStatus";

const BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";

type ReservationRow = { date: string; item: WetCalendarAppointment };

function getMonthsToFetch(back: number, forward: number): string[] {
  const now = new Date();
  const months: string[] = [];
  for (let i = -back; i <= forward; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

export function WetReservationsList({
  vetSlug,
  staffIdParam,
  refreshTrigger = 0,
}: {
  vetSlug: string;
  staffIdParam?: string;
  refreshTrigger?: number;
}) {
  const [rows, setRows] = useState<ReservationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Record<string, boolean>>({
    planned: true,
    done: true,
    no_show: true,
    cancelled: false,
  });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    const months = getMonthsToFetch(2, 4);
    const params = (month: string) => {
      const p = new URLSearchParams({ month });
      if (vetSlug) p.set("vet_slug", vetSlug);
      if (staffIdParam) p.set("staff_id", staffIdParam);
      return p.toString();
    };
    try {
      const results = await Promise.all(
        months.map((month) =>
          fetch(`${BASE}/api/wet/booking/calendar?${params(month)}`).then((r) => r.json())
        )
      );
      const flat: ReservationRow[] = [];
      for (const data of results) {
        const appointments = (data?.appointments ?? {}) as Record<string, WetCalendarAppointment[]>;
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
      setError("Błąd ładowania wizyt.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [vetSlug, staffIdParam]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll, refreshTrigger]);

  const filtered = rows.filter((r) => statusFilter[r.item.status] !== false);
  const toggleStatus = (key: string) =>
    setStatusFilter((s) => ({ ...s, [key]: !s[key] }));

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-wet-navy">Wszystkie wizyty</h2>
        <div className="flex flex-wrap items-center gap-3">
          {VET_VISIT_STATUSES.map(({ value, label }) => (
            <label key={value} className="flex cursor-pointer items-center gap-2 text-[14px] text-wet-navy-muted">
              <input
                type="checkbox"
                checked={statusFilter[value] !== false}
                onChange={() => toggleStatus(value)}
                className="h-4 w-4 rounded border-neutral-300 text-wet-teal-500"
              />
              {label}
            </label>
          ))}
          <button
            type="button"
            onClick={() => fetchAll()}
            disabled={loading}
            className="rounded-full border border-neutral-200 px-3 py-1.5 text-[13px] hover:bg-neutral-50 disabled:opacity-50"
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
            <p className="py-8 text-center text-[14px] text-wet-navy-muted">
              {loading ? "Ładowanie…" : "Brak wizyt w wybranym zakresie."}
            </p>
          ) : (
            <table className="w-full min-w-[640px] border-collapse text-[14px]">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-[13px] font-medium uppercase tracking-wide text-wet-navy-muted">
                  <th className="py-3 pr-4">Data</th>
                  <th className="py-3 pr-4">Godzina</th>
                  <th className="py-3 pr-4">Pacjent</th>
                  <th className="py-3 pr-4">Typ</th>
                  <th className="py-3 pr-4">Lekarz</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(({ date, item }) => (
                  <tr
                    key={`${date}-${item.id}`}
                    className={`border-b border-neutral-100 ${
                      item.status === "cancelled" ? "text-neutral-500 line-through" : "text-wet-navy"
                    }`}
                  >
                    <td className="py-3 pr-4">{date}</td>
                    <td className="py-3 pr-4 font-medium tabular-nums">{item.time}</td>
                    <td className="py-3 pr-4">
                      {item.petId ? (
                        <Link href={`/wet/panel/zwierzeta/${item.petId}`} className="font-medium text-wet-teal hover:underline">
                          {item.label}
                        </Link>
                      ) : (
                        item.label
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold ${visitTypeBadgeClass(item.visitType)}`}>
                        {visitTypeLabel(item.visitType)}
                      </span>
                    </td>
                    <td className="py-3 pr-4">{item.doctorName ?? "—"}</td>
                    <td className="py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[12px] ${visitStatusBadgeClass(item.status)}`}>
                        {visitStatusLabel(item.status)}
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
