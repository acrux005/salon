import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { buildSpeciesReferenceCsv, buildSpeciesReferenceTxt } from "@/lib/vet/speciesCatalog";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const format = new URL(req.url).searchParams.get("format") ?? "csv";

  if (format === "txt") {
    const body = buildSpeciesReferenceTxt();
    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": 'attachment; filename="gatunki-weterynaryjne.txt"',
      },
    });
  }

  const body = buildSpeciesReferenceCsv();
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="gatunki-weterynaryjne.csv"',
    },
  });
}
