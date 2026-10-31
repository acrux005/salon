import Link from "next/link";
import { CATALOG_RODO_PATH, clinicClaimPath, clinicReportPath } from "@/lib/catalogListing";

function formatPlDate(isoOrDate: string | Date | null | undefined): string | null {
  if (!isoOrDate) return null;
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" });
}

const CLAIM_BENEFITS = [
  "Profil w katalogu z usługami, zdjęciami i kontaktem",
  "Cennik, godziny pracy i opcjonalny kalendarz rezerwacji",
  "Wiadomości od klientek oraz przypomnienia o wizycie",
  "Prośby o opinię po wizycie i oznaczenie potwierdzonego profilu",
] as const;

type Props = {
  slug: string;
  updatedAt?: string | Date | null;
};

export function ClinicUnverifiedNotice({ slug, updatedAt }: Props) {
  const updatedLabel = formatPlDate(updatedAt);

  return (
    <aside className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-4 sm:px-5">
      <p className="font-[var(--font-sans)] text-[13px] font-semibold uppercase tracking-wide text-amber-900">
        Profil niepotwierdzony przez właściciela
      </p>
      <p className="mt-2 font-[var(--font-sans)] text-[14px] leading-relaxed text-[#4a3f42]">
        Profil utworzyliśmy na podstawie publicznych danych CEIDG. Właściciel nie potwierdził
        jeszcze informacji w Salon Odart. Adres, oferta i dostępność usług mogą wymagać
        aktualizacji.
      </p>

      <div className="mt-4 border-t border-amber-200/80 pt-4">
        <p className="font-[var(--font-sans)] text-[14px] leading-relaxed text-[#4a3f42]">
          <strong className="font-semibold text-[#1F1A1C]">Prowadzisz ten salon?</strong> Przejmij
          profil bezpłatnie i zarządzaj nim w panelu Salon Odart:
        </p>
        <ul className="mt-3 space-y-1.5">
          {CLAIM_BENEFITS.map((item) => (
            <li
              key={item}
              className="flex gap-2 font-[var(--font-sans)] text-[13px] leading-snug text-[#4a3f42]"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-500" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-3 font-[var(--font-sans)] text-[13px] text-[#6F5E64]">
          <Link href="/portal/dla-salonow" className="font-medium text-pink-600 hover:underline">
            Wszystkie funkcje panelu →
          </Link>
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={clinicClaimPath(slug)}
          className="inline-flex rounded-full bg-pink-500 px-4 py-2 text-[14px] font-medium text-white hover:bg-pink-600"
        >
          Przejmij profil
        </Link>
        <Link
          href={clinicReportPath(slug)}
          className="inline-flex rounded-full border border-neutral-300 bg-white px-4 py-2 text-[14px] font-medium text-[#1F1A1C] hover:border-pink-300"
        >
          Zgłoś błąd lub poproś o usunięcie
        </Link>
      </div>
      <p className="mt-4 font-[var(--font-sans)] text-[12px] text-[#6F5E64]">
        Źródło: CEIDG
        {updatedLabel ? ` · Aktualizacja danych: ${updatedLabel}` : null}
        {" · "}
        <Link href={CATALOG_RODO_PATH} className="underline-offset-2 hover:text-pink-700 hover:underline">
          Źródło i przetwarzanie danych
        </Link>
      </p>
    </aside>
  );
}
