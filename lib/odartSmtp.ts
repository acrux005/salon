import nodemailer from "nodemailer";

/**
 * Wspólna konfiguracja SMTP (OVH) — ta sama skrzynka co na zamow.odart.pl.
 * Zmienne: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, opcjonalnie MAIL_FROM.
 */
export function getOdartSmtpTransport() {
  const host = process.env.SMTP_HOST?.trim();
  const port = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export function getMailFrom() {
  return process.env.MAIL_FROM?.trim() || process.env.SMTP_USER?.trim() || "it@odart.pl";
}
