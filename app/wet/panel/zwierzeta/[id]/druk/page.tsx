import { redirect, notFound } from "next/navigation";
import { getWetRedirectPath } from "@/lib/wetRedirect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { WetPetPrintView } from "@/components/wet/WetPetPrintView";

type PageProps = { params: Promise<{ id: string }> };

export default async function WetPetPrintPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login"));
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) redirect(await getWetRedirectPath("/login"));

  const { id } = await params;
  const prisma = getPrisma();

  const [pet, clinic] = await Promise.all([
    prisma.pet.findFirst({
      where: { id, owner: { vetClinicId } },
      include: {
        owner: true,
        herd: true,
        vaccinations: {
          include: { vaccineType: true },
          orderBy: { administeredAt: "desc" },
        },
      },
    }),
    prisma.vetClinic.findUnique({ where: { id: vetClinicId }, select: { name: true } }),
  ]);

  if (!pet) notFound();

  return (
    <WetPetPrintView
      data={{
        clinicName: clinic?.name ?? "Przychodnia weterynaryjna",
        pet: {
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          birthDate: pet.birthDate,
          chipNumber: pet.chipNumber,
          status: pet.status,
          notes: pet.notes,
          owner: {
            name: pet.owner.name,
            phone: pet.owner.phone,
            email: pet.owner.email,
          },
          herd: pet.herd ? { name: pet.herd.name } : null,
          vaccinations: pet.vaccinations.map((v) => ({
            vaccineName: v.vaccineType.name,
            administeredAt: v.administeredAt.toISOString(),
            nextDueAt: v.nextDueAt.toISOString(),
          })),
        },
      }}
    />
  );
}
