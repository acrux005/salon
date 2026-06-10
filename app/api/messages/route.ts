import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";
import { canStartMessageThread, getMyMessageParticipation } from "@/lib/messagesParticipation";

/** GET: lista wątków dla zalogowanego użytkownika. */
export async function GET() {
  const session = await getServerSession(authOptions);
  const me = getMyMessageParticipation(session);
  if (!me) {
    return NextResponse.json({ error: "Zaloguj się." }, { status: 401 });
  }

  const prisma = getPrisma();
  const threadsRaw = await prisma.messageThread.findMany({
    where: {
      OR: [
        { typeA: me.myType, idA: me.myId },
        { typeB: me.myType, idB: me.myId },
      ],
    },
    orderBy: { lastMessageAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { body: true, senderType: true, senderId: true, readAt: true },
      },
    },
  });

  const otherIds = new Map<string, string>();
  for (const t of threadsRaw) {
    const otherType = t.typeA === me.myType ? t.typeB : t.typeA;
    const otherId = t.typeA === me.myType ? t.idB : t.idA;
    otherIds.set(`${otherType}:${otherId}`, otherId);
  }
  const clientIds = Array.from(otherIds.entries())
    .filter(([k]) => k.startsWith("client:"))
    .map(([, v]) => v);
  const clinicIds = Array.from(otherIds.entries())
    .filter(([k]) => k.startsWith("clinic:"))
    .map(([, v]) => v);
  const petOwnerIds = Array.from(otherIds.entries())
    .filter(([k]) => k.startsWith("pet_owner:"))
    .map(([, v]) => v);
  const vetClinicIds = Array.from(otherIds.entries())
    .filter(([k]) => k.startsWith("vet_clinic:"))
    .map(([, v]) => v);

  const [clients, clinics, petOwners, vetClinics] = await Promise.all([
    clientIds.length > 0
      ? prisma.client.findMany({
          where: { id: { in: clientIds } },
          select: { id: true, name: true, email: true },
        })
      : [],
    clinicIds.length > 0
      ? prisma.clinic.findMany({
          where: { id: { in: clinicIds } },
          select: { id: true, name: true },
        })
      : [],
    petOwnerIds.length > 0
      ? prisma.petOwner.findMany({
          where: { id: { in: petOwnerIds } },
          select: { id: true, name: true, phone: true },
        })
      : [],
    vetClinicIds.length > 0
      ? prisma.vetClinic.findMany({
          where: { id: { in: vetClinicIds } },
          select: { id: true, name: true },
        })
      : [],
  ]);

  const clientNames = new Map(
    clients.map((c) => [c.id, (c.name ?? c.email ?? "Klient").toString()])
  );
  const clinicNames = new Map(clinics.map((c) => [c.id, c.name ?? "Gabinet"]));
  const petOwnerNames = new Map(petOwners.map((o) => [o.id, o.name || o.phone || "Klient"]));
  const vetClinicNames = new Map(vetClinics.map((c) => [c.id, c.name ?? "Przychodnia"]));

  const unreadFromOther = await prisma.privateMessage.groupBy({
    by: ["threadId"],
    where: {
      threadId: { in: threadsRaw.map((t) => t.id) },
      readAt: null,
      NOT: [{ senderType: me.myType, senderId: me.myId }],
    },
    _count: { id: true },
  });
  const unreadByThread = new Map(unreadFromOther.map((u) => [u.threadId, u._count.id]));

  const threads = threadsRaw.map((t) => {
    const otherType = t.typeA === me.myType ? t.typeB : t.typeA;
    const otherId = t.typeA === me.myType ? t.idB : t.idA;
    const lastMsg = t.messages[0];
    let otherName = "Rozmówca";
    if (otherType === "client") otherName = clientNames.get(otherId) ?? "Klient";
    if (otherType === "clinic") otherName = clinicNames.get(otherId) ?? "Gabinet";
    if (otherType === "pet_owner") otherName = petOwnerNames.get(otherId) ?? "Klient";
    if (otherType === "vet_clinic") otherName = vetClinicNames.get(otherId) ?? "Przychodnia";
    if (otherType === "admin") otherName = "Admin";

    return {
      id: t.id,
      subject: t.subject,
      otherType,
      otherId,
      otherName,
      lastMessageAt: t.lastMessageAt.toISOString(),
      lastBody: lastMsg?.body ?? null,
      unreadCount: unreadByThread.get(t.id) ?? 0,
    };
  });

  return NextResponse.json({ threads });
}

/** POST: utwórz wątek i wyślij pierwszą wiadomość. Body: { toType, toId, body, subject? }. */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const me = getMyMessageParticipation(session);
  if (!me) {
    return NextResponse.json({ error: "Zaloguj się." }, { status: 401 });
  }

  let body: { toType?: string; toId?: string; body?: string; subject?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Nieprawidłowy JSON." }, { status: 400 });
  }
  const toType = typeof body.toType === "string" ? body.toType.trim() : "";
  const toId = typeof body.toId === "string" ? body.toId.trim() : "";
  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!toType || !toId) {
    return NextResponse.json({ error: "Podaj toType i toId." }, { status: 400 });
  }
  if (!text) {
    return NextResponse.json({ error: "Treść wiadomości jest pusta." }, { status: 400 });
  }
  if (!["client", "admin", "clinic", "vet_clinic", "pet_owner"].includes(toType)) {
    return NextResponse.json({ error: "Nieprawidłowy toType." }, { status: 400 });
  }
  if (toType === me.myType && toId === me.myId) {
    return NextResponse.json({ error: "Nie możesz wysłać wiadomości do siebie." }, { status: 400 });
  }
  if (!canStartMessageThread(me.myType, toType)) {
    return NextResponse.json({ error: "Nie możesz rozpocząć takiej rozmowy." }, { status: 403 });
  }

  const prisma = getPrisma();

  if (toType === "client") {
    const c = await prisma.client.findUnique({ where: { id: toId }, select: { id: true } });
    if (!c) return NextResponse.json({ error: "Nie znaleziono klienta." }, { status: 404 });
  }
  if (toType === "clinic") {
    const c = await prisma.clinic.findUnique({ where: { id: toId }, select: { id: true } });
    if (!c) return NextResponse.json({ error: "Nie znaleziono gabinetu." }, { status: 404 });
  }
  if (toType === "admin") {
    const a = await prisma.admin.findUnique({ where: { id: toId }, select: { id: true } });
    if (!a) return NextResponse.json({ error: "Nie znaleziono admina." }, { status: 404 });
  }
  if (toType === "pet_owner") {
    const o = await prisma.petOwner.findUnique({
      where: { id: toId },
      select: { id: true, vetClinicId: true },
    });
    if (!o) return NextResponse.json({ error: "Nie znaleziono klienta." }, { status: 404 });
    if (me.myType === "vet_clinic" && o.vetClinicId !== me.myId) {
      return NextResponse.json({ error: "Brak dostępu do tego klienta." }, { status: 403 });
    }
  }
  if (toType === "vet_clinic") {
    const c = await prisma.vetClinic.findUnique({ where: { id: toId }, select: { id: true } });
    if (!c) return NextResponse.json({ error: "Nie znaleziono przychodni." }, { status: 404 });
  }

  let thread = await prisma.messageThread.findFirst({
    where: {
      OR: [
        { typeA: me.myType, idA: me.myId, typeB: toType, idB: toId },
        { typeA: toType, idA: toId, typeB: me.myType, idB: me.myId },
      ],
    },
  });
  if (!thread) {
    thread = await prisma.messageThread.create({
      data: {
        subject: typeof body.subject === "string" ? body.subject.slice(0, 500) : null,
        typeA: me.myType,
        idA: me.myId,
        typeB: toType,
        idB: toId,
      },
    });
  }

  await prisma.privateMessage.create({
    data: {
      threadId: thread.id,
      senderType: me.myType,
      senderId: me.myId,
      body: text.slice(0, 10000),
    },
  });
  await prisma.messageThread.update({
    where: { id: thread.id },
    data: { lastMessageAt: new Date() },
  });

  return NextResponse.json({ ok: true, threadId: thread.id });
}
