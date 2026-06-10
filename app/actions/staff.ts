"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {
  getStaffByClinicIdAsync,
  createStaffAsync,
  updateStaffAsync,
  deleteStaffAsync,
} from "@/lib/skinmatch/staffDb";
import {
  getStaffTreatmentIdsAsync,
  setStaffTreatmentsAsync,
} from "@/lib/skinmatch/staffTreatmentDb";

export type StaffRecord = { id: string; clinicId: string; name: string; cosmoStaffId: number | null; subCabinetIds: string[]; order: number };
export type StaffListResult = { ok: true; items: StaffRecord[] } | { ok: false; error: string };
export type StaffMutateResult = { ok: true; item?: StaffRecord } | { ok: false; error: string };
export type StaffTreatmentIdsResult = { ok: true; treatmentIds: string[] } | { ok: false; error: string };
export type SetStaffTreatmentsResult = { ok: true } | { ok: false; error: string };

async function getClinicIdFromSession(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as { clinicId?: string })?.clinicId ?? null;
}

export async function getStaffListAction(): Promise<StaffListResult> {
  const clinicId = await getClinicIdFromSession();
  if (!clinicId) return { ok: false, error: "Brak sesji." };
  try {
    const items = await getStaffByClinicIdAsync(clinicId);
    return { ok: true, items };
  } catch (e) {
    console.error("getStaffListAction:", e);
    return { ok: false, error: "Błąd wczytywania listy pracowników." };
  }
}

export async function createStaffAction(formData: FormData): Promise<StaffMutateResult> {
  const clinicId = await getClinicIdFromSession();
  if (!clinicId) return { ok: false, error: "Brak sesji." };
  const name = formData.get("name")?.toString()?.trim();
  if (!name) return { ok: false, error: "Imię i nazwisko są wymagane." };
  const cosmoRaw = formData.get("cosmoStaffId")?.toString()?.trim();
  const cosmoStaffId = cosmoRaw ? parseInt(cosmoRaw, 10) : null;
  const subCabinetIds = formData.getAll("subCabinetIds").map((v) => String(v).trim()).filter(Boolean);
  try {
    const item = await createStaffAsync(clinicId, {
      name,
      cosmoStaffId: Number.isNaN(cosmoStaffId) ? null : cosmoStaffId,
      subCabinetIds: subCabinetIds.length > 0 ? subCabinetIds : undefined,
    });
    return { ok: true, item };
  } catch (e) {
    console.error("createStaffAction:", e);
    return { ok: false, error: "Błąd dodawania pracownika." };
  }
}

export async function updateStaffAction(id: string, formData: FormData): Promise<StaffMutateResult> {
  const clinicId = await getClinicIdFromSession();
  if (!clinicId) return { ok: false, error: "Brak sesji." };
  const name = formData.get("name")?.toString()?.trim();
  const cosmoRaw = formData.get("cosmoStaffId")?.toString()?.trim();
  const cosmoStaffId = cosmoRaw ? parseInt(cosmoRaw, 10) : null;
  const subCabinetIds = formData.getAll("subCabinetIds").map((v) => String(v).trim()).filter(Boolean);
  try {
    const item = await updateStaffAsync(id, clinicId, {
      ...(name !== undefined && name !== "" && { name }),
      cosmoStaffId: Number.isNaN(cosmoStaffId) ? null : cosmoStaffId,
      subCabinetIds,
    });
    if (!item) return { ok: false, error: "Pracownik nie należy do tego gabinetu lub nie istnieje." };
    return { ok: true, item };
  } catch (e) {
    console.error("updateStaffAction:", e);
    return { ok: false, error: "Błąd zapisu." };
  }
}

export async function deleteStaffAction(id: string): Promise<StaffMutateResult> {
  const clinicId = await getClinicIdFromSession();
  if (!clinicId) return { ok: false, error: "Brak sesji." };
  try {
    const deleted = await deleteStaffAsync(id, clinicId);
    if (!deleted) return { ok: false, error: "Pracownik nie należy do tego gabinetu lub nie istnieje." };
    return { ok: true };
  } catch (e) {
    console.error("deleteStaffAction:", e);
    return { ok: false, error: "Błąd usuwania." };
  }
}

export async function getStaffTreatmentIdsAction(staffId: string): Promise<StaffTreatmentIdsResult> {
  const clinicId = await getClinicIdFromSession();
  if (!clinicId) return { ok: false, error: "Brak sesji." };
  try {
    const { getPrisma } = await import("@/lib/db");
    const prisma = getPrisma();
    const staff = await prisma.staff.findFirst({
      where: { id: staffId, clinicId },
      select: { id: true },
    });
    if (!staff) return { ok: false, error: "Pracownik nie należy do tego gabinetu." };
    const treatmentIds = await getStaffTreatmentIdsAsync(staffId);
    return { ok: true, treatmentIds };
  } catch (e) {
    console.error("getStaffTreatmentIdsAction:", e);
    return { ok: false, error: "Błąd wczytywania zabiegów." };
  }
}

export async function setStaffTreatmentsAction(
  staffId: string,
  treatmentIds: string[]
): Promise<SetStaffTreatmentsResult> {
  const clinicId = await getClinicIdFromSession();
  if (!clinicId) return { ok: false, error: "Brak sesji." };
  try {
    const ok = await setStaffTreatmentsAsync(staffId, clinicId, treatmentIds);
    if (!ok) return { ok: false, error: "Pracownik nie należy do tego gabinetu." };
    return { ok: true };
  } catch (e) {
    console.error("setStaffTreatmentsAction:", e);
    return { ok: false, error: "Błąd zapisu zabiegów." };
  }
}
