import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import type { VetCatalogItemDto } from "@/lib/vet/catalog";

function mapItem(row: {
  id: string;
  category: string;
  name: string;
  manufacturer: string | null;
  defaultPrice: number | null;
  defaultIntervalDays: number;
  defaultVisitType: string | null;
  trackStock: boolean;
  stockDoses: number | null;
  urplId: string | null;
  permitNumber: string | null;
  active: boolean;
  order: number;
}): VetCatalogItemDto {
  return {
    id: row.id,
    category: row.category,
    name: row.name,
    manufacturer: row.manufacturer,
    defaultPrice: row.defaultPrice,
    defaultIntervalDays: row.defaultIntervalDays,
    defaultVisitType: row.defaultVisitType,
    trackStock: row.trackStock,
    stockDoses: row.stockDoses,
    urplId: row.urplId,
    permitNumber: row.permitNumber,
    active: row.active,
    order: row.order,
  };
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) return NextResponse.json({ items: [] });

  const url = new URL(request.url);
  const category = url.searchParams.get("category")?.trim();
  const activeOnly = url.searchParams.get("active") !== "false";

  const prisma = getPrisma();
  const rows = await prisma.vaccineType.findMany({
    where: {
      vetClinicId,
      ...(category ? { category } : {}),
      ...(activeOnly ? { active: true } : {}),
    },
    orderBy: [{ category: "asc" }, { order: "asc" }, { name: "asc" }],
  });

  return NextResponse.json({ items: rows.map(mapItem) });
}
