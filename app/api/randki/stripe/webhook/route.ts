import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { handleStripeWebhook } from "@/lib/randki/stripe";

export async function POST(req: NextRequest) {
  const signature = (await headers()).get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Brak podpisu." }, { status: 400 });
  const rawBody = await req.text();
  try {
    const type = await handleStripeWebhook(rawBody, signature);
    return NextResponse.json({ received: true, type });
  } catch (e) {
    console.error("stripe webhook:", e);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}

export const runtime = "nodejs";
