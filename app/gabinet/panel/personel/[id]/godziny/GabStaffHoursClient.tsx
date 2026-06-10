"use client";

import { useState } from "react";
import { saveGabStaffWorkingHoursAction } from "@/app/actions/gabinetSettings";
import { GAB_WEEKDAY_LABELS } from "@/lib/gabinet/weekdays";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import type { WorkingHoursDay } from "@/lib/gabinet/schema";
import { defaultWorkingHoursWeek } from "@/lib/gabinet/workingHours";

type DayForm = { closed: boolean; open: string; close: string };

function hoursToForm(hours: WorkingHoursDay[] | null): DayForm[] {
  if (!hours?.length) return defaultWorkingHoursWeek().map((d) => ({ closed: !d.open, open: d.open || "08:00", close: d.close || "18:00" }));
  return hours.map((d) =>
    !d.open && !d.close
      ? { closed: true, open: "08:00", close: "18:00" }
      : { closed: false, open: d.open || "08:00", close: d.close || "18:00" }
  );
}

export function GabStaffHoursClient({
  staffId,
  staffName,
  useClinicHours: initialUseClinic,
  initialHours,
}: {
  staffId: string;
  staffName: string;
  useClinicHours: boolean;
  initialHours: WorkingHoursDay[] | null;
}) {
  const [useClinicHours, setUseClinicHours] = useState(initialUseClinic);
  const [days, setDays] = useState<DayForm[]>(hoursToForm(initialHours));
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const fd = new FormData();
    fd.set("staffId", staffId);
    fd.set("useClinicHours", useClinicHours ? "true" : "false");
    if (!useClinicHours) {
      days.forEach((d, i) => {
        fd.set(`day_${i}_closed`, d.closed ? "true" : "false");
        fd.set(`day_${i}_open`, d.open);
        fd.set(`day_${i}_close`, d.close);
      });
    }
    const res = await saveGabStaffWorkingHoursAction(fd);
    setLoading(false);
    setMsg(res.ok ? "Zapisano godziny personelu." : res.error);
  }

  return (
    <>
      <GabPanelPageHeader title={`Godziny — ${staffName}`} description="Indywidualny grafik lub godziny gabinetu." />
      <div className="px-4 py-6 lg:px-8">
        <GabLink href="/panel/personel" className="text-[14px] text-gab-sky hover:underline">
          ← Personel
        </GabLink>
        <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-xl space-y-4">
          {msg && <p className="rounded-lg bg-sky-50 px-3 py-2 text-[14px]">{msg}</p>}
          <label className="flex items-center gap-2 text-[14px]">
            <input
              type="checkbox"
              checked={useClinicHours}
              onChange={(e) => setUseClinicHours(e.target.checked)}
            />
            Użyj godzin gabinetu (ustawienia → Godziny pracy)
          </label>
          {!useClinicHours &&
            days.map((d, i) => (
              <div key={i} className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-100 bg-white px-3 py-2">
                <span className="w-10 text-[13px] font-semibold text-gab-navy">{GAB_WEEKDAY_LABELS[i]}</span>
                <label className="flex items-center gap-1 text-[13px]">
                  <input
                    type="checkbox"
                    checked={d.closed}
                    onChange={(e) => setDays((prev) => prev.map((x, j) => (j === i ? { ...x, closed: e.target.checked } : x)))}
                  />
                  Zamknięte
                </label>
                {!d.closed && (
                  <>
                    <input
                      type="time"
                      className="gab-input w-auto"
                      value={d.open}
                      onChange={(e) => setDays((prev) => prev.map((x, j) => (j === i ? { ...x, open: e.target.value } : x)))}
                    />
                    <span>—</span>
                    <input
                      type="time"
                      className="gab-input w-auto"
                      value={d.close}
                      onChange={(e) => setDays((prev) => prev.map((x, j) => (j === i ? { ...x, close: e.target.value } : x)))}
                    />
                  </>
                )}
              </div>
            ))}
          <button type="submit" disabled={loading} className="gab-btn-primary disabled:opacity-60">
            {loading ? "Zapisuję…" : "Zapisz"}
          </button>
        </form>
      </div>
    </>
  );
}
