import { cityInPhrase, getCityLocative } from "@/content/portalLocale";
import { splitCatalogClinicName } from "@/lib/catalog/clinicDisplayName";

interface ClinicSeoContentProps {
  clinicName: string;
  city: string;
  claimed?: boolean;
  legalName?: string | null;
}

export function ClinicSeoContent({
  clinicName,
  city,
  claimed = true,
  legalName = null,
}: ClinicSeoContentProps) {
  const cityIn = cityInPhrase(city);
  const cityLoc = getCityLocative(city);
  const { displayName } = splitCatalogClinicName(clinicName);
  const headingName = displayName || clinicName;

  if (!claimed) {
    return (
      <section className="border-t border-neutral-200/60 py-12">
        <div className="prose prose-sm max-w-none font-[var(--font-sans)]">
          <h2 className="text-[18px] font-semibold text-[#1F1A1C]">
            {headingName} — {city}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#6F5E64]">
            Według danych CEIDG firma jest zarejestrowana {cityIn}. Poniżej znajdziesz informacje
            dostępne w naszej bazie. Profil nie został jeszcze potwierdzony przez właściciela,
            dlatego zakres usług i pozostałe dane mogą być niepełne lub nieaktualne.
          </p>
          {legalName ? (
            <p className="mt-3 text-[14px] leading-relaxed text-[#6F5E64]">
              <span className="font-medium text-[#1F1A1C]">Nazwa rejestrowa:</span> {legalName}
            </p>
          ) : null}
        </div>
      </section>
    );
  }
  return (
    <section className="border-t border-neutral-200/60 py-12">
      <div className="prose prose-sm max-w-none font-[var(--font-sans)]">
        <h2 className="text-[18px] font-semibold text-[#1F1A1C]">
          Gabinet kosmetyczny {headingName} – {cityLoc}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[#6F5E64]">
          {headingName} to jeden z gabinetów kosmetycznych {cityIn} dostępnych przez platformę
          Zabiegi Odart. Na tej stronie znajdziesz ofertę zabiegów, specjalizacje, opinie klientów
          oraz możliwość umówienia wizyty online.
        </p>
      </div>
    </section>
  );
}
