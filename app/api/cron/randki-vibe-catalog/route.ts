import { NextRequest, NextResponse } from "next/server";
import { refreshVibeCatalog } from "@/lib/randki/vibeCatalogRefresh";

const CRON_SECRET = process.env.CRON_SECRET?.trim();

/** Codzienny refresh katalogu moodów — GET /api/cron/randki-vibe-catalog?secret=… */
export async function GET(request: NextRequest) {
  if (CRON_SECRET && request.nextUrl.searchParams.get("secret") !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
