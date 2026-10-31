import { NextRequest, NextResponse } from "next/server";
import { runDueGabClientMessageSchedules } from "@/lib/gabinet/clientMessageSchedules";
import { assertCronSecret } from "@/lib/cronSecret";

export const dynamic = "force-dynamic";

/** Wysyła wiadomości cykliczne i jednorazowe do klientów gabinetu. */
export async function GET(request: NextRequest) {
  const denied = assertCronSecret(request);
  if (denied) return denied;

  const result = await runDueGabClientMessageSchedules(10);
  return NextResponse.json({ ok: true, ...result });
}
