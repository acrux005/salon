"use client";

import {
  VET_ONBOARDING_PHASES,
  getOnboardingPercentComplete,
  getOnboardingPhaseId,
  getOnboardingProgressCopy,
} from "@/lib/vet/onboarding";
import { Check } from "lucide-react";

export function WetOnboardingProgress({ currentStep }: { currentStep: number }) {
  const phaseId = getOnboardingPhaseId(currentStep);
  const copy = getOnboardingProgressCopy(currentStep);
  const percent = getOnboardingPercentComplete(currentStep);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between gap-3 text-[12px] font-medium sm:text-[13px]">
        <span className="text-wet-navy">
          Etap {copy.phaseIndex} z {copy.phaseTotal}
          <span className="text-wet-teal-800"> · {copy.phaseLabel}</span>
        </span>
        <span className="tabular-nums font-semibold text-wet-teal-700">{percent}%</span>
      </div>

      <div className="mb-2.5 h-2 overflow-hidden rounded-full bg-slate-300/70 sm:mb-3">
        <div
          className="h-full rounded-full bg-gradient-to-r from-wet-teal via-teal-500 to-teal-400 transition-[width] duration-700 ease-out motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Postęp konfiguracji: ${percent}%`}
        />
      </div>

      <div className="hidden items-center justify-between gap-0.5 sm:flex">
        {VET_ONBOARDING_PHASES.map((phase, i) => {
          const done = phase.id < phaseId;
          const active = phase.id === phaseId;
          const upcoming = phase.id > phaseId;
          return (
            <div key={phase.id} className="flex min-w-0 flex-1 items-center gap-0.5">
              {i > 0 && (
                <div className="relative h-2 min-w-[1.25rem] flex-1 overflow-hidden rounded-full bg-slate-300/80">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out ${
                      done
                        ? "w-full bg-gradient-to-r from-wet-teal to-teal-500"
                        : active
                          ? "w-1/2 bg-gradient-to-r from-wet-teal to-teal-400"
                          : "w-0 bg-transparent"
                    }`}
                  />
                </div>
              )}
              <div className="flex min-w-0 flex-col items-center gap-1.5">
                <span
                  className={`flex shrink-0 items-center justify-center rounded-full font-bold transition-all duration-300 ${
                    active
                      ? "h-11 w-11 bg-wet-navy text-[14px] text-white shadow-lg shadow-wet-navy/25 ring-4 ring-wet-teal/35"
                      : done
                        ? "h-9 w-9 bg-wet-teal text-white shadow-md shadow-wet-teal/40"
                        : "h-9 w-9 border-2 border-slate-300 bg-slate-50 text-[13px] font-semibold text-slate-600 shadow-sm"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden /> : phase.id}
                </span>
                <span
                  className={`max-w-[6rem] truncate text-center text-[11px] font-semibold sm:max-w-none sm:text-[12px] ${
                    active
                      ? "text-wet-navy"
                      : done
                        ? "text-wet-teal-800"
                        : upcoming
                          ? "text-slate-500"
                          : "text-slate-600"
                  }`}
                >
                  {phase.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {copy.sectionHint && (
        <p className="mt-1.5 hidden text-center text-[11px] text-slate-500 sm:block">{copy.sectionHint}</p>
      )}
    </div>
  );
}
