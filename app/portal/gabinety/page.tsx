import Link from "next/link";
import { PORTAL_LOCALE } from "@/content/portalLocale";
import { PORTAL_CITIES_TOTAL, PORTAL_SEO_CITIES } from "@/content/portalCities";
import { getAllClinicRecordsAsync } from "@/lib/skinmatch/clinics";
import { ClinicList } from "@/components/portal/ClinicList";
import { PortalCitiesPicker } from "@/components/portal/PortalCitiesPicker";

const SITE_URL = "https://salon.odart.pl";

export const metadata = {
  title: `Gabinety kosmetyczne – ${PORTAL_LOCALE.regionLabel}`,
  description: `Lista gabinetów kosmetycznych w ${PORTAL_LOCALE.regionLong}. Sprawdź ofertę, opinie i umów wizytę. Profesjonalne salony kosmetyczne – twarz, ciało, paznokcie.`,
  alternates: { canonical: `${SITE_URL}/portal/gabinety` },
  openGraph: {
    title: `Gabinety kosmetyczne – ${PORTAL_LOCALE.regionLabel}`,
    description: `Lista gabinetów kosmetycznych w ${PORTAL_LOCALE.regionLong}. Sprawdź ofertę, opinie i umów wizytę online.`,
    url: `${SITE_URL}/portal/gabinety`,
    locale: "pl_PL",
    siteName: "Zabiegi Odart",
  },
};

type Props = { searchParams: Promise<{ city?: string }> };

export default async function GabinetyPage({ searchParams }: Props) {
  const params = await searchParams;
  const city = (params?.city as string | undefined)?.trim() || undefined;
  const clinics = await getAllClinicRecordsAsync(city);

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-[var(--font-serif)] text-3xl font-medium text-[#1F1A1C] sm:text-4xl">
          {city ? `Gabinety kosmetyczne – ${city}` : `Gabinety kosmetyczne w ${PORTAL_LOCALE.regionLong}`}
        </h1>
        <p className="mt-3 max-w-3xl font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
          Przeglądaj sprawdzone gabinety kosmetyczne i salony piękności w całej Polsce. Każdy z naszych partnerów został zweryfikowany pod kątem jakości usług, sprzętu i podejścia do klienta. Dzięki Zabiegi Odart szybko znajdziesz salon dopasowany do potrzeb swojej skóry – czy szukasz zabiegów na twarz, masaży, manicure czy depilacji.
        </p>
      </header>

      {!city && (
        <section className="mb-10 rounded-2xl border border-neutral-200/80 bg-neutral-50/60 p-6 sm:p-8">
          <h2 className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
            Gabinety kosmetyczne wg miasta
          </h2>
          <p className="mt-2 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
            Katalog {PORTAL_CITIES_TOTAL} miast w Polsce — wyszukaj i przejdź do listy gabinetów w wybranej
            miejscowości.
          </p>
          <PortalCitiesPicker cities={PORTAL_SEO_CITIES} />
        </section>
      )}

      <section aria-labelledby="lista-gabinetow">
        <h2 id="lista-gabinetow" className="font-[var(--font-sans)] text-xl font-semibold text-[#1F1A1C]">
          {city ? `${clinics.length} gabinetów w ${city}` : "Wszystkie gabinety z ofertą"}
        </h2>
        <p className="mt-1 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
          Wybierz gabinet i sprawdź ofertę, terminy oraz opinie. Możesz umówić wizytę bezpośrednio przez stronę gabinetu.
        </p>
        <div className="mt-6">
          <ClinicList clinics={clinics} city={city ?? null} />
        </div>
      </section>

      <section className="mt-16 border-t border-neutral-200/60 pt-12">
        <h2 className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
          Dlaczego warto wybrać gabinet przez Zabiegi Odart?
        </h2>
        <ul className="mt-4 space-y-3 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
          <li>
            <strong className="text-[#1F1A1C]">Dopasowanie do potrzeb skóry</strong> – każdy gabinet w naszej bazie ma określone specjalizacje (np. trądzik, anti-aging, skóra naczynkowa). Dzięki temu nie trafisz do salonu, który nie obsługuje Twojego problemu.
          </li>
          <li>
            <strong className="text-[#1F1A1C]">Opinie i oceny</strong> – pokazujemy realne opinie klientów, które pomogą Ci podjąć świadomą decyzję.
          </li>
          <li>
            <strong className="text-[#1F1A1C]">Rezerwacja online</strong> – większość gabinetów oferuje umawianie wizyt przez internet. Sprawdź dostępność i zarezerwuj termin w kilka minut.
          </li>
          <li>
            <strong className="text-[#1F1A1C]">Oferta dopasowana do lokalizacji</strong> – działamy na terenie {PORTAL_LOCALE.regionLong}, więc łatwo znajdziesz gabinet blisko domu, pracy lub na wyjeździe.
          </li>
        </ul>
      </section>
    </article>
  );
}
