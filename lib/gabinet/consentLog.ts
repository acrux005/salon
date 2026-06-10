import { getPrisma } from "@/lib/db";

export async function logGabClientConsentChange(
  gabClinicId: string,
  clientId: string,
  consentType: string,
  granted: boolean,
  source = "panel",
  note?: string | null
): Promise<void> {
  await getPrisma().gabClientConsentLog.create({
    data: { gabClinicId, clientId, consentType, granted, source, note: note ?? null },
  });
}

export async function logGabClientConsentsFromData(
  gabClinicId: string,
  clientId: string,
  prev: {
    smsConsent: boolean;
    emailConsent: boolean;
    marketingConsent: boolean;
    pushConsent: boolean;
  },
  next: {
    smsConsent: boolean;
    emailConsent: boolean;
    marketingConsent: boolean;
    pushConsent: boolean;
  },
  source = "panel"
): Promise<void> {
  const pairs: [string, boolean, boolean][] = [
    ["sms", prev.smsConsent, next.smsConsent],
    ["email", prev.emailConsent, next.emailConsent],
    ["marketing", prev.marketingConsent, next.marketingConsent],
    ["push", prev.pushConsent, next.pushConsent],
  ];
  for (const [type, was, now] of pairs) {
    if (was !== now) {
      await logGabClientConsentChange(gabClinicId, clientId, type, now, source);
    }
  }
}
