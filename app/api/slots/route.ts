import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";

/** workingHours: JSON array of 7 days, [0]=Sunday. Each: { open: "09:00", close: "22:00" } or "" for closed. */
function parseWorkingHours(json: string | null): { open: string; close: string }[] {
  const defaultDay = { open: "10:00", close: "22:00" };
  if (!json || json === "") {
    return Array(7).fill(defaultDay);
  }
  try {
    const arr = JSON.parse(json) as unknown[];
    return Array.from({ length: 7 }, (_, i) => {
      const d = arr[i];
      if (d && typeof d === "object" && "open" in d && "close" in d) {
        return { open: String((d as { open: string }).open), close: String((d as { close: string }).close) };
      }
      return defaultDay;
    });
  } catch {
    return Array(7).fill(defaultDay);
  }
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function minutesToTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export async function GET(request: NextRequest) {
  const restaurantId = request.nextUrl.searchParams.get("restaurantId");
  const dateStr = request.nextUrl.searchParams.get("date");
  if (!restaurantId || !dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json({ error: "restaurantId and date (YYYY-MM-DD) required" }, { status: 400 });
  }
  const prisma = getPrisma();
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { workingHours: true, orderAheadDays: true, slotDurationMinutes: true },
  });
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }
  const slotDuration = restaurant.slotDurationMinutes ?? 30;
  const orderAheadDays = restaurant.orderAheadDays ?? 3;
  const hours = parseWorkingHours(restaurant.workingHours);
  const date = new Date(dateStr + "T12:00:00");
  const dayOfWeek = date.getDay(); // 0 Sun, 1 Mon, ...
  const dayHours = hours[dayOfWeek];
  const openMin = timeToMinutes(dayHours.open);
  const closeMin = timeToMinutes(dayHours.close);
  if (openMin >= closeMin) {
    return NextResponse.json({ slots: [] });
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + orderAheadDays);
  const chosen = new Date(dateStr + "T00:00:00");
  if (chosen < today) {
    return NextResponse.json({ slots: [] });
  }
  if (chosen > maxDate) {
    return NextResponse.json({ slots: [] });
  }
  const slots: string[] = [];
  for (let min = openMin; min + slotDuration <= closeMin; min += slotDuration) {
    slots.push(minutesToTime(min));
  }
  const isToday = dateStr === today.toISOString().slice(0, 10);
  if (isToday) {
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();
    const filtered = slots.filter((s) => timeToMinutes(s) > currentMin + 15);
    return NextResponse.json({ slots: filtered });
  }
  return NextResponse.json({ slots });
}
