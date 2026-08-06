import { getRecaptchaTokenAsync, hasRecaptcha } from "@/components/portal/RecaptchaWidget";

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  phone?: string;
  projectType?: string;
  source?: "salon" | "odart";
  context?: string;
  subject?: string;
  contactPreference?: string;
};

export async function submitContactForm(
  payload: ContactPayload,
  extras?: { honeypot?: string; formLoadedAt?: number }
): Promise<{ ok: boolean; error?: string }> {
  let captchaToken: string | undefined;
  if (hasRecaptcha()) {
    try {
      captchaToken = await getRecaptchaTokenAsync("contact");
    } catch {
      return { ok: false, error: "Nie udało się zweryfikować zabezpieczenia. Odśwież stronę i spróbuj ponownie." };
    }
  }

  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      company_website: extras?.honeypot ?? "",
      _formLoadedAt: extras?.formLoadedAt,
      captchaToken,
    }),
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (data.ok) return { ok: true };
  return { ok: false, error: data.error ?? "Wystąpił błąd. Spróbuj ponownie." };
}
