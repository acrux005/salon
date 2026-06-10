import { getPrisma } from "@/lib/db";

export type ClinicLightStats = {
  petsActive: number;
  petsArchived: number;
  owners: number;
  vaccinationsTotal: number;
  vaccinationsLast30Days: number;
  appointmentsTotal: number;
  appointmentsLast30Days: number;
  appointmentsDone: number;
  smsSent: number;
  smsScheduled: number;
  emailSent: number;
  topVisitTypes: { type: string; count: number }[];
  topVaccines: { name: string; count: number }[];
};

export async function getClinicLightStats(vetClinicId: string): Promise<ClinicLightStats> {
  const prisma = getPrisma();
  const since30 = new Date();
  since30.setDate(since30.getDate() - 30);

  const [
    petsActive,
    petsArchived,
    owners,
    vaccinationsTotal,
    vaccinationsLast30Days,
    appointmentsTotal,
    appointmentsLast30Days,
    appointmentsDone,
    smsSent,
    smsScheduled,
    emailSent,
    visitTypeGroups,
    vaccineGroups,
  ] = await Promise.all([
    prisma.pet.count({ where: { owner: { vetClinicId }, status: "active" } }),
    prisma.pet.count({ where: { owner: { vetClinicId }, status: { not: "active" } } }),
    prisma.petOwner.count({ where: { vetClinicId } }),
    prisma.vaccination.count({ where: { pet: { owner: { vetClinicId } } } }),
    prisma.vaccination.count({
      where: { pet: { owner: { vetClinicId } }, administeredAt: { gte: since30 } },
    }),
    prisma.vetAppointment.count({ where: { vetClinicId } }),
    prisma.vetAppointment.count({ where: { vetClinicId, createdAt: { gte: since30 } } }),
    prisma.vetAppointment.count({ where: { vetClinicId, status: "done" } }),
    prisma.vetScheduledReminder.count({
      where: { vetClinicId, channel: "sms", sentAt: { not: null } },
    }),
    prisma.vetScheduledReminder.count({
      where: { vetClinicId, channel: "sms", sentAt: null, sendAt: { gte: new Date() } },
    }),
    prisma.vetScheduledReminder.count({
      where: { vetClinicId, channel: "email", sentAt: { not: null } },
    }),
    prisma.vetAppointment.groupBy({
      by: ["visitType"],
      where: { vetClinicId, visitType: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
    prisma.vaccination.groupBy({
      by: ["vaccineTypeId"],
      where: { pet: { owner: { vetClinicId } }, administeredAt: { gte: since30 } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
  ]);

  const vaccineTypeIds = vaccineGroups.map((g) => g.vaccineTypeId);
  const vaccineTypes =
    vaccineTypeIds.length > 0
      ? await prisma.vaccineType.findMany({
          where: { id: { in: vaccineTypeIds } },
          select: { id: true, name: true },
        })
      : [];
  const vaccineNameById = new Map(vaccineTypes.map((v) => [v.id, v.name]));

  return {
    petsActive,
    petsArchived,
    owners,
    vaccinationsTotal,
    vaccinationsLast30Days,
    appointmentsTotal,
    appointmentsLast30Days,
    appointmentsDone,
    smsSent,
    smsScheduled,
    emailSent,
    topVisitTypes: visitTypeGroups.map((g) => ({
      type: g.visitType ?? "wizyta",
      count: g._count.id,
    })),
    topVaccines: vaccineGroups.map((g) => ({
      name: vaccineNameById.get(g.vaccineTypeId) ?? "—",
      count: g._count.id,
    })),
  };
}
