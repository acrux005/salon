import type { ClinicTreatmentRequestRow } from "./clinicTreatmentRequestTypes";

export type { ClinicTreatmentRequestRow } from "./clinicTreatmentRequestTypes";

export function requestToRow(r: {
  id: string;
  clinicId: string;
  nazwa: string;
  opis: string;
  problemIds: string;
  czas: number;
  cena_od: number;
  status: string;
  createdAt: Date;
  reviewedAt: Date | null;
  createdTreatmentId: string | null;
  clinic?: { name: string; slug: string };
}): ClinicTreatmentRequestRow {
  return {
    id: r.id,
    clinicId: r.clinicId,
    nazwa: r.nazwa,
    opis: r.opis,
    problemIds: r.problemIds,
    czas: r.czas,
    cena_od: r.cena_od,
    status: r.status,
    createdAt: r.createdAt,
    reviewedAt: r.reviewedAt,
    createdTreatmentId: r.createdTreatmentId,
    clinic: r.clinic,
  };
}

/** Stub: zamow.odart.pl nie ma propozycji zabiegów. */
export async function getClinicTreatmentRequestsAsync(_clinicId: string): Promise<ClinicTreatmentRequestRow[]> {
  return [];
}

/** Stub: zamow.odart.pl nie ma propozycji zabiegów. */
export async function getPendingClinicTreatmentRequestsAsync(): Promise<ClinicTreatmentRequestRow[]> {
  return [];
}
