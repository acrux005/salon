import { getPrisma } from "@/lib/db";
import type { GabClinicRecord, WorkingHoursDay } from "@/lib/gabinet/schema";

function parseWorkingHours(raw: string | null): WorkingHoursDay[] | undefined {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed) && parsed.length === 7) return parsed as WorkingHoursDay[];
  } catch {
    /* ignore */
  }
  return undefined;
}

function parseNoOrderDays(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((d): d is string => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d));
    }
  } catch {
    /* ignore */
  }
  return [];
}

function rowToRecord(row: {
  id: string;
  slug: string;
  vertical: string;
  name: string;
  city: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  description: string;
  logoUrl: string | null;
  isPublished: boolean;
  workingHours: string | null;
  noOrderDays: string | null;
  bookingPhoneOnly: boolean;
  slotDurationMinutes: number;
}): GabClinicRecord {
  return {
    id: row.id,
    slug: row.slug,
    vertical: row.vertical,
    name: row.name,
    city: row.city,
    address: row.address,
    phone: row.phone,
    email: row.email,
    description: row.description,
    logoUrl: row.logoUrl,
    isPublished: row.isPublished,
    workingHours: parseWorkingHours(row.workingHours),
    noOrderDays: parseNoOrderDays(row.noOrderDays),
    bookingPhoneOnly: row.bookingPhoneOnly,
    slotDurationMinutes: row.slotDurationMinutes,
  };
}

export async function getGabClinicBySlugAsync(slug: string): Promise<GabClinicRecord | null> {
  const row = await getPrisma().gabClinic.findUnique({ where: { slug } });
  return row ? rowToRecord(row) : null;
}

export async function getGabClinicByIdAsync(id: string): Promise<GabClinicRecord | null> {
  const row = await getPrisma().gabClinic.findUnique({ where: { id } });
  return row ? rowToRecord(row) : null;
}

export async function getPublishedGabClinicsAsync(): Promise<GabClinicRecord[]> {
  const rows = await getPrisma().gabClinic.findMany({
    where: { isPublished: true },
    orderBy: [{ city: "asc" }, { name: "asc" }],
  });
  return rows.map(rowToRecord);
}

export async function getGabStaffByClinicIdAsync(gabClinicId: string) {
  return getPrisma().gabStaff.findMany({
    where: { gabClinicId, active: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
}

export function getWeekdayIndex(dateStr: string): number {
  const d = new Date(`${dateStr}T12:00:00`);
  const jsDay = d.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}
