import type { ProblemId } from "@/lib/skinmatch/schema";

export type ClinicTreatmentRequestRow = {
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
};

function parseProblemIds(json: string): ProblemId[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? (arr as ProblemId[]) : [];
  } catch {
    return [];
  }
}

export function parseRequestProblemIds(request: ClinicTreatmentRequestRow): ProblemId[] {
  return parseProblemIds(request.problemIds);
}
