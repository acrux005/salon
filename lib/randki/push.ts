import webpush from "web-push";
import { getPrisma } from "@/lib/db";
import { getRandkiSiteUrl } from "@/lib/randkiHost";

export type RandkiPushPayload = {
  title: string;
  body?: string;
  url?: string;
};

function configureVapid(): boolean {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  const subject = process.env.VAPID_MAILTO?.trim() || process.env.VAPID_SUBJECT?.trim() || "mailto:it@odart.pl";
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

function randkiUrl(path: string, host?: string): string {
  const base = getRandkiSiteUrl(host);
  const p = path.startsWith("/") ? path : `/${path}`;
  if (p.startsWith("/randki")) return `${base}${p.slice(6) || "/"}`;
  return `${base}${p}`;
}

export async function sendRandkiPush(accountId: string, payload: RandkiPushPayload, host?: string): Promise<number> {
  const subs = await getPrisma().datingPushSubscription.findMany({ where: { accountId } });
  if (!subs.length) return 0;
  if (!configureVapid()) {
    console.log("[randki-push] Brak VAPID:", payload.title);
    return 0;
  }
  const body = JSON.stringify({
    title: payload.title,
    body: payload.body ?? "",
    url: payload.url ? randkiUrl(payload.url, host) : randkiUrl("/dopasowania", host),
  });
  let sent = 0;
  for (const sub of subs) {
    try {
      const keys = JSON.parse(sub.keysJson) as { p256dh?: string; auth?: string };
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: keys as webpush.PushSubscription["keys"] },
        body
      );
      sent++;
    } catch (err) {
      console.error("[randki-push]", err);
      await getPrisma().datingPushSubscription.deleteMany({ where: { endpoint: sub.endpoint } }).catch(() => {});
    }
  }
  return sent;
}

export function isRandkiPushConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim() && process.env.VAPID_PRIVATE_KEY?.trim());
}
