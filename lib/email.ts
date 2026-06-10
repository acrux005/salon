/**
 * Wysyłka e-maili (np. potwierdzenie rejestracji).
 * Wymaga w .env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM.
 * Gdy brak konfiguracji — link jest tylko logowany (dev).
 */

import nodemailer from "nodemailer";
import { getGabinetSiteUrl } from "@/lib/gabinetPlatform/host";
import { GABINET_VERTICALS } from "@/lib/gabinetPlatform/verticals";
import { getWetSiteUrl } from "@/lib/wetHost";

const SMTP_HOST = process.env.SMTP_HOST?.trim();
const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? "587", 10);
const SMTP_USER = process.env.SMTP_USER?.trim();
const SMTP_PASS = process.env.SMTP_PASS?.trim();
const MAIL_FROM = process.env.MAIL_FROM?.trim() || SMTP_USER || "noreply@example.com";
const BASE_URL = process.env.NEXTAUTH_URL?.trim() || "https://salon.odart.pl";

function getTransporter(): nodemailer.Transporter | null {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  const verifyUrl = `${BASE_URL}/portal/verify-email?token=${encodeURIComponent(token)}`;
  const html = `
    <p>Witaj,</p>
    <p>Dziękujemy za rejestrację. Kliknij poniższy link, aby potwierdzić adres e-mail:</p>
    <p><a href="${verifyUrl}" style="color:#c71585;">Potwierdź adres e-mail</a></p>
    <p>Link jest ważny 24 godziny.</p>
    <p>Jeśli to nie Ty się rejestrowałeś/aś, zignoruj tę wiadomość.</p>
    <p>— Zabiegi Odart</p>
  `;
  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: email,
        subject: "Potwierdź adres e-mail — Zabiegi Odart",
        text: `Potwierdź adres e-mail, otwierając link: ${verifyUrl}`,
        html,
      });
      return true;
    } catch (e) {
      console.error("[sendVerificationEmail]", e);
      return false;
    }
  }
  console.log("[sendVerificationEmail] Brak SMTP — link (dev):", verifyUrl);
  return true;
}

export async function sendClinicVerificationEmail(email: string, token: string): Promise<boolean> {
  const verifyUrl = `${BASE_URL}/portal/verify-email?type=clinic&token=${encodeURIComponent(token)}`;
  const html = `
    <p>Witaj,</p>
    <p>Dziękujemy za rejestrację gabinetu. Kliknij poniższy link, aby potwierdzić adres e-mail i aktywować możliwość logowania:</p>
    <p><a href="${verifyUrl}" style="color:#c71585;">Potwierdź adres e-mail gabinetu</a></p>
    <p>Link jest ważny 24 godziny.</p>
    <p>Jeśli to nie Ty zakładałeś/aś konto, zignoruj tę wiadomość.</p>
    <p>— Zabiegi Odart</p>
  `;
  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: email,
        subject: "Potwierdź e-mail gabinetu — Zabiegi Odart",
        text: `Potwierdź adres e-mail gabinetu, otwierając link: ${verifyUrl}`,
        html,
      });
      return true;
    } catch (e) {
      console.error("[sendClinicVerificationEmail]", e);
      return false;
    }
  }
  console.log("[sendClinicVerificationEmail] Brak SMTP — link (dev):", verifyUrl);
  return true;
}

/** Potwierdzenie e-mail przy rejestracji przychodni wet (VetHarmonogram). */
export async function sendVetClinicVerificationEmail(email: string, token: string): Promise<boolean> {
  const verifyUrl = `${getWetSiteUrl()}/wet/potwierdz-email?token=${encodeURIComponent(token)}`;
  const html = `
    <p>Witaj,</p>
    <p>Dziękujemy za rejestrację przychodni w VetHarmonogram. Kliknij poniższy link, aby potwierdzić adres e-mail i móc się zalogować:</p>
    <p><a href="${verifyUrl}" style="color:#0d9488;">Potwierdź adres e-mail</a></p>
    <p>Link jest ważny 24 godziny.</p>
    <p>Jeśli to nie Ty zakładałeś/aś konto, zignoruj tę wiadomość.</p>
    <p>— VetHarmonogram (weterynaria.odart.pl)</p>
  `;
  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: email,
        subject: "Potwierdź e-mail przychodni — VetHarmonogram",
        text: `Potwierdź adres e-mail przychodni, otwierając link: ${verifyUrl}`,
        html,
      });
      return true;
    } catch (e) {
      console.error("[sendVetClinicVerificationEmail]", e);
      return false;
    }
  }
  console.log("[sendVetClinicVerificationEmail] Brak SMTP — link (dev):", verifyUrl);
  return false;
}

/** Reset hasła konta przychodni wet. */
export async function sendVetPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const resetUrl = `${getWetSiteUrl()}/wet/ustaw-haslo?token=${encodeURIComponent(token)}`;
  const html = `
    <p>Witaj,</p>
    <p>Otrzymaliśmy prośbę o ustawienie nowego hasła do VetHarmonogram. Kliknij link:</p>
    <p><a href="${resetUrl}" style="color:#0d9488;">Ustaw nowe hasło</a></p>
    <p>Link jest ważny 1 godzinę.</p>
    <p>Jeśli to nie Ty — zignoruj tę wiadomość.</p>
    <p>— VetHarmonogram (weterynaria.odart.pl)</p>
  `;
  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: email,
        subject: "Ustaw nowe hasło — VetHarmonogram",
        text: `Ustaw nowe hasło: ${resetUrl}`,
        html,
      });
      return true;
    } catch (e) {
      console.error("[sendVetPasswordResetEmail]", e);
      return false;
    }
  }
  console.log("[sendVetPasswordResetEmail] Brak SMTP — link (dev):", resetUrl);
  return false;
}

const MONTHS_PL = [
  "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
  "lipca", "sierpnia", "września", "października", "listopada", "grudnia",
];

function formatBookingDate(dateStr: string, timeStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const month = m >= 1 && m <= 12 ? MONTHS_PL[m - 1] : String(m);
  const day = d ?? 0;
  const year = y ?? 0;
  const time = timeStr.replace(/^(\d{1,2}):(\d{2})$/, "$1:$2");
  return `${day} ${month} ${year}, godz. ${time}`;
}

export type BookingEmailData = {
  clinicName: string;
  clinicEmail?: string;
  clinicPhone?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  date: string;
  time: string;
  serviceName?: string;
  staffName?: string;
  /** Token do linku „Potwierdź przyjście” (tylko rezerwacje z portalu). */
  confirmToken?: string;
};

const BEAUTY_STYLES = {
  wrap: "margin:0; padding: 24px; background: linear-gradient(135deg, #fef7f9 0%, #fdf2f8 50%, #fce7f3 100%); font-family: 'Segoe UI', system-ui, sans-serif;",
  card: "max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(190, 24, 93, 0.08); overflow: hidden;",
  headerBg: "background: linear-gradient(135deg, #be185d 0%, #9d174d 100%); padding: 28px 24px;",
  headerTitle: "margin: 0; font-size: 20px; font-weight: 600; color: #ffffff; letter-spacing: 0.02em;",
  headerSub: "margin: 6px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.88);",
  body: "padding: 28px 24px; color: #374151; font-size: 15px; line-height: 1.6;",
  row: "margin: 0 0 14px 0; padding: 0;",
  label: "display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af; margin-bottom: 2px;",
  value: "font-weight: 500; color: #1f2937;",
  highlight: "background: #fdf2f8; border-left: 4px solid #be185d; padding: 14px 16px; border-radius: 0 8px 8px 0; margin: 18px 0;",
  footer: "padding: 20px 24px; border-top: 1px solid #fce7f3; font-size: 12px; color: #9ca3af; text-align: center;",
  brand: "color: #be185d; font-weight: 600; text-decoration: none;",
};

function buildBookingEmailClientHtml(data: BookingEmailData): string {
  const dateFormatted = formatBookingDate(data.date, data.time);
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="${BEAUTY_STYLES.wrap}">
  <div style="${BEAUTY_STYLES.card}">
    <div style="${BEAUTY_STYLES.headerBg}">
      <h1 style="${BEAUTY_STYLES.headerTitle}">Twoja wizyta jest zarezerwowana</h1>
      <p style="${BEAUTY_STYLES.headerSub}">${data.clinicName}</p>
    </div>
    <div style="${BEAUTY_STYLES.body}">
      <p style="margin: 0 0 20px 0;">Dziękujemy za rezerwację. Poniżej znajdziesz szczegóły wizyty.</p>
      <div style="${BEAUTY_STYLES.highlight}">
        <div style="${BEAUTY_STYLES.row}"><span style="${BEAUTY_STYLES.label}">Data i godzina</span><span style="${BEAUTY_STYLES.value}">${dateFormatted}</span></div>
        ${data.serviceName ? `<div style="${BEAUTY_STYLES.row}"><span style="${BEAUTY_STYLES.label}">Zabieg</span><span style="${BEAUTY_STYLES.value}">${escapeHtml(data.serviceName)}</span></div>` : ""}
        ${data.staffName ? `<div style="${BEAUTY_STYLES.row}"><span style="${BEAUTY_STYLES.label}">Pracownik</span><span style="${BEAUTY_STYLES.value}">${escapeHtml(data.staffName)}</span></div>` : ""}
      </div>
      <p style="margin: 18px 0 0 0;">W razie potrzeby zmiany lub rezygnacji skontaktuj się z gabinetem.</p>
      ${data.confirmToken ? `<p style="margin: 16px 0 0 0;"><a href="${BASE_URL}/portal/potwierdz-obecnosc?token=${encodeURIComponent(data.confirmToken)}" style="display: inline-block; background: #be185d; color: #fff !important; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">Potwierdź, że przyjdziesz</a></p><p style="margin: 8px 0 0 0; font-size: 13px; color: #6b7280;">Kliknij, aby gabinet wiedział, że planujesz przyjść.</p>` : ""}
      ${data.clinicPhone ? `<p style="margin: 10px 0 0 0;">Telefon: <strong>${escapeHtml(data.clinicPhone)}</strong></p>` : ""}
    </div>
    <div style="${BEAUTY_STYLES.footer}">
      Wiadomość wygenerowana przez <a href="${BASE_URL}" style="${BEAUTY_STYLES.brand}">Zabiegi Odart</a> — dopasowanie zabiegów i gabinetów.
    </div>
  </div>
</body>
</html>`;
}

function buildBookingEmailClinicHtml(data: BookingEmailData): string {
  const dateFormatted = formatBookingDate(data.date, data.time);
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="${BEAUTY_STYLES.wrap}">
  <div style="${BEAUTY_STYLES.card}">
    <div style="${BEAUTY_STYLES.headerBg}">
      <h1 style="${BEAUTY_STYLES.headerTitle}">Nowa rezerwacja wizyty</h1>
      <p style="${BEAUTY_STYLES.headerSub}">${escapeHtml(data.clinicName)} — ${dateFormatted}</p>
    </div>
    <div style="${BEAUTY_STYLES.body}">
      <p style="margin: 0 0 16px 0;">Otrzymujesz niniejszą wiadomość, ponieważ w systemie Zabiegi Odart zarezerwowano wizytę w Twoim gabinecie.</p>
      <div style="${BEAUTY_STYLES.highlight}">
        <div style="${BEAUTY_STYLES.row}"><span style="${BEAUTY_STYLES.label}">Data i godzina</span><span style="${BEAUTY_STYLES.value}">${dateFormatted}</span></div>
        ${data.serviceName ? `<div style="${BEAUTY_STYLES.row}"><span style="${BEAUTY_STYLES.label}">Zabieg</span><span style="${BEAUTY_STYLES.value}">${escapeHtml(data.serviceName)}</span></div>` : ""}
        ${data.staffName ? `<div style="${BEAUTY_STYLES.row}"><span style="${BEAUTY_STYLES.label}">Pracownik</span><span style="${BEAUTY_STYLES.value}">${escapeHtml(data.staffName)}</span></div>` : ""}
        <div style="${BEAUTY_STYLES.row}"><span style="${BEAUTY_STYLES.label}">Klient</span><span style="${BEAUTY_STYLES.value}">${escapeHtml(data.clientName || "—")}</span></div>
        ${data.clientEmail ? `<div style="${BEAUTY_STYLES.row}"><span style="${BEAUTY_STYLES.label}">E-mail</span><span style="${BEAUTY_STYLES.value}"><a href="mailto:${escapeHtml(data.clientEmail)}">${escapeHtml(data.clientEmail)}</a></span></div>` : ""}
        ${data.clientPhone ? `<div style="${BEAUTY_STYLES.row}"><span style="${BEAUTY_STYLES.label}">Telefon</span><span style="${BEAUTY_STYLES.value}">${escapeHtml(data.clientPhone)}</span></div>` : ""}
      </div>
      <p style="margin: 18px 0 0 0;">Prosimy o potwierdzenie wizyty u klienta (np. telefonicznie lub e-mailem) zgodnie z przyjętą w gabinecie procedurą.</p>
    </div>
    <div style="${BEAUTY_STYLES.footer}">
      Wiadomość wygenerowana przez <a href="${BASE_URL}" style="${BEAUTY_STYLES.brand}">Zabiegi Odart</a>.
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const WET_EMAIL_STYLES = {
  wrap: "margin:0; padding: 24px; background: #f0fdfa; font-family: 'Segoe UI', system-ui, sans-serif;",
  card: "max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(13, 148, 136, 0.12); overflow: hidden;",
  headerBg: "background: linear-gradient(135deg, #0d9488 0%, #115e59 100%); padding: 28px 24px;",
  headerTitle: "margin: 0; font-size: 20px; font-weight: 600; color: #ffffff;",
  headerSub: "margin: 6px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.88);",
  body: "padding: 28px 24px; color: #374151; font-size: 15px; line-height: 1.6;",
  footer: "padding: 20px 24px; border-top: 1px solid #ccfbf1; font-size: 12px; color: #9ca3af; text-align: center;",
  brand: "color: #0d9488; font-weight: 600; text-decoration: none;",
  btn: "display: inline-block; background: #0d9488; color: #fff !important; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;",
};

export type VetOwnerReminderEmailData = {
  clinicName: string;
  clinicPhone?: string | null;
  ownerName: string;
  petName: string;
  subject: string;
  message: string;
  panelUrl?: string;
};

export async function sendVetOwnerReminderEmail(
  to: string,
  data: VetOwnerReminderEmailData
): Promise<boolean> {
  const transporter = getTransporter();
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="${WET_EMAIL_STYLES.wrap}">
  <div style="${WET_EMAIL_STYLES.card}">
    <div style="${WET_EMAIL_STYLES.headerBg}">
      <h1 style="${WET_EMAIL_STYLES.headerTitle}">${escapeHtml(data.subject)}</h1>
      <p style="${WET_EMAIL_STYLES.headerSub}">${escapeHtml(data.clinicName)} · ${escapeHtml(data.petName)}</p>
    </div>
    <div style="${WET_EMAIL_STYLES.body}">
      <p style="margin: 0 0 12px 0;">Witaj${data.ownerName ? ` ${escapeHtml(data.ownerName)}` : ""},</p>
      <p style="margin: 0 0 16px 0;">${escapeHtml(data.message)}</p>
      ${data.panelUrl ? `<p style="margin: 16px 0 0 0;"><a href="${escapeHtml(data.panelUrl)}" style="${WET_EMAIL_STYLES.btn}">Zobacz plan profilaktyki</a></p>` : ""}
      ${data.clinicPhone ? `<p style="margin: 16px 0 0 0; font-size: 14px;">Telefon gabinetu: <strong>${escapeHtml(data.clinicPhone)}</strong></p>` : ""}
      <p style="margin: 16px 0 0 0; font-size: 13px; color: #6b7280;">Wytyczne profilaktyki mają charakter informacyjny — ostateczny protokół ustala lekarz weterynarii.</p>
    </div>
    <div style="${WET_EMAIL_STYLES.footer}">
      VetHarmonogram · <a href="${getWetSiteUrl()}" style="${WET_EMAIL_STYLES.brand}">weterynaria</a>
    </div>
  </div>
</body>
</html>`;

  if (!transporter) {
    console.info("[sendVetOwnerReminderEmail] Brak SMTP — dev:", to, data.message);
    return true;
  }

  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: to.trim(),
      subject: data.subject,
      text: `${data.message}\n\n${data.panelUrl ?? ""}`,
      html,
    });
    return true;
  } catch (e) {
    console.error("[sendVetOwnerReminderEmail]", e);
    return false;
  }
}

export async function sendBookingEmails(data: BookingEmailData): Promise<{ client: boolean; clinic: boolean }> {
  const transporter = getTransporter();
  const result = { client: false, clinic: false };
  if (!transporter) {
    console.log("[sendBookingEmails] Brak SMTP — pomijam wysyłkę e-maili (dev).");
    return result;
  }
  const clientHtml = buildBookingEmailClientHtml(data);
  const clinicHtml = buildBookingEmailClinicHtml(data);
  const dateFormatted = formatBookingDate(data.date, data.time);

  if (data.clientEmail?.trim()) {
    try {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: data.clientEmail.trim(),
        subject: `Potwierdzenie rezerwacji — ${data.clinicName} | ${dateFormatted}`,
        text: `Twoja wizyta w ${data.clinicName} została zarezerwowana na ${dateFormatted}.${data.serviceName ? ` Zabieg: ${data.serviceName}.` : ""} W razie pytań skontaktuj się z gabinetem. — Zabiegi Odart`,
        html: clientHtml,
      });
      result.client = true;
    } catch (e) {
      console.error("[sendBookingEmails] do klienta:", e);
    }
  }

  if (data.clinicEmail?.trim()) {
    try {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: data.clinicEmail.trim(),
        subject: `Nowa rezerwacja: ${data.clientName || "Klient"} — ${dateFormatted} | Zabiegi Odart`,
        text: `Nowa rezerwacja w ${data.clinicName}: ${dateFormatted}. Klient: ${data.clientName || "—"}${data.clientEmail ? `, ${data.clientEmail}` : ""}${data.clientPhone ? `, tel. ${data.clientPhone}` : ""}. Zabieg: ${data.serviceName || "—"}. — Zabiegi Odart`,
        html: clinicHtml,
      });
      result.clinic = true;
    } catch (e) {
      console.error("[sendBookingEmails] do gabinetu:", e);
    }
  }

  return result;
}

/** E-mail do gabinetu o zapytaniu klienta dotyczącym zabiegu. */
export async function sendTreatmentInquiryEmail(data: {
  clinicName: string;
  clinicEmail: string;
  clientName: string;
  clientEmail: string;
  treatmentName: string;
  message: string;
}): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.log("[sendTreatmentInquiryEmail] Brak SMTP — pomijam (dev).");
    return false;
  }
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="${BEAUTY_STYLES.wrap}">
  <div style="${BEAUTY_STYLES.card}">
    <div style="${BEAUTY_STYLES.headerBg}">
      <h1 style="${BEAUTY_STYLES.headerTitle}">Pytanie o zabieg</h1>
      <p style="${BEAUTY_STYLES.headerSub}">${escapeHtml(data.clinicName)}</p>
    </div>
    <div style="${BEAUTY_STYLES.body}">
      <p style="margin: 0 0 16px 0;">Klient przesłał zapytanie dotyczące zabiegu w Twoim gabinecie.</p>
      <div style="${BEAUTY_STYLES.highlight}">
        <div style="${BEAUTY_STYLES.row}"><span style="${BEAUTY_STYLES.label}">Zabieg</span><span style="${BEAUTY_STYLES.value}">${escapeHtml(data.treatmentName)}</span></div>
        <div style="${BEAUTY_STYLES.row}"><span style="${BEAUTY_STYLES.label}">Klient</span><span style="${BEAUTY_STYLES.value}">${escapeHtml(data.clientName)}</span></div>
        <div style="${BEAUTY_STYLES.row}"><span style="${BEAUTY_STYLES.label}">E-mail klienta</span><span style="${BEAUTY_STYLES.value}"><a href="mailto:${escapeHtml(data.clientEmail)}">${escapeHtml(data.clientEmail)}</a></span></div>
      </div>
      <div style="margin: 18px 0 0 0; padding: 14px 16px; background: #f9fafb; border-radius: 8px; font-size: 15px; color: #374151; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(data.message)}</div>
      <p style="margin: 18px 0 0 0; font-size: 14px; color: #6b7280;">Odpowiedz bezpośrednio na adres klienta: <a href="mailto:${escapeHtml(data.clientEmail)}">${escapeHtml(data.clientEmail)}</a></p>
    </div>
    <div style="${BEAUTY_STYLES.footer}">
      Wiadomość z platformy <a href="${BASE_URL}" style="${BEAUTY_STYLES.brand}">Zabiegi Odart</a>.
    </div>
  </div>
</body>
</html>`;
  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: data.clinicEmail,
      replyTo: data.clientEmail,
      subject: `Pytanie o zabieg: ${data.treatmentName} — ${data.clientName}`,
      text: `Pytanie od ${data.clientName} (${data.clientEmail}) o zabieg „${data.treatmentName}":\n\n${data.message}`,
      html,
    });
    return true;
  } catch (e) {
    console.error("[sendTreatmentInquiryEmail]", e);
    return false;
  }
}

/** Przypomnienie 24h przed wizytą (tylko ClinicBooking z portalu). */
export async function sendBookingReminderEmail(data: BookingEmailData): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.log("[sendBookingReminderEmail] Brak SMTP — pomijam (dev).");
    return false;
  }
  if (!data.clientEmail?.trim()) return false;
  const dateFormatted = formatBookingDate(data.date, data.time);
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="${BEAUTY_STYLES.wrap}">
  <div style="${BEAUTY_STYLES.card}">
    <div style="${BEAUTY_STYLES.headerBg}">
      <h1 style="${BEAUTY_STYLES.headerTitle}">Przypomnienie o wizycie</h1>
      <p style="${BEAUTY_STYLES.headerSub}">${escapeHtml(data.clinicName)} — jutro</p>
    </div>
    <div style="${BEAUTY_STYLES.body}">
      <p style="margin: 0 0 20px 0;">Witaj${data.clientName ? ` ${escapeHtml(data.clientName)}` : ""},</p>
      <p style="margin: 0 0 16px 0;">Przypominamy o Twojej wizycie <strong>jutro</strong>.</p>
      <div style="${BEAUTY_STYLES.highlight}">
        <div style="${BEAUTY_STYLES.row}"><span style="${BEAUTY_STYLES.label}">Data i godzina</span><span style="${BEAUTY_STYLES.value}">${dateFormatted}</span></div>
        ${data.serviceName ? `<div style="${BEAUTY_STYLES.row}"><span style="${BEAUTY_STYLES.label}">Zabieg</span><span style="${BEAUTY_STYLES.value}">${escapeHtml(data.serviceName)}</span></div>` : ""}
      </div>
      ${data.confirmToken ? `<p style="margin: 16px 0 0 0;"><a href="${BASE_URL}/portal/potwierdz-obecnosc?token=${encodeURIComponent(data.confirmToken)}" style="display: inline-block; background: #be185d; color: #fff !important; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">Potwierdź przyjście</a></p>` : ""}
      ${data.clinicPhone ? `<p style="margin: 10px 0 0 0;">Telefon gabinetu: <strong>${escapeHtml(data.clinicPhone)}</strong></p>` : ""}
    </div>
    <div style="${BEAUTY_STYLES.footer}">
      <a href="${BASE_URL}" style="${BEAUTY_STYLES.brand}">Zabiegi Odart</a>
    </div>
  </div>
</body>
</html>`;
  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: data.clientEmail.trim(),
      subject: `Przypomnienie: wizyta jutro — ${data.clinicName} | ${dateFormatted}`,
      text: `Przypomnienie: jutro (${dateFormatted}) masz wizytę w ${data.clinicName}.${data.serviceName ? ` Zabieg: ${data.serviceName}.` : ""} — Zabiegi Odart`,
      html,
    });
    return true;
  } catch (e) {
    console.error("[sendBookingReminderEmail]", e);
    return false;
  }
}

/** E-mail: wolne terminy w gabinecie (lista oczekujących). */
export async function sendWaitlistNotificationEmail(data: {
  clinicName: string;
  clinicSlug: string;
  clientEmail: string;
  baseUrl: string;
}): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.log("[sendWaitlistNotificationEmail] Brak SMTP — pomijam (dev).");
    return false;
  }
  const link = `${data.baseUrl}/portal/gabinet/${encodeURIComponent(data.clinicSlug)}`;
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="${BEAUTY_STYLES.wrap}">
  <div style="${BEAUTY_STYLES.card}">
    <div style="${BEAUTY_STYLES.headerBg}">
      <h1 style="${BEAUTY_STYLES.headerTitle}">Wolne terminy</h1>
      <p style="${BEAUTY_STYLES.headerSub}">${escapeHtml(data.clinicName)}</p>
    </div>
    <div style="${BEAUTY_STYLES.body}">
      <p style="margin: 0 0 16px 0;">W kalendarzu gabinetu <strong>${escapeHtml(data.clinicName)}</strong> pojawiły się wolne terminy.</p>
      <p style="margin: 0 0 20px 0;"><a href="${link}" style="display: inline-block; background: #be185d; color: #fff !important; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">Zarezerwuj wizytę</a></p>
    </div>
    <div style="${BEAUTY_STYLES.footer}"><a href="${data.baseUrl}" style="${BEAUTY_STYLES.brand}">Zabiegi Odart</a></div>
  </div>
</body>
</html>`;
  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: data.clientEmail.trim(),
      subject: `Wolne terminy — ${data.clinicName} | Zabiegi Odart`,
      text: `W kalendarzu gabinetu ${data.clinicName} są wolne terminy. Zarezerwuj wizytę: ${link}`,
      html,
    });
    return true;
  } catch (e) {
    console.error("[sendWaitlistNotificationEmail]", e);
    return false;
  }
}

/** Prośba o opinię po wizycie (gdy gabinet oznaczy wizytę jako zrealizowaną). */
export async function sendReviewRequestEmail(data: {
  clinicName: string;
  clinicSlug: string;
  clientEmail: string;
  clientName?: string;
}): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.log("[sendReviewRequestEmail] Brak SMTP — pomijam (dev).");
    return false;
  }
  if (!data.clientEmail?.trim()) return false;
  const reviewUrl = `${BASE_URL}/portal/gabinet/${encodeURIComponent(data.clinicSlug)}?addReview=1#opinie`;
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="${BEAUTY_STYLES.wrap}">
  <div style="${BEAUTY_STYLES.card}">
    <div style="${BEAUTY_STYLES.headerBg}">
      <h1 style="${BEAUTY_STYLES.headerTitle}">Jak było na wizycie?</h1>
      <p style="${BEAUTY_STYLES.headerSub}">${escapeHtml(data.clinicName)}</p>
    </div>
    <div style="${BEAUTY_STYLES.body}">
      <p style="margin: 0 0 16px 0;">Witaj${data.clientName ? ` ${escapeHtml(data.clientName)}` : ""},</p>
      <p style="margin: 0 0 20px 0;">Twoja wizyta w <strong>${escapeHtml(data.clinicName)}</strong> została oznaczona jako zrealizowana. Chcielibyśmy poznać Twoją opinię — pomoże to innym klientom i gabinetowi.</p>
      <p style="margin: 0 0 20px 0;"><a href="${reviewUrl}" style="display: inline-block; background: #be185d; color: #fff !important; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">Dodaj opinię</a></p>
    </div>
    <div style="${BEAUTY_STYLES.footer}"><a href="${BASE_URL}" style="${BEAUTY_STYLES.brand}">Zabiegi Odart</a></div>
  </div>
</body>
</html>`;
  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: data.clientEmail.trim(),
      subject: `Jak było na wizycie? — ${data.clinicName} | Zabiegi Odart`,
      text: `Twoja wizyta w ${data.clinicName} została zrealizowana. Dodaj opinię: ${reviewUrl}`,
      html,
    });
    return true;
  } catch (e) {
    console.error("[sendReviewRequestEmail]", e);
    return false;
  }
}

/** E-mail do klienta o zmianie terminu rezerwacji (nowa data/godzina). */
export async function sendBookingRescheduleEmail(data: BookingEmailData): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.log("[sendBookingRescheduleEmail] Brak SMTP — pomijam (dev).");
    return false;
  }
  if (!data.clientEmail?.trim()) return false;
  const dateFormatted = formatBookingDate(data.date, data.time);
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="${BEAUTY_STYLES.wrap}">
  <div style="${BEAUTY_STYLES.card}">
    <div style="${BEAUTY_STYLES.headerBg}">
      <h1 style="${BEAUTY_STYLES.headerTitle}">Zmiana terminu wizyty</h1>
      <p style="${BEAUTY_STYLES.headerSub}">${escapeHtml(data.clinicName)}</p>
    </div>
    <div style="${BEAUTY_STYLES.body}">
      <p style="margin: 0 0 20px 0;">Witaj${data.clientName ? ` ${escapeHtml(data.clientName)}` : ""},</p>
      <p style="margin: 0 0 16px 0;">Gabinet zmienił termin Twojej wizyty. Poniżej podany jest <strong>nowy termin</strong>.</p>
      <div style="${BEAUTY_STYLES.highlight}">
        <div style="${BEAUTY_STYLES.row}"><span style="${BEAUTY_STYLES.label}">Nowa data i godzina</span><span style="${BEAUTY_STYLES.value}">${dateFormatted}</span></div>
        ${data.serviceName ? `<div style="${BEAUTY_STYLES.row}"><span style="${BEAUTY_STYLES.label}">Zabieg</span><span style="${BEAUTY_STYLES.value}">${escapeHtml(data.serviceName)}</span></div>` : ""}
      </div>
      <p style="margin: 18px 0 0 0;">W razie pytań lub potrzeby kolejnej zmiany skontaktuj się z gabinetem.</p>
      ${data.clinicPhone ? `<p style="margin: 10px 0 0 0;">Telefon: <strong>${escapeHtml(data.clinicPhone)}</strong></p>` : ""}
      ${data.clinicEmail ? `<p style="margin: 4px 0 0 0;">E-mail: <a href="mailto:${escapeHtml(data.clinicEmail)}">${escapeHtml(data.clinicEmail)}</a></p>` : ""}
    </div>
    <div style="${BEAUTY_STYLES.footer}">
      Wiadomość wygenerowana przez <a href="${BASE_URL}" style="${BEAUTY_STYLES.brand}">Zabiegi Odart</a>.
    </div>
  </div>
</body>
</html>`;
  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: data.clientEmail.trim(),
      subject: `Zmiana terminu wizyty — ${data.clinicName} | ${dateFormatted}`,
      text: `Termin Twojej wizyty w ${data.clinicName} został zmieniony. Nowy termin: ${dateFormatted}.${data.serviceName ? ` Zabieg: ${data.serviceName}.` : ""} W razie pytań skontaktuj się z gabinetem. — Zabiegi Odart`,
      html,
    });
    return true;
  } catch (e) {
    console.error("[sendBookingRescheduleEmail]", e);
    return false;
  }
}

const GAB_EMAIL_STYLES = {
  wrap: "margin:0; padding: 24px; background: #f0f9ff; font-family: 'Segoe UI', system-ui, sans-serif;",
  card: "max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(14, 165, 233, 0.12); overflow: hidden;",
  headerBg: "background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 28px 24px;",
  headerTitle: "margin: 0; font-size: 20px; font-weight: 600; color: #ffffff;",
  headerSub: "margin: 6px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.88);",
  body: "padding: 28px 24px; color: #374151; font-size: 15px; line-height: 1.6;",
  footer: "padding: 20px 24px; border-top: 1px solid #e0f2fe; font-size: 12px; color: #9ca3af; text-align: center;",
  brand: "color: #0ea5e9; font-weight: 600; text-decoration: none;",
  btn: "display: inline-block; background: #0ea5e9; color: #fff !important; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;",
};

function gabBrandFromHost(host?: string | null): string {
  if (!host) return GABINET_VERTICALS.dent.brandName;
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  for (const v of Object.values(GABINET_VERTICALS)) {
    if (v.hosts.some((entry) => h === entry.toLowerCase() || h === `www.${entry.toLowerCase()}`)) {
      return v.brandName;
    }
  }
  return GABINET_VERTICALS.dent.brandName;
}

/** Potwierdzenie e-mail konta gabinetu. */
export async function sendGabClinicVerificationEmail(
  email: string,
  token: string,
  host?: string | null
): Promise<boolean> {
  const brand = gabBrandFromHost(host);
  const verifyUrl = `${getGabinetSiteUrl(host ?? undefined)}/potwierdz-email?token=${encodeURIComponent(token)}`;
  const html = `
    <p>Witaj,</p>
    <p>Potwierdź adres e-mail konta gabinetu w ${brand}:</p>
    <p><a href="${verifyUrl}" style="color:#0284c7;">Potwierdź adres e-mail</a></p>
    <p>Link jest ważny 24 godziny.</p>
    <p>— ${brand}</p>
  `;
  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: email,
        subject: `Potwierdź e-mail — ${brand}`,
        text: `Potwierdź e-mail: ${verifyUrl}`,
        html,
      });
      return true;
    } catch (e) {
      console.error("[sendGabClinicVerificationEmail]", e);
      return false;
    }
  }
  console.log("[sendGabClinicVerificationEmail] Brak SMTP — link (dev):", verifyUrl);
  return true;
}

/** Potwierdzenie e-mail konta pacjenta. */
export async function sendGabPatientVerificationEmail(
  email: string,
  token: string,
  host?: string | null
): Promise<boolean> {
  const brand = gabBrandFromHost(host);
  const verifyUrl = `${getGabinetSiteUrl(host ?? undefined)}/klient/potwierdz-email?token=${encodeURIComponent(token)}`;
  const html = `
    <p>Witaj,</p>
    <p>Potwierdź adres e-mail konta pacjenta w ${brand}:</p>
    <p><a href="${verifyUrl}" style="color:#0284c7;">Potwierdź adres e-mail</a></p>
    <p>Link jest ważny 24 godziny.</p>
    <p>— ${brand}</p>
  `;
  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: email,
        subject: `Potwierdź e-mail pacjenta — ${brand}`,
        text: `Potwierdź e-mail: ${verifyUrl}`,
        html,
      });
      return true;
    } catch (e) {
      console.error("[sendGabPatientVerificationEmail]", e);
      return false;
    }
  }
  console.log("[sendGabPatientVerificationEmail] Brak SMTP — link (dev):", verifyUrl);
  return true;
}

/** Reset hasła (gabinet lub pacjent). */
export async function sendGabPasswordResetEmail(
  email: string,
  token: string,
  accountType: "clinic" | "patient",
  host?: string | null
): Promise<boolean> {
  const brand = gabBrandFromHost(host);
  const base = getGabinetSiteUrl(host ?? undefined);
  const resetUrl =
    accountType === "patient"
      ? `${base}/klient/ustaw-haslo?token=${encodeURIComponent(token)}`
      : `${base}/ustaw-haslo?token=${encodeURIComponent(token)}`;
  const html = `
    <p>Witaj,</p>
    <p>Ustaw nowe hasło do konta ${accountType === "patient" ? "pacjenta" : "gabinetu"} w ${brand}:</p>
    <p><a href="${resetUrl}" style="color:#0284c7;">Ustaw nowe hasło</a></p>
    <p>Link jest ważny 1 godzinę.</p>
    <p>— ${brand}</p>
  `;
  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: email,
        subject: `Reset hasła — ${brand}`,
        text: `Ustaw hasło: ${resetUrl}`,
        html,
      });
      return true;
    } catch (e) {
      console.error("[sendGabPasswordResetEmail]", e);
      return false;
    }
  }
  console.log("[sendGabPasswordResetEmail] Brak SMTP — link (dev):", resetUrl);
  return true;
}

export type GabTreatmentPlanEmailData = {
  clinicName: string;
  clinicPhone?: string | null;
  patientName: string;
  planTitle: string;
  totalPln: number;
  planUrl: string;
  brandName?: string;
};

/** Powiadomienie o planie leczenia do akceptacji. */
export async function sendGabTreatmentPlanPresentedEmail(
  to: string,
  data: GabTreatmentPlanEmailData
): Promise<boolean> {
  const brand = data.brandName ?? "GabinetHarmonogram";
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="${GAB_EMAIL_STYLES.wrap}">
  <div style="${GAB_EMAIL_STYLES.card}">
    <div style="${GAB_EMAIL_STYLES.headerBg}">
      <h1 style="${GAB_EMAIL_STYLES.headerTitle}">Plan leczenia do akceptacji</h1>
      <p style="${GAB_EMAIL_STYLES.headerSub}">${escapeHtml(data.clinicName)}</p>
    </div>
    <div style="${GAB_EMAIL_STYLES.body}">
      <p style="margin: 0 0 12px 0;">Witaj ${escapeHtml(data.patientName)},</p>
      <p style="margin: 0 0 12px 0;">Gabinet przesłał plan leczenia <strong>${escapeHtml(data.planTitle)}</strong> (suma: ${data.totalPln.toFixed(2)} PLN).</p>
      <p style="margin: 0 0 16px 0;">Zaloguj się w portalu pacjenta, aby zaakceptować lub odrzucić plan.</p>
      <p style="margin: 0;"><a href="${escapeHtml(data.planUrl)}" style="${GAB_EMAIL_STYLES.btn}">Zobacz plan w portalu</a></p>
      ${data.clinicPhone ? `<p style="margin: 16px 0 0 0; font-size: 14px;">Telefon: <strong>${escapeHtml(data.clinicPhone)}</strong></p>` : ""}
    </div>
    <div style="${GAB_EMAIL_STYLES.footer}">${escapeHtml(brand)} · portal pacjenta</div>
  </div>
</body>
</html>`;
  const transporter = getTransporter();
  if (!transporter) {
    console.info("[sendGabTreatmentPlanPresentedEmail] Brak SMTP — dev:", to, data.planUrl);
    return true;
  }
  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: to.trim(),
      subject: `Plan leczenia do akceptacji — ${data.clinicName}`,
      text: `${data.clinicName} przesłał plan "${data.planTitle}". Otwórz: ${data.planUrl}`,
      html,
    });
    return true;
  } catch (e) {
    console.error("[sendGabTreatmentPlanPresentedEmail]", e);
    return false;
  }
}

export type GabPatientReminderEmailData = {
  clinicName: string;
  clinicPhone?: string | null;
  patientName: string;
  subject: string;
  message: string;
  panelUrl?: string;
  brandName?: string;
};

export async function sendGabPatientReminderEmail(
  to: string,
  data: GabPatientReminderEmailData
): Promise<boolean> {
  const transporter = getTransporter();
  const brand = data.brandName ?? "GabinetHarmonogram";
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="${GAB_EMAIL_STYLES.wrap}">
  <div style="${GAB_EMAIL_STYLES.card}">
    <div style="${GAB_EMAIL_STYLES.headerBg}">
      <h1 style="${GAB_EMAIL_STYLES.headerTitle}">${escapeHtml(data.subject)}</h1>
      <p style="${GAB_EMAIL_STYLES.headerSub}">${escapeHtml(data.clinicName)} · ${escapeHtml(data.patientName)}</p>
    </div>
    <div style="${GAB_EMAIL_STYLES.body}">
      <p style="margin: 0 0 12px 0;">Witaj ${escapeHtml(data.patientName)},</p>
      <p style="margin: 0 0 16px 0;">${escapeHtml(data.message)}</p>
      ${data.panelUrl ? `<p style="margin: 16px 0 0 0;"><a href="${escapeHtml(data.panelUrl)}" style="${GAB_EMAIL_STYLES.btn}">Portal pacjenta</a></p>` : ""}
      ${data.clinicPhone ? `<p style="margin: 16px 0 0 0; font-size: 14px;">Telefon: <strong>${escapeHtml(data.clinicPhone)}</strong></p>` : ""}
    </div>
    <div style="${GAB_EMAIL_STYLES.footer}">
      ${escapeHtml(brand)} · gabinet online
    </div>
  </div>
</body>
</html>`;

  if (!transporter) {
    console.info("[sendGabPatientReminderEmail] Brak SMTP — dev:", to, data.message);
    return true;
  }

  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: to.trim(),
      subject: data.subject,
      text: `${data.message}\n\n${data.panelUrl ?? ""}`,
      html,
    });
    return true;
  } catch (e) {
    console.error("[sendGabPatientReminderEmail]", e);
    return false;
  }
}
