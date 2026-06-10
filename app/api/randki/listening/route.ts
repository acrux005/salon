import { NextResponse } from "next/server";
import { requireDatingAccountIdWithError } from "@/lib/randki/session";
import { getOrCreateListeningSession, getListeningSession } from "@/lib/randki/listeningSession";
import type { SharedListeningSource } from "@/lib/randki/sharedListening";

export async function GET(req: Request) {
  const scopeKey = new URL(req.url).searchParams.get("scopeKey");
  if (!scopeKey) return NextResponse.json({ error: "scopeKey required" }, { status: 400 });

  const session = await getListeningSession(scopeKey);
  if (!session) return NextResponse.json({ session: null });
  return NextResponse.json({ session });
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    scopeKey?: string;
    source?: SharedListeningSource;
  };
  if (!body.scopeKey || !body.source?.title || !body.source?.platform) {
    return NextResponse.json({ error: "scopeKey and source required" }, { status: 400 });
  }

  const isMatchScope = body.scopeKey.startsWith("match:");
  if (isMatchScope) {
    const session = await requireDatingAccountIdWithError();
    if (!session.ok) {
      const status = session.error.includes("zablokowane") ? 403 : 401;
      return NextResponse.json({ error: session.error }, { status });
    }
  }

  const listeningSession = await getOrCreateListeningSession(body.scopeKey, body.source);
  return NextResponse.json({ session: listeningSession });
}
