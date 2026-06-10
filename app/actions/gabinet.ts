"use server";

import bcrypt from "bcrypt";
import crypto from "crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GAB_CLINIC_ROLE, GAB_PATIENT_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { gabPrisma } from "@/lib/gabinet/prismaGab";
import { isValidFdiTooth } from "@/lib/gabinet/fdiTeeth";
import { sendGabSms } from "@/lib/gabinet/gabNotify";
import { gabPatientPlanUrl } from "@/lib/gabinet/portalUrl";
import { GABINET_VERTICALS, getGabinetVerticalFromHost } from "@/lib/gabinetPlatform/verticals";
import {
  sendGabClinicVerificationEmail,
  sendGabPatientVerificationEmail,
  sendGabTreatmentPlanPresentedEmail,
} from "@/lib/email";
import { tryConsume } from "@/lib/rateLimit";
import { getAllowedCities } from "@/lib/voivodeships";

export type GabActionResult = { ok: true } | { ok: false; error: string };
export type GabRegisterResult =
  | { ok: true; slug: string }
  | { ok: false; error: string };

const slugRegex = /^[a-z0-9-]{3,}$/;
const VERIFY_EXPIRES_MS = 24 * 60 * 60 * 1000;
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10, "Hasło musi mieć min. 10 znaków"),
  slug: z.string().regex(slugRegex, "Slug: małe litery, cyfry, myślniki (min. 3 znaki)"),
  name: z.string().min(1, "Nazwa jest wymagana"),
  city: z.string().min(1, "Miasto jest wymagane"),
});

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

export async function registerGabClinic(formData: FormData): Promise<GabRegisterResult> {
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
  if (!getAllowedCities().includes(city)) {
    return { ok: false, error: "Wybierz miasto z listy." };
  }
  const emailNorm = email.trim().toLowerCase();
  if (!tryConsume("gab-register:" + emailNorm, 5, 60 * 60 * 1000)) {
    return { ok: false, error: "Zbyt wiele prób rejestracji. Spróbuj za godzinę." };
  }
  try {
    const prisma = gabPrisma();
    if (await prisma.gabClinic.findUnique({ where: { slug } })) {
      return { ok: false, error: "Ten adres profilu jest już zajęty." };
    }
    if (await prisma.gabClinicAccount.findUnique({ where: { email: emailNorm } })) {
      return { ok: false, error: "Konto z tym adresem e-mail już istnieje." };
    }
    const hash = await bcrypt.hash(password, 10);
    const autoVerify = process.env.GAB_AUTO_VERIFY === "true";
    const verificationToken = autoVerify ? null : crypto.randomBytes(32).toString("hex");
    const defaultHours = JSON.stringify(
      Array(7)
        .fill(null)
        .map(() => ({ open: "08:00", close: "18:00" }))
    );
    const clinic = await prisma.gabClinic.create({
      data: {
        slug,
        name,
        city,
        description: "",
        workingHours: defaultHours,
        noOrderDays: "[]",
        isPublished: false,
        vertical: getGabinetVerticalFromHost((await headers()).get("host") ?? ""),
      },
    });
    await prisma.gabClinicAccount.create({
      data: {
        email: emailNorm,
        passwordHash: hash,
        gabClinicId: clinic.id,
        emailVerifiedAt: autoVerify ? new Date() : null,
        verificationToken: autoVerify ? null : verificationToken,
        verificationTokenExpires: autoVerify ? null : new Date(Date.now() + VERIFY_EXPIRES_MS),
      },
    });
    const db = getPrisma();
    await db.gabStaff.create({
      data: {
        gabClinicId: clinic.id,
        name: "Lekarz / specjalista",
        role: "doctor",
        order: 0,
        active: true,
      },
    });
    for (const preset of GABINET_VERTICALS[getGabinetVerticalFromHost((await headers()).get("host") ?? "")].recallPresets) {
      await db.gabRecallRule.create({
        data: {
          gabClinicId: clinic.id,
          name: preset.name,
          visitType: preset.visitType,
          intervalDays: preset.intervalDays,
          channel: "sms",
          messageTemplate: `{pacjent}, zapraszamy na ${preset.name.toLowerCase()} — {gabinet}.`,
          active: true,
        },
      });
    }
    const host = (await headers()).get("host") ?? "";
    if (!autoVerify && verificationToken) {
      await sendGabClinicVerificationEmail(emailNorm, verificationToken, host);
    }
    return { ok: true, slug };
  } catch (e) {
    console.error("registerGabClinic:", e);
    return { ok: false, error: "Nie udało się utworzyć konta. (Sprawdź migrację modeli Gab*)" };
  }
}

export async function updateGabClinicProfileAction(formData: FormData): Promise<GabActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const name = formData.get("name")?.toString()?.trim();
  const description = formData.get("description")?.toString()?.trim() ?? "";
  const address = formData.get("address")?.toString()?.trim() ?? "";
  const phone = formData.get("phone")?.toString()?.trim() ?? "";
  const email = formData.get("email")?.toString()?.trim() || null;
  const isPublished = formData.get("isPublished") === "true";
  if (!name) return { ok: false, error: "Nazwa jest wymagana." };
  try {
    const prisma = gabPrisma();
    await prisma.gabClinic.update({
      where: { id: gabClinicId },
      data: { name, description, address, phone, email, isPublished },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zapisać profilu." };
  }
}

export async function addGabPatientAction(
  formData: FormData
): Promise<GabActionResult & { patientId?: string }> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const name = formData.get("name")?.toString()?.trim();
  const phone = formData.get("phone")?.toString()?.trim();
  const email = formData.get("email")?.toString()?.trim() || null;
  const pesel = formData.get("pesel")?.toString()?.trim() || null;
  const notes = formData.get("notes")?.toString()?.trim() || null;
  const smsConsent = formData.get("smsConsent") !== "false";
  if (!name || !phone) return { ok: false, error: "Imię i telefon są wymagane." };
  try {
    const patient = await gabPrisma().gabPatient.create({
      data: { gabClinicId, name, phone, email, pesel, notes, smsConsent, status: "active" },
    });
    return { ok: true, patientId: patient.id };
  } catch {
    return { ok: false, error: "Nie udało się dodać pacjenta." };
  }
}

export async function updateGabPatientAction(formData: FormData): Promise<GabActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const id = formData.get("id")?.toString()?.trim();
  if (!id) return { ok: false, error: "Brak identyfikatora." };
  const name = formData.get("name")?.toString()?.trim();
  const phone = formData.get("phone")?.toString()?.trim();
  const email = formData.get("email")?.toString()?.trim() || null;
  const pesel = formData.get("pesel")?.toString()?.trim() || null;
  const notes = formData.get("notes")?.toString()?.trim() || null;
  const smsConsent = formData.get("smsConsent") !== "false";
  const emailConsent = formData.get("emailConsent") !== "false";
  if (!name || !phone) return { ok: false, error: "Imię i telefon są wymagane." };
  try {
    const existing = await gabPrisma().gabPatient.findFirst({ where: { id, gabClinicId } });
    if (!existing) return { ok: false, error: "Nie znaleziono pacjenta." };
    await gabPrisma().gabPatient.update({
      where: { id },
      data: { name, phone, email, pesel, notes, smsConsent, emailConsent },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zaktualizować pacjenta." };
  }
}

export async function addGabAppointmentAction(formData: FormData): Promise<GabActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const patientId = formData.get("patientId")?.toString()?.trim() || null;
  const date = formData.get("date")?.toString()?.trim();
  const time = formData.get("time")?.toString()?.trim() || "09:00";
  const visitType = formData.get("visitType")?.toString()?.trim() || "konsultacja";
  if (!date) return { ok: false, error: "Data wizyty jest wymagana." };
  try {
    if (patientId) {
      const patient = await gabPrisma().gabPatient.findFirst({ where: { id: patientId, gabClinicId } });
      if (!patient) return { ok: false, error: "Nie znaleziono pacjenta." };
    }
    await gabPrisma().gabAppointment.create({
      data: {
        gabClinicId,
        patientId,
        date,
        time,
        visitType,
        status: "planned",
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zapisać wizyty." };
  }
}

export async function registerGabPatientAccountAction(formData: FormData): Promise<GabActionResult> {
  const email = formData.get("email")?.toString()?.trim().toLowerCase();
  const password = formData.get("password")?.toString();
  const name = formData.get("name")?.toString()?.trim();
  const phone = formData.get("phone")?.toString()?.trim() || "000000000";
  if (!email || !password || password.length < 10) {
    return { ok: false, error: "E-mail i hasło (min. 10 znaków) są wymagane." };
  }
  if (!name) return { ok: false, error: "Imię jest wymagane." };
  try {
    const prisma = getPrisma();
    if (await prisma.gabPatientAccount.findUnique({ where: { email } })) {
      return { ok: false, error: "Konto z tym e-mailem już istnieje." };
    }
    const hash = await bcrypt.hash(password, 10);
    const autoVerify = process.env.GAB_AUTO_VERIFY === "true";
    const verificationToken = autoVerify ? null : crypto.randomBytes(32).toString("hex");
    await prisma.gabPatientAccount.create({
      data: {
        email,
        passwordHash: hash,
        name,
        phone,
        emailVerifiedAt: autoVerify ? new Date() : null,
        verificationToken: autoVerify ? null : verificationToken,
        verificationTokenExpires: autoVerify ? null : new Date(Date.now() + VERIFY_EXPIRES_MS),
      },
    });
    if (!autoVerify && verificationToken) {
      const host = (await headers()).get("host") ?? "";
      await sendGabPatientVerificationEmail(email, verificationToken, host);
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się utworzyć konta pacjenta." };
  }
}

export async function saveGabRecallRuleAction(formData: FormData): Promise<GabActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const id = formData.get("id")?.toString()?.trim();
  const name = formData.get("name")?.toString()?.trim();
  const visitType = formData.get("visitType")?.toString()?.trim() || "konsultacja";
  const intervalDays = parseInt(formData.get("intervalDays")?.toString() ?? "", 10);
  const channel = formData.get("channel")?.toString() === "email" ? "email" : "sms";
  const messageTemplate = formData.get("messageTemplate")?.toString()?.trim() || "";
  const active = formData.get("active") !== "false";
  if (!name || Number.isNaN(intervalDays) || intervalDays < 1) {
    return { ok: false, error: "Nazwa i interwał (dni) są wymagane." };
  }
  try {
    const db = getPrisma();
    if (id) {
      const existing = await db.gabRecallRule.findFirst({ where: { id, gabClinicId } });
      if (!existing) return { ok: false, error: "Nie znaleziono reguły." };
      await db.gabRecallRule.update({
        where: { id },
        data: { name, visitType, intervalDays, channel, messageTemplate, active },
      });
    } else {
      await db.gabRecallRule.create({
        data: { gabClinicId, name, visitType, intervalDays, channel, messageTemplate, active },
      });
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zapisać reguły recall." };
  }
}

export async function deleteGabRecallRuleAction(id: string): Promise<GabActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    await getPrisma().gabRecallRule.deleteMany({ where: { id, gabClinicId } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się usunąć reguły." };
  }
}

export async function saveGabTreatmentPlanAction(
  formData: FormData
): Promise<GabActionResult & { planId?: string }> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const patientId = formData.get("patientId")?.toString()?.trim();
  const title = formData.get("title")?.toString()?.trim();
  const notes = formData.get("notes")?.toString()?.trim() || null;
  if (!patientId || !title) return { ok: false, error: "Pacjent i tytuł są wymagane." };
  try {
    const db = getPrisma();
    const patient = await db.gabPatient.findFirst({ where: { id: patientId, gabClinicId } });
    if (!patient) return { ok: false, error: "Nie znaleziono pacjenta." };
    const plan = await db.gabTreatmentPlan.create({
      data: { gabClinicId, patientId, title, notes, status: "draft" },
    });
    return { ok: true, planId: plan.id };
  } catch {
    return { ok: false, error: "Nie udało się utworzyć planu leczenia." };
  }
}

async function recalcPlanTotal(planId: string, gabClinicId: string) {
  const db = getPrisma();
  const items = await db.gabTreatmentPlanItem.findMany({ where: { planId } });
  const total = items.reduce((s, i) => s + i.pricePln, 0);
  await db.gabTreatmentPlan.updateMany({
    where: { id: planId, gabClinicId },
    data: { totalPln: total },
  });
}

export async function saveGabTreatmentPlanItemAction(formData: FormData): Promise<GabActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const planId = formData.get("planId")?.toString()?.trim();
  const title = formData.get("title")?.toString()?.trim();
  const toothFdi = formData.get("toothFdi")?.toString()?.trim() || null;
  const pricePln = parseFloat(formData.get("pricePln")?.toString() ?? "0");
  const status = formData.get("status")?.toString()?.trim() || "planned";
  if (!planId || !title) return { ok: false, error: "Plan i tytuł etapu są wymagane." };
  if (!isValidFdiTooth(toothFdi)) return { ok: false, error: "Nieprawidłowy numer zęba FDI." };
  try {
    const db = getPrisma();
    const plan = await db.gabTreatmentPlan.findFirst({ where: { id: planId, gabClinicId } });
    if (!plan) return { ok: false, error: "Nie znaleziono planu." };
    const maxOrder = await db.gabTreatmentPlanItem.aggregate({
      where: { planId },
      _max: { sortOrder: true },
    });
    await db.gabTreatmentPlanItem.create({
      data: {
        planId,
        title,
        toothFdi,
        pricePln: Number.isNaN(pricePln) ? 0 : pricePln,
        status,
        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      },
    });
    await recalcPlanTotal(planId, gabClinicId);
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się dodać etapu." };
  }
}

export async function updateGabTreatmentPlanItemAction(formData: FormData): Promise<GabActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const id = formData.get("id")?.toString()?.trim();
  const planId = formData.get("planId")?.toString()?.trim();
  const status = formData.get("status")?.toString()?.trim();
  if (!id || !planId || !status) return { ok: false, error: "Brak danych." };
  try {
    const db = getPrisma();
    const plan = await db.gabTreatmentPlan.findFirst({ where: { id: planId, gabClinicId } });
    if (!plan) return { ok: false, error: "Nie znaleziono planu." };
    await db.gabTreatmentPlanItem.updateMany({ where: { id, planId }, data: { status } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zaktualizować etapu." };
  }
}

export async function deleteGabTreatmentPlanItemAction(id: string, planId: string): Promise<GabActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    const db = getPrisma();
    const plan = await db.gabTreatmentPlan.findFirst({ where: { id: planId, gabClinicId } });
    if (!plan) return { ok: false, error: "Nie znaleziono planu." };
    await db.gabTreatmentPlanItem.deleteMany({ where: { id, planId } });
    await recalcPlanTotal(planId, gabClinicId);
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się usunąć etapu." };
  }
}

export async function updateGabTreatmentPlanStatusAction(
  planId: string,
  status: string
): Promise<GabActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const allowed = [
    "draft",
    "pending_acceptance",
    "accepted",
    "rejected",
    "in_progress",
    "completed",
    "cancelled",
  ];
  if (!allowed.includes(status)) return { ok: false, error: "Nieprawidłowy status." };
  if (status === "pending_acceptance") {
    return { ok: false, error: "Użyj przycisku „Wyślij do akceptacji pacjenta”." };
  }
  try {
    const db = getPrisma();
    const data: {
      status: string;
      presentedAt?: null;
      acceptedAt?: null;
      patientResponseNote?: null;
    } = { status };
    if (status === "draft") {
      data.presentedAt = null;
      data.acceptedAt = null;
      data.patientResponseNote = null;
    }
    await db.gabTreatmentPlan.updateMany({
      where: { id: planId, gabClinicId },
      data,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zaktualizować statusu planu." };
  }
}

export async function presentGabTreatmentPlanAction(planId: string): Promise<GabActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    const db = getPrisma();
    const plan = await db.gabTreatmentPlan.findFirst({
      where: { id: planId, gabClinicId },
      include: {
        patient: {
          select: { accountId: true, name: true, phone: true, email: true, emailConsent: true, smsConsent: true },
        },
        gabClinic: { select: { name: true, phone: true, vertical: true } },
        items: { select: { id: true } },
      },
    });
    if (!plan) return { ok: false, error: "Nie znaleziono planu." };
    if (!["draft", "rejected"].includes(plan.status)) {
      return { ok: false, error: "Plan można wysłać tylko ze statusu szkic lub odrzucony." };
    }
    if (plan.items.length === 0) {
      return { ok: false, error: "Dodaj co najmniej jeden etap przed wysłaniem." };
    }
    if (!plan.patient.accountId) {
      return {
        ok: false,
        error: "Pacjent nie ma powiązanego konta w portalu — poproś go o rejestrację.",
      };
    }
    await db.gabTreatmentPlan.update({
      where: { id: planId },
      data: {
        status: "pending_acceptance",
        presentedAt: new Date(),
        acceptedAt: null,
        patientResponseNote: null,
      },
    });

    const host = (await headers()).get("host") ?? "";
    const vertical = plan.gabClinic.vertical;
    const brandName = GABINET_VERTICALS[vertical as keyof typeof GABINET_VERTICALS]?.brandName ?? "GabinetHarmonogram";
    const planUrl = gabPatientPlanUrl(planId, vertical, host);
    const account = plan.patient.accountId
      ? await db.gabPatientAccount.findUnique({
          where: { id: plan.patient.accountId },
          select: { email: true },
        })
      : null;
    const emailTo = account?.email ?? plan.patient.email;
    if (emailTo && plan.patient.emailConsent !== false) {
      await sendGabTreatmentPlanPresentedEmail(emailTo, {
        clinicName: plan.gabClinic.name,
        clinicPhone: plan.gabClinic.phone,
        patientName: plan.patient.name,
        planTitle: plan.title,
        totalPln: plan.totalPln,
        planUrl,
        brandName,
      });
    }
    if (plan.patient.smsConsent && plan.patient.phone?.trim()) {
      await sendGabSms(
        plan.patient.phone,
        `${plan.gabClinic.name}: plan leczenia "${plan.title}" czeka na akceptację. Portal: ${planUrl}`
      );
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się wysłać planu do akceptacji." };
  }
}

export async function acceptGabTreatmentPlanPatientAction(planId: string): Promise<GabActionResult> {
  const accountId = await requireGabPatientAccountId();
  if (!accountId) return { ok: false, error: "Zaloguj się jako pacjent." };
  try {
    const db = getPrisma();
    const plan = await db.gabTreatmentPlan.findFirst({
      where: { id: planId, status: "pending_acceptance", patient: { accountId } },
    });
    if (!plan) return { ok: false, error: "Plan nie jest dostępny do akceptacji." };
    await db.gabTreatmentPlan.update({
      where: { id: planId },
      data: { status: "accepted", acceptedAt: new Date() },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zaakceptować planu." };
  }
}

export async function rejectGabTreatmentPlanPatientAction(formData: FormData): Promise<GabActionResult> {
  const accountId = await requireGabPatientAccountId();
  if (!accountId) return { ok: false, error: "Zaloguj się jako pacjent." };
  const planId = formData.get("planId")?.toString()?.trim();
  const note = formData.get("note")?.toString()?.trim() || null;
  if (!planId) return { ok: false, error: "Brak identyfikatora planu." };
  try {
    const db = getPrisma();
    const plan = await db.gabTreatmentPlan.findFirst({
      where: { id: planId, status: "pending_acceptance", patient: { accountId } },
    });
    if (!plan) return { ok: false, error: "Plan nie jest dostępny do odrzucenia." };
    await db.gabTreatmentPlan.update({
      where: { id: planId },
      data: {
        status: "rejected",
        acceptedAt: null,
        patientResponseNote: note,
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się odrzucić planu." };
  }
}

export async function archiveGabPatientAction(patientId: string): Promise<GabActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    const patient = await gabPrisma().gabPatient.findFirst({ where: { id: patientId, gabClinicId } });
    if (!patient) return { ok: false, error: "Nie znaleziono pacjenta." };
    await gabPrisma().gabPatient.update({ where: { id: patientId }, data: { status: "archived" } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zarchiwizować pacjenta." };
  }
}

export async function restoreGabPatientAction(patientId: string): Promise<GabActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    const patient = await gabPrisma().gabPatient.findFirst({ where: { id: patientId, gabClinicId } });
    if (!patient) return { ok: false, error: "Nie znaleziono pacjenta." };
    await gabPrisma().gabPatient.update({ where: { id: patientId }, data: { status: "active" } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się przywrócić pacjenta." };
  }
}

export async function sendGabScheduledReminderNowAction(reminderId: string): Promise<GabActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const { dispatchGabScheduledReminder } = await import("@/lib/gabinet/recallReminders");
  const res = await dispatchGabScheduledReminder(reminderId, gabClinicId);
  return res.ok ? { ok: true } : { ok: false, error: res.error };
}

export async function updateGabTreatmentPlanTitleAction(planId: string, title: string): Promise<GabActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  const trimmed = title.trim();
  if (!trimmed) return { ok: false, error: "Tytuł jest wymagany." };
  try {
    const plan = await getPrisma().gabTreatmentPlan.findFirst({ where: { id: planId, gabClinicId } });
    if (!plan) return { ok: false, error: "Nie znaleziono planu." };
    await getPrisma().gabTreatmentPlan.update({ where: { id: planId }, data: { title: trimmed } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zapisać tytułu." };
  }
}

export async function deleteGabTreatmentPlanAction(planId: string): Promise<GabActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    const plan = await getPrisma().gabTreatmentPlan.findFirst({ where: { id: planId, gabClinicId } });
    if (!plan) return { ok: false, error: "Nie znaleziono planu." };
    if (plan.status === "in_progress") {
      return { ok: false, error: "Nie można usunąć planu w trakcie realizacji." };
    }
    await getPrisma().gabTreatmentPlan.delete({ where: { id: planId } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się usunąć planu." };
  }
}

export async function cancelGabAppointmentPatientAction(appointmentId: string): Promise<GabActionResult> {
  const accountId = await requireGabPatientAccountId();
  if (!accountId) return { ok: false, error: "Zaloguj się jako pacjent." };
  try {
    const db = getPrisma();
    const appt = await db.gabAppointment.findFirst({
      where: {
        id: appointmentId,
        status: { in: ["planned", "confirmed"] },
        patient: { accountId },
      },
    });
    if (!appt) return { ok: false, error: "Wizyta nie może być anulowana." };
    await db.gabAppointment.update({ where: { id: appointmentId }, data: { status: "cancelled" } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się anulować wizyty." };
  }
}
