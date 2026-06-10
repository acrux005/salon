import { getPrisma } from "@/lib/db";

export async function ensurePetOwnerProfileAtClinic(params: {
  accountId: string;
  vetClinicId: string;
  name: string;
  phone: string;
  email?: string | null;
}) {
  const prisma = getPrisma();
  const existing = await prisma.petOwner.findFirst({
    where: { accountId: params.accountId, vetClinicId: params.vetClinicId },
  });
  if (existing) return existing;

  return prisma.petOwner.create({
    data: {
      accountId: params.accountId,
      vetClinicId: params.vetClinicId,
      name: params.name,
      phone: params.phone,
      email: params.email ?? null,
    },
  });
}

export async function getOwnerClinicProfile(accountId: string, vetClinicId: string) {
  const prisma = getPrisma();
  return prisma.petOwner.findFirst({
    where: { accountId, vetClinicId },
  });
}

export async function getAccountPets(accountId: string) {
  const prisma = getPrisma();
  return prisma.pet.findMany({
    where: { accountId },
    include: {
      vaccinations: { include: { vaccineType: true }, orderBy: { administeredAt: "desc" } },
      owner: { include: { vetClinic: { select: { id: true, name: true, slug: true } } } },
    },
    orderBy: { name: "asc" },
  });
}
