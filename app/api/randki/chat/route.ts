import { NextResponse } from "next/server";
import { getMatchChatPayload } from "@/lib/randki/matching";
import { requireDatingAccountIdWithError } from "@/lib/randki/session";

export async function GET(req: Request) {
  const session = await requireDatingAccountIdWithError();
  if (!session.ok) {
    const status = session.error.includes("zablokowane") ? 403 : 401;
    return NextResponse.json({ error: session.error }, { status });
  }

  const matchId = new URL(req.url).searchParams.get("matchId");
  if (!matchId) return NextResponse.json({ error: "matchId required" }, { status: 400 });

  const payload = await getMatchChatPayload(matchId, session.accountId);
  if (!payload) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(payload);
}
