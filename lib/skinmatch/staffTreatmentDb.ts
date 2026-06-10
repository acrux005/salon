import { getPrisma } from "@/lib/db";

export async function getStaffTreatmentIdsAsync(staffId: string): Promise<string[]> {
  const prisma = getPrisma();
  const rows = await prisma.staffTreatment.findMany({
    where: { staffId },
    select: { treatmentId: true },
  });
  return rows.map((r) => r.treatmentId);
}

export async function setStaffTreatmentsAsync(
  staffId: string,
  clinicId: string,
  treatmentIds: string[]
): Promise<boolean> {
  const prisma = getPrisma();
  const staff = await prisma.staff.findFirst({
    where: { id: staffId, clinicId },
    select: { id: true },
  });
  if (!staff) return false;
  await prisma.staffTreatment.deleteMany({ where: { staffId } });
  const uniqueIds = Array.from(new Set(treatmentIds));
  if (uniqueIds.length > 0) {
    await prisma.staffTreatment.createMany({
      data: uniqueIds.map((treatmentId) => ({ staffId, treatmentId })),
    });
  }
  return true;
}
