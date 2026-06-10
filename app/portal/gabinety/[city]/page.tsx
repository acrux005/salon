import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortalCityBySlug, PORTAL_SEO_CITIES, isTopMarketingCity } from "@/content/portalCities";
import { getAllClinicRecordsAsync } from "@/lib/skinmatch/clinics";
import { ClinicList } from "@/components/portal/ClinicList";
import { formatCityLocativePhrase, shouldIndexCityPage } from "@/lib/portalCitySeo";
import { buildCitySeoMeta } from "@/lib/cityPageSeo";
import { ChevronRight } from "lucide-react";

type Props = { params: Promise<{ city: string }> };

const SITE_URL = "https://salon.odart.pl";

function cityHeading(city: NonNullable<ReturnType<typeof getPortalCityBySlug>>): string {
  if (city.locativeManual && city.locative !== city.name) {
    return `Gabinety kosmetyczne w ${city.locative}`;
  }
  return `Gabinety kosmetyczne — ${city.name}`;
}

export function generateStaticParams() {
  return PORTAL_SEO_CITIES.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { city: slug } = await params;
  const city = getPortalCityBySlug(slug);
  if (!city) return { title: "Gabinety" };
  const clinics = await getAllClinicRecordsAsync(city.name);
  const indexable = shouldIndexCityPage(slug, clinics.length > 0);
  const canonical = `${SITE_URL}/portal/gabinety/${slug?.toLowerCase()}`;
  const { title, description, keywords } = buildCitySeoMeta(city, clinics.length);
  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: "pl_PL",
      siteName: "Zabiegi Odart",
    },
  };
}

export default async function GabinetyCityPage({ params }: Props) {
  const { city: slug } = await params;
  const city = getPortalCityBySlug(slug);
  if (!city) notFound();

  const clinics = await getAllClinicRecordsAsync(city.name);
  const locPhrase = formatCityLocativePhrase(city);
  const showPartnerCta = clinics.length === 0;

  const jsonLd =
    clinics.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: cityHeading(city),
          description: `Lista gabinetów kosmetycznych w ${locPhrase}.`,
          numberOfItems: clinics.length,
          itemListElement: clinics.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "LocalBusiness",
              name: c.name,
              address: { "@type": "PostalAddress", addressLocality: c.city },
              url: `${SITE_URL}/portal/gabinet/${c.slug}`,
              aggregateRating:
                c.reviewCount > 0
                  ? {
                      "@type": "AggregateRating",
                      ratingValue: c.rating,
                      reviewCount: c.reviewCount,
                    }
                  : undefined,
            },
          })),
        }
      : null;

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}
      <nav aria-label="Nawigacja breadcrumb" className="mb-6">
        <ol
          className="flex flex-wrap items-center gap-1.5 font-[var(--font-sans)] text-[13px] text-[#6F5E64]"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/portal" itemProp="item" className="transition-colors hover:text-pink-600">
              <span itemProp="name">Zabiegi Odart</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <li aria-hidden className="flex items-center">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/portal/gabinety" itemProp="item" className="transition-colors hover:text-pink-600">
              <span itemProp="name">Gabinety</span>
            </Link>
            <meta itemProp="position" content="2" />
          </li>
          <li aria-hidden className="flex items-center">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" className="font-medium text-[#1F1A1C]">
              {city.name}
            </span>
            <meta itemProp="position" content="3" />
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="font-[var(--font-serif)] text-3xl font-medium text-[#1F1A1C] sm:text-4xl">
          Gabinet kosmetyczny {city.name}
        </h1>
        <p className="mt-2 font-[var(--font-sans)] text-[17px] font-medium text-[#4a3f42]">{cityHeading(city)}</p>
        <p className="mt-3 max-w-2xl font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
          {clinics.length > 0
            ? "Wybierz gabinet i sprawdź ofertę, terminy oraz opinie. Dopasujemy salon do potrzeb Twojej skóry."
            : `W ${locPhrase} wkrótce pojawią się partnerzy Zabiegów Odart. Prowadzisz gabinet? Dołącz do platformy.`}
        </p>
        {clinics.length > 0 && (
          <p className="mt-2 font-[var(--font-sans)] text-[14px] text-[#8A7F84]">
            {clinics.length} {clinics.length === 1 ? "gabinet" : clinics.length < 5 ? "gabinety" : "gabinetów"} w tej
            lokalizacji
          </p>
        )}
      </header>

      {showPartnerCta && (
        <section className="mb-10 rounded-2xl border border-pink-200 bg-pink-50/50 p-6 sm:p-8">
          <h2 className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
            {isTopMarketingCity(slug)
              ? `Szukamy gabinetów partnerskich w ${locPhrase}`
              : `Brak gabinetu w ${locPhrase}`}
          </h2>
          <p className="mt-2 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
            Prowadzisz salon kosmetyczny? Dołącz do Zabiegów Odart — widoczność w wyszukiwarce, dopasowanie klientów i
            rezerwacje online.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/portal/dla-gabinetow"
              className="inline-flex rounded-full bg-pink-500 px-6 py-3 font-[var(--font-sans)] text-[14px] font-medium text-white hover:bg-pink-600"
            >
              Dołącz gabinet
            </Link>
            <Link
              href="/strona-internetowa-dla-gabinetu-kosmetycznego"
              className="inline-flex rounded-full border border-pink-300 px-6 py-3 font-[var(--font-sans)] text-[14px] font-medium text-pink-700 hover:bg-pink-50"
            >
              Strona WWW dla gabinetu
            </Link>
          </div>
        </section>
      )}

      <section className="mb-10 rounded-2xl border border-neutral-200/80 bg-neutral-50/60 p-6 sm:p-8">
        <h2 className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
          Gabinety kosmetyczne i salony piękności — {city.name}
        </h2>
        <p className="mt-3 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
          {clinics.length > 0
            ? `Poniżej lista gabinetów w ${locPhrase}. Zabiegi na twarz i ciało, anti-aging, paznokcie, depilacja — sprawdź opinie i umów wizytę.`
            : `Zabiegi Odart rozwijają sieć w ${locPhrase}. Wróć wkrótce lub wybierz inne miasto z listy.`}
        </p>
      </section>

      <section aria-labelledby="lista-gabinetow">
        <h2 id="lista-gabinetow" className="sr-only">
          Lista gabinetów kosmetycznych — {city.name}
        </h2>
        <ClinicList clinics={clinics} city={city.name} />
      </section>

      <section className="mt-16 border-t border-neutral-200/60 pt-12">
        <h2 className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
          Jak wybrać gabinet kosmetyczny — {city.name}?
        </h2>
        <p className="mt-3 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
          Sprawdź specjalizacje salonu, opinie i dostępne terminy. Możesz też przejść analizę skóry w Zabiegach Odart —
          polecimy dopasowane gabinety w całej Polsce.
        </p>
        <p className="mt-4">
          <Link href="/portal/gabinety" className="font-medium text-pink-600 hover:underline">
            ← Wszystkie miasta ({PORTAL_SEO_CITIES.length})
          </Link>
        </p>
      </section>
    </article>
  );
}
