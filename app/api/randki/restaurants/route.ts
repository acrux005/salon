import { NextResponse } from "next/server";
import { listRestaurantsForDating } from "@/lib/randki/restaurants";
import { requireDatingAccountIdWithError } from "@/lib/randki/session";

export async function GET(req: Request) {
  const session = await requireDatingAccountIdWithError();
  if (!session.ok) {
    const status = session.error.includes("zablokowane") ? 403 : 401;
    return NextResponse.json({ error: session.error }, { status });
  }

  const city = new URL(req.url).searchParams.get("city") ?? undefined;
  const restaurants = await listRestaurantsForDating(city || undefined);
  return NextResponse.json({ restaurants });
}
