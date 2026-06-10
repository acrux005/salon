import { redirect, notFound } from "next/navigation";
import { getWetRedirectPath } from "@/lib/wetRedirect";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { buildHerdVaccinationReport } from "@/lib/vet/reports";
import { WetHerdVaccinationReportView } from "@/components/wet/reports/WetHerdVaccinationReportView";

type PageProps = { params: Promise<{ herdId: string }> };

export default async function WetHerdVaccinationReportPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login"));
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) redirect(await getWetRedirectPath("/login"));

  const { herdId } = await params;
  const prisma = getPrisma();

  const [herd, clinic] = await Promise.all([
    prisma.vetHerd.findFirst({
      where: { id: herdId, vetClinicId },
      include: {
        owner: { select: { name: true } },
        pets: {
          where: { status: "active" },
          include: {
            vaccinations: {
              include: { vaccineType: { select: { name: true } } },
              orderBy: { administeredAt: "desc" },
            },
          },
          orderBy: { name: "asc" },
        },
      },
    }),
    prisma.vetClinic.findUnique({ where: { id: vetClinicId }, select: { name: true } }),
  ]);

  if (!herd || !clinic) notFound();

  const data = buildHerdVaccinationReport({
    herd: {
      id: herd.id,
      name: herd.name,
      species: herd.species,
      owner: herd.owner,
    },
    pets: herd.pets.map((pet) => ({
      id: pet.id,
      name: pet.name,
      chipNumber: pet.chipNumber,
      vaccinations: pet.vaccinations.map((v) => ({
        vaccineName: v.vaccineType.name,
        administeredAt: v.administeredAt.toISOString(),
        nextDueAt: v.nextDueAt.toISOString(),
        batchNumber: v.batchNumber,
        vetName: v.vetName,
      })),
    })),
  });

  return (
    <main className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0">
      <div className="mx-auto max-w-3xl px-4 print:max-w-none print:px-0">
        <div className="mb-4 print:hidden">
          <Link href="/wet/panel/narzedzia/raporty" className="text-[14px] font-medium text-wet-teal hover:underline">
            ← Raporty
          </Link>
        </div>
        <WetHerdVaccinationReportView data={data} clinicName={clinic.name} />
      </div>
    </main>
  );
}
