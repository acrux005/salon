"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  saveVetOnboardingStep1Action,
  saveVetOnboardingStep2Action,
  saveVetOnboardingStep3Action,
  saveVetOnboardingStep4Action,
  skipVetOnboardingToPanelAction,
} from "@/app/actions/vetOnboarding";
import {
  VET_ONBOARDING_STEPS,
  VET_ONBOARDING_TOTAL,
  DEFAULT_ALERT_POLICY,
  DEFAULT_PRICING_POLICY,
  getOnboardingProgressCopy,
  normalizeOnboardingUiStep,
  type VetClinicSettings,
  type VetPackageId,
} from "@/lib/vet/onboarding";
import { WetOnboardingProgress } from "@/components/wet/WetOnboardingProgress";
import { WetPricingPicker } from "@/components/wet/WetPricingPicker";
import { WetOnboardingComplete } from "@/components/wet/WetOnboardingComplete";
import {
  validateOnboardingStep1,
  validateOnboardingStep3,
  validateOnboardingStep4,
  wetInputClass,
} from "@/lib/vet/onboardingValidation";
import type { VetOnboardingResult } from "@/app/actions/vetOnboarding";

export type WetOnboardingInitial = {
  step: number;
  name: string;
  street: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string;
  settings: VetClinicSettings;
};

export function WetOnboardingWizard({ initial }: { initial: WetOnboardingInitial }) {
  const router = useRouter();
  const normalized = normalizeOnboardingUiStep(initial.step, null);
  const initialUiStep =
    initial.step >= 4 && initial.settings.pricingPolicy
      ? VET_ONBOARDING_TOTAL
      : Math.min(normalized, VET_ONBOARDING_TOTAL);
  const [currentStep, setCurrentStep] = useState(initialUiStep);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const [clinic, setClinic] = useState({
    name: initial.name,
    street: initial.street,
    postalCode: initial.postalCode,
    city: initial.city,
    email: initial.email,
    phone: initial.phone,
  });

  const [selectedPackage, setSelectedPackage] = useState<VetPackageId | "">(
    initial.settings.package ?? "standard"
  );

  const alert = initial.settings.alertPolicy ?? DEFAULT_ALERT_POLICY;
  const [appointmentDays, setAppointmentDays] = useState<number[]>(alert.appointmentDaysBefore);
  const [vaccinationDays, setVaccinationDays] = useState<number[]>(alert.vaccinationDaysBefore);
  const [smsEnabled, setSmsEnabled] = useState(alert.smsEnabled ?? true);
  const [emailEnabled, setEmailEnabled] = useState(alert.emailEnabled ?? true);

  const pricing = initial.settings.pricingPolicy ?? DEFAULT_PRICING_POLICY;
  const [consultationPln, setConsultationPln] = useState(String(pricing.consultationPln));
  const [vaccinationPln, setVaccinationPln] = useState(String(pricing.vaccinationPln));
  const [otherPln, setOtherPln] = useState(String(pricing.otherPln));

  const isCompleteStep = currentStep === VET_ONBOARDING_TOTAL;
  const stepMeta = VET_ONBOARDING_STEPS[currentStep - 1];
  const progressCopy = getOnboardingProgressCopy(currentStep);
  const ctaLabel =
    currentStep === 4 ? "Zakończ konfigurację" : currentStep === 2 ? "Wybierz plan i kontynuuj" : "Kontynuuj";

  function clearField(name: string) {
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function applyValidationFail(message: string, errors: Record<string, string>) {
    setFieldErrors(errors);
    setError(message);
  }

  function toggleDay(list: number[], day: number, setter: (v: number[]) => void) {
    setter(list.includes(day) ? list.filter((d) => d !== day) : [...list, day].sort((a, b) => b - a));
  }

  async function runStep(save: () => Promise<VetOnboardingResult>) {
    setLoading(true);
    const result = await save();
    setLoading(false);
    if (!result.ok) {
      setFieldErrors(result.fieldErrors ?? {});
      setError(result.error ?? "Błąd zapisu.");
      return false;
    }
    setError("");
    setFieldErrors({});
    return true;
  }

  async function goNext() {
    if (isCompleteStep) return;

    setError("");
    setFieldErrors({});

    if (currentStep === 1) {
      const v1 = validateOnboardingStep1(clinic);
      if (!v1.ok) {
        applyValidationFail(v1.message, v1.fieldErrors);
        return;
      }
    } else if (currentStep === 3) {
      const v3 = validateOnboardingStep3(appointmentDays, vaccinationDays, smsEnabled, emailEnabled);
      if (!v3.ok) {
        applyValidationFail(v3.message, v3.fieldErrors);
        return;
      }
    } else if (currentStep === 4) {
      const v4 = validateOnboardingStep4(consultationPln, vaccinationPln, otherPln);
      if (!v4.ok) {
        applyValidationFail(v4.message, v4.fieldErrors);
        return;
      }
    }

    let ok = false;
    if (currentStep === 1) {
      const fd = new FormData();
      Object.entries(clinic).forEach(([k, v]) => fd.set(k, String(v)));
      ok = await runStep(() => saveVetOnboardingStep1Action(fd));
    } else if (currentStep === 2) {
      ok = await runStep(() => saveVetOnboardingStep2Action(selectedPackage || "standard"));
    } else if (currentStep === 3) {
      const fd = new FormData();
      appointmentDays.forEach((d) => fd.append("appointmentDays", String(d)));
      vaccinationDays.forEach((d) => fd.append("vaccinationDays", String(d)));
      fd.set("smsEnabled", smsEnabled ? "true" : "false");
      fd.set("emailEnabled", emailEnabled ? "true" : "false");
      ok = await runStep(() => saveVetOnboardingStep3Action(fd));
    } else if (currentStep === 4) {
      const fd = new FormData();
      fd.set("consultationPln", consultationPln);
      fd.set("vaccinationPln", vaccinationPln);
      fd.set("otherPln", otherPln);
      ok = await runStep(() => saveVetOnboardingStep4Action(fd));
    }

    if (!ok) return;
    setCurrentStep(currentStep + 1);
  }

  async function handleSkip() {
    setLoading(true);
    const result = await skipVetOnboardingToPanelAction();
    setLoading(false);
    if (result.ok) {
      router.push("/wet/panel");
      router.refresh();
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="wet-onboarding-shell min-h-[calc(100dvh-4rem)] pb-28 sm:pb-6">
      <div className="wet-onboarding-header">
        <div className="mx-auto flex max-w-4xl flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <Link href="/wet" className="text-base font-bold tracking-tight text-wet-navy sm:text-lg">
              Vet<span className="text-wet-teal">Harmonogram</span>
            </Link>
            {!isCompleteStep && (
              <button
                type="button"
                onClick={handleSkip}
                disabled={loading}
                className="text-[13px] font-medium text-wet-navy-muted hover:text-wet-navy"
              >
                Pomiń konfigurację
              </button>
            )}
          </div>
          <WetOnboardingProgress currentStep={currentStep} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 py-3 sm:py-5">
        <div className="wet-onboarding-card p-5 sm:p-8">
          {!isCompleteStep && (
            <>
              <p className="text-[13px] font-semibold uppercase tracking-wider text-wet-teal">
                Etap {progressCopy.phaseIndex} z {progressCopy.phaseTotal} · {progressCopy.phaseLabel}
              </p>
              <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-wet-navy sm:text-3xl">
                {stepMeta.title}
              </h1>
              <p className="mt-2 text-[15px] leading-relaxed text-wet-navy-muted">{stepMeta.subtitle}</p>
            </>
          )}

          {(error || Object.keys(fieldErrors).length > 0) && !isCompleteStep && (
            <div
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-800"
              role="alert"
            >
              {error && <p className="font-medium">{error}</p>}
              {Object.keys(fieldErrors).length > 0 && (
                <p className={error ? "mt-1 text-red-700" : ""}>
                  Sprawdź pola oznaczone na czerwono poniżej.
                </p>
              )}
            </div>
          )}

          <div className={isCompleteStep ? "" : "mt-8 space-y-4"}>
            {currentStep === 1 && (
              <>
                <RequiredLegend />
                <Field label="Nazwa przychodni" htmlFor="clinic-name" required error={fieldErrors.name}>
                  <input
                    id="clinic-name"
                    className={wetInputClass(!!fieldErrors.name)}
                    value={clinic.name}
                    onChange={(e) => {
                      clearField("name");
                      setClinic((p) => ({ ...p, name: e.target.value }));
                    }}
                    aria-invalid={!!fieldErrors.name}
                  />
                </Field>
                <Field label="Adres (ulica i numer)" htmlFor="clinic-street" required error={fieldErrors.street}>
                  <input
                    id="clinic-street"
                    className={wetInputClass(!!fieldErrors.street)}
                    value={clinic.street}
                    onChange={(e) => {
                      clearField("street");
                      setClinic((p) => ({ ...p, street: e.target.value }));
                    }}
                    placeholder="np. ul. Weterynaryjna 12"
                    aria-invalid={!!fieldErrors.street}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Kod pocztowy" htmlFor="clinic-postal" required hint="Format: 00-000" error={fieldErrors.postalCode}>
                    <input
                      id="clinic-postal"
                      className={wetInputClass(!!fieldErrors.postalCode)}
                      value={clinic.postalCode}
                      onChange={(e) => {
                        clearField("postalCode");
                        setClinic((p) => ({ ...p, postalCode: e.target.value }));
                      }}
                      inputMode="numeric"
                      autoComplete="postal-code"
                    />
                  </Field>
                  <Field label="Miasto" htmlFor="clinic-city" required error={fieldErrors.city}>
                    <input
                      id="clinic-city"
                      className={wetInputClass(!!fieldErrors.city)}
                      value={clinic.city}
                      onChange={(e) => {
                        clearField("city");
                        setClinic((p) => ({ ...p, city: e.target.value }));
                      }}
                    />
                  </Field>
                </div>
                <Field label="Telefon" htmlFor="clinic-phone" required error={fieldErrors.phone}>
                  <input
                    id="clinic-phone"
                    className={wetInputClass(!!fieldErrors.phone)}
                    value={clinic.phone}
                    onChange={(e) => {
                      clearField("phone");
                      setClinic((p) => ({ ...p, phone: e.target.value }));
                    }}
                  />
                </Field>
                <Field label="E-mail" htmlFor="clinic-email" required error={fieldErrors.email}>
                  <input
                    id="clinic-email"
                    type="email"
                    className={wetInputClass(!!fieldErrors.email)}
                    value={clinic.email}
                    onChange={(e) => {
                      clearField("email");
                      setClinic((p) => ({ ...p, email: e.target.value }));
                    }}
                  />
                </Field>
              </>
            )}

            {currentStep === 2 && (
              <WetPricingPicker value={selectedPackage} onChange={(id) => setSelectedPackage(id)} />
            )}

            {currentStep === 3 && (
              <>
                <p className="rounded-xl bg-wet-teal-50 px-4 py-3 text-[14px] text-wet-navy">
                  To najważniejsza część — klienci dostaną przypomnienia automatycznie, bez ręcznego dzwonienia.
                </p>
                <p className="text-[14px] font-medium text-wet-navy">
                  Przypomnienia o wizycie<span className="wet-required-mark" aria-hidden="true">*</span>
                </p>
                <DayChips
                  options={[0, 1, 2, 7]}
                  selected={appointmentDays}
                  onToggle={(d) => {
                    clearField("appointmentDays");
                    toggleDay(appointmentDays, d, setAppointmentDays);
                  }}
                  hasError={!!fieldErrors.appointmentDays}
                  error={fieldErrors.appointmentDays}
                  suffix="przed wizytą"
                />
                <p className="mt-6 text-[14px] font-medium text-wet-navy">
                  Przypomnienia o szczepieniu<span className="wet-required-mark" aria-hidden="true">*</span>
                </p>
                <DayChips
                  options={[0, 7, 14, 30]}
                  selected={vaccinationDays}
                  onToggle={(d) => {
                    clearField("vaccinationDays");
                    toggleDay(vaccinationDays, d, setVaccinationDays);
                  }}
                  hasError={!!fieldErrors.vaccinationDays}
                  error={fieldErrors.vaccinationDays}
                  suffix="przed terminem"
                />
                <p className="mt-6 text-[14px] font-medium text-wet-navy">
                  Kanały wysyłki<span className="wet-required-mark" aria-hidden="true">*</span>
                </p>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-[14px]">
                    <input
                      type="checkbox"
                      checked={emailEnabled}
                      onChange={(e) => {
                        clearField("channels");
                        setEmailEnabled(e.target.checked);
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-wet-teal"
                    />
                    E-mail
                  </label>
                  <label className="flex items-center gap-2 text-[14px]">
                    <input
                      type="checkbox"
                      checked={smsEnabled}
                      onChange={(e) => {
                        clearField("channels");
                        setSmsEnabled(e.target.checked);
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-wet-teal"
                    />
                    SMS
                  </label>
                </div>
                {fieldErrors.channels && (
                  <p className="wet-field-error" role="alert">
                    {fieldErrors.channels}
                  </p>
                )}
                <p className="text-[12px] text-wet-navy-muted">
                  Bramkę SMS podłączysz później w panelu — teraz zapisujemy preferencje.
                </p>
              </>
            )}

            {currentStep === 4 && (
              <>
                <Field label="Konsultacja (PLN)" htmlFor="price-consult" required error={fieldErrors.consultationPln}>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    id="price-consult"
                    className={wetInputClass(!!fieldErrors.consultationPln)}
                    value={consultationPln}
                    onChange={(e) => {
                      clearField("consultationPln");
                      setConsultationPln(e.target.value);
                    }}
                  />
                </Field>
                <Field label="Szczepienie (PLN)" htmlFor="price-vacc" required error={fieldErrors.vaccinationPln}>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    id="price-vacc"
                    className={wetInputClass(!!fieldErrors.vaccinationPln)}
                    value={vaccinationPln}
                    onChange={(e) => {
                      clearField("vaccinationPln");
                      setVaccinationPln(e.target.value);
                    }}
                  />
                </Field>
                <Field label="Zabieg (PLN)" htmlFor="price-other" required error={fieldErrors.otherPln}>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    id="price-other"
                    className={wetInputClass(!!fieldErrors.otherPln)}
                    value={otherPln}
                    onChange={(e) => {
                      clearField("otherPln");
                      setOtherPln(e.target.value);
                    }}
                  />
                </Field>
              </>
            )}

            {isCompleteStep && <WetOnboardingComplete />}
          </div>

          {!isCompleteStep && (
            <div className="wet-onboarding-cta mt-8 sm:mt-10">
              <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3 sm:border-t sm:border-slate-100 sm:pt-8">
                {currentStep > 1 && (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setError("");
                      setFieldErrors({});
                      setCurrentStep((s) => s - 1);
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[14px] font-medium text-wet-navy hover:bg-slate-50"
                  >
                    Wstecz
                  </button>
                )}
                <button
                  type="button"
                  disabled={loading}
                  onClick={goNext}
                  className="wet-btn-primary-lg sm:ml-auto"
                >
                  {loading ? "Zapisuję…" : ctaLabel}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RequiredLegend() {
  return (
    <p className="wet-required-legend">
      <span className="wet-required-mark" aria-hidden="true">*</span> pole wymagane
    </p>
  );
}

function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-[14px] font-medium text-wet-navy">
        {label}
        {required && (
          <>
            <span className="wet-required-mark" aria-hidden="true">*</span>
            <span className="sr-only"> — pole wymagane</span>
          </>
        )}
      </label>
      <div className="mt-1">{children}</div>
      {error ? (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} className="wet-field-error" role="alert">
          {error}
        </p>
      ) : null}
      {hint && !error ? <p className="wet-field-hint">{hint}</p> : null}
    </div>
  );
}

function DayChips({
  options,
  selected,
  onToggle,
  suffix,
  hasError,
  error,
}: {
  options: number[];
  selected: number[];
  onToggle: (d: number) => void;
  suffix: string;
  hasError?: boolean;
  error?: string;
}) {
  return (
    <div>
      <div
        className={`flex flex-wrap gap-2 ${hasError ? "wet-day-chips--error" : ""}`}
        aria-invalid={hasError || undefined}
      >
        {options.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onToggle(d)}
            className={`rounded-full px-3.5 py-2 text-[13px] font-medium transition ${
              selected.includes(d)
                ? "bg-wet-teal text-white shadow-sm"
                : hasError
                  ? "border border-red-300 bg-red-50/50 text-wet-navy hover:border-red-400"
                  : "border border-slate-200 bg-white text-wet-navy-muted hover:border-wet-teal-200"
            }`}
          >
            {d === 0 ? "W dniu terminu" : `${d} dni`} {suffix}
          </button>
        ))}
      </div>
      {error ? (
        <p className="wet-field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
