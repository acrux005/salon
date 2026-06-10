"use server";

import bcrypt from "bcrypt";
import crypto from "crypto";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GAB_CLINIC_ROLE, GAB_PATIENT_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { gabPrisma } from "@/lib/gabinet/prismaGab";
import { logGabClientConsentsFromData } from "@/lib/gabinet/consentLog";
import {
  buildGabDocumentMeta,
  normalizeGabDocumentType,
} from "@/lib/gabinet/patientDocumentTypes";
import {
  deleteGabPatientDocumentFile,
  saveGabPatientDocumentFile,
} from "@/lib/gabinet/patientDocument";
import type { WorkingHoursDay } from "@/lib/gabinet/schema";
import { getGabinetSiteUrl } from "@/lib/gabinetPlatform/host";
import {
  sendGabClinicVerificationEmail,
  sendGabPasswordResetEmail,
  sendGabPatientReminderEmail,
  sendGabPatientVerificationEmail,
} from "@/lib/email";
import { sendGabSms } from "@/lib/gabinet/gabNotify";
import { tryConsume } from "@/lib/rateLimit";

export type GabSettingsResult = { ok: true } | { ok: false; error: string };
export type GabAuthResult = { ok: true } | { ok: false; error: string };

const VERIFY_EXPIRES_MS = 24 * 60 * 60 * 1000;
const RESET_EXPIRES_MS = 60 * 60 * 1000;

async function requireGabClinicId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== GAB_CLINIC_ROLE) return null;
  return (session?.user as { gabClinicId?: string })?.gabClinicId ?? null;
}

async function requireGabPatientAccountId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== GAB_PATIENT_ROLE) return null;
  return (session?.user as { gabPatientAccountId?: string })?.gabPatientAccountId ?? null;
}

function getRequestHost(): string {
  return (headers().get("host") ?? "dentysta.odart.pl").split(":")[0] ?? "dentysta.odart.pl";
}

export async function saveGabStaffAction(formData: FormData): Promise<GabSettingsResult & { staffId?: string }> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const id = formData.get("id")?.toString()?.trim() || null;
  const name = formData.get("name")?.toString()?.trim();
  const phone = formData.get("phone")?.toString()?.trim() || null;
  const role = formData.get("role")?.toString()?.trim() || "doctor";
  const active = formData.get("active") !== "false";
  if (!name) return { ok: false, error: "Imię jest wymagane." };
  try {
    const db = getPrisma();
    if (id) {
      const existing = await db.gabStaff.findFirst({ where: { id, gabClinicId } });
      if (!existing) return { ok: false, error: "Nie znaleziono personelu." };
      await db.gabStaff.update({ where: { id }, data: { name, phone, role, active } });
      return { ok: true, staffId: id };
    }
    const maxOrder = await db.gabStaff.aggregate({ where: { gabClinicId }, _max: { order: true } });
    const staff = await db.gabStaff.create({
      data: { gabClinicId, name, phone, role, active, order: (maxOrder._max.order ?? 0) + 1 },
    });
    await advanceOnboardingStep(gabClinicId, 3);
    return { ok: true, staffId: staff.id };
  } catch {
    return { ok: false, error: "Nie udało się zapisać personelu." };
  }
}

export async function deleteGabStaffAction(id: string): Promise<GabSettingsResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    const db = getPrisma();
    const staff = await db.gabStaff.findFirst({ where: { id, gabClinicId } });
    if (!staff) return { ok: false, error: "Nie znaleziono personelu." };
    const used = await db.gabAppointment.count({ where: { gabStaffId: id } });
    if (used > 0) {
      await db.gabStaff.update({ where: { id }, data: { active: false } });
    } else {
      await db.gabStaff.delete({ where: { id } });
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się usunąć personelu." };
  }
}

export async function saveGabStaffWorkingHoursAction(formData: FormData): Promise<GabSettingsResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const staffId = formData.get("staffId")?.toString()?.trim();
  if (!staffId) return { ok: false, error: "Brak personelu." };
  const useClinicHours = formData.get("useClinicHours") === "true";

  try {
    const db = getPrisma();
    const staff = await db.gabStaff.findFirst({ where: { id: staffId, gabClinicId } });
    if (!staff) return { ok: false, error: "Nie znaleziono personelu." };

    if (useClinicHours) {
      await db.gabStaff.update({ where: { id: staffId }, data: { workingHours: null } });
      return { ok: true };
    }

    const hours: WorkingHoursDay[] = [];
    for (let i = 0; i < 7; i++) {
      const closed = formData.get(`day_${i}_closed`) === "true";
      const open = formData.get(`day_${i}_open`)?.toString()?.trim() || "08:00";
      const close = formData.get(`day_${i}_close`)?.toString()?.trim() || "18:00";
      hours.push(closed ? { open: "", close: "" } : { open, close });
    }
    await db.gabStaff.update({
      where: { id: staffId },
      data: { workingHours: JSON.stringify(hours) },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zapisać godzin personelu." };
  }
}

export async function saveGabWorkingHoursAction(formData: FormData): Promise<GabSettingsResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const hours: WorkingHoursDay[] = [];
  for (let i = 0; i < 7; i++) {
    const closed = formData.get(`day_${i}_closed`) === "true";
    const open = formData.get(`day_${i}_open`)?.toString()?.trim() || "08:00";
    const close = formData.get(`day_${i}_close`)?.toString()?.trim() || "18:00";
    hours.push(closed ? { open: "", close: "" } : { open, close });
  }
  const noOrderDaysRaw = formData.get("noOrderDays")?.toString()?.trim() ?? "";
  const noOrderDays = noOrderDaysRaw
    .split(/[\n,;]+/)
    .map((d) => d.trim())
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
  const slotDurationMinutes = parseInt(formData.get("slotDurationMinutes")?.toString() ?? "30", 10);
  const bookingPhoneOnly = formData.get("bookingPhoneOnly") === "true";
  try {
    await gabPrisma().gabClinic.update({
      where: { id: gabClinicId },
      data: {
        workingHours: JSON.stringify(hours),
        noOrderDays: JSON.stringify(noOrderDays),
        slotDurationMinutes: Number.isNaN(slotDurationMinutes) ? 30 : Math.max(5, slotDurationMinutes),
        bookingPhoneOnly,
      },
    });
    await advanceOnboardingStep(gabClinicId, 2);
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zapisać godzin pracy." };
  }
}

export async function saveGabCatalogItemAction(formData: FormData): Promise<GabSettingsResult & { itemId?: string }> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const id = formData.get("id")?.toString()?.trim() || null;
  const name = formData.get("name")?.toString()?.trim();
  const category = formData.get("category")?.toString()?.trim() || "general";
  const pricePln = parseFloat(formData.get("pricePln")?.toString() ?? "0");
  const durationMinutes = parseInt(formData.get("durationMinutes")?.toString() ?? "30", 10);
  const active = formData.get("active") !== "false";
  if (!name) return { ok: false, error: "Nazwa zabiegu jest wymagana." };
  try {
    const db = getPrisma();
    if (id) {
      await db.gabTreatmentCatalogItem.updateMany({
        where: { id, gabClinicId },
        data: {
          name,
          category,
          pricePln: Number.isNaN(pricePln) ? 0 : pricePln,
          durationMinutes: Number.isNaN(durationMinutes) ? 30 : durationMinutes,
          active,
        },
      });
      await advanceOnboardingStep(gabClinicId, 4);
      return { ok: true, itemId: id };
    }
    const item = await db.gabTreatmentCatalogItem.create({
      data: {
        gabClinicId,
        name,
        category,
        pricePln: Number.isNaN(pricePln) ? 0 : pricePln,
        durationMinutes: Number.isNaN(durationMinutes) ? 30 : durationMinutes,
        active,
      },
    });
    await advanceOnboardingStep(gabClinicId, 4);
    return { ok: true, itemId: item.id };
  } catch {
    return { ok: false, error: "Nie udało się zapisać pozycji katalogu." };
  }
}

export async function deleteGabCatalogItemAction(id: string): Promise<GabSettingsResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    await getPrisma().gabTreatmentCatalogItem.deleteMany({ where: { id, gabClinicId } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się usunąć pozycji." };
  }
}

export async function saveGabClinicExtendedProfileAction(formData: FormData): Promise<GabSettingsResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const name = formData.get("name")?.toString()?.trim();
  const description = formData.get("description")?.toString()?.trim() ?? "";
  const address = formData.get("address")?.toString()?.trim() ?? "";
  const city = formData.get("city")?.toString()?.trim() ?? "";
  const phone = formData.get("phone")?.toString()?.trim() ?? "";
  const email = formData.get("email")?.toString()?.trim() || null;
  const nip = formData.get("nip")?.toString()?.trim() || null;
  const logoUrl = formData.get("logoUrl")?.toString()?.trim() || null;
  const isPublished = formData.get("isPublished") === "true";
  if (!name) return { ok: false, error: "Nazwa jest wymagana." };
  try {
    await gabPrisma().gabClinic.update({
      where: { id: gabClinicId },
      data: { name, description, address, city, phone, email, nip, logoUrl, isPublished },
    });
    await advanceOnboardingStep(gabClinicId, 1);
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zapisać profilu." };
  }
}

export async function advanceOnboardingStep(gabClinicId: string, minStep: number): Promise<void> {
  const clinic = await gabPrisma().gabClinic.findUnique({
    where: { id: gabClinicId },
    select: { onboardingStep: true },
  });
  if (!clinic || clinic.onboardingStep >= minStep) return;
  await gabPrisma().gabClinic.update({
    where: { id: gabClinicId },
    data: { onboardingStep: minStep },
  });
}

export async function completeGabOnboardingAction(): Promise<GabSettingsResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    await gabPrisma().gabClinic.update({
      where: { id: gabClinicId },
      data: { onboardingStep: 5, onboardingDoneAt: new Date() },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zakończyć konfiguracji." };
  }
}

export async function linkGabPatientAccountAction(
  patientId: string,
  accountEmail: string
): Promise<GabSettingsResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const emailNorm = accountEmail.trim().toLowerCase();
  if (!emailNorm) return { ok: false, error: "Podaj e-mail konta pacjenta." };
  try {
    const db = getPrisma();
    const patient = await db.gabPatient.findFirst({ where: { id: patientId, gabClinicId } });
    if (!patient) return { ok: false, error: "Nie znaleziono pacjenta." };
    const account = await db.gabPatientAccount.findUnique({ where: { email: emailNorm } });
    if (!account) {
      return { ok: false, error: "Brak konta pacjenta z tym e-mailem — poproś o rejestrację w portalu." };
    }
    await db.gabPatient.update({
      where: { id: patientId },
      data: { accountId: account.id, email: patient.email ?? account.email },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się powiązać konta." };
  }
}

export async function uploadGabPatientDocumentAction(formData: FormData): Promise<GabSettingsResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const patientId = formData.get("patientId")?.toString()?.trim();
  const documentType = normalizeGabDocumentType(formData.get("documentType")?.toString());
  const note = formData.get("note")?.toString()?.trim() || undefined;
  const file = formData.get("file");
  if (!patientId) return { ok: false, error: "Brak pacjenta." };
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Wybierz plik (PDF, JPG, PNG)." };
  try {
    const db = getPrisma();
    const patient = await db.gabPatient.findFirst({ where: { id: patientId, gabClinicId } });
    if (!patient) return { ok: false, error: "Nie znaleziono pacjenta." };
    const doc = await db.gabPatientDocument.create({
      data: { patientId, gabClinicId, documentType, fileName: file.name },
    });
    const saved = await saveGabPatientDocumentFile(patientId, doc.id, file);
    if ("error" in saved) {
      await db.gabPatientDocument.delete({ where: { id: doc.id } });
      return { ok: false, error: saved.error };
    }
    await db.gabPatientDocument.update({
      where: { id: doc.id },
      data: {
        extractedJson: buildGabDocumentMeta({
          fileUrl: saved.url,
          mimeType: saved.mimeType,
          sizeBytes: saved.sizeBytes,
          note,
        }),
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się dodać dokumentu." };
  }
}

export async function deleteGabPatientDocumentAction(documentId: string): Promise<GabSettingsResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    const db = getPrisma();
    const doc = await db.gabPatientDocument.findFirst({
      where: { id: documentId, gabClinicId },
    });
    if (!doc) return { ok: false, error: "Nie znaleziono dokumentu." };
    const { parseGabDocumentMeta } = await import("@/lib/gabinet/patientDocumentTypes");
    const meta = parseGabDocumentMeta(doc.extractedJson);
    await deleteGabPatientDocumentFile(meta?.fileUrl);
    await db.gabPatientDocument.delete({ where: { id: documentId } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się usunąć dokumentu." };
  }
}

export async function updateGabClientAction(formData: FormData): Promise<GabSettingsResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const id = formData.get("id")?.toString()?.trim();
  if (!id) return { ok: false, error: "Brak identyfikatora." };
  const name = formData.get("name")?.toString()?.trim();
  const phone = formData.get("phone")?.toString()?.trim();
  const email = formData.get("email")?.toString()?.trim() || null;
  const notes = formData.get("notes")?.toString()?.trim() || null;
  const smsConsent = formData.get("smsConsent") === "true";
  const emailConsent = formData.get("emailConsent") === "true";
  const marketingConsent = formData.get("marketingConsent") === "true";
  const pushConsent = formData.get("pushConsent") === "true";
  if (!name || !phone) return { ok: false, error: "Imię i telefon są wymagane." };
  try {
    const existing = await gabPrisma().gabClient.findFirst({ where: { id, gabClinicId } });
    if (!existing) return { ok: false, error: "Nie znaleziono klienta." };
    await gabPrisma().gabClient.update({
      where: { id },
      data: { name, phone, email, notes, smsConsent, emailConsent, marketingConsent, pushConsent },
    });
    await logGabClientConsentsFromData(
      gabClinicId,
      id,
      existing,
      { smsConsent, emailConsent, marketingConsent, pushConsent }
    );
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zaktualizować klienta." };
  }
}

export async function updateGabPatientSettingsAction(formData: FormData): Promise<GabSettingsResult> {
  const accountId = await requireGabPatientAccountId();
  if (!accountId) return { ok: false, error: "Zaloguj się jako pacjent." };
  const name = formData.get("name")?.toString()?.trim();
  const phone = formData.get("phone")?.toString()?.trim();
  if (!name || !phone) return { ok: false, error: "Imię i telefon są wymagane." };
  try {
    await getPrisma().gabPatientAccount.update({
      where: { id: accountId },
      data: { name, phone },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zapisać ustawień." };
  }
}

export async function changeGabPatientPasswordAction(formData: FormData): Promise<GabSettingsResult> {
  const accountId = await requireGabPatientAccountId();
  if (!accountId) return { ok: false, error: "Zaloguj się jako pacjent." };
  const current = formData.get("currentPassword")?.toString() ?? "";
  const next = formData.get("newPassword")?.toString() ?? "";
  if (next.length < 10) return { ok: false, error: "Nowe hasło: min. 10 znaków." };
  try {
    const account = await getPrisma().gabPatientAccount.findUnique({ where: { id: accountId } });
    if (!account) return { ok: false, error: "Nie znaleziono konta." };
    const ok = await bcrypt.compare(current, account.passwordHash);
    if (!ok) return { ok: false, error: "Obecne hasło jest nieprawidłowe." };
    const hash = await bcrypt.hash(next, 10);
    await getPrisma().gabPatientAccount.update({ where: { id: accountId }, data: { passwordHash: hash } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zmienić hasła." };
  }
}

export async function requestGabClinicPasswordResetAction(email: string): Promise<GabAuthResult> {
  const emailNorm = email.trim().toLowerCase();
  if (!emailNorm || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
    return { ok: false, error: "Podaj prawidłowy adres e-mail." };
  }
  if (!tryConsume("gab-reset-clinic:" + emailNorm, 5, 60 * 60 * 1000)) {
    return { ok: false, error: "Zbyt wiele prób. Spróbuj za godzinę." };
  }
  try {
    const account = await getPrisma().gabClinicAccount.findUnique({ where: { email: emailNorm } });
    if (!account) return { ok: true };
    const token = crypto.randomBytes(32).toString("hex");
    await getPrisma().gabClinicAccount.update({
      where: { id: account.id },
      data: {
        verificationToken: token,
        verificationTokenExpires: new Date(Date.now() + RESET_EXPIRES_MS),
      },
    });
    await sendGabPasswordResetEmail(emailNorm, token, "clinic", getRequestHost());
    return { ok: true };
  } catch {
    return { ok: false, error: "Błąd wysyłki." };
  }
}

export async function requestGabPatientPasswordResetAction(email: string): Promise<GabAuthResult> {
  const emailNorm = email.trim().toLowerCase();
  if (!emailNorm || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
    return { ok: false, error: "Podaj prawidłowy adres e-mail." };
  }
  if (!tryConsume("gab-reset-patient:" + emailNorm, 5, 60 * 60 * 1000)) {
    return { ok: false, error: "Zbyt wiele prób. Spróbuj za godzinę." };
  }
  try {
    const account = await getPrisma().gabPatientAccount.findUnique({ where: { email: emailNorm } });
    if (!account) return { ok: true };
    const token = crypto.randomBytes(32).toString("hex");
    await getPrisma().gabPatientAccount.update({
      where: { id: account.id },
      data: {
        verificationToken: token,
        verificationTokenExpires: new Date(Date.now() + RESET_EXPIRES_MS),
      },
    });
    await sendGabPasswordResetEmail(emailNorm, token, "patient", getRequestHost());
    return { ok: true };
  } catch {
    return { ok: false, error: "Błąd wysyłki." };
  }
}

export async function resetGabPasswordAction(formData: FormData): Promise<GabAuthResult> {
  const token = formData.get("token")?.toString()?.trim();
  const password = formData.get("password")?.toString() ?? "";
  const accountType = formData.get("accountType")?.toString() === "patient" ? "patient" : "clinic";
  if (!token) return { ok: false, error: "Brak tokenu." };
  if (password.length < 10) return { ok: false, error: "Hasło: min. 10 znaków." };
  try {
    const db = getPrisma();
    const hash = await bcrypt.hash(password, 10);
    if (accountType === "patient") {
      const account = await db.gabPatientAccount.findFirst({
        where: { verificationToken: token, verificationTokenExpires: { gt: new Date() } },
      });
      if (!account) return { ok: false, error: "Link wygasł lub jest nieprawidłowy." };
      await db.gabPatientAccount.update({
        where: { id: account.id },
        data: {
          passwordHash: hash,
          verificationToken: null,
          verificationTokenExpires: null,
          emailVerifiedAt: account.emailVerifiedAt ?? new Date(),
        },
      });
    } else {
      const account = await db.gabClinicAccount.findFirst({
        where: { verificationToken: token, verificationTokenExpires: { gt: new Date() } },
      });
      if (!account) return { ok: false, error: "Link wygasł lub jest nieprawidłowy." };
      await db.gabClinicAccount.update({
        where: { id: account.id },
        data: {
          passwordHash: hash,
          verificationToken: null,
          verificationTokenExpires: null,
          emailVerifiedAt: account.emailVerifiedAt ?? new Date(),
        },
      });
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się ustawić hasła." };
  }
}

export async function verifyGabClinicEmail(token: string): Promise<GabAuthResult> {
  if (!token?.trim()) return { ok: false, error: "Brak tokenu." };
  try {
    const account = await getPrisma().gabClinicAccount.findFirst({
      where: { verificationToken: token.trim(), verificationTokenExpires: { gt: new Date() } },
    });
    if (!account) return { ok: false, error: "Link wygasł lub jest nieprawidłowy." };
    await getPrisma().gabClinicAccount.update({
      where: { id: account.id },
      data: { emailVerifiedAt: new Date(), verificationToken: null, verificationTokenExpires: null },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Błąd weryfikacji." };
  }
}

export async function verifyGabPatientEmail(token: string): Promise<GabAuthResult> {
  if (!token?.trim()) return { ok: false, error: "Brak tokenu." };
  try {
    const account = await getPrisma().gabPatientAccount.findFirst({
      where: { verificationToken: token.trim(), verificationTokenExpires: { gt: new Date() } },
    });
    if (!account) return { ok: false, error: "Link wygasł lub jest nieprawidłowy." };
    await getPrisma().gabPatientAccount.update({
      where: { id: account.id },
      data: { emailVerifiedAt: new Date(), verificationToken: null, verificationTokenExpires: null },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Błąd weryfikacji." };
  }
}

export async function resendGabClinicVerificationAction(): Promise<GabAuthResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    const account = await getPrisma().gabClinicAccount.findFirst({ where: { gabClinicId } });
    if (!account) return { ok: false, error: "Nie znaleziono konta." };
    if (account.emailVerifiedAt) return { ok: false, error: "E-mail jest już potwierdzony." };
    const token = crypto.randomBytes(32).toString("hex");
    await getPrisma().gabClinicAccount.update({
      where: { id: account.id },
      data: {
        verificationToken: token,
        verificationTokenExpires: new Date(Date.now() + VERIFY_EXPIRES_MS),
      },
    });
    const sent = await sendGabClinicVerificationEmail(account.email, token, getRequestHost());
    if (!sent) return { ok: false, error: "Nie udało się wysłać maila." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Błąd wysyłki." };
  }
}

export async function resendGabPatientVerificationAction(): Promise<GabAuthResult> {
  const accountId = await requireGabPatientAccountId();
  if (!accountId) return { ok: false, error: "Zaloguj się jako pacjent." };
  try {
    const account = await getPrisma().gabPatientAccount.findUnique({ where: { id: accountId } });
    if (!account) return { ok: false, error: "Nie znaleziono konta." };
    if (account.emailVerifiedAt) return { ok: false, error: "E-mail jest już potwierdzony." };
    const token = crypto.randomBytes(32).toString("hex");
    await getPrisma().gabPatientAccount.update({
      where: { id: accountId },
      data: {
        verificationToken: token,
        verificationTokenExpires: new Date(Date.now() + VERIFY_EXPIRES_MS),
      },
    });
    const sent = await sendGabPatientVerificationEmail(account.email, token, getRequestHost());
    if (!sent) return { ok: false, error: "Nie udało się wysłać maila." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Błąd wysyłki." };
  }
}

export async function setGabPatientActiveClinicAction(gabClinicId: string): Promise<GabSettingsResult> {
  const accountId = await requireGabPatientAccountId();
  if (!accountId) return { ok: false, error: "Zaloguj się jako pacjent." };
  try {
    const linked = await getPrisma().gabPatient.findFirst({
      where: { accountId, gabClinicId },
    });
    if (!linked) return { ok: false, error: "Brak powiązania z tym gabinetem." };
    await getPrisma().gabPatientAccount.update({
      where: { id: accountId },
      data: { activeGabClinicId: gabClinicId },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zmienić gabinetu." };
  }
}

export async function changeGabClinicPasswordAction(formData: FormData): Promise<GabSettingsResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const current = formData.get("currentPassword")?.toString() ?? "";
  const next = formData.get("newPassword")?.toString() ?? "";
  if (next.length < 10) return { ok: false, error: "Nowe hasło: min. 10 znaków." };
  try {
    const account = await getPrisma().gabClinicAccount.findFirst({ where: { gabClinicId } });
    if (!account) return { ok: false, error: "Nie znaleziono konta." };
    const ok = await bcrypt.compare(current, account.passwordHash);
    if (!ok) return { ok: false, error: "Obecne hasło jest nieprawidłowe." };
    const hash = await bcrypt.hash(next, 10);
    await getPrisma().gabClinicAccount.update({ where: { id: account.id }, data: { passwordHash: hash } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zmienić hasła." };
  }
}

export async function sendGabNotifyTestAction(formData: FormData): Promise<GabSettingsResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const channel = formData.get("channel")?.toString() === "email" ? "email" : "sms";
  const body = "[TEST] GabinetHarmonogram — test kanału powiadomień.";
  try {
    const db = getPrisma();
    const [clinic, account] = await Promise.all([
      gabPrisma().gabClinic.findUnique({ where: { id: gabClinicId }, select: { name: true, phone: true, email: true } }),
      db.gabClinicAccount.findFirst({ where: { gabClinicId }, select: { email: true } }),
    ]);
    if (channel === "sms") {
      const phone = formData.get("target")?.toString()?.trim() || clinic?.phone?.trim();
      if (!phone) return { ok: false, error: "Podaj numer telefonu do testu." };
      const sent = await sendGabSms(phone, body);
      await db.gabClientMessage.create({
        data: {
          gabClinicId,
          channel: "sms",
          body: `${body} → ${phone}`,
          status: sent ? "sent" : "failed",
          subject: "Test SMS",
        },
      });
      return sent ? { ok: true } : { ok: false, error: "Wysyłka SMS nie powiodła się (sprawdź logi / SMSAPI)." };
    }
    const email = formData.get("target")?.toString()?.trim() || account?.email || clinic?.email?.trim();
    if (!email) return { ok: false, error: "Podaj adres e-mail do testu." };
    const sent = await sendGabPatientReminderEmail(email, {
      clinicName: clinic?.name ?? "Gabinet",
      patientName: "Test",
      subject: "Test powiadomień GabinetHarmonogram",
      message: body,
    });
    await db.gabClientMessage.create({
      data: {
        gabClinicId,
        channel: "email",
        body: `${body} → ${email}`,
        status: sent ? "sent" : "failed",
        subject: "Test e-mail",
      },
    });
    return sent ? { ok: true } : { ok: false, error: "Wysyłka e-mail nie powiodła się (sprawdź SMTP)." };
  } catch {
    return { ok: false, error: "Nie udało się wysłać testu." };
  }
}

export async function uploadGabClinicLogoAction(formData: FormData): Promise<GabSettingsResult & { logoUrl?: string }> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Wybierz plik logo." };
  const { saveGabClinicLogoFile, deleteGabClinicLogoFile } = await import("@/lib/gabinet/clinicLogo");
  try {
    const clinic = await gabPrisma().gabClinic.findUnique({ where: { id: gabClinicId }, select: { logoUrl: true } });
    const saved = await saveGabClinicLogoFile(gabClinicId, file);
    if ("error" in saved) return { ok: false, error: saved.error };
    if (clinic?.logoUrl?.startsWith("/uploads/gabinet/logos/")) {
      await deleteGabClinicLogoFile(clinic.logoUrl);
    }
    await gabPrisma().gabClinic.update({ where: { id: gabClinicId }, data: { logoUrl: saved.url } });
    return { ok: true, logoUrl: saved.url };
  } catch {
    return { ok: false, error: "Nie udało się przesłać logo." };
  }
}

export async function resendGabPatientVerificationByEmailAction(formData: FormData): Promise<GabAuthResult> {
  const email = formData.get("email")?.toString()?.trim().toLowerCase();
  if (!email) return { ok: false, error: "Podaj adres e-mail." };
  try {
    const account = await getPrisma().gabPatientAccount.findUnique({ where: { email } });
    if (!account) return { ok: true };
    if (account.emailVerifiedAt) return { ok: false, error: "Ten adres jest już potwierdzony — możesz się zalogować." };
    const token = crypto.randomBytes(32).toString("hex");
    await getPrisma().gabPatientAccount.update({
      where: { id: account.id },
      data: {
        verificationToken: token,
        verificationTokenExpires: new Date(Date.now() + VERIFY_EXPIRES_MS),
      },
    });
    const sent = await sendGabPatientVerificationEmail(account.email, token, getRequestHost());
    if (!sent) return { ok: false, error: "Nie udało się wysłać maila (sprawdź SMTP)." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Błąd wysyłki." };
  }
}

export async function checkGabPatientLoginAction(
  email: string,
  password: string
): Promise<{ status: "ok" | "invalid" | "unverified" }> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) return { status: "invalid" };
  try {
    const account = await getPrisma().gabPatientAccount.findUnique({ where: { email: normalized } });
    if (!account) return { status: "invalid" };
    if (!(await bcrypt.compare(password, account.passwordHash))) return { status: "invalid" };
    if (!account.emailVerifiedAt && process.env.GAB_AUTO_VERIFY !== "true") return { status: "unverified" };
    return { status: "ok" };
  } catch {
    return { status: "invalid" };
  }
}

export async function getGabPatientCalendarFeedUrlAction(): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const accountId = await requireGabPatientAccountId();
  if (!accountId) return { ok: false, error: "Zaloguj się jako pacjent." };
  try {
    const { ensureGabPatientCalendarToken } = await import("@/lib/gabinet/patientCalendar");
    const token = await ensureGabPatientCalendarToken(accountId);
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    return { ok: true, url: `${base}/api/gabinet/klient/ical?token=${encodeURIComponent(token)}` };
  } catch {
    return { ok: false, error: "Nie udało się wygenerować kalendarza." };
  }
}

async function requireGabClinicOwnerId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== GAB_CLINIC_ROLE) return null;
  if ((session?.user as { gabMemberId?: string })?.gabMemberId) return null;
  return (session?.user as { gabClinicId?: string })?.gabClinicId ?? null;
}

export async function addGabClinicMemberAction(formData: FormData): Promise<GabSettingsResult & { memberId?: string }> {
  const gabClinicId = await requireGabClinicOwnerId();
  if (!gabClinicId) return { ok: false, error: "Tylko właściciel gabinetu może dodawać konta zespołu." };
  const name = formData.get("name")?.toString()?.trim();
  const email = formData.get("email")?.toString()?.trim().toLowerCase();
  const password = formData.get("password")?.toString() ?? "";
  const role = formData.get("role")?.toString()?.trim() || "reception";
  if (!name || !email) return { ok: false, error: "Imię i e-mail są wymagane." };
  if (password.length < 10) return { ok: false, error: "Hasło: min. 10 znaków." };
  if (!["reception", "admin"].includes(role)) return { ok: false, error: "Nieprawidłowa rola." };
  try {
    const db = getPrisma();
    const owner = await db.gabClinicAccount.findFirst({ where: { gabClinicId }, select: { email: true } });
    if (owner?.email === email) return { ok: false, error: "Ten e-mail należy do konta właściciela." };
    const hash = await bcrypt.hash(password, 10);
    const member = await db.gabClinicMember.create({
      data: { gabClinicId, name, email, passwordHash: hash, role, active: true },
    });
    return { ok: true, memberId: member.id };
  } catch {
    return { ok: false, error: "Nie udało się dodać użytkownika (e-mail może być zajęty)." };
  }
}

export async function removeGabClinicMemberAction(memberId: string): Promise<GabSettingsResult> {
  const gabClinicId = await requireGabClinicOwnerId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    await getPrisma().gabClinicMember.deleteMany({ where: { id: memberId, gabClinicId } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się usunąć użytkownika." };
  }
}
