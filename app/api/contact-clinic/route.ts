import { NextRequest, NextResponse } from "next/server";
import { getMailFrom, getOdartSmtpTransport } from "@/lib/odartSmtp";

const CONTACT_TO = "biuro@odart.pl";

/**
 * POST /api/contact-clinic
 * Wysyła e-mail kontaktowy od właściciela gabinetu do biuro@odart.pl.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as {
    name?: string;
    email?: string;
    clinic?: string;
    message?: string;
  };

  const name = body.name?.trim();
  const email = body.email?.trim();
  const clinic = body.clinic?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Wypełnij wymagane pola: imię, e-mail i wiadomość." }, { status: 400 });
  }

  const subject = clinic
    ? `Zapytanie o współpracę: ${clinic} (${name})`
    : `Zapytanie o współpracę: ${name}`;

  const html = `
    <p><strong>Nowe zapytanie o dołączenie do Zabiegi Odart</strong></p>
    <table cellpadding="6" style="font-family:sans-serif;font-size:14px;border-collapse:collapse;">
      <tr><td style="color:#888">Imię i nazwisko:</td><td><strong>${name}</strong></td></tr>
      <tr><td style="color:#888">E-mail:</td><td><a href="mailto:${email}">${email}</a></td></tr>
      ${clinic ? `<tr><td style="color:#888">Gabinet:</td><td>${clinic}</td></tr>` : ""}
    </table>
    <p style="margin-top:16px;font-size:14px;color:#333;white-space:pre-line;">${message.replace(/</g, "&lt;")}</p>
    <hr style="margin-top:24px;border:none;border-top:1px solid #eee;"/>
    <p style="font-size:12px;color:#aaa;">Wiadomość wysłana przez formularz na zabiegi.odart.pl</p>
  `;

  const transporter = getOdartSmtpTransport();
  if (!transporter) {
    if (process.env.NODE_ENV === "production") {
      console.error("[contact-clinic] Brak konfiguracji SMTP (SMTP_HOST / SMTP_USER / SMTP_PASS).");
      return NextResponse.json(
        { error: "Wysyłka e-mail jest chwilowo niedostępna. Napisz na biuro@odart.pl." },
        { status: 503 }
      );
    }
    console.log("[contact-clinic] (no SMTP) Would send:", { to: CONTACT_TO, subject, name, email, clinic, message });
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
    console.error("[contact-clinic] SMTP error:", err);
    return NextResponse.json({ error: "Błąd wysyłania e-maila. Spróbuj ponownie." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
