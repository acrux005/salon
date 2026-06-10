"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {
  getSubCabinetsByClinicIdAsync,
  createSubCabinetAsync,
  updateSubCabinetAsync,
  deleteSubCabinetAsync,
  getSubCabinetTreatmentIdsAsync,
  setSubCabinetTreatmentsAsync,
  type SubCabinetRecord,
} from "@/lib/skinmatch/subCabinetDb";

export type SubCabinetListResult = { ok: true; items: SubCabinetRecord[] } | { ok: false; error: string };
export type SubCabinetMutateResult = { ok: true; item?: SubCabinetRecord } | { ok: false; error: string };
export type TreatmentIdsResult = { ok: true; treatmentIds: string[] } | { ok: false; error: string };

async function getClinicIdFromSession(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as { clinicId?: string } | undefined)?.clinicId ?? null;
}

export async function getSubCabinetListAction(): Promise<SubCabinetListResult> {
  const clinicId = await getClinicIdFromSession();
  if (!clinicId) return { ok: false, error: "Brak sesji." };
  try {
    const items = await getSubCabinetsByClinicIdAsync(clinicId);
    return { ok: true, items };
  } catch (e) {
    console.error("getSubCabinetList:", e);
    return { ok: false, error: "Nie udało się pobrać listy podgabinetów." };
  }
}

export async function createSubCabinetAction(formData: FormData): Promise<SubCabinetMutateResult> {
  const clinicId = await getClinicIdFromSession();
  if (!clinicId) return { ok: false, error: "Brak sesji." };
  const name = formData.get("name")?.toString()?.trim();
  if (!name) return { ok: false, error: "Nazwa podgabinetu jest wymagana." };
  try {
    const item = await createSubCabinetAsync(clinicId, { name });
    return { ok: true, item };
  } catch (e) {
    console.error("createSubCabinet:", e);
    return { ok: false, error: "Nie udało się dodać podgabinetu." };
  }
}

export async function updateSubCabinetAction(
  id: string,
  formData: FormData
): Promise<SubCabinetMutateResult> {
  const clinicId = await getClinicIdFromSession();
  if (!clinicId) return { ok: false, error: "Brak sesji." };
  const name = formData.get("name")?.toString()?.trim();
  if (!name) return { ok: false, error: "Nazwa podgabinetu jest wymagana." };
  try {
    const item = await updateSubCabinetAsync(id, clinicId, { name });
    return item ? { ok: true, item } : { ok: false, error: "Nie znaleziono podgabinetu." };
  } catch (e) {
    console.error("updateSubCabinet:", e);
    return { ok: false, error: "Nie udało się zapisać." };
  }
}

export async function deleteSubCabinetAction(id: string): Promise<SubCabinetMutateResult> {
  const clinicId = await getClinicIdFromSession();
  if (!clinicId) return { ok: false, error: "Brak sesji." };
  try {
    const deleted = await deleteSubCabinetAsync(id, clinicId);
    return deleted ? { ok: true } : { ok: false, error: "Nie znaleziono podgabinetu." };
  } catch (e) {
    console.error("deleteSubCabinet:", e);
    return { ok: false, error: "Nie udało się usunąć." };
  }
}

export async function getSubCabinetTreatmentIdsAction(subCabinetId: string): Promise<TreatmentIdsResult> {
  const clinicId = await getClinicIdFromSession();
  if (!clinicId) return { ok: false, error: "Brak sesji." };
  try {
    const treatmentIds = await getSubCabinetTreatmentIdsAsync(subCabinetId);
    return { ok: true, treatmentIds };
  } catch (e) {
    console.error("getSubCabinetTreatmentIds:", e);
    return { ok: false, error: "Nie udało się pobrać zabiegów." };
  }
}

export async function setSubCabinetTreatmentsAction(
  subCabinetId: string,
  treatmentIds: string[]
): Promise<SubCabinetMutateResult> {
  const clinicId = await getClinicIdFromSession();
  if (!clinicId) return { ok: false, error: "Brak sesji." };
  try {
    await setSubCabinetTreatmentsAsync(subCabinetId, clinicId, treatmentIds);
    return { ok: true };
  } catch (e) {
    console.error("setSubCabinetTreatments:", e);
    return { ok: false, error: "Nie udało się zapisać przydziału zabiegów." };
  }
}
