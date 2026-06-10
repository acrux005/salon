"use client";

import Link from "next/link";
import Image from "next/image";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
import { PORTAL_LOCALE } from "@/content/portalLocale";
import { getAllClinicRecords } from "@/lib/skinmatch/clinicsSeed";
import { PROBLEM_LABELS } from "@/content/clinicDemo";
import type { ProblemId } from "@/lib/skinmatch/schema";

/** Lista gabinetów z bazy — do sekcji „Polecane gabinety” i strony /portal/gabinety. */
export function FeaturedClinics(props: { clinics?: import("@/lib/skinmatch/schema").ClinicRecord[] }) {
  const clinics = props.clinics ?? getAllClinicRecords();
  return (
    <section
      id="gabinety"
      className="border-b border-neutral-200/40 py-20 lg:py-28"
      style={{ background: "#FFF8FB" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-3 text-center font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
          Polecane gabinety — jakość, nie ilość
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          Rekomendowane miejsca w {PORTAL_LOCALE.regionLong}.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clinics.slice(0, 6).map((clinic) => (
            <Link
              key={clinic.id}
              href={`/portal/gabinet/${clinic.slug}`}
              aria-label={`Otwórz profil gabinetu ${clinic.name}`}
              className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
            >
              <div className="relative block aspect-[16/10] bg-gradient-to-br from-pink-50 to-neutral-100">
                {clinic.avatarUrl ? (
                  <Image
                    src={clinic.avatarUrl.startsWith("http") ? clinic.avatarUrl : `${BASE_PATH}${clinic.avatarUrl}`}
                    alt={`${clinic.name}${clinic.city ? `, ${clinic.city}` : ""}`}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Image
                      src={`${BASE_PATH}/images/icon-192.png`}
                      alt={clinic.name}
                      width={80}
                      height={80}
                      className="opacity-60"
                    />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-[var(--font-sans)] text-[17px] font-semibold text-[#1F1A1C]">
                  {clinic.name}
                </h3>
                <p className="mt-0.5 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
                  {clinic.city}
                </p>
                <p className="mt-2 font-[var(--font-sans)] text-[13px] text-[#6F5E64]">
                  Specjalizacje: {clinic.specializations.map((pid) => PROBLEM_LABELS[pid as ProblemId]).join(", ")}
                </p>
                <p className="mt-1 flex items-center gap-1 font-[var(--font-sans)] text-[13px] font-medium" style={{ color: "#DE1F40" }}>
                  <StarIcon className="h-4 w-4 shrink-0" />
                  {clinic.rating} ({clinic.reviewCount})
                </p>
                <span className="mt-4 inline-block rounded-full border border-pink-300 px-4 py-2 font-[var(--font-sans)] text-[14px] font-medium text-pink-600 transition-colors group-hover:bg-pink-50">
                  Sprawdź dopasowanie
                </span>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-10 text-center">
          <Link
            href="/portal/gabinety"
            className="font-[var(--font-sans)] text-[15px] font-medium text-pink-600 hover:underline"
          >
            {`Zobacz gabinety w ${PORTAL_LOCALE.regionIn}`}
          </Link>
        </p>
      </div>
    </section>
  );
}
