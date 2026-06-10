import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { filterUrplProducts, loadUrplVetProductsSnapshot, URPL_SOURCE_LABEL } from "@/lib/vet/urplProducts";
import fs from "fs";
import path from "path";

function loadMeta() {
  try {
    const p = path.join(process.cwd(), "lib/vet/data/urpl-vet-products-meta.json");
    return JSON.parse(fs.readFileSync(p, "utf8")) as {
      fetchedAt: string;
      total: number;
      vaccines: number;
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const vaccinesOnly = request.nextUrl.searchParams.get("vaccinesOnly") === "1";
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") ?? "40", 10) || 40, 100);

  const all = await loadUrplVetProductsSnapshot();
  const items = filterUrplProducts(all, q, { vaccinesOnly, limit });
  const meta = loadMeta();

  return NextResponse.json({
    source: URPL_SOURCE_LABEL,
    meta,
    totalInRegister: all.length,
    items,
  });
}
