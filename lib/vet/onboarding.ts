export const VET_ONBOARDING_STEPS = [
  {
    id: 1,
    key: "clinic",
    title: "Przychodnia",
    subtitle: "Minimalne dane — system wie, kim jesteś.",
  },
  {
    id: 2,
    key: "package",
    title: "Plan",
    subtitle: "Start, Standard lub Pro — 14 dni testu na każdym planie.",
  },
  {
    id: 3,
    key: "alerts",
    title: "Powiadomienia",
    subtitle: "Przypomnienia o wizytach i szczepieniach — główna wartość produktu.",
  },
  {
    id: 4,
    key: "pricing",
    title: "Cennik wizyt",
    subtitle: "Kalendarz od razu gotowy do pracy.",
  },
  {
    id: 5,
    key: "complete",
    title: "Gotowe",
    subtitle: "Twoja przychodnia jest skonfigurowana.",
  },
] as const;

/** 5 etapów w poziomym pasku postępu. */
export const VET_ONBOARDING_PHASES = [
  { id: 1, label: "Przychodnia", steps: [1] as const },
  { id: 2, label: "Plan", steps: [2] as const },
  { id: 3, label: "Powiadomienia", steps: [3] as const },
  { id: 4, label: "Cennik", steps: [4] as const },
  { id: 5, label: "Gotowe", steps: [5] as const },
] as const;

export const VET_ONBOARDING_TOTAL = VET_ONBOARDING_STEPS.length;

export function getOnboardingPhaseId(step: number): number {
  return Math.min(Math.max(step, 1), VET_ONBOARDING_PHASES.length);
}

export function getOnboardingProgressCopy(step: number): {
  phaseIndex: number;
  phaseTotal: number;
  phaseLabel: string;
  sectionHint?: string;
} {
  const phaseIndex = getOnboardingPhaseId(step);
  const phase = VET_ONBOARDING_PHASES.find((p) => p.id === phaseIndex)!;
  return {
    phaseIndex,
    phaseTotal: VET_ONBOARDING_PHASES.length,
    phaseLabel: phase.label,
  };
}

/** 0–100 — pasek globalny. */
export function getOnboardingPercentComplete(step: number): number {
  return Math.round((Math.min(step, VET_ONBOARDING_TOTAL) / VET_ONBOARDING_TOTAL) * 100);
}

/** Mapowanie starych kroków (6-krokowy wizard) na nowy flow 1–5. */
export function normalizeOnboardingUiStep(dbStep: number, doneAt: Date | null | undefined): number {
  if (doneAt) return VET_ONBOARDING_TOTAL;
  if (dbStep <= 0) return 1;
  if (dbStep >= 6) return 5;
  if (dbStep === 5) return 4;
  if (dbStep === 3) return 3;
  return Math.min(dbStep, VET_ONBOARDING_TOTAL);
}

export type VetPackageId = "start" | "standard" | "pro";

export type VetReceptionPoint = {
  id: string;
  name: string;
  type?: "gabinet" | "teren" | "mobilny" | "oddzial";
  street?: string;
  houseNumber?: string;
  apartmentNumber?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
  notes?: string;
};

export type VetClinicSettings = {
  package?: VetPackageId;
  warehouse?: { name: string; notes?: string };
  alertPolicy?: {
    appointmentDaysBefore: number[];
    vaccinationDaysBefore: number[];
    smsEnabled: boolean;
    emailEnabled: boolean;
    smsBranding?: string;
  };
  receptionPoint?: {
    name: string;
    street?: string;
    houseNumber?: string;
    apartmentNumber?: string;
    postalCode?: string;
    city?: string;
    phone?: string;
  };
  receptionPoints?: VetReceptionPoint[];
  pricingPolicy?: {
    consultationPln: number;
    vaccinationPln: number;
    otherPln: number;
  };
  calendarFeedToken?: string;
};

export const VET_PACKAGES: {
  id: VetPackageId;
  name: string;
  tagline: string;
  monthlyPln: number;
  yearlyPln: number;
  features: string[];
  popular?: boolean;
}[] = [
  {
    id: "start",
    name: "Start",
    tagline: "Mała przychodnia na start",
    monthlyPln: 0,
    yearlyPln: 0,
    features: ["Kalendarz i wizyty", "Kartoteka pacjentów", "1 lekarz", "E-mail do klientów"],
  },
  {
    id: "standard",
    name: "Standard",
    tagline: "Najczęściej wybierany",
    monthlyPln: 149,
    yearlyPln: 1490,
    popular: true,
    features: ["Wszystko ze Start", "SMS i e-mail", "Moduł szczepień", "Do 3 lekarzy"],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Większe kliniki",
    monthlyPln: 299,
    yearlyPln: 2990,
    features: ["Wszystko ze Standard", "Nielimitowani lekarze", "Priorytetowe wsparcie", "Zaawansowane raporty"],
  },
];

export const DEFAULT_ALERT_POLICY: NonNullable<VetClinicSettings["alertPolicy"]> = {
  appointmentDaysBefore: [1],
  vaccinationDaysBefore: [30, 7, 0],
  smsEnabled: true,
  emailEnabled: true,
};

export const DEFAULT_PRICING_POLICY: NonNullable<VetClinicSettings["pricingPolicy"]> = {
  consultationPln: 120,
  vaccinationPln: 80,
  otherPln: 100,
};

export function parseVetClinicSettings(raw: string | null | undefined): VetClinicSettings {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as VetClinicSettings;
    if (typeof parsed !== "object" || parsed === null) return {};
    if (parsed.alertPolicy && parsed.alertPolicy.emailEnabled === undefined) {
      parsed.alertPolicy.emailEnabled = true;
    }
    return parsed;
  } catch {
    return {};
  }
}

/** Lista punktów przyjęć — obsługa legacy pojedynczego `receptionPoint`. */
export function getReceptionPoints(settings: VetClinicSettings): VetReceptionPoint[] {
  if (settings.receptionPoints?.length) return settings.receptionPoints;
  if (settings.receptionPoint?.name) {
    return [{ id: "legacy", ...settings.receptionPoint, type: "gabinet" }];
  }
  return [];
}

export function buildAddressLine(parts: {
  street?: string | null;
  houseNumber?: string | null;
  apartmentNumber?: string | null;
  postalCode?: string | null;
  city?: string | null;
}): string {
  const streetLine = [parts.street, parts.houseNumber].filter(Boolean).join(" ");
  const apt = parts.apartmentNumber ? `/${parts.apartmentNumber}` : "";
  const cityLine = [parts.postalCode, parts.city].filter(Boolean).join(" ");
  return [streetLine + apt, cityLine].filter((s) => s.trim()).join(", ");
}

export function isOnboardingComplete(step: number, doneAt: Date | null | undefined): boolean {
  return !!doneAt;
}
