import { getPrisma } from "@/lib/db";

export type VetConsentType = "sms" | "email" | "marketing" | "push";

export async function logOwnerConsent(params: {
  vetClinicId: string;
  ownerId: string;
  consentType: VetConsentType;
  granted: boolean;
  source?: string;
  note?: string | null;
}): Promise<void> {
  const prisma = getPrisma();
  await prisma.vetOwnerConsentLog.create({
    data: {
      vetClinicId: params.vetClinicId,
      ownerId: params.ownerId,
      consentType: params.consentType,
      granted: params.granted,
      source: params.source ?? "panel",
      note: params.note ?? null,
    },
  });
}