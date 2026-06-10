import { getPrisma } from "@/lib/db";

export type SubCabinetRecord = {
  id: string;
  clinicId: string;
  name: string;
  order: number;
};

export async function getSubCabinetsByClinicIdAsync(clinicId: string): Promise<SubCabinetRecord[]> {
  const prisma = getPrisma();
  const rows = await prisma.subCabinet.findMany({
    where: { clinicId },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
  return rows.map((r) => ({
    id: r.id,
    clinicId: r.clinicId,
    name: r.name,
    order: r.order,
  }));
}

export async function createSubCabinetAsync(
  clinicId: string,
  data: { name: string }
): Promise<SubCabinetRecord> {
  const prisma = getPrisma();
  const maxOrder = await prisma.subCabinet
    .aggregate({ where: { clinicId }, _max: { order: true } })
    .then((a) => a._max.order ?? -1);
  const row = await prisma.subCabinet.create({
    data: {
      clinicId,
      name: data.name.trim(),
      order: maxOrder + 1,
    },
  });
  return {
    id: row.id,
    clinicId: row.clinicId,
    name: row.name,
    order: row.order,
  };
}

export async function updateSubCabinetAsync(
  id: string,
  clinicId: string,
  data: { name?: string }
): Promise<SubCabinetRecord | null> {
  const prisma = getPrisma();
  const result = await prisma.subCabinet.updateMany({
    where: { id, clinicId },
    data: { ...(data.name !== undefined && { name: data.name.trim() }) },
  });
  if (result.count === 0) return null;
  const row = await prisma.subCabinet.findUnique({ where: { id } });
  return row ? { id: row.id, clinicId: row.clinicId, name: row.name, order: row.order } : null;
}

export async function deleteSubCabinetAsync(id: string, clinicId: string): Promise<boolean> {
  const prisma = getPrisma();
  const result = await prisma.subCabinet.deleteMany({ where: { id, clinicId } });
  return result.count > 0;
}

export async function getSubCabinetTreatmentIdsAsync(subCabinetId: string): Promise<string[]> {
  const prisma = getPrisma();
  const rows = await prisma.subCabinetTreatment.findMany({
    where: { subCabinetId },
    select: { treatmentId: true },
  });
  return rows.map((r) => r.treatmentId);
}

export async function setSubCabinetTreatmentsAsync(
  subCabinetId: string,
  clinicId: string,
  treatmentIds: string[]
): Promise<void> {
  const prisma = getPrisma();
  const sub = await prisma.subCabinet.findFirst({ where: { id: subCabinetId, clinicId } });
  if (!sub) return;
  await prisma.subCabinetTreatment.deleteMany({ where: { subCabinetId } });
  const uniqueIds = Array.from(new Set(treatmentIds));
  if (uniqueIds.length > 0) {
    await prisma.subCabinetTreatment.createMany({
      data: uniqueIds.map((treatmentId) => ({ subCabinetId, treatmentId })),
    });
  }
}

export async function canDoTreatmentInSubCabinetAsync(
  treatmentId: string,
  subCabinetId: string | null
): Promise<boolean> {
  if (!subCabinetId) return true;
  const prisma = getPrisma();
  const count = await prisma.subCabinetTreatment.count({
    where: { subCabinetId, treatmentId },
  });
  return count > 0;
}

export async function canStaffDoTreatmentAsync(
  clinicId: string,
  cosmoStaffId: number,
  treatmentId: string
): Promise<boolean> {
  const prisma = getPrisma();
  const staff = await prisma.staff.findFirst({
    where: { clinicId, cosmoStaffId },
    select: {
      id: true,
      subCabinetId: true,
      staffSubCabinets: { select: { subCabinetId: true } },
    },
  });
  if (!staff) return false;
  const subCabinetIds = staff.staffSubCabinets.map((sc) => sc.subCabinetId);
  const legacy =
    subCabinetIds.length === 0 && staff.subCabinetId ? [staff.subCabinetId] : subCabinetIds;
  if (legacy.length === 0) return true;
  const { getStaffTreatmentIdsAsync } = await import("./staffTreatmentDb");
  const staffTreatmentIds = await getStaffTreatmentIdsAsync(staff.id);
  if (staffTreatmentIds.length > 0) return staffTreatmentIds.includes(treatmentId);
  for (const subId of legacy) {
    if (await canDoTreatmentInSubCabinetAsync(treatmentId, subId)) return true;
  }
  return false;
}

export async function canStaffDoTreatmentByStaffIdAsync(
  staffId: string,
  treatmentId: string
): Promise<boolean> {
  const prisma = getPrisma();
  const staff = await prisma.staff.findUnique({
    where: { id: staffId },
    select: {
      id: true,
      subCabinetId: true,
      staffSubCabinets: { select: { subCabinetId: true } },
    },
  });
  if (!staff) return false;
  const subCabinetIds = staff.staffSubCabinets.map((sc) => sc.subCabinetId);
  const legacy =
    subCabinetIds.length === 0 && staff.subCabinetId ? [staff.subCabinetId] : subCabinetIds;
  if (legacy.length === 0) return true;
  const { getStaffTreatmentIdsAsync } = await import("./staffTreatmentDb");
  const staffTreatmentIds = await getStaffTreatmentIdsAsync(staff.id);
  if (staffTreatmentIds.length > 0) return staffTreatmentIds.includes(treatmentId);
  for (const subId of legacy) {
    if (await canDoTreatmentInSubCabinetAsync(treatmentId, subId)) return true;
  }
  return false;
}
