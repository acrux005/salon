"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ADMIN_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

export type AdminDeleteResult = { ok: true } | { ok: false; error: string };

async function requireAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return (session?.user as { role?: string })?.role === ADMIN_ROLE;
}

export async function deleteClinicAction(clinicId: string): Promise<AdminDeleteResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Brak uprawnień." };
  try {
    const prisma = getPrisma();
    await prisma.clinic.delete({ where: { id: clinicId } });
    revalidatePath("/portal/admin/gabinety");
    revalidatePath("/portal/admin/klienci");
    return { ok: true };
  } catch (e) {
    console.error("[deleteClinicAction]", e);
    return { ok: false, error: "Błąd usuwania gabinetu." };
  }
}

export async function deleteClinicAccountAction(accountId: string): Promise<AdminDeleteResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Brak uprawnień." };
  try {
    const prisma = getPrisma();
    await prisma.clinicAccount.delete({ where: { id: accountId } });
    revalidatePath("/portal/admin/gabinety");
    revalidatePath("/portal/admin/klienci");
    return { ok: true };
  } catch (e) {
    console.error("[deleteClinicAccountAction]", e);
    return { ok: false, error: "Błąd usuwania konta." };
  }
}

export async function changeClinicPasswordAction(
  clinicAccountId: string,
  newPassword: string
): Promise<AdminDeleteResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Brak uprawnień." };
  if (!newPassword || newPassword.length < 10)
    return { ok: false, error: "Hasło musi mieć min. 10 znaków." };
  try {
    const bcrypt = await import("bcrypt");
    const hash = await bcrypt.default.hash(newPassword, 10);
    const prisma = getPrisma();
    await prisma.clinicAccount.update({
      where: { id: clinicAccountId },
      data: {
        passwordHash: hash,
        // Logowanie wymaga emailVerifiedAt (lib/authOptions); reset hasła przez admina = umożliwienie dostępu.
        emailVerifiedAt: new Date(),
      },
    });
    revalidatePath("/portal/admin/gabinety");
    revalidatePath("/portal/admin/klienci");
    return { ok: true };
  } catch (e) {
    console.error("[changeClinicPasswordAction]", e);
    return { ok: false, error: "Błąd zapisu hasła." };
  }
}

export async function deleteClientAction(clientId: string): Promise<AdminDeleteResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Brak uprawnień." };
  try {
    const prisma = getPrisma();
    await prisma.client.delete({ where: { id: clientId } });
    revalidatePath("/portal/admin/klienci");
    return { ok: true };
  } catch (e) {
    console.error("[deleteClientAction]", e);
    return { ok: false, error: "Błąd usuwania klienta." };
  }
}

/** Stub: salon używa katalogu zabiegów (treatmentsCatalog), nie DB. */
export async function createTreatmentAction(_formData: FormData) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== ADMIN_ROLE)
    return { ok: false as const, error: "Brak uprawnień." };
  return { ok: false as const, error: "Zabiegi są w katalogu (kod). Edycja wymaga zmiany w lib/skinmatch/treatmentsCatalog.ts." };
}
