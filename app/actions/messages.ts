"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getThreadsForParticipant, type Participant } from "@/lib/messagesDb";
import { CLINIC_ROLE, ADMIN_ROLE, CLIENT_ROLE } from "@/lib/auth";

function getParticipant(session: ReturnType<typeof Object.create> | null): Participant | null {
  const user = session?.user;
  if (!user) return null;
  const role = (user as { role?: string }).role;
  if (role === CLINIC_ROLE) {
    const id = (user as { clinicId?: string }).clinicId;
    return id ? { type: "clinic", id } : null;
  }
  if (role === ADMIN_ROLE) {
    const id = (user as { id?: string }).id;
    return id ? { type: "admin", id } : null;
  }
  if (role === CLIENT_ROLE) {
    const id = (user as { clientId?: string }).clientId ?? (user as { id?: string }).id;
    return id ? { type: "client", id } : null;
  }
  return null;
}

export async function getUnreadMessagesCountAction(): Promise<number> {
  try {
    const session = await getServerSession(authOptions);
    const me = getParticipant(session);
    if (!me) return 0;
    const threads = await getThreadsForParticipant(me);
    return threads.reduce((sum, t) => sum + (t.unreadCount ?? 0), 0);
  } catch {
    return 0;
  }
}
