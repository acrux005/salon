import { getPrisma } from "@/lib/db";
import { sendPushToRecipient } from "@/lib/push";

export type NotificationType = "new_treatment" | "new_booking" | "new_message" | "info";
export type RecipientType = "clinic" | "admin" | "client" | "vet_clinic";

export interface CreateNotificationParams {
  recipientType: RecipientType;
  recipientId: string;
  type: NotificationType;
  title: string;
  body?: string | null;
  link?: string | null;
}

export async function createNotification(params: CreateNotificationParams) {
  const prisma = getPrisma();
  const notification = await prisma.notification.create({
    data: {
      recipientType: params.recipientType,
      recipientId: params.recipientId,
      type: params.type,
      title: params.title,
      body: params.body ?? null,
      link: params.link ?? null,
    },
  });

  // Wyślij Web Push równolegle (nie blokuj odpowiedzi)
  sendPushToRecipient(params.recipientType, params.recipientId, {
    title: params.title,
    body: params.body ?? undefined,
    url: params.link
      ? `${process.env.NEXTAUTH_URL ?? ""}${params.link}`
      : undefined,
  }).catch((err) => console.error("[push] sendPushToRecipient error:", err));

  return notification;
}

/** Powiadomienia dla odbiorcy (gabinetu, admina lub klienta). */
export async function getNotificationsForRecipient(
  recipientType: RecipientType,
  recipientId: string,
  options?: { limit?: number; unreadOnly?: boolean }
) {
  const prisma = getPrisma();
  const limit = options?.limit ?? 50;
  const where: { recipientType: string; recipientId: string; readAt?: null } = {
    recipientType,
    recipientId,
  };
  if (options?.unreadOnly) where.readAt = null;
  const list = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return list;
}

export async function getUnreadCount(recipientType: RecipientType, recipientId: string) {
  const prisma = getPrisma();
  return prisma.notification.count({
    where: { recipientType, recipientId, readAt: null },
  });
}

/** Oznacz powiadomienie jako przeczytane (tylko jeśli należy do odbiorcy). */
export async function markAsRead(
  notificationId: string,
  recipientType: RecipientType,
  recipientId: string
) {
  const prisma = getPrisma();
  await prisma.notification.updateMany({
    where: {
      id: notificationId,
      recipientType,
      recipientId,
    },
    data: { readAt: new Date() },
  });
}
