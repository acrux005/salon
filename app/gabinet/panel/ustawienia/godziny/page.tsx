"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { saveGabWorkingHoursAction } from "@/app/actions/gabinetSettings";
import { GAB_WEEKDAY_LABELS } from "@/lib/gabinet/weekdays";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import type { WorkingHoursDay } from "@/lib/gabinet/schema";

type DayForm = { closed: boolean; open: string; close: string };

export default function GabGodzinyPage() {
  const { data: session } = useSession();
  const slug = (session?.user as { gabClinicSlug?: string })?.gabClinicSlug;
  const [days, setDays] = useState<DayForm[]>(
    Array(7)
      .fill(null)
      .map(() => ({ closed: false, open: "08:00", close: "18:00" }))
  );
  const [noOrderDays, setNoOrderDays] = useState("");
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(30);
  const [bookingPhoneOnly, setBookingPhoneOnly] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const slug = (session?.user as { gabClinicSlug?: string })?.gabClinicSlug;
    if (!slug) return;
    fetch(`/api/gabinet/clinic?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => {
        const c = data.clinic;
        if (!c) return;
        let hours: WorkingHoursDay[] | undefined;
        try {
          hours = c.workingHours ? JSON.parse(c.workingHours) : undefined;
        } catch {
          /* ignore */
        }
        if (hours?.length === 7) {
          setDays(
            hours.map((h) =>
              !h.open && !h.close
                ? { closed: true, open: "08:00", close: "18:00" }
                : { closed: false, open: h.open ?? "08:00", close: h.close ?? "18:00" }
            )
          );
        }
        try {
          const nod = c.noOrderDays ? JSON.parse(c.noOrderDays) : [];
          if (Array.isArray(nod)) setNoOrderDays(nod.join("\n"));
        } catch {
          /* ignore */
        }
        setSlotDurationMinutes(c.slotDurationMinutes ?? 30);
        setBookingPhoneOnly(!!c.bookingPhoneOnly);
      });
  }, [session]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const fd = new FormData();
    days.forEach((d, i) => {
      fd.set(`day_${i}_closed`, d.closed ? "true" : "false");
      fd.set(`day_${i}_open`, d.open);
      fd.set(`day_${i}_close`, d.close);
    });
    fd.set("noOrderDays", noOrderDays);
    fd.set("slotDurationMinutes", String(slotDurationMinutes));
    fd.set("bookingPhoneOnly", bookingPhoneOnly ? "true" : "false");
    const res = await saveGabWorkingHoursAction(fd);
    setLoading(false);
    setMsg(res.ok ? "Zapisano godziny pracy." : res.error);
  }

  return (
    <>
      <GabPanelPageHeader title="Godziny pracy" description="Dostępność w rezerwacji online i kalendarzu." />
      <div className="px-4 py-6 lg:px-8">
        <GabLink href="/panel/ustawienia" className="text-[14px] text-gab-sky hover:underline">
          ← Ustawienia
        </GabLink>
        <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-xl space-y-4">
          {msg && <p className="rounded-lg bg-sky-50 px-3 py-2 text-[14px]">{msg}</p>}
          {days.map((d, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-100 bg-white px-3 py-2">
              <span className="w-10 text-[13px] font-semibold text-gab-navy">{GAB_WEEKDAY_LABELS[i]}</span>
              <label className="flex items-center gap-1 text-[13px]">
                <input type="checkbox" checked={d.closed} onChange={(e) => setDays((prev) => prev.map((x, j) => (j === i ? { ...x, closed: e.target.checked } : x)))} />
                Zamknięte
              </label>
              {!d.closed && (
                <>
                  <input type="time" className="gab-input w-auto" value={d.open} onChange={(e) => setDays((prev) => prev.map((x, j) => (j === i ? { ...x, open: e.target.value } : x)))} />
                  <span>—</span>
                  <input type="time" className="gab-input w-auto" value={d.close} onChange={(e) => setDays((prev) => prev.map((x, j) => (j === i ? { ...x, close: e.target.value } : x)))} />
                </>
              )}
            </div>
          ))}
          <div>
            <label className="block text-[14px] font-medium">Dni bez rezerwacji (YYYY-MM-DD, po jednym w linii)</label>
            <textarea className="gab-input min-h-[80px]" value={noOrderDays} onChange={(e) => setNoOrderDays(e.target.value)} />
          </div>
          <div>
            <label className="block text-[14px] font-medium">Długość slotu (min)</label>
            <input type="number" min={5} step={5} className="gab-input max-w-[120px]" value={slotDurationMinutes} onChange={(e) => setSlotDurationMinutes(parseInt(e.target.value, 10) || 30)} />
          </div>
          <label className="flex items-center gap-2 text-[14px]">
            <input type="checkbox" checked={bookingPhoneOnly} onChange={(e) => setBookingPhoneOnly(e.target.checked)} />
            Rezerwacja tylko telefoniczna (wyłącz booking online)
          </label>
          <button type="submit" disabled={loading} className="gab-btn-primary disabled:opacity-60">
            {loading ? "Zapisuję…" : "Zapisz"}
          </button>
          {slug && (
            <div className="rounded-lg border border-sky-100 bg-sky-50/50 p-4">
              <p className="text-[14px] font-medium text-gab-navy">Podgląd dostępności online</p>
              <p className="mt-1 text-[13px] text-slate-600">
                Otwórz stronę rezerwacji pacjenta, aby sprawdzić sloty według zapisanych godzin.
              </p>
              <GabLink
                href={`/gabinet/${slug}?book=1`}
                target="_blank"
                className="mt-2 inline-block text-[14px] text-gab-sky hover:underline"
              >
                Otwórz booking online →
              </GabLink>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
