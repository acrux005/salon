import { ADMIN_ROLE, CLIENT_ROLE, CLINIC_ROLE, VET_CLINIC_ROLE } from "@/lib/auth";

type SessionUser = {
  role?: string;
  clientId?: string;
  clinicId?: string;
  vetClinicId?: string;
  id?: string;
};

/** Uczestnik wątku wiadomości na podstawie sesji (portal zabiegi + wet). */
export function getMyMessageParticipation(
  session: { user?: SessionUser } | null
): { myType: string; myId: string } | null {
  const user = session?.user;
  if (!user?.role) return null;
  if (user.role === CLIENT_ROLE && user.clientId) {
    return { myType: "client", myId: user.clientId };
  }
  if (user.role === VET_CLINIC_ROLE && user.vetClinicId) {
    return { myType: "vet_clinic", myId: user.vetClinicId };
  }
  if (user.role === CLINIC_ROLE && user.clinicId) {
    return { myType: "clinic", myId: user.clinicId };
  }
  if (user.role === ADMIN_ROLE && user.id) {
    return { myType: "admin", myId: user.id };
  }
  return null;
}

export function canStartMessageThread(fromType: string, toType: string): boolean {
  if (fromType === "admin" || toType === "admin") return true;
  if (
    (fromType === "client" && toType === "clinic") ||
    (fromType === "clinic" && toType === "client")
  ) {
    return true;
  }
  if (
    (fromType === "pet_owner" && toType === "vet_clinic") ||
    (fromType === "vet_clinic" && toType === "pet_owner")
  ) {
    return true;
  }
  return false;
}
