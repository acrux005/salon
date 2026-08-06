import { tryConsume } from "@/lib/rateLimit";

const URL_RE = /https?:\/\/|www\./gi;
const SPAM_KEYWORDS =
  /\b(casino|viagra|cialis|crypto\s*invest|forex|seo\s*services|guest\s*post|backlink|telegram\.me|t\.me\/|whatsapp\.com)\b/i;

export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

/** Honeypot wypełniony — bot; zwracamy sukces bez wysyłki. */
export function isHoneypotTriggered(honeypot?: string): boolean {
  return !!honeypot?.trim();
}

export function isTooFastSubmit(formLoadedAt?: number): boolean {
  if (!formLoadedAt || !Number.isFinite(formLoadedAt)) return false;
  return Date.now() - formLoadedAt < 3000;
}

export function checkContactRateLimit(ip: string, email: string): boolean {
  const ipOk = tryConsume(`contact:ip:${ip}`, 5, 15 * 60 * 1000);
  const emailOk = tryConsume(`contact:email:${email.toLowerCase()}`, 3, 60 * 60 * 1000);
  return ipOk && emailOk;
}

export function looksLikeSpam(input: {
  name: string;
  email: string;
  message: string;
  phone?: string;
}): string | null {
  const { name, email, message, phone } = input;

  if (name.length > 120) return "name_too_long";
  if (message.length > 8000) return "message_too_long";
  if ((message.match(URL_RE) || []).length > 3) return "too_many_urls";
  if (SPAM_KEYWORDS.test(message) || SPAM_KEYWORDS.test(name)) return "spam_keywords";

  const local = email.split("@")[0] ?? "";
  if (/^[a-z0-9._-]{40,}$/i.test(local)) return "suspicious_email";

  if (phone && /[a-z]/i.test(phone.replace(/\+/g, ""))) return "invalid_phone";

  const letters = message.replace(/\s/g, "");
  if (letters.length >= 20) {
    const upper = (message.match(/[A-ZĄĆĘŁŃÓŚŹŻ]/g) || []).length;
    const lower = (message.match(/[a-ząćęłńóśźż]/g) || []).length;
    if (upper > 15 && lower === 0) return "all_caps";
  }

  return null;
}
