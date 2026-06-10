import { redirect, notFound } from "next/navigation";
import { getWetRedirectPath } from "@/lib/wetRedirect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { buildAddressLine } from "@/lib/vet/onboarding";
import { WetVaccinationCertificate } from "@/components/wet/WetVaccinationCertificate";

type PageProps = { params: Promise<{ id: string; vaccinationId: string }> };

export default async function WetVaccinationCertificatePage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login"));
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) redirect(await getWetRedirectPath("/login"));

  const { id: petId, vaccinationId } = await params;
  const prisma = getPrisma();

  const [vaccination, clinic] = await Promise.all([
    prisma.vaccination.findFirst({
      where: { id: vaccinationId, petId, pet: { owner: { vetClinicId } } },
      include: {
        vaccineType: true,
        pet: { include: { owner: true } },
      },
    }),
    prisma.vetClinic.findUnique({
      where: { id: vetClinicId },
      select: {
        name: true,
        address: true,
        phone: true,
        email: true,
        street: true,
        houseNumber: true,
        apartmentNumber: true,
        postalCode: true,
        city: true,
      },
    }),
  ]);

  if (!vaccination || !clinic) notFound();

  const address =
    buildAddressLine(clinic) ||
    clinic.address ||
    null;

  return (
    <WetVaccinationCertificate
      data={{
        clinic: {
          name: clinic.name,
          address,
          phone: clinic.phone,
          email: clinic.email,
        },
        pet: {
          name: vaccination.pet.name,
          species: vaccination.pet.species,
          breed: vaccination.pet.breed,
          birthDate: vaccination.pet.birthDate,
          chipNumber: vaccination.pet.chipNumber,
        },
        owner: {
          name: vaccination.pet.owner.name,
          phone: vaccination.pet.owner.phone,
        },
        vaccination: {
          vaccineName: vaccination.vaccineType.name,
          administeredAt: vaccination.administeredAt.toISOString(),
          nextDueAt: vaccination.nextDueAt.toISOString(),
          batchNumber: vaccination.batchNumber,
          batchExpiryDate: vaccination.batchExpiryDate,
          vetName: vaccination.vetName,
          notes: vaccination.notes,
        },
      }}
    />
  );
}
