import { getPrisma } from "@/lib/db";

export type StaffRecord = {
  id: string;
  clinicId: string;
  name: string;
  cosmoStaffId: number | null;
  subCabinetIds: string[];
  order: number;
};

export async function getStaffByClinicIdAsync(clinicId: string): Promise<StaffRecord[]> {
  const prisma = getPrisma();
  const rows = await prisma.staff.findMany({
    where: { clinicId },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { staffSubCabinets: { select: { subCabinetId: true } } },
  });
  return rows.map((r) => {
    const subCabinetIds = r.staffSubCabinets.map((sc) => sc.subCabinetId);
    const legacy = subCabinetIds.length === 0 && r.subCabinetId ? [r.subCabinetId] : subCabinetIds;
    return {
      id: r.id,
      clinicId: r.clinicId,
      name: r.name,
      cosmoStaffId: r.cosmoStaffId,
      subCabinetIds: legacy,
      order: r.order,
    };
  });
}

export async function createStaffAsync(
  clinicId: string,
  data: { name: string; cosmoStaffId?: number | null; subCabinetIds?: string[] }
): Promise<StaffRecord> {
  const prisma = getPrisma();
  const maxOrder = await prisma.staff
    .aggregate({ where: { clinicId }, _max: { order: true } })
    .then((a) => a._max.order ?? -1);
  const ids = data.subCabinetIds ?? [];
  const row = await prisma.staff.create({
    data: {
      clinicId,
      name: data.name.trim(),
      cosmoStaffId: data.cosmoStaffId ?? null,
      order: maxOrder + 1,
      staffSubCabinets:
        ids.length > 0 ? { create: ids.map((subCabinetId) => ({ subCabinetId })) } : undefined,
    },
  });
  return {
    id: row.id,
    clinicId: row.clinicId,
    name: row.name,
    cosmoStaffId: row.cosmoStaffId,
    subCabinetIds: ids,
    order: row.order,
  };
}

export async function updateStaffAsync(
  id: string,
  clinicId: string,
  data: { name?: string; cosmoStaffId?: number | null; subCabinetIds?: string[] }
): Promise<StaffRecord | null> {
  const prisma = getPrisma();
  if (data.subCabinetIds !== undefined) {
    await prisma.staffSubCabinet.deleteMany({ where: { staffId: id } });
    const ids = data.subCabinetIds;
    if (ids.length > 0) {
      await prisma.staffSubCabinet.createMany({
        data: ids.map((subCabinetId) => ({ staffId: id, subCabinetId })),
      });
    }
  }
  const row = await prisma.staff.updateMany({
    where: { id, clinicId },
    data: {
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.cosmoStaffId !== undefined && { cosmoStaffId: data.cosmoStaffId }),
    },
  });
  if (row.count === 0) return null;
  const updated = await prisma.staff.findUnique({
    where: { id },
    include: { staffSubCabinets: { select: { subCabinetId: true } } },
  });
  return updated
    ? {
        id: updated.id,
        clinicId: updated.clinicId,
        name: updated.name,
        cosmoStaffId: updated.cosmoStaffId,
        subCabinetIds: updated.staffSubCabinets.map((sc) => sc.subCabinetId),
        order: updated.order,
      }
    : null;
}

export async function deleteStaffAsync(id: string, clinicId: string): Promise<boolean> {
  const prisma = getPrisma();
  const result = await prisma.staff.deleteMany({ where: { id, clinicId } });
  return result.count > 0;
}
