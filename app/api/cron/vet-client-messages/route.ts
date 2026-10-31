import { NextRequest, NextResponse } from "next/server";
import { runDueClientMessageSchedules } from "@/lib/vet/clientMessageSchedules";
import { assertCronSecret } from "@/lib/cronSecret";

export const dynamic = "force-dynamic";

/** Wysyła wiadomości cykliczne i jednorazowe do klientów przychodni. */
export async function GET(request: NextRequest) {
  const denied = assertCronSecret(request);
  if (denied) return denied;

  const result = await runDueClientMessageSchedules(10);
  return NextResponse.json({ ok: true, ...result });
}
