import webpush from "web-push";
import { getPrisma } from "@/lib/db";

export type GabPushPayload = {
  title: string;
  body?: string;
  url?: string;
};

function configureVapid(): boolean {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  const subject = process.env.VAPID_SUBJECT?.trim() || "mailto:powiadomienia@odart.pl";
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

async function sendToEndpoints(
  subs: { endpoint: string; keysJson: string }[],
  payload: GabPushPayload
): Promise<number> {
  if (subs.length === 0) return 0;
  if (!configureVapid()) {
    console.log("[gab-push] Brak VAPID — pominięto:", payload.title);
    return 0;
  }
  const body = JSON.stringify(payload);
  let sent = 0;
  for (const sub of subs) {
    try {
      const keys = JSON.parse(sub.keysJson) as { p256dh?: string; auth?: string };
      await webpush.sendNotification({ endpoint: sub.endpoint, keys: keys as webpush.PushSubscription["keys"] }, body);
      sent++;
    } catch (err) {
      console.error("[gab-push] send error:", err);
      await getPrisma().gabPushSubscription.deleteMany({ where: { endpoint: sub.endpoint } }).catch(() => {});
    }
  }
  return sent;
}

export async function sendGabPushToPatientAccount(accountId: string, payload: GabPushPayload): Promise<number> {
  const subs = await getPrisma().gabPushSubscription.findMany({
    where: { gabPatientAccountId: accountId, context: "gab_patient" },
  });
  return sendToEndpoints(subs, payload);
}

export async function sendGabPushToClient(clientId: string, payload: GabPushPayload): Promise<number> {
  const subs = await getPrisma().gabPushSubscription.findMany({
    where: { gabClientId: clientId, context: "gab_client" },
  });
  return sendToEndpoints(subs, payload);
}

export function isGabPushConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim() && process.env.VAPID_PRIVATE_KEY?.trim());
}
