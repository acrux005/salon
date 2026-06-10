import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ADMIN_ROLE } from "@/lib/auth";
import { getClinicByIdAsync } from "@/lib/skinmatch/clinics";
import { getCatalogAsync } from "@/lib/skinmatch/treatmentsDb";
import { getClinicTreatmentRequestsAsync } from "@/lib/clinicTreatmentRequest";
import { getTaxonomyAsync, getTreatmentsTaxonomyMapAsync } from "@/lib/taxonomy";
import { getClinicTreatmentPricesAsync } from "@/lib/clinicTreatmentPrices";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { ClinicEditForm } from "./ClinicEditForm";
import { ClinicTreatmentRequestsSection } from "./ClinicTreatmentRequestsSection";

export default async function PanelKlinikaPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role === ADMIN_ROLE) redirect("/portal/admin");
  const clinicId = (session?.user as { clinicId?: string } | undefined)?.clinicId;
  if (!clinicId) redirect("/portal/login");

  const [clinic, treatments, requests, treatmentData, taxonomy] = await Promise.all([
    getClinicByIdAsync(clinicId),
    getCatalogAsync(),
    getClinicTreatmentRequestsAsync(clinicId),
    getClinicTreatmentPricesAsync(clinicId),
    getTaxonomyAsync().catch(() => ({ categories: [], tags: [] })),
  ]);
  if (!clinic) redirect("/portal/login");
  const treatmentTaxonomyMap =
    treatments.length > 0
      ? await getTreatmentsTaxonomyMapAsync(treatments.map((t) => t.id)).catch(() => new Map())
      : new Map();
  const treatmentCategoryMap: Record<string, string | null> = {};
  treatmentTaxonomyMap.forEach((v, id) => {
    treatmentCategoryMap[id] = v.categorySlug ?? null;
  });
  const { prices: initialTreatmentPrices, durations: initialTreatmentDurations } = treatmentData;

  return (
    <>
      <HeaderPortal />
      <main className="min-h-screen bg-white py-12">
        <div className="mx-auto max-w-2xl px-4">
          <Link href="/portal/panel" className="text-[14px] font-medium text-pink-600 hover:underline">
            ← Panel
          </Link>
          <h1 className="mt-4 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
            Edycja danych gabinetu
          </h1>
          <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
            Zmiany będą widoczne na stronie /portal/gabinet/{clinic.slug}
          </p>
          <div className="mt-8">
            <ClinicEditForm
              clinic={clinic}
              treatments={treatments}
              initialTreatmentPrices={initialTreatmentPrices}
              initialTreatmentDurations={initialTreatmentDurations}
              categories={taxonomy.categories}
              treatmentCategoryMap={treatmentCategoryMap}
            />
          </div>
          <ClinicTreatmentRequestsSection className="mt-12" initialRequests={requests} />
        </div>
      </main>
      <FooterPortal />
    </>
  );
}
