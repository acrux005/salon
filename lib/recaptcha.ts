const SECRET = process.env.RECAPTCHA_SECRET_KEY?.trim();
const MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE ?? "0.5");

type VerifyResult =
  | { ok: true; score: number }
  | { ok: false; reason: string };

/** Weryfikacja tokenu reCAPTCHA v3 (Google siteverify). */
export async function verifyRecaptchaV3(
  token: string | undefined,
  expectedAction: string
): Promise<VerifyResult> {
  if (!SECRET) {
    return { ok: true, score: 1 };
  }
  const t = token?.trim();
  if (!t) {
    return { ok: false, reason: "missing_token" };
  }

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: SECRET, response: t }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    score?: number;
    action?: string;
    "error-codes"?: string[];
  };

  if (!data.success) {
    return { ok: false, reason: "verify_failed" };
  }
  if (data.action && data.action !== expectedAction) {
    return { ok: false, reason: "action_mismatch" };
  }
  const score = typeof data.score === "number" ? data.score : 0;
  if (score < MIN_SCORE) {
    return { ok: false, reason: "low_score" };
  }
  return { ok: true, score };
}

export function isRecaptchaConfigured(): boolean {
  return !!SECRET;
}
