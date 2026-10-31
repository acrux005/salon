export async function isClinicClaimed(clinicId: string): Promise<boolean> {
  try {
    const { getPrisma } = await import("@/lib/db");
    const row = await getPrisma().clinicAccount.findUnique({
      where: { clinicId },
      select: { emailVerifiedAt: true },
    });
    return Boolean(row?.emailVerifiedAt);
  } catch {
    return false;
  }
}

export async function getClaimedClinicIdSet(clinicIds?: string[]): Promise<Set<string>> {
  try {
    const { getPrisma } = await import("@/lib/db");
    const rows = await getPrisma().clinicAccount.findMany({
      where: {
        emailVerifiedAt: { not: null },
        ...(clinicIds?.length ? { clinicId: { in: clinicIds } } : {}),
      },
      select: { clinicId: true },
    });
    return new Set(rows.map((r) => r.clinicId));
  } catch {
    return new Set();
  }
}
