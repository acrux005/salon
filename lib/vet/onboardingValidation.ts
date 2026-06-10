import { z } from "zod";

export const onboardingStep1Schema = z.object({
  name: z.string().min(1, "Podaj nazwę przychodni"),
  street: z.string().min(1, "Podaj ulicę i numer"),
  postalCode: z
    .string()
    .min(1, "Podaj kod pocztowy")
    .regex(/^\d{2}-\d{3}$/, "Kod pocztowy w formacie 00-000 (np. 78-100)"),
  city: z.string().min(1, "Podaj miasto"),
  email: z.string().min(1, "Podaj e-mail").email("Podaj prawidłowy adres e-mail"),
  phone: z.string().min(9, "Podaj numer telefonu (min. 9 cyfr)"),
});

export type OnboardingStep1Input = z.infer<typeof onboardingStep1Schema>;

export function zodToFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, messages] of Object.entries(error.flatten().fieldErrors)) {
    if (messages?.[0]) out[key] = messages[0];
  }
  return out;
}

export function firstFieldError(errors: Record<string, string>, fallback: string): string {
  return Object.values(errors)[0] ?? fallback;
}

export function validateOnboardingStep1(data: OnboardingStep1Input): {
  ok: true;
  data: OnboardingStep1Input;
} | {
  ok: false;
  fieldErrors: Record<string, string>;
  message: string;
} {
  const parsed = onboardingStep1Schema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors = zodToFieldErrors(parsed.error);
    return {
      ok: false,
      fieldErrors,
      message: firstFieldError(fieldErrors, "Uzupełnij wymagane pola."),
    };
  }
  return { ok: true, data: parsed.data };
}

export function validateOnboardingStep3(
  appointmentDays: number[],
  vaccinationDays: number[],
  smsEnabled: boolean,
  emailEnabled: boolean
): { ok: boolean; fieldErrors: Record<string, string>; message: string } {
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
      fieldErrors,
      message: firstFieldError(fieldErrors, "Uzupełnij wymagane pola."),
    };
  }
  return { ok: true, fieldErrors: {}, message: "" };
}

export function validateOnboardingStep4(
  consultationPln: string,
  vaccinationPln: string,
  otherPln: string
): { ok: boolean; fieldErrors: Record<string, string>; message: string } {
  const fieldErrors: Record<string, string> = {};
  const fields = [
    { key: "consultationPln", value: consultationPln, label: "konsultacji" },
    { key: "vaccinationPln", value: vaccinationPln, label: "szczepienia" },
    { key: "otherPln", value: otherPln, label: "zabiegu" },
  ] as const;
  for (const { key, value, label } of fields) {
    const n = parseFloat(value);
    if (value.trim() === "" || Number.isNaN(n) || n < 0) {
      fieldErrors[key] = `Podaj cenę ${label} (0 lub więcej).`;
    }
  }
  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      fieldErrors,
      message: firstFieldError(fieldErrors, "Uzupełnij wymagane pola."),
    };
  }
  return { ok: true, fieldErrors: {}, message: "" };
}

export function wetInputClass(hasError?: boolean): string {
  return hasError ? "wet-input wet-input--error" : "wet-input";
}
