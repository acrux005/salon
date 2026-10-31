import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

function readPresentedSecret(request: NextRequest): string {
  const fromQuery = request.nextUrl.searchParams.get("secret")?.trim() ?? "";
  if (fromQuery) return fromQuery;
  const header =
    request.headers.get("x-cron-secret")?.trim() ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() ||
    "";
  return header;
}

/** Cron bez ustawionego sekretu albo ze złym kluczem — zawsze 401. */
export function assertCronSecret(request: NextRequest): NextResponse | null {
  const expected = process.env.CRON_SECRET?.trim() ?? "";
  if (!expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const got = readPresentedSecret(request);
  if (!got) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const a = Buffer.from(got);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
