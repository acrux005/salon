import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { markAsRead } from "@/lib/notificationsDb";
import { getNotificationRecipientFromSession } from "@/lib/recipientFromSession";

/**
 * PATCH /api/notifications/[id]/read
 * Oznacza powiadomienie jako przeczytane.
 */
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const recipient = getNotificationRecipientFromSession(session);
  if (!recipient) {
    return NextResponse.json({ error: "Nie jesteś zalogowany." }, { status: 401 });
  }
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Brak ID powiadomienia." }, { status: 400 });
  }
  await markAsRead(id, recipient.recipientType, recipient.recipientId);
  return NextResponse.json({ ok: true });
}
