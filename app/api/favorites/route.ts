import { NextRequest, NextResponse } from "next/server";

/** Stub: zamow.odart.pl nie ma ulubionych gabinetów. */
export async function GET() {
  return NextResponse.json({ clinicIds: [] });
}

export async function POST(_request: NextRequest) {
  return NextResponse.json({ error: "Not available." }, { status: 501 });
}
