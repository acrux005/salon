import { getCityLocative } from "@/content/portalLocale";

interface ClinicSeoContentProps {
  clinicName: string;
  city: string;
}

/**
 * Blok treści SEO na stronie gabinetu – rozbudowany tekst pod wyszukiwarki.
 */
export function ClinicSeoContent({ clinicName, city }: ClinicSeoContentProps) {
  const cityLoc = getCityLocative(city);
  return (
    <section className="border-t border-neutral-200/60 py-12">
      <div className="prose prose-sm max-w-none font-[var(--font-sans)]">
        <h2 className="text-[18px] font-semibold text-[#1F1A1C]">
          Gabinet kosmetyczny {clinicName} – {cityLoc}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[#6F5E64]">
          {clinicName} to jeden z gabinetów kosmetycznych w {cityLoc} dostępnych przez platformę Zabiegi Odart. Na tej stronie znajdziesz ofertę zabiegów, specjalizacje, opinie klientów oraz możliwość umówienia wizyty online. Jeśli szukasz salonu kosmetycznego w {cityLoc} – sprawdź profil {clinicName} oraz inne gabinety w naszej bazie. Platforma łączy sprawdzone salony i gabinety kosmetyczne z klientami szukającymi profesjonalnej pielęgnacji twarzy, ciała, paznokci czy masaży.
        </p>
        <h3 className="mt-6 text-[16px] font-semibold text-[#1F1A1C]">
          Zabiegi kosmetyczne w {cityLoc}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-[#6F5E64]">
          W {cityLoc} działają liczne gabinety kosmetyczne oferujące zabiegi na twarz (oczyszczanie, peelingi, zabiegi anti-aging, pielęgnację skóry naczynkowej, trądzikowej czy z przebarwieniami), masaże, depilację, manicure, pedicure, przedłużanie rzęs i inne usługi. Wybierając gabinet, warto sprawdzić jego specjalizacje oraz opinie. Zabiegi Odart pomaga dopasować salon do potrzeb skóry – przejdź analizę w portalu lub przeglądaj listę gabinetów w {cityLoc}.
        </p>
      </div>
    </section>
  );
}
