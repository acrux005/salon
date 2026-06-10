"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ADMIN_ROLE } from "@/lib/auth";
import { tryConsumeAdmin } from "@/lib/rateLimit";
import {
  createTreatmentAsync,
  updateTreatmentAsync,
  deleteTreatmentAsync,
} from "@/lib/skinmatch/treatmentsDb";
import type { ProblemId } from "@/lib/skinmatch/schema";
import { z } from "zod";

const PROBLEM_IDS: ProblemId[] = [
  "tradzik",
  "przebarwienia",
  "anti_aging",
  "naczynka",
  "sucha_skora",
  "zmarszczki",
  "jedrnost",
  "owal",
  "brwi_rzesy",
  "makijaz",
  "wlosy",
  "stopy",
  "masaze",
  "terapia_manualna",
  "dzwiekoterapia",
];

const slugSchema = z
  .string()
  .min(1, "ID jest wymagane")
  .max(80)
  .regex(/^[a-z0-9_]+$/, "ID: tylko małe litery, cyfry i podkreślenia (snake_case)");

const treatmentSchema = z.object({
  id: slugSchema,
  nazwa: z.string().min(1, "Nazwa jest wymagana").max(200),
  opis: z.string().min(1, "Opis jest wymagany").max(1000),
  problemIds: z
    .array(z.enum(PROBLEM_IDS as unknown as [string, ...string[]]))
    .max(4, "Maksymalnie 4 problemy"),
  czas: z.number().int().min(0, "Czas ≥ 0"),
  cena_od: z.number().int().min(0, "Cena od ≥ 0"),
});

export type CreateTreatmentResult = { ok: true } | { ok: false; error: string };
export type UpdateTreatmentResult = { ok: true } | { ok: false; error: string };
export type DeleteTreatmentResult =
  | { ok: true }
  | { ok: false; error: string; inUse?: number };

export async function createTreatmentAction(
  formData: FormData
): Promise<CreateTreatmentResult> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== ADMIN_ROLE)
    return { ok: false, error: "Brak uprawnień." };
  if (!tryConsumeAdmin("admin:treatments:create"))
    return { ok: false, error: "Zbyt wiele prób. Odczekaj chwilę." };

  const idRaw = formData.get("id")?.toString()?.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") ?? "";
  const nazwa = formData.get("nazwa")?.toString()?.trim() ?? "";
  const opis = formData.get("opis")?.toString()?.trim() ?? "";
  const czas = Number(formData.get("czas"));
  const cena_od = Number(formData.get("cena_od"));
  const problemIdsRaw = formData.get("problemIds")?.toString();
  const problemy: ProblemId[] = problemIdsRaw
    ? (JSON.parse(problemIdsRaw) as string[]).filter((p): p is ProblemId =>
        PROBLEM_IDS.includes(p as ProblemId)
      )
    : [];

  const parsed = treatmentSchema.safeParse({
    id: idRaw,
    nazwa,
    opis,
    problemIds: problemy,
    czas,
    cena_od,
  });
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors.id?.[0] ?? parsed.error.flatten().fieldErrors.nazwa?.[0] ?? parsed.error.message;
    return { ok: false, error: String(msg) };
  }

  const created = await createTreatmentAsync({
    id: parsed.data.id,
    nazwa: parsed.data.nazwa,
    opis: parsed.data.opis,
    problemy: parsed.data.problemIds as ProblemId[],
    czas: parsed.data.czas,
    cena_od: parsed.data.cena_od,
  });
  if (!created)
    return { ok: false, error: "Nie udało się dodać zabiegu (np. duplikat ID)." };
  return { ok: true };
}

export async function updateTreatmentAction(
  id: string,
  formData: FormData
): Promise<UpdateTreatmentResult> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== ADMIN_ROLE)
    return { ok: false, error: "Brak uprawnień." };
  if (!tryConsumeAdmin("admin:treatments:update"))
    return { ok: false, error: "Zbyt wiele prób. Odczekaj chwilę." };

  const nazwa = formData.get("nazwa")?.toString()?.trim() ?? "";
  const opis = formData.get("opis")?.toString()?.trim() ?? "";
  const czas = Number(formData.get("czas"));
  const cena_od = Number(formData.get("cena_od"));
  const problemIdsRaw = formData.get("problemIds")?.toString();
  const problemy: ProblemId[] = problemIdsRaw
    ? (JSON.parse(problemIdsRaw) as string[]).filter((p): p is ProblemId =>
        PROBLEM_IDS.includes(p as ProblemId)
      )
    : [];

  const updateSchema = z.object({
    nazwa: z.string().min(1).max(200),
    opis: z.string().min(1).max(1000),
    problemIds: z.array(z.enum(PROBLEM_IDS as unknown as [string, ...string[]])).max(4),
    czas: z.number().int().min(0),
    cena_od: z.number().int().min(0),
  });
  const parsed = updateSchema.safeParse({
    nazwa,
    opis,
    problemIds: problemy,
    czas,
    cena_od,
  });
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? "Walidacja nie przeszła.";
    return { ok: false, error: String(msg) };
  }

  const updated = await updateTreatmentAsync(id, {
    nazwa: parsed.data.nazwa,
    opis: parsed.data.opis,
    problemy: parsed.data.problemIds as ProblemId[],
    czas: parsed.data.czas,
    cena_od: parsed.data.cena_od,
  });
  if (!updated) return { ok: false, error: "Nie udało się zapisać." };
  return { ok: true };
}

export async function deleteTreatmentAction(
  id: string
): Promise<DeleteTreatmentResult> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== ADMIN_ROLE)
    return { ok: false, error: "Brak uprawnień." };
  if (!tryConsumeAdmin("admin:treatments:delete"))
    return { ok: false, error: "Zbyt wiele prób. Odczekaj chwilę." };

  const result = await deleteTreatmentAsync(id);
  if (result.ok) return { ok: true };
  if (result.inUse !== undefined)
    return { ok: false, error: `Zabieg używany przez ${result.inUse} gabinet(ów). Usuń go najpierw z oferty gabinetów.`, inUse: result.inUse };
  return { ok: false, error: "Nie udało się usunąć zabiegu." };
}
