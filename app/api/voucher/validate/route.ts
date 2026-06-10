import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")?.trim();
  if (!code) return NextResponse.json({ error: "Podaj code." }, { status: 400 });
  return NextResponse.json({ valid: false, error: "Not available." });
}
