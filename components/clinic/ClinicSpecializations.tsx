"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClinicData } from "@/contexts/ClinicDataContext";

interface ClinicSpecializationsProps {
  activeProblem: string | null | undefined;
}

export function ClinicSpecializations({ activeProblem }: ClinicSpecializationsProps) {
  const pathname = usePathname();
  const { specializations } = useClinicData();
  const base = pathname || "/";

  return (
    <section className="border-b border-neutral-200/60 bg-white py-10 lg:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C] sm:text-2xl">
          Specjalizacje
        </h2>
        <p className="mt-1 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
          Kliknij, aby filtrować zabiegi po problemie
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={base}
            className={
              !activeProblem
                ? "rounded-full border border-pink-400 bg-pink-50 px-4 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-pink-700"
                : "rounded-full border border-neutral-200 bg-white px-4 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C] hover:border-pink-200 hover:bg-pink-50/50"
            }
          >
            Wszystkie
          </Link>
          {specializations.map((spec) => {
            const isActive = activeProblem === spec.id;
            const href = `${base}?problem=${spec.id}`;
            return (
              <Link
                key={spec.id}
                href={href}
                className={
                  isActive
                    ? "rounded-full border border-pink-400 bg-pink-50 px-4 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-pink-700"
                    : "rounded-full border border-neutral-200 bg-white px-4 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C] hover:border-pink-200 hover:bg-pink-50/50"
                }
              >
                {spec.label} ({spec.count})
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
