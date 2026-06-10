/**
 * SMS dla VetHarmonogram (SMSAPI.pl).
 * Env: VET_SMSAPI_TOKEN lub SMSAPI_TOKEN, opcjonalnie VET_SMS_FROM / SMS_FROM
 */

const SMSAPI_TOKEN = process.env.VET_SMSAPI_TOKEN?.trim() || process.env.SMSAPI_TOKEN?.trim();
const SMS_FROM = process.env.VET_SMS_FROM?.trim() || process.env.SMS_FROM?.trim() || "VetHarmonogram";

function normalizePhone(phone: string): string {
  let p = phone.replace(/\s+/g, "").replace(/-/g, "");
  if (p.startsWith("+")) return p.slice(1);
  if (p.startsWith("00")) return p.slice(2);
  if (p.length === 9) return `48${p}`;
  return p;
}

export async function sendVetSms(phone: string, message: string): Promise<boolean> {
  const to = normalizePhone(phone);
  if (!to || !message.trim()) return false;

  if (!SMSAPI_TOKEN) {
    console.info("[sendVetSms] Brak SMSAPI — symulacja do", to, ":", message);
    return true;
  }

  try {
    const params = new URLSearchParams({
      to,
      message: message.trim(),
      format: "json",
    });
    if (SMS_FROM) params.set("from", SMS_FROM);

    const res = await fetch(`https://api.smsapi.pl/sms.do?${params}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${SMSAPI_TOKEN}` },
    });
    if (!res.ok) {
      console.error("[sendVetSms] HTTP", res.status, await res.text());
      return false;
    }
    const data = (await res.json()) as { error?: string | number; message?: string };
    if (data.error) {
      console.error("[sendVetSms] API error", data);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[sendVetSms]", e);
    return false;
  }
}
