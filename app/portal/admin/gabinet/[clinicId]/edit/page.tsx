import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ADMIN_ROLE } from "@/lib/auth";
import { getClinicByIdAsync } from "@/lib/skinmatch/clinics";
import { getCatalogAsync } from "@/lib/skinmatch/treatmentsDb";
import { getTaxonomyAsync, getTreatmentsTaxonomyMapAsync } from "@/lib/taxonomy";
import { getClinicTreatmentPricesAsync } from "@/lib/clinicTreatmentPrices";
import { AdminClinicEditForm } from "./AdminClinicEditForm";

export default async function AdminEditClinicPage({ params }: { params: { clinicId: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  if (role !== ADMIN_ROLE) redirect("/portal/admin");

  const clinic = await getClinicByIdAsync(params.clinicId);
  if (!clinic) redirect("/portal/admin");

  const [treatments, treatmentData, taxonomy] = await Promise.all([
    getCatalogAsync(),
    getClinicTreatmentPricesAsync(params.clinicId),
    getTaxonomyAsync().catch(() => ({ categories: [], tags: [] })),
  ]);

  const treatmentTaxonomyMap =
    treatments.length > 0
      ? await getTreatmentsTaxonomyMapAsync(treatments.map((t) => t.id)).catch(() => new Map())
      : new Map<string, { categorySlug: string | null; subcategorySlug: string | null; tagSlugs: string[] }>();
  const treatmentCategoryMap: Record<string, string | null> = {};
  treatmentTaxonomyMap.forEach((v, id) => {
    treatmentCategoryMap[id] = v.categorySlug ?? null;
  });
  const { prices: initialTreatmentPrices, durations: initialTreatmentDurations } = treatmentData;

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="mx-auto max-w-2xl px-4">
        <Link href="/portal/admin" className="text-[14px] font-medium text-pink-600 hover:underline">
          ← Panel admina
        </Link>
        <h1 className="mt-4 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
          Edycja gabinetu: {clinic.name}
        </h1>
        <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          Zmiany będą widoczne na stronie /portal/gabinet/{clinic.slug}
        </p>
        <div className="mt-8">
          <AdminClinicEditForm
            clinic={clinic}
            clinicId={params.clinicId}
            treatments={treatments}
            initialTreatmentPrices={initialTreatmentPrices}
            initialTreatmentDurations={initialTreatmentDurations}
            categories={taxonomy.categories}
            treatmentCategoryMap={treatmentCategoryMap}
          />
        </div>
      </div>
    </main>
  );
}
