import { NextRequest, NextResponse } from "next/server";
import { refreshVibeCatalog } from "@/lib/randki/vibeCatalogRefresh";
import { assertCronSecret } from "@/lib/cronSecret";

/** Codzienny refresh katalogu moodów — GET /api/cron/randki-vibe-catalog?secret=… */
export async function GET(request: NextRequest) {
  const denied = assertCronSecret(request);
  if (denied) return denied;

  try {
    const result = await refreshVibeCatalog();
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Refresh failed" },
      { status: 500 }
    );
  }
}
