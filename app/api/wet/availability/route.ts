import { NextRequest, NextResponse } from "next/server";
import { getVetClinicBySlugAsync } from "@/lib/vet/clinics";
import { getPrisma } from "@/lib/db";
import type { WorkingHoursDay } from "@/lib/vet/schema";

type SlotOut = { start: string; end: string; available: boolean; id: string };
type DayOut = { date: string; slots: SlotOut[]; closed?: boolean };

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

function buildSlotsForDay(
  dateStr: string,
  hours: WorkingHoursDay | undefined,
  booked: Set<string>,
  slotMin: number
): SlotOut[] {
  if (!hours?.open || !hours?.close) return [];
  const [oh, om] = hours.open.split(":").map(Number);
  const [ch, cm] = hours.close.split(":").map(Number);
  const startMin = (oh ?? 9) * 60 + (om ?? 0);
  const endMin = (ch ?? 17) * 60 + (cm ?? 0);
  const d = new Date(dateStr + "T12:00:00");
  const slots: SlotOut[] = [];
  for (let t = startMin; t + slotMin <= endMin; t += slotMin) {
    const h = Math.floor(t / 60);
    const m = t % 60;
    const endTotal = t + slotMin;
    const eh = Math.floor(endTotal / 60);
    const em = endTotal % 60;
    const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    slots.push({
      start: toISO(d, h, m),
      end: toISO(d, eh, em),
      available: !booked.has(timeStr),
      id: `${dateStr}-${timeStr}`,
    });
  }
  return slots;
}

export async function GET(request: NextRequest) {
  const vetSlug = request.nextUrl.searchParams.get("vet_slug")?.trim() || request.nextUrl.searchParams.get("clinic_slug")?.trim();
  const from = request.nextUrl.searchParams.get("from")?.trim();
  const to = request.nextUrl.searchParams.get("to")?.trim();
  const staffId = request.nextUrl.searchParams.get("staff_id")?.trim();

  if (!vetSlug || !from || !to) {
    return NextResponse.json({ error: "Wymagane: vet_slug, from, to (YYYY-MM-DD)." }, { status: 400 });
  }

  const clinic = await getVetClinicBySlugAsync(vetSlug);
  if (!clinic) {
    return NextResponse.json({ error: "Nie znaleziono przychodni." }, { status: 404 });
  }

  const prisma = getPrisma();
  const bookings = await prisma.vetAppointment.findMany({
    where: {
      vetClinicId: clinic.id,
      date: { gte: from, lte: to },
      status: "planned",
      ...(staffId ? { vetDoctorId: staffId } : {}),
    },
    select: { date: true, time: true },
  });
  const bookedByDate: Record<string, Set<string>> = {};
  for (const b of bookings) {
    if (!bookedByDate[b.date]) bookedByDate[b.date] = new Set();
    bookedByDate[b.date].add(b.time);
  }

  const noOrderDays = new Set(clinic.noOrderDays ?? []);
  const slotMin = clinic.slotDurationMinutes ?? 30;
  const result: DayOut[] = [];
  const start = new Date(from + "T12:00:00");
  const end = new Date(to + "T12:00:00");
  const nowMs = Date.now();

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10);
    if (noOrderDays.has(dateStr)) {
      result.push({ date: dateStr, slots: [], closed: true });
      continue;
    }
    const dayHours = clinic.workingHours?.[getWeekdayIndex(dateStr)];
    const slots = buildSlotsForDay(dateStr, dayHours, bookedByDate[dateStr] ?? new Set(), slotMin);
    const filtered = slots.filter((s) => new Date(s.start).getTime() >= nowMs);
    result.push({ date: dateStr, slots: filtered, closed: slots.length === 0 });
  }

  return NextResponse.json({ days: result });
}
