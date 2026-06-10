import { getPrisma } from "@/lib/db";
import { vaccinationStateKind, type PanelStateKind } from "@/lib/vet/panelStates";

export type DashboardRecentPet = {
  id: string;
  name: string;
  species: string;
  status: string;
  ownerName: string;
  smsConsent: boolean;
  createdAt: string;
};

export type DashboardVaccinationItem = {
  id: string;
  petId: string;
  petName: string;
  species: string;
  vaccineName: string;
  nextDueAt: string;
  state: PanelStateKind;
};

export type DashboardMessageItem = {
  threadId: string;
  ownerName: string;
  preview: string;
  unreadCount: number;
  lastMessageAt: string;
};

export type DashboardHerdItem = {
  id: string;
  name: string;
  species: string;
  location: string | null;
  reason: "overdue_vaccinations" | "incomplete_registry";
  detail: string;
  overdueCount?: number;
};

export type DashboardWidgets = {
  recentPets: DashboardRecentPet[];
  vaccinationsToday: DashboardVaccinationItem[];
  overdueVaccinationsList: DashboardVaccinationItem[];
  newMessages: DashboardMessageItem[];
  unreadMessagesTotal: number;
  herdsNeedingVisit: DashboardHerdItem[];
};

function dayBounds(dateStr: string) {
  return {
    start: new Date(`${dateStr}T00:00:00`),
    end: new Date(`${dateStr}T23:59:59.999`),
  };
}

export async function getDashboardWidgets(vetClinicId: string): Promise<DashboardWidgets> {
  const prisma = getPrisma();
  const today = new Date().toISOString().slice(0, 10);
  const { start: dayStart, end: dayEnd } = dayBounds(today);
  const now = new Date();

  const [
    recentPetsRaw,
    vaccinationsDueRaw,
    overdueVaccinationsRaw,
    threadsRaw,
    herdsRaw,
    unreadAgg,
  ] = await Promise.all([
    prisma.pet.findMany({
      where: { owner: { vetClinicId }, status: "active" },
      include: { owner: { select: { name: true, smsConsent: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.vaccination.findMany({
      where: {
        nextDueAt: { gte: dayStart, lte: dayEnd },
        pet: { owner: { vetClinicId }, status: "active" },
      },
      include: {
        pet: { select: { id: true, name: true, species: true } },
        vaccineType: { select: { name: true } },
      },
      orderBy: { nextDueAt: "asc" },
      take: 8,
    }),
    prisma.vaccination.findMany({
      where: {
        nextDueAt: { lt: dayStart },
        pet: { owner: { vetClinicId }, status: "active" },
      },
      include: {
        pet: { select: { id: true, name: true, species: true } },
        vaccineType: { select: { name: true } },
      },
      orderBy: { nextDueAt: "asc" },
      take: 5,
    }),
    prisma.messageThread.findMany({
      where: {
        OR: [
          { typeA: "vet_clinic", idA: vetClinicId },
          { typeB: "vet_clinic", idB: vetClinicId },
        ],
      },
      orderBy: { lastMessageAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { body: true, senderType: true, readAt: true },
        },
      },
      take: 20,
    }),
    prisma.vetHerd.findMany({
      where: { vetClinicId },
      include: {
        pets: {
          where: { status: "active" },
          include: {
            vaccinations: {
              where: { nextDueAt: { lt: now } },
              select: { id: true },
            },
          },
        },
        _count: { select: { pets: true } },
      },
    }),
    prisma.privateMessage.count({
      where: {
        readAt: null,
        NOT: [{ senderType: "vet_clinic", senderId: vetClinicId }],
        thread: {
          OR: [
            { typeA: "vet_clinic", idA: vetClinicId },
            { typeB: "vet_clinic", idB: vetClinicId },
          ],
        },
      },
    }),
  ]);

  const mapVaccination = (v: (typeof vaccinationsDueRaw)[0]): DashboardVaccinationItem => ({
    id: v.id,
    petId: v.pet.id,
    petName: v.pet.name,
    species: v.pet.species,
    vaccineName: v.vaccineType.name,
    nextDueAt: v.nextDueAt.toISOString(),
    state: vaccinationStateKind(v.nextDueAt, now),
  });

  const petOwnerIds = new Set<string>();
  for (const t of threadsRaw) {
    const otherType = t.typeA === "vet_clinic" ? t.typeB : t.typeA;
    const otherId = t.typeA === "vet_clinic" ? t.idB : t.idA;
    if (otherType === "pet_owner") petOwnerIds.add(otherId);
  }
  const owners = petOwnerIds.size
    ? await prisma.petOwner.findMany({
        where: { id: { in: Array.from(petOwnerIds) } },
        select: { id: true, name: true },
      })
    : [];
  const ownerNames = new Map(owners.map((o) => [o.id, o.name]));

  const threadUnread = await prisma.privateMessage.groupBy({
    by: ["threadId"],
    where: {
      threadId: { in: threadsRaw.map((t) => t.id) },
      readAt: null,
      NOT: [{ senderType: "vet_clinic", senderId: vetClinicId }],
    },
    _count: { id: true },
  });
  const unreadByThread = new Map(threadUnread.map((u) => [u.threadId, u._count.id]));

  const newMessages: DashboardMessageItem[] = threadsRaw
    .map((t) => {
      const otherType = t.typeA === "vet_clinic" ? t.typeB : t.typeA;
      const otherId = t.typeA === "vet_clinic" ? t.idB : t.idA;
      const unreadCount = unreadByThread.get(t.id) ?? 0;
      const lastMsg = t.messages[0];
      return {
        threadId: t.id,
        ownerName:
          otherType === "pet_owner" ? (ownerNames.get(otherId) ?? "Klient") : "Rozmowa",
        preview: lastMsg?.body?.slice(0, 80) ?? "—",
        unreadCount,
        lastMessageAt: t.lastMessageAt.toISOString(),
      };
    })
    .filter((m) => m.unreadCount > 0)
    .slice(0, 5);

  const herdsNeedingVisit: DashboardHerdItem[] = [];
  for (const h of herdsRaw) {
    const overdueCount = h.pets.reduce((sum, p) => sum + p.vaccinations.length, 0);
    if (overdueCount > 0) {
      herdsNeedingVisit.push({
        id: h.id,
        name: h.name,
        species: h.species,
        location: h.location,
        reason: "overdue_vaccinations",
        detail: `${overdueCount} zaległych szczepień w stadzie`,
        overdueCount,
      });
      continue;
    }
    if (h.headCount && h._count.pets < h.headCount) {
      herdsNeedingVisit.push({
        id: h.id,
        name: h.name,
        species: h.species,
        location: h.location,
        reason: "incomplete_registry",
        detail: `${h._count.pets}/${h.headCount} zwierząt w kartotece`,
      });
    }
  }

  return {
    recentPets: recentPetsRaw.map((p) => ({
      id: p.id,
      name: p.name,
      species: p.species,
      status: p.status,
      ownerName: p.owner.name,
      smsConsent: p.owner.smsConsent,
      createdAt: p.createdAt.toISOString(),
    })),
    vaccinationsToday: vaccinationsDueRaw.map(mapVaccination),
    overdueVaccinationsList: overdueVaccinationsRaw.map((v) => ({
      ...mapVaccination(v),
      state: "overdue" as PanelStateKind,
    })),
    newMessages,
    unreadMessagesTotal: unreadAgg,
    herdsNeedingVisit: herdsNeedingVisit.slice(0, 5),
  };
}
