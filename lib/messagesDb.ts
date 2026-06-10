export type ParticipantType = "clinic" | "admin" | "client";

export interface Participant {
  type: ParticipantType;
  id: string;
}

export interface ThreadSummary {
  id: string;
  subject: string | null;
  otherType: ParticipantType;
  otherId: string;
  lastMessageAt: Date;
  lastBody: string | null;
  unreadCount: number;
  createdAt: Date;
}

export interface MessageItem {
  id: string;
  threadId: string;
  senderType: ParticipantType;
  senderId: string;
  body: string;
  readAt: Date | null;
  createdAt: Date;
}

/** Zwraca wątki uczestnika z liczbą nieprzeczytanych (wiadomości od drugiej strony bez readAt). */
export async function getThreadsForParticipant(p: Participant): Promise<ThreadSummary[]> {
  try {
    const { getPrisma } = await import("@/lib/db");
    const prisma = getPrisma();
    const threads = await prisma.messageThread.findMany({
      where: {
        OR: [
          { typeA: p.type, idA: p.id },
          { typeB: p.type, idB: p.id },
        ],
      },
      orderBy: { lastMessageAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { body: true, senderType: true, senderId: true },
        },
      },
    });
    if (threads.length === 0) return [];

    const threadIds = threads.map((t) => t.id);
    const unreadFromOther = await prisma.privateMessage.groupBy({
      by: ["threadId"],
      where: {
        threadId: { in: threadIds },
        readAt: null,
        NOT: [{ senderType: p.type, senderId: p.id }],
      },
      _count: { id: true },
    });
    const unreadByThread = new Map(unreadFromOther.map((u) => [u.threadId, u._count.id]));

    return threads.map((t) => {
      const otherType = t.typeA === p.type ? t.typeB : t.typeA;
      const otherId = t.typeA === p.type ? t.idB : t.idA;
      const lastMsg = t.messages[0];
      return {
        id: t.id,
        subject: t.subject,
        otherType: otherType as ParticipantType,
        otherId,
        lastMessageAt: t.lastMessageAt,
        lastBody: lastMsg?.body ?? null,
        unreadCount: unreadByThread.get(t.id) ?? 0,
        createdAt: t.createdAt,
      };
    });
  } catch {
    return [];
  }
}

/** Salon: znajdź wątek między dwoma uczestnikami lub utwórz nowy. */
export async function getOrCreateThread(a: Participant, b: Participant, subject?: string): Promise<string> {
  const prisma = (await import("@/lib/db")).getPrisma();
  const existing = await prisma.messageThread.findFirst({
    where: {
      OR: [
        { typeA: a.type, idA: a.id, typeB: b.type, idB: b.id },
        { typeA: b.type, idA: b.id, typeB: a.type, idB: a.id },
      ],
    },
  });
  if (existing) return existing.id;
  const created = await prisma.messageThread.create({
    data: {
      typeA: a.type,
      idA: a.id,
      typeB: b.type,
      idB: b.id,
      subject: subject ?? null,
    },
  });
  return created.id;
}

/** Salon: dodaj wiadomość do wątku i zaktualizuj lastMessageAt. */
export async function addMessage(
  threadId: string,
  sender: Participant,
  body: string
): Promise<MessageItem> {
  const prisma = (await import("@/lib/db")).getPrisma();
  const msg = await prisma.privateMessage.create({
    data: {
      threadId,
      senderType: sender.type,
      senderId: sender.id,
      body: body.trim() || "(wiadomość pusta)",
    },
  });
  await prisma.messageThread.update({
    where: { id: threadId },
    data: { lastMessageAt: msg.createdAt },
  });
  return {
    id: msg.id,
    threadId: msg.threadId,
    senderType: msg.senderType as ParticipantType,
    senderId: msg.senderId,
    body: msg.body,
    readAt: msg.readAt,
    createdAt: msg.createdAt,
  };
}

/** Salon: lista wiadomości w wątku (od najstarszej). */
export async function getMessagesInThread(threadId: string): Promise<MessageItem[]> {
  const prisma = (await import("@/lib/db")).getPrisma();
  const rows = await prisma.privateMessage.findMany({
    where: { threadId },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((m) => ({
    id: m.id,
    threadId: m.threadId,
    senderType: m.senderType as ParticipantType,
    senderId: m.senderId,
    body: m.body,
    readAt: m.readAt,
    createdAt: m.createdAt,
  }));
}

/** Salon: oznacz wiadomości w wątku (od drugiej strony) jako przeczytane. */
export async function markThreadAsRead(threadId: string, reader: Participant): Promise<void> {
  const prisma = (await import("@/lib/db")).getPrisma();
  const now = new Date();
  await prisma.privateMessage.updateMany({
    where: {
      threadId,
      readAt: null,
      NOT: [{ senderType: reader.type, senderId: reader.id }],
    },
    data: { readAt: now },
  });
}

/** Salon: łączna liczba nieprzeczytanych wiadomości dla uczestnika. */
export async function getUnreadMessagesCount(p: Participant): Promise<number> {
  const prisma = (await import("@/lib/db")).getPrisma();
  const threads = await prisma.messageThread.findMany({
    where: {
      OR: [
        { typeA: p.type, idA: p.id },
        { typeB: p.type, idB: p.id },
      ],
    },
    select: { id: true },
  });
  if (threads.length === 0) return 0;
  const result = await prisma.privateMessage.aggregate({
    where: {
      threadId: { in: threads.map((t) => t.id) },
      readAt: null,
      NOT: [{ senderType: p.type, senderId: p.id }],
    },
    _count: { id: true },
  });
  return result._count.id;
}

/** Salon: wątek po ID, jeśli uczestnik jest stroną wątku. */
export async function getThreadForParticipant(
  threadId: string,
  p: Participant
): Promise<{ id: string; subject: string | null; typeA: string; idA: string; typeB: string; idB: string } | null> {
  const prisma = (await import("@/lib/db")).getPrisma();
  const thread = await prisma.messageThread.findFirst({
    where: {
      id: threadId,
      OR: [
        { typeA: p.type, idA: p.id },
        { typeB: p.type, idB: p.id },
      ],
    },
  });
  if (!thread) return null;
  return {
    id: thread.id,
    subject: thread.subject,
    typeA: thread.typeA,
    idA: thread.idA,
    typeB: thread.typeB,
    idB: thread.idB,
  };
}
