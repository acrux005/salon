import { NextRequest, NextResponse } from "next/server";
import { assertCronSecret } from "@/lib/cronSecret";

export async function GET(request: NextRequest) {
  const denied = assertCronSecret(request);
  if (denied) return denied;
  return NextResponse.json({ ok: true, sent: 0 });
}
