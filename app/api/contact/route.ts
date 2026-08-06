import { NextRequest, NextResponse } from "next/server";
import {
  checkContactRateLimit,
  getClientIp,
  isHoneypotTriggered,
  isTooFastSubmit,
  looksLikeSpam,
} from "@/lib/contactAntiSpam";
import { verifyRecaptchaV3 } from "@/lib/recaptcha";
import { getMailFrom, getOdartSmtpTransport } from "@/lib/odartSmtp";

const CONTACT_TO = "biuro@odart.pl";

/**
 * POST /api/contact
 * Wysyła zapytanie ze strony kontaktowej (salon.odart.pl lub odart.pl) na biuro@odart.pl.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    name?: string;
    email?: string;
    message?: string;
    phone?: string;
    projectType?: string;
    source?: "salon" | "odart";
    context?: string;
    subject?: string;
    contactPreference?: string;
    company_website?: string;
    _formLoadedAt?: number;
    captchaToken?: string;
  };

  if (isHoneypotTriggered(body.company_website)) {
    return NextResponse.json({ ok: true });
  }

  const ip = getClientIp(req);

  const captcha = await verifyRecaptchaV3(body.captchaToken, "contact");
  if (!captcha.ok) {
    console.warn("[contact] reCAPTCHA rejected:", captcha.reason, "ip:", ip);
    return NextResponse.json(
      { error: "Weryfikacja antyspamowa nie powiodła się. Odśwież stronę i spróbuj ponownie." },
      { status: 403 }
    );
  }

  if (isTooFastSubmit(body._formLoadedAt)) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();
  const phone = body.phone?.trim();
  const projectType = body.projectType?.trim();
  const subjectField = body.subject?.trim();
  const contactPreference = body.contactPreference?.trim();
  const source = body.source === "odart" ? "odart" : "salon";
  const context = body.context?.trim().replace(/[<>"']/g, "") ?? "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Wypełnij wymagane pola: imię, e-mail i wiadomość." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Podaj poprawny adres e-mail." }, { status: 400 });
  }

  if (!checkContactRateLimit(ip, email)) {
    return NextResponse.json(
      { error: "Zbyt wiele wiadomości w krótkim czasie. Spróbuj za chwilę lub napisz na biuro@odart.pl." },
      { status: 429 }
    );
  }

  const spamReason = looksLikeSpam({ name, email, message, phone });
  if (spamReason) {
    console.warn("[contact] spam filtered:", spamReason, "ip:", ip, "email:", email);
    return NextResponse.json({ ok: true });
  }

  const siteLabel = source === "odart" ? "odart.pl" : "salon.odart.pl";
  const subject = context
    ? `Zapytanie ${siteLabel}${context}: ${name}`
    : `Zapytanie ze strony ${siteLabel}/kontakt: ${name}`;

  const extraRows =
    phone || projectType || subjectField || contactPreference
      ? `
      ${phone ? `<tr><td style="color:#888">Telefon:</td><td>${phone.replace(/</g, "&lt;")}</td></tr>` : ""}
      ${projectType ? `<tr><td style="color:#888">Typ projektu:</td><td>${projectType.replace(/</g, "&lt;")}</td></tr>` : ""}
      ${subjectField ? `<tr><td style="color:#888">Temat:</td><td>${subjectField.replace(/</g, "&lt;")}</td></tr>` : ""}
      ${contactPreference ? `<tr><td style="color:#888">Preferowany kontakt:</td><td>${contactPreference.replace(/</g, "&lt;")}</td></tr>` : ""}
    `
      : "";

  const html = `
    <p><strong>Nowe zapytanie ze strony kontaktowej</strong></p>
    <table cellpadding="6" style="font-family:sans-serif;font-size:14px;border-collapse:collapse;">
      <tr><td style="color:#888">Imię i nazwisko:</td><td><strong>${name}</strong></td></tr>
      <tr><td style="color:#888">E-mail:</td><td><a href="mailto:${email}">${email}</a></td></tr>
      ${extraRows}
    </table>
    <p style="margin-top:16px;font-size:14px;color:#333;white-space:pre-line;">${message.replace(/</g, "&lt;")}</p>
    <hr style="margin-top:24px;border:none;border-top:1px solid #eee;"/>
    <p style="font-size:12px;color:#aaa;">Wiadomość wysłana przez formularz na ${siteLabel}${
      context ? context : "/kontakt"
    }</p>
  `;

  const transporter = getOdartSmtpTransport();
  if (!transporter) {
    if (process.env.NODE_ENV === "production") {
      console.error("[contact] Brak konfiguracji SMTP (SMTP_HOST / SMTP_USER / SMTP_PASS).");
      return NextResponse.json(
        { error: "Wysyłka e-mail jest chwilowo niedostępna. Napisz na biuro@odart.pl." },
        { status: 503 }
      );
    }
    console.log("[contact] (no SMTP) Would send:", { to: CONTACT_TO, subject, name, email, message });
    return NextResponse.json({ ok: true });
  }

  try {
    await transporter.sendMail({
      from: getMailFrom(),
      to: CONTACT_TO,
      replyTo: email,
      subject,
      html,
    });
  } catch (err) {
    console.error("[contact] SMTP error:", err);
    return NextResponse.json(
      { error: "Błąd wysyłania e-maila. Spróbuj ponownie." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
