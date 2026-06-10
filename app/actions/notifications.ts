"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {
  getNotificationsForRecipient,
  getUnreadCount,
  markAsRead as markAsReadDb,
} from "@/lib/notificationsDb";
import { getNotificationRecipientFromSession } from "@/lib/recipientFromSession";

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  readAt: Date | null;
  createdAt: Date;
};

export async function getNotificationsAction(): Promise<
  { ok: true; list: NotificationItem[]; unreadCount: number } | { ok: false; error: string }
> {
  const session = await getServerSession(authOptions);
  const recipient = getNotificationRecipientFromSession(session);
  if (!recipient) return { ok: false, error: "Nie jesteś zalogowany." };
  const [list, unreadCount] = await Promise.all([
    getNotificationsForRecipient(recipient.recipientType, recipient.recipientId),
    getUnreadCount(recipient.recipientType, recipient.recipientId),
  ]);
  return {
    ok: true,
    list: list.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      link: n.link,
      readAt: n.readAt,
      createdAt: n.createdAt,
    })),
    unreadCount,
  };
}

export async function markNotificationReadAction(notificationId: string): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const session = await getServerSession(authOptions);
  const recipient = getNotificationRecipientFromSession(session);
  if (!recipient) return { ok: false, error: "Nie jesteś zalogowany." };
  if (!notificationId?.trim()) return { ok: false, error: "Brak ID powiadomienia." };
  await markAsReadDb(notificationId, recipient.recipientType, recipient.recipientId);
  return { ok: true };
}
