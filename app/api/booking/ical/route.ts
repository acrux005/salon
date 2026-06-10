import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  return new NextResponse("Not available.", { status: 501 });
}
