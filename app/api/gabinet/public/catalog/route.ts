import { NextResponse } from "next/server";
import { getGabClinicBySlugAsync } from "@/lib/gabinet/clinics";
import { getPrisma } from "@/lib/db";

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("gab_slug")?.trim();
  if (!slug) return NextResponse.json({ items: [], vertical: "dent" });

  const clinic = await getGabClinicBySlugAsync(slug).catch(() => null);
  if (!clinic?.isPublished) return NextResponse.json({ items: [], vertical: "dent" });

  const items = await getPrisma().gabTreatmentCatalogItem.findMany({
    where: { gabClinicId: clinic.id, active: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, category: true, pricePln: true, durationMinutes: true },
  });

  return NextResponse.json({ items, vertical: clinic.vertical });
}
