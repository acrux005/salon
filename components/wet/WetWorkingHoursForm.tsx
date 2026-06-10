"use client";

import { useState, useTransition } from "react";
import type { WorkingHoursDay } from "@/lib/vet/schema";
import { updateVetNoOrderDaysAction, updateVetClinicWorkingHoursAction } from "@/app/actions/vet";

const DAY_LABELS = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];

const timeInputStyles = `
  .working-hours-form input[type="time"] {
    width: 120px;
    min-width: 120px;
    height: 40px;
    padding: 6px 10px;
    font-size: 14px;
    line-height: 1.5;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 6px;
  }
  .working-hours-form .time-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }
  @media (max-width: 768px) {
    .working-hours-form .time-row {
      flex-direction: column;
      align-items: flex-start;
    }
    .working-hours-form input[type="time"] {
      width: 100%;
      min-width: 0;
    }
  }
`;

const defaultHours = (): WorkingHoursDay[] =>
  Array(7)
    .fill(null)
    .map(() => ({ open: "09:00", close: "17:00" }));

function parseInitial(hours: WorkingHoursDay[] | undefined): WorkingHoursDay[] {
  if (hours && Array.isArray(hours) && hours.length === 7) return hours;
  return defaultHours();
}

function parseNoOrderDays(initialNoOrderDays: string[] | undefined): string[] {
  if (!Array.isArray(initialNoOrderDays)) return [];
  return Array.from(
    new Set(
      initialNoOrderDays
        .map((d) => (typeof d === "string" ? d.trim() : ""))
        .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    )
  ).sort();
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("pl-PL", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function WetWorkingHoursForm({
  initial,
  initialNoOrderDays,
}: {
  initial: WorkingHoursDay[] | undefined;
  initialNoOrderDays: string[] | undefined;
}) {
  const [hours, setHours] = useState<WorkingHoursDay[]>(() => parseInitial(initial));
  const [noOrderDays, setNoOrderDays] = useState<string[]>(() => parseNoOrderDays(initialNoOrderDays));
  const [newNoOrderDay, setNewNoOrderDay] = useState("");
  const [saving, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const update = (dayIndex: number, field: "open" | "close", value: string) => {
    setHours((prev) => {
      const next = [...prev];
      next[dayIndex] = { ...next[dayIndex], [field]: value };
      return next;
    });
    setMessage(null);
  };

  const setClosed = (dayIndex: number) => {
    setHours((prev) => {
      const next = [...prev];
      next[dayIndex] = { open: "", close: "" };
      return next;
    });
    setMessage(null);
  };

  const save = () => {
    startTransition(async () => {
      const [hoursResult, noOrderDaysResult] = await Promise.all([
        updateVetClinicWorkingHoursAction(hours),
        updateVetNoOrderDaysAction(noOrderDays),
      ]);
      if (hoursResult.ok && noOrderDaysResult.ok) {
        setMessage({ type: "ok", text: "Zapisano godziny pracy." });
      } else {
        const errorText = !hoursResult.ok
          ? hoursResult.error
          : !noOrderDaysResult.ok
            ? noOrderDaysResult.error
            : "Nie udało się zapisać ustawień.";
        setMessage({
          type: "err",
          text: errorText,
        });
      }
    });
  };

  const addNoOrderDay = () => {
    const value = newNoOrderDay.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
    setNoOrderDays((prev) => Array.from(new Set([...prev, value])).sort());
    setNewNoOrderDay("");
    setMessage(null);
  };

  const removeNoOrderDay = (dateStr: string) => {
    setNoOrderDays((prev) => prev.filter((d) => d !== dateStr));
    setMessage(null);
  };

  return (
    <div className="working-hours-form rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
      <style dangerouslySetInnerHTML={{ __html: timeInputStyles }} />
      <h2 className="font-[var(--font-serif)] text-lg font-normal text-[#1F1A1C]">
        Godziny pracy gabinetu
      </h2>
      <p className="mt-1 text-[14px] text-[#6F5E64]">
        Ustaw godziny otwarcia dla każdego dnia. Puste = zamknięte.
      </p>
      <div className="mt-4">
        {DAY_LABELS.map((label, i) => {
          const open = (hours[i]?.open ?? "").trim();
          const close = (hours[i]?.close ?? "").trim();
          const isClosed = !open || !close;
          return (
            <div key={i} className="mb-3 last:mb-0">
              <div className="time-row">
                <span className="w-8 shrink-0 text-[14px] font-medium text-[#6F5E64]">{label}</span>
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:gap-3">
                  <input
                    type="time"
                    value={hours[i]?.open ?? ""}
                    onChange={(e) => update(i, "open", e.target.value)}
                    aria-label={`${label} godzina otwarcia`}
                  />
                  <span className="shrink-0 text-neutral-400">–</span>
                  <input
                    type="time"
                    value={hours[i]?.close ?? ""}
                    onChange={(e) => update(i, "close", e.target.value)}
                    aria-label={`${label} godzina zamknięcia`}
                  />
                </div>
              </div>
              <div className="ml-10 mt-0.5 flex flex-col gap-0.5 sm:ml-[3.5rem]">
                {isClosed ? (
                  <span className="text-[13px] text-[#6F5E64]">Zamknięte</span>
                ) : (
                  <>
                    <span className="text-[13px] font-medium text-[#1F1A1C]">{open} – {close}</span>
                    <button
                      type="button"
                      className="w-fit text-left text-[12px] text-wet-teal-600 hover:underline"
                      onClick={() => setClosed(i)}
                    >
                      Ustaw jako zamknięte
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <h3 className="font-[var(--font-sans)] text-[15px] font-semibold text-[#1F1A1C]">
          No order days (dni bez rezerwacji)
        </h3>
        <p className="mt-1 text-[13px] text-[#6F5E64]">
          Dodaj wyjątkowe daty, kiedy gabinet jest zamknięty (np. święta, urlop, chorobowe).
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <div className="min-w-[170px] flex-1">
            <label className="mb-1 block text-[12px] text-[#6F5E64]" htmlFor="no-order-day">
              Data
            </label>
            <input
              id="no-order-day"
              type="date"
              value={newNoOrderDay}
              onChange={(e) => setNewNoOrderDay(e.target.value)}
              className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-[14px] text-[#1F1A1C] focus:border-wet-teal-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            />
          </div>
          <button
            type="button"
            onClick={addNoOrderDay}
            className="h-10 rounded-lg border border-wet-teal-200 bg-wet-teal-50 px-3 text-[13px] font-medium text-wet-teal-700 hover:bg-wet-teal-100"
          >
            Dodaj dzień
          </button>
        </div>
        {noOrderDays.length > 0 ? (
          <ul className="mt-3 space-y-1.5">
            {noOrderDays.map((dateStr) => (
              <li key={dateStr} className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-[13px] text-[#1F1A1C]">
                <span>{formatDateLabel(dateStr)}</span>
                <button
                  type="button"
                  onClick={() => removeNoOrderDay(dateStr)}
                  className="text-[12px] text-wet-teal-600 hover:underline"
                >
                  Usuń
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-[13px] text-[#6F5E64]">Brak dodatkowych dni bez rezerwacji.</p>
        )}
      </div>
      {message && (
        <p
          className={`mt-3 text-[14px] ${message.type === "ok" ? "text-green-700" : "text-red-600"}`}
        >
          {message.text}
        </p>
      )}
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-4 rounded-lg bg-[#1F1A1C] px-4 py-2 text-[14px] font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
      >
        {saving ? "Zapisywanie…" : "Zapisz godziny"}
      </button>
    </div>
  );
}
