"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { buildTreatmentNotes } from "@/lib/vet/treatment";
import type { ExtractedPetTreatment } from "@/lib/vet/petDocumentExtract";

export type RecordTreatmentResult =
  | { ok: true; summary: string; appointmentId: string }
  | { ok: false; error: string };

async function requireVetClinicId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) return null;
  return (session?.user as { vetClinicId?: string })?.vetClinicId ?? null;
}

function defaultTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export async function recordTreatmentAction(formData: FormData): Promise<RecordTreatmentResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const petId = formData.get("petId")?.toString()?.trim();
  const summary = formData.get("summary")?.toString()?.trim();
  const dateStr = formData.get("doneAt")?.toString()?.trim();
  const diagnosis = formData.get("diagnosis")?.toString()?.trim() || null;
  const medications = formData.get("medications")?.toString()?.trim() || null;

  if (!petId || !summary) return { ok: false, error: "Wybierz zwierzę i opisz leczenie." };

  const date = dateStr || new Date().toISOString().slice(0, 10);
  if (Number.isNaN(new Date(`${date}T12:00:00`).getTime())) {
    return { ok: false, error: "Nieprawidłowa data." };
  }

  try {
    const prisma = getPrisma();
    const pet = await prisma.pet.findFirst({
      where: { id: petId, owner: { vetClinicId } },
      include: { owner: true },
    });
    if (!pet) return { ok: false, error: "Nie znaleziono zwierzęcia." };

    const notes = buildTreatmentNotes({ summary, diagnosis, medications });
    const appointment = await prisma.vetAppointment.create({
      data: {
        vetClinicId,
        petId,
        date,
        time: defaultTime(),
        ownerName: pet.owner.name,
        ownerPhone: pet.owner.phone,
        petName: pet.name,
        visitType: "leczenie",
        status: "done",
        notes,
      },
    });

    return { ok: true, summary, appointmentId: appointment.id };
  } catch {
    return { ok: false, error: "Nie udało się zapisać leczenia." };
  }
}

export async function importPetTreatmentsFromScanAction(
  formData: FormData
): Promise<{ ok: true; imported: number } | { ok: false; error: string }> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const petId = formData.get("petId")?.toString()?.trim();
  const raw = formData.get("treatmentsJson")?.toString()?.trim();
  if (!petId || !raw) return { ok: false, error: "Brak danych leczenia." };

  let rows: ExtractedPetTreatment[];
  try {
    rows = JSON.parse(raw) as ExtractedPetTreatment[];
    if (!Array.isArray(rows)) throw new Error("invalid");
  } catch {
    return { ok: false, error: "Nieprawidłowy format leczenia." };
  }

  try {
    const prisma = getPrisma();
    const pet = await prisma.pet.findFirst({
      where: { id: petId, owner: { vetClinicId } },
      include: { owner: true },
    });
    if (!pet) return { ok: false, error: "Nie znaleziono zwierzęcia." };

    let imported = 0;
    for (const row of rows) {
      if (!row.summary?.trim()) continue;
      const date = row.administeredAt || new Date().toISOString().slice(0, 10);
      if (Number.isNaN(new Date(`${date}T12:00:00`).getTime())) continue;

      const notes = buildTreatmentNotes({
        summary: row.summary.trim(),
        diagnosis: row.diagnosis,
        medications: row.medications,
      });
      const footer = [
        row.vetName?.trim() ? `Lekarz: ${row.vetName.trim()}` : null,
        "Import ze skanu książeczki (strona leczenia)",
      ]
        .filter(Boolean)
        .join(" · ");

      await prisma.vetAppointment.create({
        data: {
          vetClinicId,
          petId,
          date,
          time: "12:00",
          ownerName: pet.owner.name,
          ownerPhone: pet.owner.phone,
          petName: pet.name,
          visitType: "leczenie",
          status: "done",
          notes: `${notes}\n${footer}`,
        },
      });
      imported += 1;
    }

    return { ok: true, imported };
  } catch {
    return { ok: false, error: "Nie udało się zapisać leczenia ze skanu." };
  }
}
