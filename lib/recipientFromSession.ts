import type { RecipientType } from "@/lib/notificationsDb";
import { ADMIN_ROLE, CLIENT_ROLE, CLINIC_ROLE, VET_CLINIC_ROLE } from "@/lib/auth";

type SessionUser = {
  id?: string;
  role?: string;
  clinicId?: string;
  clientId?: string;
  vetClinicId?: string;
};

/** Odbiorca powiadomień / push z sesji NextAuth (portal zabiegi + wet). */
export function getNotificationRecipientFromSession(session: {
  user?: SessionUser;
} | null): { recipientType: RecipientType; recipientId: string } | null {
  const user = session?.user;
  if (!user) return null;
  const role = user.role;
  if (role === VET_CLINIC_ROLE) {
    const id = user.vetClinicId;
    if (!id) return null;
    return { recipientType: "vet_clinic", recipientId: id };
  }
  if (role === CLINIC_ROLE) {
    const id = user.clinicId;
    if (!id) return null;
    return { recipientType: "clinic", recipientId: id };
  }
  if (role === ADMIN_ROLE) {
    const id = user.id;
    if (!id) return null;
    return { recipientType: "admin", recipientId: id };
  }
  if (role === CLIENT_ROLE) {
    const id = user.clientId ?? user.id;
    if (!id) return null;
    return { recipientType: "client", recipientId: id };
  }
  return null;
}
