import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { CLIENT_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { getClinicBySlugAsync } from "@/lib/skinmatch/clinics";
import { buildClinicPageData } from "@/lib/skinmatch/clinicData";
import { ClinicDataProvider } from "@/contexts/ClinicDataContext";
import { ClinicContactModalProvider } from "@/contexts/ClinicContactModalContext";
import { ClinicBookingProvider } from "@/contexts/ClinicBookingContext";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { ClinicHeroCompact } from "@/components/clinic/ClinicHeroCompact";
import { ClinicMatching } from "@/components/clinic/ClinicMatching";
import { ClinicSpecializations } from "@/components/clinic/ClinicSpecializations";
import { ClinicTreatmentsBooksy } from "@/components/clinic/ClinicTreatmentsBooksy";
import { ClinicEffects } from "@/components/clinic/ClinicEffects";
import { ClinicAbout } from "@/components/clinic/ClinicAbout";
import { ClinicFAQ } from "@/components/clinic/ClinicFAQ";
import { ClinicFinalCTA } from "@/components/clinic/ClinicFinalCTA";
import { ClinicReviews } from "@/components/clinic/ClinicReviews";
import { ClinicSeoContent } from "@/components/clinic/ClinicSeoContent";
import { ClinicSidebar } from "@/components/clinic/ClinicSidebar";
import { getClinicReviewsAsync } from "@/lib/clinicReviews";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getPortalCitySlug } from "@/content/portalCities";
import { ClinicUnverifiedNotice } from "@/components/clinic/ClinicUnverifiedNotice";
import { isClinicClaimed } from "@/lib/catalogListingServer";
import { splitCatalogClinicName } from "@/lib/catalog/clinicDisplayName";

/** Wyłącz cache — opinie muszą być zawsze aktualne. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = "https://salon.odart.pl";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const clinic = await getClinicBySlugAsync(slug);
  if (!clinic) return { title: "Gabinet" };
  const { displayName } = splitCatalogClinicName(clinic.name);
  const titleName = displayName || clinic.name;
  const title = `${titleName} — gabinet kosmetyczny`;
  const description =
    (clinic.description?.trim().slice(0, 160) || `Gabinet ${titleName} – sprawdź ofertę i umów wizytę.`) +
    (clinic.description && clinic.description.length > 160 ? "…" : "");
  const canonical = `${SITE_URL}/portal/gabinet/${slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: titleName,
      description,
      url: canonical,
      type: "website",
      locale: "pl_PL",
    },
  };
}

export default async function PortalClinicPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ problem?: string; rezerwacja?: string }>;
}) {
  const { slug } = await params;
  const record = await getClinicBySlugAsync(slug);
  if (!record) notFound();

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const claimed = record.id ? await isClinicClaimed(record.id) : false;
  const { displayName, legalName } = splitCatalogClinicName(record.name);
  const titleName = displayName || record.name;

  let catalogUpdatedAt: Date | null = null;
  try {
    const row = await getPrisma().clinic.findUnique({
      where: { id: record.id },
      select: { updatedAt: true },
    });
    catalogUpdatedAt = row?.updatedAt ?? null;
  } catch {
    catalogUpdatedAt = null;
  }

  const [data, session, reviews] = await Promise.all([
    buildClinicPageData(record),
    getServerSession(authOptions),
    getClinicReviewsAsync(record.id),
  ]);

  const role = (session?.user as { role?: string })?.role;
  const clientId = (session?.user as { clientId?: string })?.clientId;
  const isClient = role === CLIENT_ROLE && !!clientId;

  let sessionInfo: { isClient: boolean; clientInfo?: { name?: string; email?: string; phone?: string } } = {
    isClient: false,
  };
  if (isClient && clientId) {
    const prisma = getPrisma();
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { name: true, email: true, phone: true },
    });
    if (client) {
      sessionInfo = {
        isClient: true,
        clientInfo: {
          name: client.name ?? undefined,
          email: client.email,
          phone: client.phone ?? undefined,
        },
      };
    }
  }

  const initialOpenBooking =
    resolvedSearchParams?.rezerwacja === "1" || resolvedSearchParams?.rezerwacja === "true";
  const problem = resolvedSearchParams?.problem ?? undefined;
  const citySlug = getPortalCitySlug(record.city);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        name: titleName,
        url: `${SITE_URL}/portal/gabinet/${record.slug}`,
        address: { "@type": "PostalAddress", addressLocality: record.city },
        ...(record.kontakt?.phone && { telephone: record.kontakt.phone }),
        ...(record.reviewCount > 0 && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: record.rating ?? 0,
            reviewCount: record.reviewCount ?? 0,
            bestRating: 5,
          },
        }),
        ...(reviews.length > 0 && {
          review: reviews.slice(0, 5).map((r) => ({
            "@type": "Review" as const,
            author: { "@type": "Person" as const, name: r.authorName },
            datePublished: new Date(r.createdAt).toISOString().slice(0, 10),
            reviewRating: { "@type": "Rating" as const, ratingValue: r.rating, bestRating: 5 },
            reviewBody: r.content,
          })),
        }),
      },
      ...(claimed && data.faq.items.length > 0
        ? [
            {
              "@type": "FAQPage" as const,
              mainEntity: data.faq.items.map((q) => ({
                "@type": "Question" as const,
                name: q.question,
                acceptedAnswer: { "@type": "Answer" as const, text: q.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <ClinicDataProvider data={{ ...data, sessionInfo, initialOpenBooking, claimed }}>
      <ClinicContactModalProvider>
        <ClinicBookingProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <HeaderPortal />
          <main className="min-h-screen bg-white">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="border-b border-neutral-100 pb-4 pt-4">
                <Breadcrumbs
                  items={[
                    { label: "Portal", href: "/portal" },
                    { label: "Gabinety", href: "/portal/gabinety" },
                    ...(record.city && citySlug
                      ? [{ label: record.city, href: `/portal/gabinety/${citySlug}` }]
                      : []),
                    { label: titleName },
                  ]}
                />
                <Link
                  href={record.city && citySlug ? `/portal/gabinety/${citySlug}` : "/portal/gabinety"}
                  className="mt-3 inline-flex items-center gap-1 font-[var(--font-sans)] text-[14px] text-pink-600 transition-colors hover:text-pink-700"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  Wróć do listy gabinetów
                </Link>
              </div>
              <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-10 lg:pt-6">
                <div className="min-w-0">
                  <ClinicHeroCompact />
                  {!claimed ? (
                    <ClinicUnverifiedNotice slug={record.slug} updatedAt={catalogUpdatedAt} />
                  ) : null}
                  {claimed ? (
                    <>
                      <ClinicMatching problem={problem} />
                      <ClinicSpecializations activeProblem={problem} />
                      <ClinicTreatmentsBooksy problem={problem} />
                      <ClinicEffects />
                      <ClinicAbout />
                      <ClinicFAQ />
                    </>
                  ) : null}
                  <ClinicFinalCTA />
                  <ClinicReviews
                    reviews={reviews}
                    clinicId={record.id}
                    clinicSlug={record.slug}
                    isClient={sessionInfo.isClient}
                  />
                  <ClinicSeoContent
                    clinicName={record.name}
                    city={record.city}
                    claimed={claimed}
                    legalName={legalName}
                  />
                </div>
                <ClinicSidebar />
              </div>
            </div>
          </main>
          <FooterPortal />
        </ClinicBookingProvider>
      </ClinicContactModalProvider>
    </ClinicDataProvider>
  );
}
