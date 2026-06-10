"use server";

import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import {
  DEFAULT_ALERT_POLICY,
  getReceptionPoints,
  parseVetClinicSettings,
  type VetClinicSettings,
  type VetReceptionPoint,
} from "@/lib/vet/onboarding";

export type VetSettingsActionResult = { ok: true } | { ok: false; error: string };

async function requireVetClinicId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) return null;
  return (session?.user as { vetClinicId?: string })?.vetClinicId ?? null;
}

async function mergeSettings(vetClinicId: string, patch: VetClinicSettings): Promise<VetClinicSettings> {
  const prisma = getPrisma();
  const row = await prisma.vetClinic.findUnique({ where: { id: vetClinicId }, select: { settingsJson: true } });
  const current = parseVetClinicSettings(row?.settingsJson);
  return { ...current, ...patch };
}

export async function updateVetAccountPasswordAction(formData: FormData): Promise<VetSettingsActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const currentPassword = formData.get("currentPassword")?.toString() ?? "";
  const newPassword = formData.get("newPassword")?.toString() ?? "";
  const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

  if (!currentPassword || !newPassword) return { ok: false, error: "Uzupełnij wszystkie pola." };
  if (newPassword.length < 8) return { ok: false, error: "Nowe hasło: minimum 8 znaków." };
  if (newPassword !== confirmPassword) return { ok: false, error: "Hasła nie są identyczne." };

  try {
    const prisma = getPrisma();
    const account = await prisma.vetClinicAccount.findUnique({ where: { vetClinicId } });
    if (!account) return { ok: false, error: "Nie znaleziono konta." };

    const valid = await bcrypt.compare(currentPassword, account.passwordHash);
    if (!valid) return { ok: false, error: "Obecne hasło jest nieprawidłowe." };

    await prisma.vetClinicAccount.update({
      where: { vetClinicId },
      data: { passwordHash: await bcrypt.hash(newPassword, 10) },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zmienić hasła." };
  }
}

export async function updateVetAlertPolicyAction(formData: FormData): Promise<VetSettingsActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const appointmentDays = formData
    .getAll("appointmentDays")
    .map((v) => parseInt(String(v), 10))
    .filter((n) => !Number.isNaN(n));
  const vaccinationDays = formData
    .getAll("vaccinationDays")
    .map((v) => parseInt(String(v), 10))
    .filter((n) => !Number.isNaN(n));
  const smsEnabled = formData.get("smsEnabled") === "true";
  const emailEnabled = formData.get("emailEnabled") === "true";
  const smsBranding = formData.get("smsBranding")?.toString()?.trim() || undefined;

  if (appointmentDays.length === 0 || vaccinationDays.length === 0) {
    return { ok: false, error: "Wybierz co najmniej jeden termin przypomnienia." };
  }
  if (!smsEnabled && !emailEnabled) {
    return { ok: false, error: "Włącz co najmniej SMS lub e-mail." };
  }

  try {
    const prisma = getPrisma();
    const settings = await mergeSettings(vetClinicId, {
      alertPolicy: {
        appointmentDaysBefore: Array.from(new Set(appointmentDays)).sort((a, b) => b - a),
        vaccinationDaysBefore: Array.from(new Set(vaccinationDays)).sort((a, b) => b - a),
        smsEnabled,
        emailEnabled,
        smsBranding,
      },
    });
    await prisma.vetClinic.update({
      where: { id: vetClinicId },
      data: { settingsJson: JSON.stringify(settings) },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zapisać ustawień." };
  }
}

export async function updateVetReceptionPointsAction(points: VetReceptionPoint[]): Promise<VetSettingsActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const cleaned = points
    .map((p) => ({
      ...p,
      id: p.id || crypto.randomUUID(),
      name: p.name.trim(),
      phone: p.phone?.trim() || undefined,
      street: p.street?.trim() || undefined,
      houseNumber: p.houseNumber?.trim() || undefined,
      apartmentNumber: p.apartmentNumber?.trim() || undefined,
      postalCode: p.postalCode?.trim() || undefined,
      city: p.city?.trim() || undefined,
      notes: p.notes?.trim() || undefined,
    }))
    .filter((p) => p.name.length > 0);

  if (cleaned.length === 0) {
    return { ok: false, error: "Dodaj co najmniej jeden punkt przyjęć." };
  }

  try {
    const prisma = getPrisma();
    const settings = await mergeSettings(vetClinicId, { receptionPoints: cleaned });
    const { receptionPoint: _legacy, ...payload } = settings;
    await prisma.vetClinic.update({
      where: { id: vetClinicId },
      data: { settingsJson: JSON.stringify(payload) },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zapisać punktów." };
  }
}

export async function getVetSettingsSnapshot(vetClinicId: string) {
  const prisma = getPrisma();
  const [clinic, account] = await Promise.all([
    prisma.vetClinic.findUnique({
      where: { id: vetClinicId },
      select: { settingsJson: true, name: true },
    }),
    prisma.vetClinicAccount.findUnique({
      where: { vetClinicId },
      select: { email: true, emailVerifiedAt: true },
    }),
  ]);
  const settings = parseVetClinicSettings(clinic?.settingsJson);
  return {
    email: account?.email ?? "",
    emailVerified: !!account?.emailVerifiedAt,
    alertPolicy: settings.alertPolicy ?? DEFAULT_ALERT_POLICY,
    receptionPoints: getReceptionPoints(settings),
  };
}
