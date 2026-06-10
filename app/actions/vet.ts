"use server";

import bcrypt from "bcrypt";
import crypto from "crypto";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { tryConsume } from "@/lib/rateLimit";
import { getAllowedCities } from "@/lib/voivodeships";
import {
  sendVetClinicVerificationEmail,
  sendVetPasswordResetEmail,
} from "@/lib/email";
import type { WorkingHoursDay } from "@/lib/vet/schema";

const slugRegex = /^[a-z0-9-]{3,}$/;
const VERIFY_EXPIRES_MS = 24 * 60 * 60 * 1000;
const RESET_EXPIRES_MS = 60 * 60 * 1000;
const MIN_PASSWORD_LENGTH = 10;

export type VetRegisterResult =
  | { ok: true; slug: string; emailSent: boolean; needsEmailVerification: boolean }
  | { ok: false; error: string };
export type VetActionResult = { ok: true } | { ok: false; error: string };
export type RecordVaccinationResult =
  | {
      ok: true;
      vaccineName: string;
      nextDueAt: string;
      remindersScheduled: number;
      smsEnabled: boolean;
      emailEnabled: boolean;
    }
  | { ok: false; error: string };
export type VetUpdateClinicResult = { ok: true; slug: string } | { ok: false; error: string };

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10, "Hasło musi mieć min. 10 znaków"),
  slug: z.string().regex(slugRegex, "Slug: małe litery, cyfry, myślniki (min. 3 znaki)"),
  name: z.string().min(1, "Nazwa jest wymagana"),
  city: z.string().min(1, "Miasto jest wymagane"),
});

async function requireVetClinicId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  if (role !== VET_CLINIC_ROLE) return null;
  return (session?.user as { vetClinicId?: string })?.vetClinicId ?? null;
}

export async function registerVetClinic(formData: FormData): Promise<VetRegisterResult> {
  const raw = {
    email: formData.get("email")?.toString()?.trim(),
    password: formData.get("password")?.toString(),
    slug: formData.get("slug")?.toString()?.trim()?.toLowerCase(),
    name: formData.get("name")?.toString()?.trim(),
    city: formData.get("city")?.toString()?.trim(),
  };
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const msg =
      parsed.error.flatten().fieldErrors?.password?.[0] ??
      parsed.error.flatten().fieldErrors?.slug?.[0] ??
      parsed.error.message;
    return { ok: false, error: String(msg) };
  }
  const { email, password, slug, name, city } = parsed.data;
  const allowedCities = new Set(getAllowedCities());
  if (!allowedCities.has(city)) {
    return { ok: false, error: "Wybierz miasto z listy." };
  }
  const emailNorm = email.trim().toLowerCase();
  if (!tryConsume("vet-register:" + emailNorm, 5, 60 * 60 * 1000)) {
    return { ok: false, error: "Zbyt wiele prób rejestracji. Spróbuj za godzinę." };
  }
  try {
    const prisma = getPrisma();
    if (await prisma.vetClinic.findUnique({ where: { slug } })) {
      return { ok: false, error: "Ten adres profilu jest już zajęty." };
    }
    if (await prisma.vetClinicAccount.findUnique({ where: { email: emailNorm } })) {
      return {
        ok: false,
        error:
          "Konto z tym adresem e-mail już istnieje. Zaloguj się lub użyj „Zapomniałem hasła” na stronie logowania.",
      };
    }
    const hash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + VERIFY_EXPIRES_MS);
    const defaultHours: WorkingHoursDay[] = Array(7)
      .fill(null)
      .map(() => ({ open: "08:00", close: "18:00" }));
    const clinic = await prisma.vetClinic.create({
      data: {
        slug,
        name,
        city,
        description: "",
        workingHours: JSON.stringify(defaultHours),
        noOrderDays: "[]",
        isPublished: false,
        onboardingStep: 0,
      },
    });
    const autoVerify = process.env.VET_AUTO_VERIFY === "true";
    await prisma.vetClinicAccount.create({
      data: {
        email: emailNorm,
        passwordHash: hash,
        vetClinicId: clinic.id,
        verificationToken: autoVerify ? null : verificationToken,
        verificationTokenExpires: autoVerify ? null : verificationTokenExpires,
        emailVerifiedAt: autoVerify ? new Date() : null,
      },
    });
    await prisma.vetDoctor.create({
      data: { vetClinicId: clinic.id, name: "Lekarz weterynarii", order: 0 },
    });
    const defaults = [
      { name: "Wścieklizna", defaultIntervalDays: 365 },
      { name: "Nosówka", defaultIntervalDays: 365 },
      { name: "Kaszoch", defaultIntervalDays: 365 },
    ];
    for (let i = 0; i < defaults.length; i++) {
      await prisma.vaccineType.create({
        data: { vetClinicId: clinic.id, ...defaults[i], order: i },
      });
    }
    let emailSent = false;
    if (!autoVerify) {
      emailSent = await sendVetClinicVerificationEmail(emailNorm, verificationToken);
    }
    return {
      ok: true,
      slug,
      emailSent,
      needsEmailVerification: !autoVerify,
    };
  } catch (e) {
    console.error("registerVetClinic:", e);
    return { ok: false, error: "Nie udało się utworzyć konta." };
  }
}

/** Ponowna wysyłka linku weryfikacyjnego (gdy konto nieaktywne). */
export async function resendVetVerificationEmailAction(email: string): Promise<VetActionResult> {
  const emailNorm = email.trim().toLowerCase();
  if (!emailNorm || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
    return { ok: false, error: "Podaj prawidłowy adres e-mail." };
  }
  if (!tryConsume("vet-resend-verify:" + emailNorm, 3, 60 * 60 * 1000)) {
    return { ok: false, error: "Zbyt wiele prób. Spróbuj za godzinę." };
  }
  try {
    const prisma = getPrisma();
    const account = await prisma.vetClinicAccount.findUnique({ where: { email: emailNorm } });
    if (!account) {
      return { ok: true };
    }
    if (account.emailVerifiedAt) {
      return {
        ok: false,
        error: "Konto jest już aktywne. Zaloguj się lub użyj „Zapomniałem hasła”.",
      };
    }
    const verificationToken = crypto.randomBytes(32).toString("hex");
    await prisma.vetClinicAccount.update({
      where: { id: account.id },
      data: {
        verificationToken,
        verificationTokenExpires: new Date(Date.now() + VERIFY_EXPIRES_MS),
      },
    });
    const sent = await sendVetClinicVerificationEmail(emailNorm, verificationToken);
    if (!sent) {
      return { ok: false, error: "Nie udało się wysłać maila. Napisz na biuro@odart.pl." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Błąd wysyłki." };
  }
}

/** Link do ustawienia nowego hasła (token w verificationToken). */
export async function requestVetPasswordResetAction(email: string): Promise<VetActionResult> {
  const emailNorm = email.trim().toLowerCase();
  if (!emailNorm || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
    return { ok: false, error: "Podaj prawidłowy adres e-mail." };
  }
  if (!tryConsume("vet-reset:" + emailNorm, 5, 60 * 60 * 1000)) {
    return { ok: false, error: "Zbyt wiele prób. Spróbuj za godzinę." };
  }
  try {
    const prisma = getPrisma();
    const account = await prisma.vetClinicAccount.findUnique({ where: { email: emailNorm } });
    if (!account) {
      return { ok: true };
    }
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.vetClinicAccount.update({
      where: { id: account.id },
      data: {
        verificationToken: token,
        verificationTokenExpires: new Date(Date.now() + RESET_EXPIRES_MS),
      },
    });
    await sendVetPasswordResetEmail(emailNorm, token);
    return { ok: true };
  } catch (e) {
    console.error("requestVetPasswordResetAction:", e);
    return { ok: false, error: "Błąd wysyłki." };
  }
}

export async function resetVetPasswordAction(
  token: string,
  password: string
): Promise<VetActionResult> {
  if (!token?.trim()) return { ok: false, error: "Brak tokenu." };
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, error: `Hasło musi mieć min. ${MIN_PASSWORD_LENGTH} znaków.` };
  }
  try {
    const prisma = getPrisma();
    const account = await prisma.vetClinicAccount.findFirst({
      where: {
        verificationToken: token.trim(),
        verificationTokenExpires: { gt: new Date() },
      },
    });
    if (!account) return { ok: false, error: "Link wygasł lub jest nieprawidłowy." };
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.vetClinicAccount.update({
      where: { id: account.id },
      data: {
        passwordHash,
        verificationToken: null,
        verificationTokenExpires: null,
        emailVerifiedAt: account.emailVerifiedAt ?? new Date(),
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się ustawić hasła." };
  }
}

export async function verifyVetClinicEmail(token: string): Promise<VetActionResult> {
  if (!token?.trim()) return { ok: false, error: "Brak tokenu." };
  try {
    const prisma = getPrisma();
    const account = await prisma.vetClinicAccount.findFirst({
      where: {
        verificationToken: token.trim(),
        verificationTokenExpires: { gt: new Date() },
      },
    });
    if (!account) return { ok: false, error: "Link wygasł lub jest nieprawidłowy." };
    await prisma.vetClinicAccount.update({
      where: { id: account.id },
      data: {
        emailVerifiedAt: new Date(),
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Błąd weryfikacji." };
  }
}

export async function updateVetClinicWorkingHoursAction(
  hours: WorkingHoursDay[]
): Promise<VetActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };
  if (!Array.isArray(hours) || hours.length !== 7) {
    return { ok: false, error: "Nieprawidłowe godziny pracy." };
  }
  try {
    const prisma = getPrisma();
    await prisma.vetClinic.update({
      where: { id: vetClinicId },
      data: { workingHours: JSON.stringify(hours) },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zapisać." };
  }
}

export async function updateVetNoOrderDaysAction(days: string[]): Promise<VetActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };
  const clean = Array.from(
    new Set(days.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)))
  ).sort();
  try {
    const prisma = getPrisma();
    await prisma.vetClinic.update({
      where: { id: vetClinicId },
      data: { noOrderDays: JSON.stringify(clean) },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zapisać." };
  }
}

export async function updateVetClinicProfileAction(formData: FormData): Promise<VetUpdateClinicResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };
  const name = formData.get("name")?.toString()?.trim();
  const description = formData.get("description")?.toString()?.trim() ?? "";
  const address = formData.get("address")?.toString()?.trim() || null;
  const phone = formData.get("phone")?.toString()?.trim() || null;
  const email = formData.get("email")?.toString()?.trim() || null;
  const isPublished = formData.get("isPublished") === "true";
  if (!name) return { ok: false, error: "Nazwa jest wymagana." };
  try {
    const prisma = getPrisma();
    const updated = await prisma.vetClinic.update({
      where: { id: vetClinicId },
      data: { name, description, address, phone, email, isPublished },
    });
    return { ok: true, slug: updated.slug };
  } catch {
    return { ok: false, error: "Nie udało się zapisać." };
  }
}

export async function addVetDoctorAction(name: string): Promise<VetActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "Podaj imię i nazwisko." };
  try {
    const prisma = getPrisma();
    const count = await prisma.vetDoctor.count({ where: { vetClinicId } });
    await prisma.vetDoctor.create({
      data: { vetClinicId, name: trimmed, order: count },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się dodać lekarza." };
  }
}

export async function addPetOwnerAction(formData: FormData): Promise<VetActionResult & { ownerId?: string }> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };
  const ownerName = formData.get("ownerName")?.toString()?.trim();
  const phone = formData.get("phone")?.toString()?.trim();
  const petName = formData.get("petName")?.toString()?.trim();
  const species = formData.get("species")?.toString()?.trim() || "pies";
  if (!ownerName || !phone || !petName) {
    return { ok: false, error: "Właściciel, telefon i imię zwierzęcia są wymagane." };
  }
  try {
    const prisma = getPrisma();
    const owner = await prisma.petOwner.create({
      data: {
        vetClinicId,
        name: ownerName,
        phone,
        email: formData.get("email")?.toString()?.trim() || null,
        smsConsent: formData.get("smsConsent") !== "false",
      },
    });
    await prisma.pet.create({
      data: { ownerId: owner.id, name: petName, species },
    });
    return { ok: true, ownerId: owner.id };
  } catch {
    return { ok: false, error: "Nie udało się dodać pacjenta." };
  }
}

export async function recordVaccinationAction(formData: FormData): Promise<RecordVaccinationResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };
  const petId = formData.get("petId")?.toString()?.trim();
  const vaccineTypeId = formData.get("vaccineTypeId")?.toString()?.trim();
  const dateStr = formData.get("administeredAt")?.toString()?.trim();
  if (!petId || !vaccineTypeId || !dateStr) {
    return { ok: false, error: "Wybierz zwierzę, szczep i datę." };
  }
  const administeredAt = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(administeredAt.getTime())) {
    return { ok: false, error: "Nieprawidłowa data." };
  }
  try {
    const prisma = getPrisma();
    const pet = await prisma.pet.findFirst({
      where: { id: petId, owner: { vetClinicId } },
      include: { owner: true },
    });
    const vaccineType = await prisma.vaccineType.findFirst({
      where: { id: vaccineTypeId, vetClinicId },
    });
    if (!pet || !vaccineType) return { ok: false, error: "Nie znaleziono danych." };
    if (vaccineType.trackStock && vaccineType.stockDoses != null && vaccineType.stockDoses <= 0) {
      return { ok: false, error: `Brak dawek preparatu „${vaccineType.name}” w katalogu.` };
    }
    const nextDueAt = new Date(administeredAt);
    nextDueAt.setDate(nextDueAt.getDate() + vaccineType.defaultIntervalDays);
    await prisma.vaccination.create({
      data: {
        petId,
        vaccineTypeId,
        administeredAt,
        nextDueAt,
        batchNumber: formData.get("batchNumber")?.toString()?.trim() || null,
        batchExpiryDate: formData.get("batchExpiryDate")?.toString()?.trim() || null,
        vetName: formData.get("vetName")?.toString()?.trim() || null,
      },
    });

    if (vaccineType.trackStock && vaccineType.stockDoses != null && vaccineType.stockDoses > 0) {
      await prisma.vaccineType.update({
        where: { id: vaccineTypeId },
        data: { stockDoses: vaccineType.stockDoses - 1 },
      });
    }

    const ownerId = pet.ownerId;
    const owner = pet.owner;
    const reminders = [
      { daysBefore: 30, msg: `Za miesiąc termin szczepienia (${vaccineType.name}) dla ${pet.name}.` },
      { daysBefore: 7, msg: `Za tydzień termin szczepienia (${vaccineType.name}) dla ${pet.name}.` },
      { daysBefore: 0, msg: `Dziś termin szczepienia (${vaccineType.name}) dla ${pet.name}. Umów wizytę.` },
    ];
    let remindersScheduled = 0;
    for (const r of reminders) {
      const sendAt = new Date(nextDueAt);
      sendAt.setDate(sendAt.getDate() - r.daysBefore);
      if (sendAt.getTime() > Date.now()) {
        const base = {
          vetClinicId,
          ownerId,
          petId,
          kind: "vaccination" as const,
          sendAt,
          message: r.msg,
          itemKey: `vaccination:${vaccineTypeId}:${r.daysBefore}`,
        };
        if (owner.smsConsent && owner.phone?.trim()) {
          await prisma.vetScheduledReminder.create({
            data: { ...base, channel: "sms" },
          });
          remindersScheduled++;
        }
        if (owner.emailConsent && owner.email?.trim()) {
          await prisma.vetScheduledReminder.create({
            data: { ...base, channel: "email" },
          });
          remindersScheduled++;
        }
      }
    }

    const { syncPreventionRemindersForPet } = await import("@/lib/vet/preventionReminders");
    await syncPreventionRemindersForPet(petId);

    return {
      ok: true,
      vaccineName: vaccineType.name,
      nextDueAt: nextDueAt.toISOString(),
      remindersScheduled,
      smsEnabled: !!(owner.smsConsent && owner.phone?.trim()),
      emailEnabled: !!(owner.emailConsent && owner.email?.trim()),
    };
  } catch (e) {
    console.error("recordVaccinationAction:", e);
    return { ok: false, error: "Nie udało się zapisać szczepienia." };
  }
}
