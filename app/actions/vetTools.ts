"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { parseOwnerImportCsv, normalizeOwnerPhone } from "@/lib/vet/ownerImport";

export type VetToolsActionResult = { ok: true } | { ok: false; error: string };

export type VetOwnerImportResult =
  | { ok: true; imported: number; skipped: number; errors: string[] }
  | { ok: false; error: string };

async function requireVetClinicId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) return null;
  return (session?.user as { vetClinicId?: string })?.vetClinicId ?? null;
}

export async function importVetOwnersFromCsvAction(formData: FormData): Promise<VetOwnerImportResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const csv = formData.get("csv")?.toString()?.trim();
  if (!csv) return { ok: false, error: "Wklej lub wczytaj plik CSV." };

  const { rows, errors: parseErrors } = parseOwnerImportCsv(csv);
  if (rows.length === 0) {
    return { ok: false, error: parseErrors[0] ?? "Brak poprawnych wierszy." };
  }

  try {
    const prisma = getPrisma();
    const existing = await prisma.petOwner.findMany({ where: { vetClinicId } });
    const byPhone = new Map(existing.map((o) => [normalizeOwnerPhone(o.phone), o]));

    let imported = 0;
    let skipped = 0;
    const errors = [...parseErrors];

    for (const row of rows) {
      if (byPhone.has(row.phone)) {
        skipped++;
        errors.push(`Wiersz ${row.line} (${row.name}): telefon ${row.phone} już w bazie — pominięto.`);
        continue;
      }

      const owner = await prisma.petOwner.create({
        data: {
          vetClinicId,
          name: row.name,
          phone: row.phone,
          email: row.email,
          smsConsent: row.smsConsent,
          emailConsent: row.emailConsent,
          notes: row.notes,
        },
      });
      byPhone.set(row.phone, owner);
      imported++;
    }

    if (imported === 0) {
      return { ok: false, error: errors[0] ?? "Nie zaimportowano żadnego właściciela." };
    }

    return { ok: true, imported, skipped, errors };
  } catch {
    return { ok: false, error: "Nie udało się wykonać importu." };
  }
}
