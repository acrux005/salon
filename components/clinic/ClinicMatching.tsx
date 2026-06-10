"use client";

import { Check } from "lucide-react";
import { useClinicData } from "@/contexts/ClinicDataContext";
import { PROBLEM_LABELS, type ProblemId } from "@/content/clinicDemo";

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

interface ClinicMatchingProps {
  problem: string | null | undefined;
}

export function ClinicMatching({ problem }: ClinicMatchingProps) {
  if (!problem || !VALID_PROBLEMS.includes(problem as ProblemId)) return null;
  const { matchingReasons } = useClinicData();
  const reasons = matchingReasons[problem as ProblemId];
  if (!reasons) return null;
  return (
    <section className="border-b border-neutral-200/60 bg-pink-50/40 py-10 lg:py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C] sm:text-2xl">
          {reasons.title}
        </h2>
        <p className="mt-2 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
          Problem: <strong>{PROBLEM_LABELS[problem as ProblemId]}</strong>
        </p>
        <ul className="mt-6 space-y-3">
          {reasons.bullets.map((text, i) => (
            <li key={i} className="flex items-start gap-3 font-[var(--font-sans)] text-[15px] text-[#1F1A1C]">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-pink-500" aria-hidden />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
