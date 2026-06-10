import { NextRequest, NextResponse } from "next/server";
import { ODART_SITE_URL } from "@/lib/odartSite";

const BASE = ODART_SITE_URL.replace(/\/$/, "") + "/wp-json/wc/store/v1";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const qs = new URLSearchParams();

  sp.forEach((val, key) => qs.set(key, val));
  if (!qs.has("per_page")) qs.set("per_page", "12");
  if (!qs.has("page"))     qs.set("page", "1");

  try {
    const res = await fetch(`${BASE}/products?${qs}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ products: [], total: 0, totalPages: 0 }, { status: 200 });
    }

    const total      = parseInt(res.headers.get("x-wp-total")      ?? "0", 10);
    const totalPages = parseInt(res.headers.get("x-wp-totalpages") ?? "1", 10);
    const products   = await res.json();

    return NextResponse.json({ products, total, totalPages });
  } catch {
    return NextResponse.json({ products: [], total: 0, totalPages: 0 }, { status: 200 });
  }
}
