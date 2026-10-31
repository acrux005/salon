"use client";

import Link from "next/link";
import Image from "next/image";
import { getAllClinicRecords } from "@/lib/skinmatch/clinicsSeed";
import { splitCatalogClinicName } from "@/lib/catalog/clinicDisplayName";
import { PROBLEM_LABELS } from "@/content/clinicDemo";
import type { ClinicRecord, ProblemId } from "@/lib/skinmatch/schema";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function completeness(c: ClinicRecord): number {
  let s = 0;
  if (c.avatarUrl) s += 4;
  if (c.kontakt?.phone) s += 3;
  if (c.kontakt?.address) s += 2;
  if (c.specializations.length > 0) s += 2;
  if (c.reviewCount > 0) s += 3;
  return s;
}

type Props = {
  clinics?: ClinicRecord[];
  claimedIds?: string[];
};

export function FeaturedClinics({ clinics: clinicsProp, claimedIds = [] }: Props) {
  const claimed = new Set(claimedIds);
  const raw = clinicsProp ?? getAllClinicRecords();
  const clinics = [...raw]
    .sort((a, b) => {
      const ca = claimed.has(a.id) ? 1 : 0;
      const cb = claimed.has(b.id) ? 1 : 0;
      if (cb !== ca) return cb - ca;
      return completeness(b) - completeness(a);
    })
    .slice(0, 6);

  return (
    <section
      id="gabinety"
      className="border-b border-neutral-200/40 py-20 lg:py-28"
      style={{ background: "#FFF8FB" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-3 text-center font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
          Poznaj salony w Odart
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          Sprawdź dostępne informacje o salonach i ich usługach.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clinics.map((clinic) => {
            const { displayName } = splitCatalogClinicName(clinic.name);
            const title = displayName || clinic.name;
            const isClaimed = claimed.has(clinic.id);
            const services = isClaimed
              ? clinic.specializations
                  .map((pid) => PROBLEM_LABELS[pid as ProblemId])
                  .filter(Boolean)
                  .slice(0, 3)
              : [];
            const hasReviews = clinic.reviewCount > 0 && clinic.rating > 0;

            return (
              <Link
                key={clinic.id}
                href={`/portal/gabinet/${clinic.slug}`}
                aria-label={`Otwórz profil gabinetu ${title}`}
                className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)]"
              >
                <div className="relative block aspect-[16/10] bg-gradient-to-br from-pink-50 to-neutral-100">
                  {clinic.avatarUrl ? (
                    <Image
                      src={
                        clinic.avatarUrl.startsWith("http")
                          ? clinic.avatarUrl
                          : `${BASE_PATH}${clinic.avatarUrl}`
                      }
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center" aria-hidden>
                      <Image
                        src={`${BASE_PATH}/images/icon-192.png`}
                        alt=""
                        width={80}
                        height={80}
                        className="opacity-60"
                      />
                    </div>
                  )}
                  {isClaimed ? (
                    <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium leading-snug text-emerald-800">
                      Profil potwierdzony przez właściciela
                    </span>
                  ) : null}
                </div>
                <div className="p-4">
                  <h3 className="font-[var(--font-sans)] text-[17px] font-semibold text-[#1F1A1C]">
                    {title}
                  </h3>
                  <p className="mt-0.5 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
                    {clinic.city}
                  </p>
                  {services.length > 0 ? (
                    <p className="mt-2 font-[var(--font-sans)] text-[13px] text-[#4a3f42]">
                      {services.join(" · ")}
                    </p>
                  ) : null}
                  {hasReviews ? (
                    <p className="mt-1 flex items-center gap-1 font-[var(--font-sans)] text-[13px] font-medium text-[#DE1F40]">
                      <StarIcon className="h-4 w-4 shrink-0" />
                      {clinic.rating} ({clinic.reviewCount})
                    </p>
                  ) : null}
                  <span className="mt-4 inline-block rounded-full border border-pink-300 px-4 py-2 font-[var(--font-sans)] text-[14px] font-medium text-pink-600 transition-colors group-hover:bg-pink-50">
                    Zobacz profil
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        <p className="mt-10 text-center">
          <Link
            href="/portal/gabinety"
            className="font-[var(--font-sans)] text-[15px] font-medium text-pink-600 hover:underline"
          >
            Zobacz wszystkie salony
          </Link>
        </p>
      </div>
    </section>
  );
}
