"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GAB_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { parseClientImportCsv } from "@/lib/gabinet/clientImport";
import { parsePatientImportCsv } from "@/lib/gabinet/patientImport";

export type GabToolsResult =
  | { ok: true; imported: number; skipped: number; errors: string[] }
  | { ok: false; error: string };

async function requireGabClinicId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== GAB_CLINIC_ROLE) return null;
  return (session?.user as { gabClinicId?: string })?.gabClinicId ?? null;
}

export async function importGabPatientsFromCsvAction(formData: FormData): Promise<GabToolsResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const csv = formData.get("csv")?.toString() ?? "";
  const { rows, errors } = parsePatientImportCsv(csv);
  if (rows.length === 0) return { ok: false, error: errors[0] ?? "Brak wierszy do importu." };

  const db = getPrisma();
  let imported = 0;
  let skipped = 0;
  const importErrors = [...errors];

  for (const row of rows) {
    const existing = await db.gabPatient.findFirst({
      where: { gabClinicId, phone: row.phone },
    });
    if (existing) {
      try {
        await db.gabPatient.update({
          where: { id: existing.id },
          data: {
            name: row.name,
            email: row.email ?? existing.email,
            pesel: row.pesel ?? existing.pesel,
            birthDate: row.birthDate ?? existing.birthDate,
            smsConsent: row.smsConsent,
            emailConsent: row.emailConsent,
            notes: row.notes ?? existing.notes,
          },
        });
        imported++;
      } catch {
        importErrors.push(`Wiersz ${row.line}: błąd aktualizacji.`);
      }
      continue;
    }
    try {
      await db.gabPatient.create({
        data: {
          gabClinicId,
          name: row.name,
          phone: row.phone,
          email: row.email,
          pesel: row.pesel,
          birthDate: row.birthDate,
          smsConsent: row.smsConsent,
          emailConsent: row.emailConsent,
          notes: row.notes,
          status: "active",
        },
      });
      imported++;
    } catch {
      importErrors.push(`Wiersz ${row.line}: błąd zapisu.`);
    }
  }

  return { ok: true, imported, skipped, errors: importErrors };
}

export async function importGabClientsFromCsvAction(formData: FormData): Promise<GabToolsResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const csv = formData.get("csv")?.toString() ?? "";
  const { rows, errors } = parseClientImportCsv(csv);
  if (rows.length === 0) return { ok: false, error: errors[0] ?? "Brak wierszy do importu." };

  const db = getPrisma();
  let imported = 0;
  let skipped = 0;
  const importErrors = [...errors];

  for (const row of rows) {
    const existing = await db.gabClient.findFirst({
      where: { gabClinicId, phone: row.phone },
    });
    if (existing) {
      skipped++;
      continue;
    }
    try {
      await db.gabClient.create({
        data: {
          gabClinicId,
          name: row.name,
          phone: row.phone,
          email: row.email,
          smsConsent: row.smsConsent,
          emailConsent: row.emailConsent,
          notes: row.notes,
        },
      });
      imported++;
    } catch {
      importErrors.push(`Wiersz ${row.line}: błąd zapisu.`);
    }
  }

  return { ok: true, imported, skipped, errors: importErrors };
}

export async function importGabAppointmentsFromCsvAction(formData: FormData): Promise<GabToolsResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const csv = formData.get("csv")?.toString() ?? "";
  const { parseAppointmentImportCsv } = await import("@/lib/gabinet/appointmentImport");
  const { rows, errors } = parseAppointmentImportCsv(csv);
  if (rows.length === 0) return { ok: false, error: errors[0] ?? "Brak wierszy do importu." };

  const db = getPrisma();
  let imported = 0;
  let skipped = 0;
  const importErrors = [...errors];

  for (const row of rows) {
    const existing = await db.gabAppointment.findFirst({
      where: { gabClinicId, date: row.date, time: row.time, patientPhone: row.phone },
    });
    if (existing) {
      skipped++;
      continue;
    }
    const patient = await db.gabPatient.findFirst({ where: { gabClinicId, phone: row.phone } });
    try {
      await db.gabAppointment.create({
        data: {
          gabClinicId,
          patientId: patient?.id ?? null,
          date: row.date,
          time: row.time,
          patientName: patient?.name ?? row.name,
          patientPhone: row.phone,
          visitType: row.visitType,
          notes: row.notes,
          status: "planned",
        },
      });
      imported++;
    } catch {
      importErrors.push(`Wiersz ${row.line}: błąd zapisu.`);
    }
  }
  return { ok: true, imported, skipped, errors: importErrors };
}

export async function importGabCatalogFromCsvAction(formData: FormData): Promise<GabToolsResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const csv = formData.get("csv")?.toString() ?? "";
  const { parseCatalogImportCsv } = await import("@/lib/gabinet/catalogImport");
  const { rows, errors } = parseCatalogImportCsv(csv);
  if (rows.length === 0) return { ok: false, error: errors[0] ?? "Brak wierszy do importu." };

  const db = getPrisma();
  let imported = 0;
  const skipped = 0;
  const importErrors = [...errors];

  for (const row of rows) {
    const existing = await db.gabTreatmentCatalogItem.findFirst({
      where: { gabClinicId, name: row.name },
    });
    if (existing) {
      try {
        await db.gabTreatmentCatalogItem.update({
          where: { id: existing.id },
          data: {
            category: row.category,
            pricePln: row.pricePln,
            durationMinutes: row.durationMinutes,
            active: row.active,
          },
        });
        imported++;
      } catch {
        importErrors.push(`Wiersz ${row.line}: błąd aktualizacji.`);
      }
      continue;
    }
    try {
      await db.gabTreatmentCatalogItem.create({
        data: {
          gabClinicId,
          name: row.name,
          category: row.category,
          pricePln: row.pricePln,
          durationMinutes: row.durationMinutes,
          active: row.active,
        },
      });
      imported++;
    } catch {
      importErrors.push(`Wiersz ${row.line}: błąd zapisu.`);
    }
  }

  return { ok: true, imported, skipped, errors: importErrors };
}
