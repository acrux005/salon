import Link from "next/link";
import Image from "next/image";
import { getAllClinicRecords } from "@/lib/skinmatch/clinicsSeed";
import { PROBLEM_LABELS } from "@/content/clinicDemo";
import type { ProblemId } from "@/lib/skinmatch/schema";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

interface ClinicListProps {
  city?: string | null;
  clinics?: import("@/lib/skinmatch/schema").ClinicRecord[];
}

/** Lista gabinetów (strona /portal/gabinety). Opcjonalnie filtrowana po mieście. */
export function ClinicList({ city, clinics: clinicsProp }: ClinicListProps) {
  const clinics = clinicsProp ?? getAllClinicRecords(city ?? undefined);
  if (clinics.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 py-16 text-center">
        <p className="font-[var(--font-sans)] text-[17px] font-medium text-[#1F1A1C]">
          Brak gabinetów spełniających kryteria
        </p>
        <p className="mt-2 max-w-md mx-auto font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          {city
            ? `W tej lokalizacji nie ma jeszcze gabinetów w naszej bazie. Sprawdź inne miasta lub wróć do pełnej listy.`
            : "Nie znaleziono gabinetów. Sprawdź inne filtry lub wróć później."}
        </p>
        <Link
          href="/portal/gabinety"
          className="mt-6 inline-flex rounded-full bg-pink-500 px-6 py-3 font-[var(--font-sans)] text-[15px] font-medium text-white transition-colors hover:bg-pink-600"
        >
          Zobacz wszystkie gabinety
        </Link>
      </div>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {clinics.map((clinic) => {
        const imgSrc = clinic.avatarUrl
          ? (clinic.avatarUrl.startsWith("http") ? clinic.avatarUrl : `${BASE_PATH}${clinic.avatarUrl}`)
          : null;
        return (
          <div
            key={clinic.id}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <Link
              href={`/portal/gabinet/${clinic.slug}`}
              aria-label={`Otwórz profil gabinetu ${clinic.name}`}
              className="relative block aspect-[16/10] bg-neutral-100"
            >
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt={clinic.name}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[13px] text-neutral-400">
                  Zdjęcie / brand
                </div>
              )}
            </Link>
            <div className="p-4">
              <h3 className="font-[var(--font-sans)] text-[17px] font-semibold text-[#1F1A1C]">
                {clinic.name}
              </h3>
              <p className="mt-0.5 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
                {clinic.city}
              </p>
              <p className="mt-2 font-[var(--font-sans)] text-[13px] text-[#6F5E64]">
                {clinic.specializations.map((pid) => PROBLEM_LABELS[pid as ProblemId]).join(", ")}
              </p>
              <p className="mt-1 font-[var(--font-sans)] text-[13px] font-medium text-pink-600">
                ⭐ {clinic.rating} ({clinic.reviewCount})
              </p>
              <Link
                href={`/portal/gabinet/${clinic.slug}`}
                className="mt-4 inline-block rounded-full border border-pink-300 px-4 py-2 font-[var(--font-sans)] text-[14px] font-medium text-pink-600 transition-colors hover:bg-pink-50"
              >
                Sprawdź dopasowanie
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
