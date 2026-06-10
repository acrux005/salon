"use client";

import { useState } from "react";
import Link from "next/link";
import { useClinicData } from "@/contexts/ClinicDataContext";
import { useClinicBooking } from "@/contexts/ClinicBookingContext";
import { PROBLEM_LABELS, type ProblemId } from "@/content/clinicDemo";
import { Clock } from "lucide-react";
import { TreatmentInquiryModal } from "@/components/portal/TreatmentInquiryModal";

/** Wszystkie problemy/specjalizacje, po których można filtrować zabiegi (zgodne z PROBLEM_LABELS). */
const VALID_PROBLEMS: ProblemId[] = Object.keys(PROBLEM_LABELS) as ProblemId[];

function treatmentSlug(id: string): string {
  return id.replace(/_/g, "-");
}

interface ClinicTreatmentsBooksyProps {
  problem: string | null | undefined;
}

/** Lista usług jak w Booksy: cennik — nazwa, czas, cena, przycisk Umów. */
export function ClinicTreatmentsBooksy({ problem }: ClinicTreatmentsBooksyProps) {
  const { treatments: all, sessionInfo, clinicSlug } = useClinicData();
  const { openCalendar, openGate } = useClinicBooking();
  const isClient = sessionInfo?.isClient === true;
  const [inquiryTreatment, setInquiryTreatment] = useState<string | null>(null);
  const filtered =
    problem && VALID_PROBLEMS.includes(problem as ProblemId)
      ? all.filter((t) => t.problemy.includes(problem as ProblemId))
      : all;

  return (
    <>
    <section className="border-b border-neutral-200 bg-white py-8 lg:py-10" aria-labelledby="uslugi-heading">
      <h2 id="uslugi-heading" className="sr-only">
        Usługi i cennik
      </h2>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          {problem ? `Dopasowane do: ${PROBLEM_LABELS[problem as ProblemId]}` : "Wszystkie usługi"}
        </p>

        {/* Desktop: tabela */}
        <div className="hidden overflow-hidden rounded-xl border border-neutral-200 sm:block">
          <table className="w-full border-collapse font-[var(--font-sans)] text-[15px]">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80">
                <th className="px-4 py-3 text-left font-semibold text-[#1F1A1C]">Usługa</th>
                <th className="w-24 px-4 py-3 text-left text-[14px] text-[#6F5E64]">Czas</th>
                <th className="w-28 px-4 py-3 text-right font-semibold text-[#1F1A1C]">Cena</th>
                <th className="w-32 px-4 py-3" aria-hidden />
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#1F1A1C]">
                      <Link
                        href={`/portal/zabieg/${treatmentSlug(t.id)}`}
                        className="text-[#1F1A1C] hover:text-pink-600 hover:underline"
                      >
                        {t.nazwa}
                      </Link>
                    </div>
                    {t.opis ? (
                      <div className="mt-1 text-[13px] leading-relaxed text-[#6F5E64]">
                        {t.opis}
                      </div>
                    ) : null}
                    <div className="mt-0.5 text-[13px] text-[#6F5E64]">
                      {t.problemy.map((p) => PROBLEM_LABELS[p]).join(", ")}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[14px] text-[#6F5E64]">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      {t.czas} min
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-[#1F1A1C]">
                    od {t.cena_od} zł
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setInquiryTreatment(t.nazwa)}
                        className="inline-block rounded-full border border-pink-300 px-3 py-1.5 text-[13px] font-medium text-pink-600 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                      >
                        Zapytaj
                      </button>
                      <button
                        type="button"
                        onClick={() => (isClient ? openCalendar(t.id) : openGate())}
                        className="inline-block rounded-full bg-pink-500 px-4 py-2 text-[14px] font-medium text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                      >
                        Umów
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: karty */}
        <ul className="space-y-3 sm:hidden">
          {filtered.map((t) => (
            <li
              key={t.id}
              className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/portal/zabieg/${treatmentSlug(t.id)}`}
                  className="font-[var(--font-sans)] font-medium text-[#1F1A1C] hover:text-pink-600 hover:underline"
                >
                  {t.nazwa}
                </Link>
                <span className="shrink-0 font-[var(--font-sans)] font-semibold text-pink-600">
                  od {t.cena_od} zł
                </span>
              </div>
              {t.opis ? (
                <p className="text-[13px] leading-relaxed text-[#6F5E64]">
                  {t.opis}
                </p>
              ) : null}
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#6F5E64]">
                  <Clock className="mr-1 inline h-3.5 w-3.5" aria-hidden />
                  {t.czas} min
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInquiryTreatment(t.nazwa)}
                    className="rounded-full border border-pink-300 px-3 py-1.5 text-[13px] font-medium text-pink-600 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  >
                    Zapytaj
                  </button>
                  <button
                    type="button"
                    onClick={() => (isClient ? openCalendar(t.id) : openGate())}
                    className="rounded-full bg-pink-500 px-4 py-2 text-[14px] font-medium text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  >
                    Umów
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>

    {inquiryTreatment && clinicSlug && (
      <TreatmentInquiryModal
        clinicSlug={clinicSlug}
        treatmentName={inquiryTreatment}
        prefillName={sessionInfo?.clientInfo?.name}
        prefillEmail={sessionInfo?.clientInfo?.email}
        onClose={() => setInquiryTreatment(null)}
      />
    )}
  </>
  );
}
