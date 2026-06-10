"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ADMIN_ROLE } from "@/lib/auth";

export type SubmitRequestResult = { ok: true } | { ok: false; error: string };
export type ReviewRequestResult = { ok: true } | { ok: false; error: string };

export async function submitClinicTreatmentRequestAction(_formData: FormData): Promise<SubmitRequestResult> {
  const session = await getServerSession(authOptions);
  if (!(session?.user as { clinicId?: string })?.clinicId) return { ok: false, error: "Brak sesji." };
  return { ok: false, error: "Funkcja niedostępna w tej wersji." };
}

export async function approveClinicTreatmentRequestAction(_requestId: string): Promise<ReviewRequestResult> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== ADMIN_ROLE) return { ok: false, error: "Brak uprawnień." };
  return { ok: false, error: "Funkcja niedostępna w tej wersji." };
}

export async function rejectClinicTreatmentRequestAction(_requestId: string): Promise<ReviewRequestResult> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== ADMIN_ROLE) return { ok: false, error: "Brak uprawnień." };
  return { ok: false, error: "Funkcja niedostępna w tej wersji." };
}
