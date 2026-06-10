import { NextRequest, NextResponse } from "next/server";

const CRON_SECRET = process.env.CRON_SECRET?.trim();

export async function GET(request: NextRequest) {
  if (CRON_SECRET && request.nextUrl.searchParams.get("secret") !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, tomorrow: "", sent: 0, total: 0 });
}
