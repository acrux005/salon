import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";
import { getMyMessageParticipation } from "@/lib/messagesParticipation";

/** GET: wiadomości wątku. Oznacz wiadomości od drugiej strony jako przeczytane. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
  if (!threadId?.trim()) {
    return NextResponse.json({ error: "Brak id wątku." }, { status: 400 });
  }
  const session = await getServerSession(authOptions);
  const me = getMyMessageParticipation(session);
  if (!me) {
    return NextResponse.json({ error: "Zaloguj się." }, { status: 401 });
  }

  const prisma = getPrisma();
  const thread = await prisma.messageThread.findUnique({
    where: { id: threadId },
  });
  if (!thread) {
    return NextResponse.json({ error: "Nie znaleziono wątku." }, { status: 404 });
  }
  const isA = thread.typeA === me.myType && thread.idA === me.myId;
  const isB = thread.typeB === me.myType && thread.idB === me.myId;
  if (!isA && !isB) {
    return NextResponse.json({ error: "Brak dostępu do tego wątku." }, { status: 403 });
  }

  const messages = await prisma.privateMessage.findMany({
    where: { threadId },
    orderBy: { createdAt: "asc" },
    select: { id: true, senderType: true, senderId: true, body: true, readAt: true, createdAt: true },
  });

  const fromOther = messages.filter((m) => !(m.senderType === me.myType && m.senderId === me.myId));
  const unreadIds = fromOther.filter((m) => !m.readAt).map((m) => m.id);
  if (unreadIds.length > 0) {
    await prisma.privateMessage.updateMany({
      where: { id: { in: unreadIds } },
      data: { readAt: new Date() },
    });
  }

  const otherType = thread.typeA === me.myType ? thread.typeB : thread.typeA;
  const otherId = thread.typeA === me.myType ? thread.idB : thread.idA;
  let otherName = "Rozmówca";
  if (otherType === "client") {
    const c = await prisma.client.findUnique({
      where: { id: otherId },
      select: { name: true, email: true },
    });
    otherName = c?.name ?? c?.email ?? "Klient";
  } else if (otherType === "clinic") {
    const c = await prisma.clinic.findUnique({
      where: { id: otherId },
      select: { name: true },
    });
    if (c?.name) otherName = c.name;
  } else if (otherType === "pet_owner") {
    const o = await prisma.petOwner.findUnique({
      where: { id: otherId },
      select: { name: true, phone: true },
    });
    otherName = o?.name ?? o?.phone ?? "Klient";
  } else if (otherType === "vet_clinic") {
    const c = await prisma.vetClinic.findUnique({
      where: { id: otherId },
      select: { name: true },
    });
    if (c?.name) otherName = c.name;
  } else if (otherType === "admin") {
    otherName = "Admin";
  }

  return NextResponse.json({
    thread: {
      id: thread.id,
      subject: thread.subject,
      typeA: thread.typeA,
      idA: thread.idA,
      typeB: thread.typeB,
      idB: thread.idB,
    },
    messages: messages.map((m) => ({
      id: m.id,
      senderType: m.senderType,
      senderId: m.senderId,
      body: m.body,
      readAt: m.readAt?.toISOString() ?? null,
      createdAt: m.createdAt.toISOString(),
    })),
    otherName,
  });
}

/** POST: odpowiedź w wątku. Body: { body }. */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
  if (!threadId?.trim()) {
    return NextResponse.json({ error: "Brak id wątku." }, { status: 400 });
  }
  const session = await getServerSession(authOptions);
  const me = getMyMessageParticipation(session);
  if (!me) {
    return NextResponse.json({ error: "Zaloguj się." }, { status: 401 });
  }

  let body: { body?: string };
  try {
    body = (await request.json()) as { body?: string };
  } catch {
    return NextResponse.json({ error: "Nieprawidłowy JSON." }, { status: 400 });
  }
  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "Treść wiadomości jest pusta." }, { status: 400 });
  }

  const prisma = getPrisma();
  const thread = await prisma.messageThread.findUnique({
    where: { id: threadId },
  });
  if (!thread) {
    return NextResponse.json({ error: "Nie znaleziono wątku." }, { status: 404 });
  }
  const isA = thread.typeA === me.myType && thread.idA === me.myId;
  const isB = thread.typeB === me.myType && thread.idB === me.myId;
  if (!isA && !isB) {
    return NextResponse.json({ error: "Brak dostępu do tego wątku." }, { status: 403 });
  }

  await prisma.privateMessage.create({
    data: {
      threadId,
      senderType: me.myType,
      senderId: me.myId,
      body: text.slice(0, 10000),
    },
  });
  await prisma.messageThread.update({
    where: { id: threadId },
    data: { lastMessageAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
