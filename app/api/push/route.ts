import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GAB_CLINIC_ROLE, GAB_PATIENT_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

type PushBody = {
  endpoint?: string;
  keys?: { p256dh?: string; auth?: string };
  context?: string;
  ownerId?: string;
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });

  const body = (await req.json().catch(() => null)) as PushBody | null;
  const endpoint = body?.endpoint?.trim();
  const keys = body?.keys;
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "Niepełna subskrypcja push." }, { status: 400 });
  }

  const role = (session.user as { role?: string }).role;
  const context = body?.context ?? (role === GAB_PATIENT_ROLE ? "gab_patient" : "gab_client");
  const db = getPrisma();

  let data: {
    endpoint: string;
    keysJson: string;
    context: string;
    gabPatientAccountId?: string;
    gabClientId?: string;
    gabClinicId?: string;
  };

  if (context === "gab_patient" && role === GAB_PATIENT_ROLE) {
    const accountId = (session.user as { gabPatientAccountId?: string }).gabPatientAccountId;
    if (!accountId) return NextResponse.json({ error: "Brak konta pacjenta." }, { status: 400 });
    data = {
      endpoint,
      keysJson: JSON.stringify(keys),
      context: "gab_patient",
      gabPatientAccountId: accountId,
    };
  } else if (context === "gab_client" && role === GAB_PATIENT_ROLE) {
    const accountId = (session.user as { gabPatientAccountId?: string }).gabPatientAccountId;
    const clientId = body?.ownerId?.trim();
    if (!accountId || !clientId) {
      return NextResponse.json({ error: "Brak klienta CRM." }, { status: 400 });
    }
    const client = await db.gabClient.findFirst({ where: { id: clientId, accountId } });
    if (!client) return NextResponse.json({ error: "Nie znaleziono klienta." }, { status: 404 });
    data = {
      endpoint,
      keysJson: JSON.stringify(keys),
      context: "gab_client",
      gabClientId: client.id,
      gabClinicId: client.gabClinicId,
    };
  } else {
    return NextResponse.json({ error: "Niedozwolony kontekst push." }, { status: 403 });
  }

  await db.gabPushSubscription.upsert({
    where: { endpoint },
    create: data,
    update: {
      keysJson: data.keysJson,
      context: data.context,
      gabPatientAccountId: data.gabPatientAccountId ?? null,
      gabClientId: data.gabClientId ?? null,
      gabClinicId: data.gabClinicId ?? null,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const body = (await req.json().catch(() => null)) as { endpoint?: string } | null;
  const endpoint = body?.endpoint?.trim();
  if (!endpoint) return NextResponse.json({ error: "Brak endpoint." }, { status: 400 });
  await getPrisma().gabPushSubscription.deleteMany({ where: { endpoint } });
  return NextResponse.json({ ok: true });
}
