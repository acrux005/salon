import { redirect, notFound } from "next/navigation";
import { getWetRedirectPath } from "@/lib/wetRedirect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";
import { WetPetCardView } from "@/components/wet/WetPetCardView";
import { speciesLabel } from "@/lib/vet/species";
import { buildPreventionChecklist } from "@/lib/vet/preventionEngine";
import { buildPetTimeline } from "@/lib/vet/petTimeline";
import { parsePetDocumentMeta } from "@/lib/vet/petDocumentTypes";

type PageProps = { params: Promise<{ id: string }> };

export default async function WetPetDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login"));
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) redirect(await getWetRedirectPath("/login"));

  const { id } = await params;
  const prisma = getPrisma();

  const [pet, herds, vaccineTypes, reminders, documents] = await Promise.all([
    prisma.pet.findFirst({
      where: { id, owner: { vetClinicId } },
      include: {
        owner: true,
        herd: true,
        preventionRecords: { orderBy: { doneAt: "asc" } },
        vaccinations: {
          include: { vaccineType: true },
          orderBy: { administeredAt: "desc" },
        },
        appointments: {
          orderBy: [{ date: "desc" }, { time: "desc" }],
          take: 20,
          include: { vetDoctor: { select: { name: true } } },
        },
      },
    }),
    prisma.vetHerd.findMany({
      where: { vetClinicId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.vaccineType.findMany({
      where: { vetClinicId, active: true, category: "szczepienie" },
      orderBy: { order: "asc" },
    }),
    prisma.vetScheduledReminder.findMany({
      where: { petId: id, vetClinicId, sentAt: { not: null } },
      orderBy: { sentAt: "desc" },
      take: 30,
    }),
    prisma.vetPetDocument.findMany({
      where: { petId: id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  if (!pet) notFound();

  const preventionChecklist = buildPreventionChecklist({
    species: pet.species,
    birthDate: pet.birthDate,
    catLifestyle: pet.catLifestyle,
    planDisabled: pet.preventionPlanDisabled,
    vaccinations: pet.vaccinations.map((v) => ({
      vaccineName: v.vaccineType.name,
      administeredAt: v.administeredAt.toISOString(),
    })),
    records: pet.preventionRecords.map((r) => ({
      itemKey: r.itemKey,
      doneAt: r.doneAt.toISOString(),
    })),
  });

  const preventionTitleByKey = new Map(preventionChecklist.items.map((i) => [i.key, i.title]));

  const timelineEvents = buildPetTimeline({
    vaccinations: pet.vaccinations.map((v) => ({
      id: v.id,
      vaccineName: v.vaccineType.name,
      administeredAt: v.administeredAt.toISOString(),
      vetName: v.vetName,
    })),
    appointments: pet.appointments.map((a) => ({
      id: a.id,
      date: a.date,
      time: a.time,
      visitType: a.visitType,
      status: a.status,
      doctorName: a.vetDoctor?.name ?? null,
      notes: a.notes,
    })),
    preventionRecords: pet.preventionRecords.map((r) => ({
      id: r.id,
      itemKey: r.itemKey,
      doneAt: r.doneAt.toISOString(),
      title: preventionTitleByKey.get(r.itemKey) ?? r.itemKey,
    })),
    reminders: reminders
      .filter((r) => r.sentAt)
      .map((r) => ({
        id: r.id,
        sentAt: r.sentAt!.toISOString(),
        channel: r.channel,
        message: r.message,
      })),
  });

  return (
    <>
      <WetPanelPageHeader
        title="Karta zwierzęcia"
        description={`${pet.name} · ${speciesLabel(pet.species)} · ${pet.owner.name}`}
      />
      <WetPetCardView
        pet={{
          id: pet.id,
          name: pet.name,
          species: pet.species,
          photoUrl: pet.photoUrl,
          breed: pet.breed,
          sex: pet.sex,
          coatColor: pet.coatColor,
          birthDate: pet.birthDate,
          chipNumber: pet.chipNumber,
          chipDate: pet.chipDate,
          chipManufacturer: pet.chipManufacturer,
          safeAnimalStatus: pet.safeAnimalStatus,
          safeAnimalSyncedAt: pet.safeAnimalSyncedAt?.toISOString() ?? null,
          status: pet.status,
          notes: pet.notes,
          catLifestyle: pet.catLifestyle,
          owner: {
            id: pet.owner.id,
            name: pet.owner.name,
            phone: pet.owner.phone,
            email: pet.owner.email,
            smsConsent: pet.owner.smsConsent,
            emailConsent: pet.owner.emailConsent,
          },
          herd: pet.herd ? { id: pet.herd.id, name: pet.herd.name } : null,
          vaccinations: pet.vaccinations.map((v) => ({
            id: v.id,
            vaccineName: v.vaccineType.name,
            administeredAt: v.administeredAt.toISOString(),
            nextDueAt: v.nextDueAt.toISOString(),
            batchNumber: v.batchNumber,
            batchExpiryDate: v.batchExpiryDate,
            vetName: v.vetName,
          })),
          appointments: pet.appointments.map((a) => ({
            id: a.id,
            date: a.date,
            time: a.time,
            visitType: a.visitType,
            status: a.status,
            notes: a.notes,
            doctorName: a.vetDoctor?.name ?? null,
          })),
        }}
        preventionChecklist={preventionChecklist}
        preventionPlanDisabled={pet.preventionPlanDisabled}
        herds={herds}
        vaccineTypes={vaccineTypes.map((v) => ({
          id: v.id,
          name: v.name,
          manufacturer: v.manufacturer,
          defaultIntervalDays: v.defaultIntervalDays,
          defaultPrice: v.defaultPrice,
          trackStock: v.trackStock,
          stockDoses: v.stockDoses,
        }))}
        timelineEvents={timelineEvents}
        documents={documents.map((d) => {
          const meta = parsePetDocumentMeta(d.extractedJson);
          return {
            id: d.id,
            fileName: d.fileName,
            documentType: d.documentType,
            fileUrl: meta.fileUrl ?? null,
            mimeType: meta.mimeType ?? null,
            createdAt: d.createdAt.toISOString(),
          };
        })}
      />
    </>
  );
}
