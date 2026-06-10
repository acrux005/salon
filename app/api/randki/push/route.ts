import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RANDKI_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

type PushBody = {
  endpoint?: string;
  keys?: { p256dh?: string; auth?: string };
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const accountId = (session?.user as { datingAccountId?: string })?.datingAccountId;
  if (role !== RANDKI_ROLE || !accountId) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as PushBody | null;
  const endpoint = body?.endpoint?.trim();
  const keys = body?.keys;
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "Niepełna subskrypcja push." }, { status: 400 });
  }

  await getPrisma().datingPushSubscription.upsert({
    where: { endpoint },
    create: { accountId, endpoint, keysJson: JSON.stringify(keys) },
    update: { accountId, keysJson: JSON.stringify(keys) },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const body = (await req.json().catch(() => null)) as { endpoint?: string } | null;
  const endpoint = body?.endpoint?.trim();
  if (!endpoint) return NextResponse.json({ error: "Brak endpoint." }, { status: 400 });
  await getPrisma().datingPushSubscription.deleteMany({ where: { endpoint } });
  return NextResponse.json({ ok: true });
}
