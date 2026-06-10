"use client";

import Link from "next/link";
import { useClinicData } from "@/contexts/ClinicDataContext";
import { PROBLEM_LABELS, type ProblemId } from "@/content/clinicDemo";
import { Clock } from "lucide-react";

const VALID_PROBLEMS: ProblemId[] = [
  "tradzik",
  "przebarwienia",
  "anti_aging",
  "naczynka",
  "sucha_skora",
  "zmarszczki",
  "jedrnost",
  "owal",
];

interface ClinicTreatmentsProps {
  problem: string | null | undefined;
}

export function ClinicTreatments({ problem }: ClinicTreatmentsProps) {
  const { treatments: all } = useClinicData();
  const filtered =
    problem && VALID_PROBLEMS.includes(problem as ProblemId)
      ? all.filter((t) => t.problemy.includes(problem as ProblemId))
      : all;

  return (
    <section className="border-b border-neutral-200/60 bg-white py-10 lg:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C] sm:text-2xl">
          Konkretne zabiegi
        </h2>
        <p className="mt-1 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
          {problem ? `Dopasowane do: ${PROBLEM_LABELS[problem as ProblemId]}` : "Wszystkie zabiegi w ofercie"}
        </p>
        <ul className="mt-8 space-y-6">
          {filtered.map((t) => (
            <li
              key={t.id}
              className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-[var(--font-sans)] text-[17px] font-semibold text-[#1F1A1C]">
                  {t.nazwa}
                </h3>
                <span className="font-[var(--font-sans)] text-[15px] font-medium text-pink-600">
                  od {t.cena_od} zł
                </span>
              </div>
              <p className="mt-2 font-[var(--font-sans)] text-[14px] leading-relaxed text-[#6F5E64]">
                {t.opis}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 font-[var(--font-sans)] text-[13px] text-[#6F5E64]">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {t.czas} min
                </span>
                <span className="font-[var(--font-sans)] text-[13px] text-[#6F5E64]">
                  Dla: {t.problemy.map((p) => PROBLEM_LABELS[p]).join(", ")}
                </span>
              </div>
              <Link
                href={`/kontakt?zabieg=${encodeURIComponent(t.id)}`}
                className="mt-3 inline-block font-[var(--font-sans)] text-[14px] font-medium text-pink-600 hover:underline"
              >
                Umów konsultację →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
