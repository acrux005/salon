import { redirect } from "next/navigation"
import { getWetRedirectPath } from "@/lib/wetRedirect";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { WetCatalogManager } from "@/components/wet/WetCatalogManager";
import type { VetCatalogItemDto } from "@/lib/vet/catalog";

export default async function WetPanelKatalogPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login"));
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) redirect(await getWetRedirectPath("/login"));

  const prisma = getPrisma();
  const rows = await prisma.vaccineType.findMany({
    where: { vetClinicId },
    orderBy: [{ category: "asc" }, { order: "asc" }, { name: "asc" }],
  });

  const items: VetCatalogItemDto[] = rows.map((r) => ({
    id: r.id,
    category: r.category,
    name: r.name,
    manufacturer: r.manufacturer,
    defaultPrice: r.defaultPrice,
    defaultIntervalDays: r.defaultIntervalDays,
    defaultVisitType: r.defaultVisitType,
    trackStock: r.trackStock,
    stockDoses: r.stockDoses,
    urplId: r.urplId,
    permitNumber: r.permitNumber,
    active: r.active,
    order: r.order,
  }));

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/wet/panel" className="text-[14px] font-medium text-wet-teal hover:underline">
        ← Panel
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-wet-navy">Cennik i preparaty</h1>
      <p className="mt-2 text-[15px] text-wet-navy-muted">
        Katalog usług weterynaryjnych — bez magazynu ERP. Wybierasz pozycję przy wizycie lub szczepieniu.
      </p>
      <div className="mt-8">
        <WetCatalogManager initialItems={items} />
      </div>
    </main>
  );
}
