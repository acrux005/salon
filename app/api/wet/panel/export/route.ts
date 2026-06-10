import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import {
  buildAppointmentsCsv,
  buildOwnersCsv,
  buildPetsCsv,
  buildVaccinationsCsv,
  buildClinicExportBundle,
} from "@/lib/vet/clinicExport";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const type = request.nextUrl.searchParams.get("type") ?? "owners";
  const prisma = getPrisma();

  const [owners, pets, vaccinations, appointments] = await Promise.all([
    prisma.petOwner.findMany({ where: { vetClinicId }, orderBy: { name: "asc" } }),
    prisma.pet.findMany({
      where: { owner: { vetClinicId } },
      include: { owner: true, herd: { select: { name: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.vaccination.findMany({
      where: { pet: { owner: { vetClinicId } } },
      include: {
        pet: { include: { owner: { select: { name: true } } } },
        vaccineType: { select: { name: true } },
      },
      orderBy: { administeredAt: "desc" },
    }),
    prisma.vetAppointment.findMany({
      where: { vetClinicId },
      include: { vetDoctor: { select: { name: true } }, pet: { select: { name: true } } },
      orderBy: [{ date: "desc" }, { time: "desc" }],
    }),
  ]);

  const exportOwners = owners.map((o) => ({
    name: o.name,
    phone: o.phone,
    email: o.email,
    smsConsent: o.smsConsent,
    emailConsent: o.emailConsent,
    notes: o.notes,
    createdAt: o.createdAt,
  }));

  const exportPets = pets.map((p) => ({
    name: p.name,
    species: p.species,
    breed: p.breed,
    birthDate: p.birthDate,
    chipNumber: p.chipNumber,
    status: p.status,
    notes: p.notes,
    ownerName: p.owner.name,
    ownerPhone: p.owner.phone,
    herdName: p.herd?.name ?? null,
  }));

  const exportVaccinations = vaccinations.map((v) => ({
    petName: v.pet.name,
    ownerName: v.pet.owner.name,
    vaccineName: v.vaccineType.name,
    administeredAt: v.administeredAt,
    nextDueAt: v.nextDueAt,
    batchNumber: v.batchNumber,
    batchExpiryDate: v.batchExpiryDate,
    vetName: v.vetName,
  }));

  const exportAppointments = appointments.map((a) => ({
    date: a.date,
    time: a.time,
    status: a.status,
    visitType: a.visitType,
    petName: a.pet?.name ?? a.petName,
    ownerName: a.ownerName,
    ownerPhone: a.ownerPhone,
    notes: a.notes,
  }));

  const date = new Date().toISOString().slice(0, 10);

  if (type === "all") {
    const bundle = buildClinicExportBundle({
      owners: exportOwners,
      pets: exportPets,
      vaccinations: exportVaccinations,
      appointments: exportAppointments,
    });
    return NextResponse.json({
      exportedAt: bundle.exportedAt,
      files: {
        owners: bundle.owners,
        pets: bundle.pets,
        vaccinations: bundle.vaccinations,
        appointments: bundle.appointments,
      },
    });
  }

  let csv: string;
  let filename: string;

  switch (type) {
    case "pets":
      csv = buildPetsCsv(exportPets);
      filename = `vetharmonogram-zwierzeta-${date}.csv`;
      break;
    case "vaccinations":
      csv = buildVaccinationsCsv(exportVaccinations);
      filename = `vetharmonogram-szczepienia-${date}.csv`;
      break;
    case "appointments":
      csv = buildAppointmentsCsv(exportAppointments);
      filename = `vetharmonogram-wizyty-${date}.csv`;
      break;
    default:
      csv = buildOwnersCsv(exportOwners);
      filename = `vetharmonogram-wlasciciele-${date}.csv`;
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
