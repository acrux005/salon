import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RANDKI_ROLE } from "@/lib/auth";
import { getCallSnapshot, postCallSignal } from "@/lib/randki/voiceCall";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const accountId = (session?.user as { datingAccountId?: string })?.datingAccountId;
  if (role !== RANDKI_ROLE || !accountId) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }
  const callId = req.nextUrl.searchParams.get("callId")?.trim();
  if (!callId) return NextResponse.json({ error: "Brak callId." }, { status: 400 });
  const snap = await getCallSnapshot(callId, accountId);
  if (!snap) return NextResponse.json({ error: "Połączenie niedostępne." }, { status: 404 });
  return NextResponse.json(snap);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const accountId = (session?.user as { datingAccountId?: string })?.datingAccountId;
  if (role !== RANDKI_ROLE || !accountId) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as {
    callId?: string;
    type?: "offer" | "answer" | "ice";
    sdp?: string;
    candidate?: string;
  } | null;
  const callId = body?.callId?.trim();
  const type = body?.type;
  if (!callId || !type) return NextResponse.json({ error: "Niepełne dane." }, { status: 400 });
  try {
    await postCallSignal(callId, accountId, { type, sdp: body?.sdp, candidate: body?.candidate });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Błąd sygnalizacji." }, { status: 400 });
  }
}
