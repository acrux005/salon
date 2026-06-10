import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import {
  getTreatmentBySlugOrIdAsync,
  getClinicsOfferingTreatmentAsync,
} from "@/lib/skinmatch/treatmentsDb";
import type { TreatmentWithSeo, ClinicOfferingTreatment } from "@/lib/skinmatch/schema";

const SITE_URL = "https://salon.odart.pl";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const treatment = await getTreatmentBySlugOrIdAsync(slug);
  if (!treatment) return { title: "Zabieg" };
  const title = treatment.metaTitle ?? `${treatment.nazwa} – Polska`;
  const rawDesc =
    treatment.metaDescription ?? `${treatment.opis} Sprawdź ceny i gabinety w Polsce.`;
  const description = rawDesc.length > 160 ? rawDesc.slice(0, 157) + "…" : rawDesc;
  const canonical = `${SITE_URL}/portal/zabieg/${slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: treatment.nazwa ?? title,
      description,
      url: canonical,
      type: "website",
      locale: "pl_PL",
    },
  };
}

function HeroSection({
  treatment,
  clinicCount,
}: {
  treatment: TreatmentWithSeo;
  clinicCount: number;
}) {
  const displaySlug = treatment.slug ?? treatment.id.replace(/_/g, "-");
  return (
    <section className="border-b border-neutral-100 bg-white py-10 lg:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 font-[var(--font-sans)] text-[13px] text-neutral-400"
        >
          <Link href="/portal" className="hover:text-pink-600">
            Zabiegi Odart
          </Link>
          <span>›</span>
          <Link href="/portal/gabinety" className="hover:text-pink-600">
            Zabiegi
          </Link>
          <span>›</span>
          <span className="text-[#6F5E64]">{treatment.nazwa}</span>
        </nav>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {treatment.heroImageUrl && (
            <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-56 sm:w-64">
              <Image
                src={treatment.heroImageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 256px"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="font-[var(--font-serif)] text-2xl font-normal leading-tight text-[#1F1A1C] sm:text-3xl lg:text-[2.2rem]">
              {treatment.nazwa} – Polska
            </h1>
            <p className="mt-4 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
              {treatment.opis}
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-[var(--font-sans)] text-[14px] text-[#4a3f42]">
              <li>⏱ ok. {treatment.czas} min</li>
              <li>od {treatment.cena_od} zł</li>
              <li>{clinicCount} {clinicCount === 1 ? "gabinet" : clinicCount < 5 ? "gabinety" : "gabinetów"}</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/portal/gabinety?zabieg=${encodeURIComponent(displaySlug)}`}
                className="inline-block rounded-full border border-pink-400 bg-pink-500 px-6 py-3 font-[var(--font-sans)] text-[15px] font-medium text-white transition-all hover:bg-pink-600"
              >
                Umów wizytę
              </Link>
              <Link
                href={`/portal/gabinety?zabieg=${encodeURIComponent(displaySlug)}`}
                className="inline-block rounded-full border border-pink-400 bg-white px-6 py-3 font-[var(--font-sans)] text-[15px] font-medium text-pink-600 transition-all hover:bg-pink-50"
              >
                Zobacz gabinety oferujące ten zabieg
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContentSection({ treatment }: { treatment: TreatmentWithSeo }) {
  const hasLong = treatment.longDescription?.trim();
  return (
    <section className="border-b border-neutral-100 py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C] sm:text-2xl">
          Czym jest zabieg?
        </h2>
        <div
          className="prose-custom mt-4 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#4a3f42] [&_p]:mb-4 [&_h3]:mt-6 [&_h3]:font-sans [&_h3]:text-[16px] [&_h3]:font-semibold [&_h3]:text-[#1F1A1C]"
          dangerouslySetInnerHTML={{
            __html: hasLong
              ? treatment.longDescription!
              : `<p>${treatment.opis}</p><p>Szczegółowy opis zabiegu zostanie uzupełniony.</p>`,
          }}
        />
      </div>
    </section>
  );
}

function EffectsSection({ treatment }: { treatment: TreatmentWithSeo }) {
  const items = treatment.indications?.length
    ? treatment.indications
    : [treatment.opis];
  return (
    <section className="border-b border-neutral-100 py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C] sm:text-2xl">
          Efekty zabiegu
        </h2>
        <ul className="mt-4 space-y-2 font-[var(--font-sans)] text-[15px] text-[#4a3f42]">
          {items.map((text, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-pink-500">✔</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function WskazaniaSection({ treatment }: { treatment: TreatmentWithSeo }) {
  if (!treatment.indications?.length) return null;
  return (
    <section className="border-b border-neutral-100 py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C] sm:text-2xl">
          Wskazania
        </h2>
        <ul className="mt-4 list-disc space-y-1 pl-5 font-[var(--font-sans)] text-[15px] text-[#4a3f42]">
          {treatment.indications.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PrzeciwwskazaniaSection({ treatment }: { treatment: TreatmentWithSeo }) {
  if (!treatment.contraindications?.length) return null;
  return (
    <section className="border-b border-neutral-100 py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C] sm:text-2xl">
          Przeciwwskazania
        </h2>
        <ul className="mt-4 list-disc space-y-1 pl-5 font-[var(--font-sans)] text-[15px] text-[#4a3f42]">
          {treatment.contraindications.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PrzygotowanieSection({ treatment }: { treatment: TreatmentWithSeo }) {
  if (!treatment.preparation?.trim()) return null;
  return (
    <section className="border-b border-neutral-100 py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C] sm:text-2xl">
          Jak się przygotować?
        </h2>
        <div
          className="prose-custom mt-4 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#4a3f42] [&_p]:mb-4"
          dangerouslySetInnerHTML={{ __html: treatment.preparation }}
        />
      </div>
    </section>
  );
}

function FaqSection({ treatment }: { treatment: TreatmentWithSeo }) {
  if (!treatment.faq?.length) return null;
  return (
    <section className="border-b border-neutral-100 py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C] sm:text-2xl">
          Najczęstsze pytania
        </h2>
        <dl className="mt-6 space-y-6">
          {treatment.faq.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-neutral-100 bg-neutral-50/60 px-5 py-5"
            >
              <dt className="font-[var(--font-sans)] text-[15px] font-semibold text-[#1F1A1C]">
                {item.question}
              </dt>
              <dd className="mt-2 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#4a3f42]">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function GabinetySection({
  clinics,
  treatmentName,
}: {
  clinics: ClinicOfferingTreatment[];
  treatmentName: string;
}) {
  if (clinics.length === 0) return null;
  return (
    <section className="border-b border-neutral-100 py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C] sm:text-2xl">
          Gabinety oferujące {treatmentName}
        </h2>
        <ul className="mt-6 space-y-4">
          {clinics.map((c) => (
            <li key={c.id}>
              <Link
                href={`/portal/gabinet/${c.slug}?rezerwacja=1`}
                className="flex items-center gap-4 rounded-xl border border-neutral-100 bg-white p-4 transition-colors hover:border-pink-200 hover:bg-pink-50/30"
              >
                {c.avatarUrl ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    <Image
                      src={c.avatarUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-neutral-100 font-[var(--font-sans)] text-lg font-medium text-neutral-400">
                    {c.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <span className="font-[var(--font-sans)] font-medium text-[#1F1A1C]">
                    {c.name}
                  </span>
                  <p className="mt-0.5 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
                    {c.city} · od {c.cenaOd} zł · ok. {c.czasMin} min
                    {c.rating != null && (
                      <> · ⭐ {c.rating.toFixed(1)}{c.reviewCount != null && ` (${c.reviewCount})`}</>
                    )}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-pink-500 px-4 py-2 font-[var(--font-sans)] text-[14px] font-medium text-white">
                  Umów wizytę →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <Link
            href="/portal/gabinety"
            className="font-[var(--font-sans)] text-[14px] text-pink-600 hover:underline"
          >
            Wszystkie gabinety w Polsce →
          </Link>
        </p>
      </div>
    </section>
  );
}

export default async function PortalZabiegPage({ params }: PageProps) {
  const { slug } = await params;
  const treatment = await getTreatmentBySlugOrIdAsync(slug);
  if (!treatment) notFound();

  const clinics = await getClinicsOfferingTreatmentAsync(
    treatment.id,
    treatment.cena_od,
    treatment.czas
  );

  const jsonLdGraph: object[] = [
    {
      "@type": "Service",
      name: treatment.nazwa,
      description: treatment.metaDescription ?? treatment.opis,
      areaServed: {
        "@type": "Country",
        name: "Polska",
      },
      provider: {
        "@type": "Organization",
        name: "Zabiegi Odart",
        url: `${SITE_URL}/portal`,
      },
      offers: {
        "@type": "Offer",
        priceRange: `od ${treatment.cena_od} zł`,
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Zabiegi Odart", item: `${SITE_URL}/portal` },
        { "@type": "ListItem", position: 2, name: "Zabiegi", item: `${SITE_URL}/portal/gabinety` },
        {
          "@type": "ListItem",
          position: 3,
          name: treatment.nazwa,
          item: `${SITE_URL}/portal/zabieg/${slug}`,
        },
      ],
    },
  ];

  if (treatment.faq?.length) {
    jsonLdGraph.push({
      "@type": "FAQPage",
      mainEntity: treatment.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  const jsonLd = { "@context": "https://schema.org", "@graph": jsonLdGraph };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeaderPortal />
      <main>
        <HeroSection treatment={treatment} clinicCount={clinics.length} />
        <ContentSection treatment={treatment} />
        <EffectsSection treatment={treatment} />
        <WskazaniaSection treatment={treatment} />
        <PrzeciwwskazaniaSection treatment={treatment} />
        <PrzygotowanieSection treatment={treatment} />
        <FaqSection treatment={treatment} />
        <GabinetySection clinics={clinics} treatmentName={treatment.nazwa} />
      </main>
      <FooterPortal />
    </>
  );
}
