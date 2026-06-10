"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import {
  DEFAULT_ALERT_POLICY,
  DEFAULT_PRICING_POLICY,
  VET_ONBOARDING_TOTAL,
  buildAddressLine,
  parseVetClinicSettings,
  type VetClinicSettings,
  type VetPackageId,
} from "@/lib/vet/onboarding";
import {
  firstFieldError,
  onboardingStep1Schema,
  zodToFieldErrors,
} from "@/lib/vet/onboardingValidation";

export type VetOnboardingResult =
  | { ok: true; step: number }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

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

export async function saveVetOnboardingStep1Action(formData: FormData): Promise<VetOnboardingResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const streetLine = formData.get("street")?.toString()?.trim() ?? "";
  const parsed = onboardingStep1Schema.safeParse({
    name: formData.get("name")?.toString()?.trim(),
    street: streetLine,
    postalCode: formData.get("postalCode")?.toString()?.trim(),
    city: formData.get("city")?.toString()?.trim(),
    email: formData.get("email")?.toString()?.trim(),
    phone: formData.get("phone")?.toString()?.trim(),
  });
  if (!parsed.success) {
    const fieldErrors = zodToFieldErrors(parsed.error);
    return {
      ok: false,
      error: firstFieldError(fieldErrors, "Uzupełnij wymagane pola."),
      fieldErrors,
    };
  }

  const { name, street, postalCode, city, email, phone } = parsed.data;
  const address = buildAddressLine({ street, houseNumber: null, postalCode, city });

  try {
    const prisma = getPrisma();
    await prisma.vetClinic.update({
      where: { id: vetClinicId },
      data: {
        name,
        street,
        houseNumber: null,
        apartmentNumber: null,
        postalCode,
        city,
        address,
        email,
        phone,
        onboardingStep: 1,
      },
    });
    return { ok: true, step: 1 };
  } catch {
    return { ok: false, error: "Nie udało się zapisać danych przychodni." };
  }
}

export async function saveVetOnboardingStep2Action(packageId: string): Promise<VetOnboardingResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };
  if (!["start", "standard", "pro"].includes(packageId)) {
    return { ok: false, error: "Wybierz plan." };
  }
  try {
    const prisma = getPrisma();
    const settings = await mergeSettings(vetClinicId, { package: packageId as VetPackageId });
    await prisma.vetClinic.update({
      where: { id: vetClinicId },
      data: { settingsJson: JSON.stringify(settings), onboardingStep: 2 },
    });
    return { ok: true, step: 2 };
  } catch {
    return { ok: false, error: "Nie udało się zapisać planu." };
  }
}

/** Krok 3: powiadomienia (wizyty, szczepienia, SMS/e-mail). */
export async function saveVetOnboardingStep3Action(formData: FormData): Promise<VetOnboardingResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const appointmentDays = formData
    .getAll("appointmentDays")
    .map((v) => parseInt(String(v), 10))
    .filter((n) => !Number.isNaN(n) && n >= 0);
  const vaccinationDays = formData
    .getAll("vaccinationDays")
    .map((v) => parseInt(String(v), 10))
    .filter((n) => !Number.isNaN(n) && n >= 0);
  const smsEnabled = formData.get("smsEnabled") === "true";
  const emailEnabled = formData.get("emailEnabled") === "true";

  const fieldErrors: Record<string, string> = {};
  if (appointmentDays.length === 0) {
    fieldErrors.appointmentDays = "Wybierz co najmniej jeden termin przypomnienia o wizycie.";
  }
  if (vaccinationDays.length === 0) {
    fieldErrors.vaccinationDays = "Wybierz co najmniej jeden termin przypomnienia o szczepieniu.";
  }
  if (!smsEnabled && !emailEnabled) {
    fieldErrors.channels = "Włącz co najmniej SMS lub e-mail.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      error: firstFieldError(fieldErrors, "Uzupełnij wymagane pola."),
      fieldErrors,
    };
  }

  try {
    const prisma = getPrisma();
    const settings = await mergeSettings(vetClinicId, {
      alertPolicy: {
        appointmentDaysBefore: Array.from(new Set(appointmentDays)).sort((a, b) => b - a),
        vaccinationDaysBefore: Array.from(new Set(vaccinationDays)).sort((a, b) => b - a),
        smsEnabled,
        emailEnabled,
      },
    });
    await prisma.vetClinic.update({
      where: { id: vetClinicId },
      data: { settingsJson: JSON.stringify(settings), onboardingStep: 3 },
    });
    return { ok: true, step: 3 };
  } catch {
    return { ok: false, error: "Nie udało się zapisać powiadomień." };
  }
}

/** Krok 4: cennik — bez zakończenia onboardingu. */
export async function saveVetOnboardingStep4Action(formData: FormData): Promise<VetOnboardingResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const consultationPln = parseFloat(formData.get("consultationPln")?.toString() ?? "");
  const vaccinationPln = parseFloat(formData.get("vaccinationPln")?.toString() ?? "");
  const otherPln = parseFloat(formData.get("otherPln")?.toString() ?? "");

  const fieldErrors: Record<string, string> = {};
  if (Number.isNaN(consultationPln) || consultationPln < 0) {
    fieldErrors.consultationPln = "Podaj cenę konsultacji (0 lub więcej).";
  }
  if (Number.isNaN(vaccinationPln) || vaccinationPln < 0) {
    fieldErrors.vaccinationPln = "Podaj cenę szczepienia (0 lub więcej).";
  }
  if (Number.isNaN(otherPln) || otherPln < 0) {
    fieldErrors.otherPln = "Podaj cenę zabiegu (0 lub więcej).";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      error: firstFieldError(fieldErrors, "Podaj poprawne ceny (0 lub więcej)."),
      fieldErrors,
    };
  }

  try {
    const prisma = getPrisma();
    const settings = await mergeSettings(vetClinicId, {
      pricingPolicy: { consultationPln, vaccinationPln, otherPln },
    });
    await prisma.vetClinic.update({
      where: { id: vetClinicId },
      data: {
        settingsJson: JSON.stringify(settings),
        onboardingStep: 4,
      },
    });
    return { ok: true, step: 4 };
  } catch {
    return { ok: false, error: "Nie udało się zapisać cennika." };
  }
}

/** Krok 5: ekran końcowy — oznacza onboarding jako ukończony. */
export async function completeVetOnboardingAction(): Promise<VetOnboardingResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  try {
    const prisma = getPrisma();
    const row = await prisma.vetClinic.findUnique({
      where: { id: vetClinicId },
      select: { settingsJson: true, onboardingStep: true },
    });
    if (!row) return { ok: false, error: "Nie znaleziono przychodni." };

    const current = parseVetClinicSettings(row.settingsJson);
    const settings: VetClinicSettings = {
      ...current,
      package: current.package ?? "standard",
      alertPolicy: current.alertPolicy ?? DEFAULT_ALERT_POLICY,
      pricingPolicy: current.pricingPolicy ?? DEFAULT_PRICING_POLICY,
    };

    await prisma.vetClinic.update({
      where: { id: vetClinicId },
      data: {
        settingsJson: JSON.stringify(settings),
        onboardingStep: VET_ONBOARDING_TOTAL,
        onboardingDoneAt: new Date(),
        isPublished: true,
      },
    });
    return { ok: true, step: VET_ONBOARDING_TOTAL };
  } catch {
    return { ok: false, error: "Nie udało się zakończyć konfiguracji." };
  }
}

export async function skipVetOnboardingToPanelAction(): Promise<VetOnboardingResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    const prisma = getPrisma();
    const settings = await mergeSettings(vetClinicId, {
      package: "standard",
      alertPolicy: DEFAULT_ALERT_POLICY,
      pricingPolicy: DEFAULT_PRICING_POLICY,
    });
    await prisma.vetClinic.update({
      where: { id: vetClinicId },
      data: {
        settingsJson: JSON.stringify(settings),
        onboardingStep: VET_ONBOARDING_TOTAL,
        onboardingDoneAt: new Date(),
        isPublished: true,
      },
    });
    return { ok: true, step: VET_ONBOARDING_TOTAL };
  } catch {
    return { ok: false, error: "Nie udało się pominąć kreatora." };
  }
}
