import { NextResponse } from "next/server";
import { getMatchChatPayload } from "@/lib/randki/matching";
import { requireDatingAccountIdWithError } from "@/lib/randki/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await requireDatingAccountIdWithError();
  if (!session.ok) {
    return new NextResponse(session.error, { status: session.error.includes("zablokowane") ? 403 : 401 });
  }

  const matchId = new URL(req.url).searchParams.get("matchId");
  if (!matchId) return new NextResponse("matchId required", { status: 400 });

  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = async () => {
        if (closed) return;
        try {
          const payload = await getMatchChatPayload(matchId, session.accountId);
          if (!payload) {
            controller.enqueue(encoder.encode(`event: error\ndata: not found\n\n`));
            return;
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        } catch {
          controller.enqueue(encoder.encode(`event: error\ndata: fetch failed\n\n`));
        }
      };

      await send();
      const interval = setInterval(send, 2500);
      req.signal.addEventListener("abort", () => {
        closed = true;
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
