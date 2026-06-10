import { NextRequest, NextResponse } from "next/server";
import { getClinicBySlugAsync } from "@/lib/skinmatch/clinics";
import { getTreatmentDurationMinutes } from "@/lib/clinicTreatmentPrices";
import type { WorkingHoursDay } from "@/lib/skinmatch/schema";
import { getPrisma } from "@/lib/db";

const CACHE_MAX_AGE = 60;

function slotTimeStr(slot: SlotOut): string {
  const match = /T(\d{2}:\d{2})/.exec(slot.start);
  return match ? match[1] : "";
}

function parseDate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Date.UTC(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10)));
  return Number.isNaN(d.getTime()) ? null : d;
}

function getWeekdayIndex(dateStr: string): number {
  const d = new Date(dateStr + "T12:00:00");
  const jsDay = d.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

function toISO(date: Date, hour: number, minute: number): string {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const h = String(hour).padStart(2, "0");
  const min = String(minute).padStart(2, "0");
  return `${y}-${mo}-${day}T${h}:${min}:00+01:00`;
}

function filterPastSlots(result: { date: string; slots: SlotOut[] }[], nowMs: number): void {
  for (const day of result) {
    day.slots = day.slots.filter((slot) => new Date(slot.start).getTime() >= nowMs);
  }
}

function timePlusMinutes(timeStr: string, addMin: number): string {
  const [h, m] = timeStr.split(":").map((x) => parseInt(x, 10));
  const total = (h ?? 0) * 60 + (m ?? 0) + addMin;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

function filterSlotsByDuration(
  slots: SlotOut[],
  booked: Set<string> | undefined,
  durationMinutes: number
): SlotOut[] {
  if (durationMinutes <= 30) return slots;
  const segments = Math.ceil(durationMinutes / 30);
  return slots.filter((slot) => {
    const start = slotTimeStr(slot);
    for (let i = 0; i < segments; i++) {
      const t = timePlusMinutes(start, i * 30);
      if (booked?.has(t)) return false;
    }
    return true;
  });
}

type SlotOut = { start: string; end: string; available: boolean; id: string };
type DayOut = { date: string; slots: SlotOut[]; closed?: boolean };

async function fetchLocalBookedTimesByDate(
  clinicId: string,
  fromStr: string,
  toStr: string,
  staffId?: string
): Promise<Record<string, Set<string>>> {
  const prisma = getPrisma();
  const bookings = await prisma.clinicBooking.findMany({
    where: {
      clinicId,
      date: { gte: fromStr, lte: toStr },
      status: { not: "cancelled" },
      ...(staffId ? { staffId } : {}),
    },
    select: { date: true, time: true, treatmentId: true },
  });
  const out: Record<string, Set<string>> = {};
  for (const b of bookings) {
    const start = (b.time ?? "").trim().slice(0, 5);
    if (!/^\d{2}:\d{2}$/.test(start)) continue;
    const duration = await getTreatmentDurationMinutes(clinicId, b.treatmentId ?? "");
    const segments = Math.max(1, Math.ceil(duration / 30));
    const set = (out[b.date] ??= new Set<string>());
    for (let i = 0; i < segments; i++) {
      set.add(timePlusMinutes(start, i * 30));
    }
  }
  return out;
}

function mockSlotsForDay(date: Date, dayHours?: WorkingHoursDay): SlotOut[] {
  const open = dayHours?.open ?? "";
  const close = dayHours?.close ?? "";
  if (open && close) {
    const toMins = (s: string) => {
      const [h, m] = s.split(":").map((x) => parseInt(x, 10));
      return (h ?? 0) * 60 + (m ?? 0);
    };
    const startM = toMins(open);
    const endM = toMins(close);
    const slots: SlotOut[] = [];
    for (let m = startM; m < endM; m += 30) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const start = toISO(date, h, min);
      const endMin = min === 30 ? 0 : 30;
      const endH = min === 30 ? h + 1 : h;
      const end = toISO(date, endH, endMin);
      const id = `slot-${date.toISOString().slice(0, 10)}-${String(h).padStart(2, "0")}-${String(min).padStart(2, "0")}`;
      slots.push({ start, end, available: true, id });
    }
    return slots;
  }
  if (open || close) return [];
  const slots: SlotOut[] = [];
  for (let h = 9; h < 17; h++) {
    for (const min of [0, 30]) {
      const start = toISO(date, h, min);
      const endM = min === 30 ? 0 : 30;
      const endH = min === 30 ? h + 1 : h;
      const end = toISO(date, endH, endM);
      const id = `slot-${date.toISOString().slice(0, 10)}-${String(h).padStart(2, "0")}-${String(min).padStart(2, "0")}`;
      slots.push({ start, end, available: true, id });
    }
  }
  return slots;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gabinetSlug = searchParams.get("gabinetSlug")?.trim();
    const fromStr = searchParams.get("from")?.trim();
    const toStr = searchParams.get("to")?.trim();
    const staffIdParam = searchParams.get("staffId")?.trim();
    const treatmentIdParam = searchParams.get("treatmentId")?.trim();

    if (!gabinetSlug || !fromStr || !toStr) {
      return NextResponse.json(
        { error: "Wymagane parametry: gabinetSlug, from, to (YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    const isOurStaffId = staffIdParam != null && staffIdParam.length > 0 && !/^\d+$/.test(staffIdParam);

    const fromDate = parseDate(fromStr);
    const toDate = parseDate(toStr);
    if (!fromDate || !toDate || fromDate > toDate) {
      return NextResponse.json(
        { error: "Nieprawidłowy zakres dat (from, to)" },
        { status: 400 }
      );
    }

    const clinic = await getClinicBySlugAsync(gabinetSlug);
    let localBookedByDate: Record<string, Set<string>> = {};
    if (clinic?.id) {
      try {
        localBookedByDate = await fetchLocalBookedTimesByDate(
          clinic.id,
          fromStr,
          toStr,
          isOurStaffId && staffIdParam ? staffIdParam : undefined
        );
      } catch {
        // ignore
      }
    }

    const nowMs = Date.now();
    const workingHours = clinic?.workingHours;
    let durationMinutes = 30;
    if (clinic?.id && treatmentIdParam) {
      try {
        durationMinutes = await getTreatmentDurationMinutes(clinic.id, treatmentIdParam);
        if (durationMinutes < 1) durationMinutes = 30;
      } catch {
        durationMinutes = 30;
      }
    }
    const getDayHours = (dateStr: string): WorkingHoursDay | undefined => {
      if (!workingHours || workingHours.length !== 7) return undefined;
      const idx = getWeekdayIndex(dateStr);
      return workingHours[idx];
    };

    const days = Math.min(90, Math.ceil((toDate.getTime() - fromDate.getTime()) / (24 * 60 * 60 * 1000)) + 1);
    const result: DayOut[] = [];
    const noOrderDays = new Set(
      (clinic?.kontakt?.noOrderDays ?? []).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    );
    const cur = new Date(fromDate);
    cur.setHours(0, 0, 0, 0);
    for (let i = 0; i < days; i++) {
      const dateStr = cur.toISOString().slice(0, 10);
      const dayHours = getDayHours(dateStr);
      const isClosed = Boolean(dayHours && (!dayHours.open || !dayHours.close));
      const isNoOrderDay = noOrderDays.has(dateStr);
      result.push({
        date: dateStr,
        slots: isClosed || isNoOrderDay ? [] : mockSlotsForDay(new Date(cur), dayHours),
        ...(isClosed || isNoOrderDay ? { closed: true } : {}),
      });
      cur.setDate(cur.getDate() + 1);
    }

    for (const day of result) {
      const booked = localBookedByDate[day.date];
      if (booked?.size) {
        day.slots = day.slots.filter((slot) => !booked.has(slotTimeStr(slot)));
      }
      day.slots = filterSlotsByDuration(day.slots, booked, durationMinutes);
    }
    filterPastSlots(result, nowMs);

    return NextResponse.json(result, {
      headers: { "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}` },
    });
  } catch (e) {
    console.error("[api/availability]", e);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
