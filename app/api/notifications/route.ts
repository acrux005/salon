import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getNotificationsForRecipient, getUnreadCount } from "@/lib/notificationsDb";
import { getNotificationRecipientFromSession } from "@/lib/recipientFromSession";

/**
 * GET /api/notifications
 * Zwraca listę powiadomień i liczbę nieprzeczytanych dla zalogowanego użytkownika.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  const recipient = getNotificationRecipientFromSession(session);
  if (!recipient) {
    return NextResponse.json({ error: "Nie jesteś zalogowany." }, { status: 401 });
  }
  const [list, unreadCount] = await Promise.all([
    getNotificationsForRecipient(recipient.recipientType, recipient.recipientId),
    getUnreadCount(recipient.recipientType, recipient.recipientId),
  ]);
  return NextResponse.json({ list, unreadCount });
}
