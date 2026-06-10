import { NextRequest, NextResponse } from "next/server";
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
    /** np. "/strony-internetowe/" — w temacie i stopce maila */
    context?: string;
    /** Opcjonalnie: temat z formularza (np. Opieka IT) */
    subject?: string;
    /** Preferencja: telefon | email */
    contactPreference?: string;
  };

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
