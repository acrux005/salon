import { NextRequest, NextResponse } from "next/server";
import { evaluateDpdFoodDeliveryPostal } from "@/lib/dpdFoodDeliveryZone";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { postalCode?: string };
    const postalCode = String(body.postalCode ?? "");
    const r = evaluateDpdFoodDeliveryPostal(postalCode);
    if (!r.ok) {
      return NextResponse.json({ ok: false as const, error: r.error });
    }
    return NextResponse.json({ ok: true as const });
  } catch {
    return NextResponse.json({ ok: false as const, error: "Nieprawidłowe żądanie." }, { status: 400 });
  }
}
