import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RANDKI_ROLE } from "@/lib/auth";
import { getIceServers, isTurnConfigured } from "@/lib/randki/webrtc";

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const accountId = (session?.user as { datingAccountId?: string })?.datingAccountId;
  if (role !== RANDKI_ROLE || !accountId) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  return NextResponse.json({
    iceServers: getIceServers(),
    turnEnabled: isTurnConfigured(),
  });
}
