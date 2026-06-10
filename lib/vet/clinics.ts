import { getPrisma } from "@/lib/db";
import type { VetClinicRecord, WorkingHoursDay } from "@/lib/vet/schema";

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
}): VetClinicRecord {
  return {
    id: row.id,
    slug: row.slug,
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

export async function getVetClinicBySlugAsync(slug: string): Promise<VetClinicRecord | null> {
  const prisma = getPrisma();
  const row = await prisma.vetClinic.findUnique({ where: { slug } });
  return row ? rowToRecord(row) : null;
}

export async function getVetClinicByIdAsync(id: string): Promise<VetClinicRecord | null> {
  const prisma = getPrisma();
  const row = await prisma.vetClinic.findUnique({ where: { id } });
  return row ? rowToRecord(row) : null;
}

export async function getPublishedVetClinicsAsync(): Promise<VetClinicRecord[]> {
  const prisma = getPrisma();
  const rows = await prisma.vetClinic.findMany({
    where: { isPublished: true },
    orderBy: [{ city: "asc" }, { name: "asc" }],
  });
  return rows.map(rowToRecord);
}

export async function getVetDoctorsByClinicIdAsync(vetClinicId: string) {
  const prisma = getPrisma();
  return prisma.vetDoctor.findMany({
    where: { vetClinicId, active: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
}
