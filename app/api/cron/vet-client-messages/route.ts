import { NextRequest, NextResponse } from "next/server";
import { runDueClientMessageSchedules } from "@/lib/vet/clientMessageSchedules";

export const dynamic = "force-dynamic";

const CRON_SECRET = process.env.CRON_SECRET?.trim();

/** Wysyła wiadomości cykliczne i jednorazowe do klientów przychodni. */
export async function GET(request: NextRequest) {
  if (CRON_SECRET && request.nextUrl.searchParams.get("secret") !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runDueClientMessageSchedules(10);
  return NextResponse.json({ ok: true, ...result });
}
