import { redirect, notFound } from "next/navigation";
import { getWetRedirectPath } from "@/lib/wetRedirect";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { WetVaccinationHistoryReport } from "@/components/wet/reports/WetVaccinationHistoryReport";
import type { PetVaccinationHistoryReport } from "@/lib/vet/reports";

type PageProps = { params: Promise<{ petId: string }> };

export default async function WetPetVaccinationHistoryReportPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login"));
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) redirect(await getWetRedirectPath("/login"));

  const { petId } = await params;
  const prisma = getPrisma();

  const [pet, clinic] = await Promise.all([
    prisma.pet.findFirst({
      where: { id: petId, owner: { vetClinicId } },
      include: {
        owner: { select: { name: true, phone: true } },
        vaccinations: {
          include: { vaccineType: true },
          orderBy: { administeredAt: "desc" },
        },
      },
    }),
    prisma.vetClinic.findUnique({ where: { id: vetClinicId }, select: { name: true } }),
  ]);

  if (!pet || !clinic) notFound();

  const data: PetVaccinationHistoryReport = {
    clinicName: clinic.name,
    pet: {
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      birthDate: pet.birthDate,
      chipNumber: pet.chipNumber,
    },
    owner: { name: pet.owner.name, phone: pet.owner.phone },
    vaccinations: pet.vaccinations.map((v) => ({
      vaccineName: v.vaccineType.name,
      administeredAt: v.administeredAt.toISOString(),
      nextDueAt: v.nextDueAt.toISOString(),
      batchNumber: v.batchNumber,
      batchExpiryDate: v.batchExpiryDate,
      vetName: v.vetName,
    })),
    generatedAt: new Date().toISOString(),
  };

  return (
    <main className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0">
      <div className="mx-auto max-w-3xl px-4 print:max-w-none print:px-0">
        <div className="mb-4 print:hidden">
          <Link href="/wet/panel/narzedzia/raporty" className="text-[14px] font-medium text-wet-teal hover:underline">
            ← Raporty
          </Link>
        </div>
        <WetVaccinationHistoryReport data={data} />
      </div>
    </main>
  );
}
