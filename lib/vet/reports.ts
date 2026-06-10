export type HerdVaccinationReportRow = {
  petId: string;
  petName: string;
  chipNumber: string | null;
  vaccineName: string;
  administeredAt: string;
  nextDueAt: string;
  batchNumber: string | null;
  vetName: string | null;
  status: "ok" | "due_soon" | "overdue" | "never";
};

export type HerdVaccinationReport = {
  herdId: string;
  herdName: string;
  species: string;
  ownerName: string | null;
  generatedAt: string;
  totalPets: number;
  vaccinatedCount: number;
  overdueCount: number;
  dueSoonCount: number;
  neverVaccinated: string[];
  rows: HerdVaccinationReportRow[];
};

const MS_DAY = 86400000;
const DUE_SOON_DAYS = 30;

export function buildHerdVaccinationReport(input: {
  herd: { id: string; name: string; species: string; owner: { name: string } | null };
  pets: {
    id: string;
    name: string;
    chipNumber: string | null;
    vaccinations: {
      vaccineName: string;
      administeredAt: string;
      nextDueAt: string;
      batchNumber: string | null;
      vetName: string | null;
    }[];
  }[];
}): HerdVaccinationReport {
  const now = Date.now();
  const rows: HerdVaccinationReportRow[] = [];
  const neverVaccinated: string[] = [];
  let overdueCount = 0;
  let dueSoonCount = 0;
  const vaccinatedPetIds = new Set<string>();

  for (const pet of input.pets) {
    if (pet.vaccinations.length === 0) {
      neverVaccinated.push(pet.name);
      continue;
    }

    vaccinatedPetIds.add(pet.id);

    for (const v of pet.vaccinations) {
      const dueMs = new Date(v.nextDueAt).getTime();
      let status: HerdVaccinationReportRow["status"] = "ok";
      if (dueMs < now - MS_DAY) {
        status = "overdue";
        overdueCount++;
      } else if (dueMs <= now + DUE_SOON_DAYS * MS_DAY) {
        status = "due_soon";
        dueSoonCount++;
      }

      rows.push({
        petId: pet.id,
        petName: pet.name,
        chipNumber: pet.chipNumber,
        vaccineName: v.vaccineName,
        administeredAt: v.administeredAt,
        nextDueAt: v.nextDueAt,
        batchNumber: v.batchNumber,
        vetName: v.vetName,
        status,
      });
    }
  }

  rows.sort(
    (a, b) =>
      (a.status === "overdue" ? 0 : a.status === "due_soon" ? 1 : 2) -
        (b.status === "overdue" ? 0 : b.status === "due_soon" ? 1 : 2) ||
      new Date(a.nextDueAt).getTime() - new Date(b.nextDueAt).getTime()
  );

  return {
    herdId: input.herd.id,
    herdName: input.herd.name,
    species: input.herd.species,
    ownerName: input.herd.owner?.name ?? null,
    generatedAt: new Date().toISOString(),
    totalPets: input.pets.length,
    vaccinatedCount: vaccinatedPetIds.size,
    overdueCount,
    dueSoonCount,
    neverVaccinated,
    rows,
  };
}

export type PetVaccinationHistoryReport = {
  clinicName: string;
  pet: {
    id: string;
    name: string;
    species: string;
    breed: string | null;
    birthDate: string | null;
    chipNumber: string | null;
  };
  owner: { name: string; phone: string };
  vaccinations: {
    vaccineName: string;
    administeredAt: string;
    nextDueAt: string;
    batchNumber: string | null;
    batchExpiryDate: string | null;
    vetName: string | null;
  }[];
  generatedAt: string;
};

export type VisitHistoryReportRow = {
  id: string;
  date: string;
  time: string;
  status: string;
  visitType: string | null;
  petName: string | null;
  ownerName: string | null;
  ownerPhone: string | null;
  doctorName: string | null;
  notes: string | null;
};
