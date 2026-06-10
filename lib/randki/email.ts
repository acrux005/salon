import nodemailer from "nodemailer";
import { getRandkiSiteUrl } from "@/lib/randkiHost";

const SMTP_HOST = process.env.SMTP_HOST?.trim();
const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? "587", 10);
const SMTP_USER = process.env.SMTP_USER?.trim();
const SMTP_PASS = process.env.SMTP_PASS?.trim();
const MAIL_FROM = process.env.MAIL_FROM?.trim() || SMTP_USER || "noreply@example.com";

function getTransporter(): nodemailer.Transporter | null {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

function datingUrl(path: string, host?: string): string {
  const base = getRandkiSiteUrl(host);
  const p = path.startsWith("/") ? path : `/${path}`;
  if (p.startsWith("/randki")) return `${base}${p}`;
  return `${base}${p}`;
}

/** Potwierdzenie e-mail przy rejestracji Randki Odart. */
export async function sendDatingVerificationEmail(email: string, token: string, host?: string): Promise<boolean> {
  const verifyUrl = `${datingUrl("/potwierdz-email", host)}?token=${encodeURIComponent(token)}`;
  const html = `
    <p>Witaj,</p>
    <p>Dziękujemy za rejestrację w Randki Odart. Kliknij link, aby potwierdzić adres e-mail:</p>
    <p><a href="${verifyUrl}" style="color:#e11d48;">Potwierdź adres e-mail</a></p>
    <p>Link jest ważny 24 godziny.</p>
    <p>Jeśli to nie Ty — zignoruj tę wiadomość.</p>
    <p>— Randki Odart (randka.odart.pl)</p>
  `;
  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: email,
        subject: "Potwierdź e-mail — Randki Odart",
        text: `Potwierdź adres e-mail: ${verifyUrl}`,
        html,
      });
      return true;
    } catch (e) {
      console.error("[sendDatingVerificationEmail]", e);
      return false;
    }
  }
  console.log("[sendDatingVerificationEmail] Brak SMTP — link (dev):", verifyUrl);
  return process.env.NODE_ENV !== "production";
}

/** Reset hasła konta randkowego. */
export async function sendDatingPasswordResetEmail(email: string, token: string, host?: string): Promise<boolean> {
  const resetUrl = `${datingUrl("/ustaw-haslo", host)}?token=${encodeURIComponent(token)}`;
  const html = `
    <p>Witaj,</p>
    <p>Otrzymaliśmy prośbę o ustawienie nowego hasła do Randki Odart. Kliknij link:</p>
    <p><a href="${resetUrl}" style="color:#e11d48;">Ustaw nowe hasło</a></p>
    <p>Link jest ważny 1 godzinę.</p>
    <p>Jeśli to nie Ty — zignoruj tę wiadomość.</p>
    <p>— Randki Odart (randka.odart.pl)</p>
  `;
  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: email,
        subject: "Ustaw nowe hasło — Randki Odart",
        text: `Ustaw nowe hasło: ${resetUrl}`,
        html,
      });
      return true;
    } catch (e) {
      console.error("[sendDatingPasswordResetEmail]", e);
      return false;
    }
  }
  console.log("[sendDatingPasswordResetEmail] Brak SMTP — link (dev):", resetUrl);
  return true;
}

/** Powiadomienie o nowym dopasowaniu. */
export async function sendDatingMatchEmail(
  email: string,
  otherName: string,
  host?: string
): Promise<boolean> {
  const matchesUrl = datingUrl("/dopasowania", host);
  const html = `
    <p>Cześć!</p>
    <p>Masz nowe dopasowanie z <strong>${otherName}</strong> w Randki Odart.</p>
    <p><a href="${matchesUrl}" style="color:#e11d48;">Otwórz dopasowania</a></p>
    <p>— Randki Odart</p>
  `;
  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: email,
        subject: `Nowe dopasowanie z ${otherName} — Randki Odart`,
        text: `Masz nowe dopasowanie z ${otherName}. Otwórz: ${matchesUrl}`,
        html,
      });
      return true;
    } catch (e) {
      console.error("[sendDatingMatchEmail]", e);
      return false;
    }
  }
  console.log("[sendDatingMatchEmail] Brak SMTP — dopasowanie:", otherName);
  return true;
}

/** Powiadomienie o zawieszeniu / banie konta. */
export async function sendDatingBanEmail(email: string, reason: string | null, host?: string): Promise<boolean> {
  const html = `
    <p>Witaj,</p>
    <p>Twoje konto w Randki Odart zostało zablokowane${reason ? `: ${reason}` : "."}</p>
    <p>W razie pytań napisz na kontakt@odart.pl</p>
    <p>— Randki Odart</p>
  `;
  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: email,
        subject: "Konto zablokowane — Randki Odart",
        text: `Twoje konto zostało zablokowane.${reason ? ` Powód: ${reason}` : ""}`,
        html,
      });
      return true;
    } catch (e) {
      console.error("[sendDatingBanEmail]", e);
      return false;
    }
  }
  console.log("[sendDatingBanEmail] Brak SMTP — ban:", email);
  return true;
}

/** Powiadomienie o ostrzeżeniu moderacji. */
export async function sendDatingWarnEmail(email: string, host?: string): Promise<boolean> {
  const settingsUrl = datingUrl("/ustawienia", host);
  const html = `
    <p>Witaj,</p>
    <p>Otrzymałeś ostrzeżenie od moderacji Randki Odart. Upewnij się, że Twój profil i zachowanie są zgodne z regulaminem.</p>
    <p><a href="${settingsUrl}" style="color:#e11d48;">Ustawienia konta</a></p>
    <p>— Randki Odart</p>
  `;
  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: email,
        subject: "Ostrzeżenie moderacji — Randki Odart",
        text: `Otrzymałeś ostrzeżenie od moderacji. Sprawdź ustawienia: ${settingsUrl}`,
        html,
      });
      return true;
    } catch (e) {
      console.error("[sendDatingWarnEmail]", e);
      return false;
    }
  }
  console.log("[sendDatingWarnEmail] Brak SMTP — warn:", email);
  return true;
}

/** Powiadomienie o nowej wiadomości. */
export async function sendDatingMessageEmail(
  email: string,
  senderName: string,
  preview: string,
  matchId: string,
  host?: string
): Promise<boolean> {
  const chatUrl = datingUrl(`/przestrzen/${matchId}`, host);
  const html = `
    <p>Cześć!</p>
    <p><strong>${senderName}</strong> napisał(a): „${preview.slice(0, 120)}${preview.length > 120 ? "…" : ""}"</p>
    <p><a href="${chatUrl}" style="color:#e11d48;">Otwórz wspólną przestrzeń</a></p>
    <p>— Randki Odart</p>
  `;
  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: email,
        subject: `Nowa wiadomość od ${senderName} — Randki Odart`,
        text: `${senderName}: ${preview.slice(0, 200)} — ${chatUrl}`,
        html,
      });
      return true;
    } catch (e) {
      console.error("[sendDatingMessageEmail]", e);
      return false;
    }
  }
  console.log("[sendDatingMessageEmail] Brak SMTP — wiadomość od:", senderName);
  return true;
}
