import "server-only";

export type GabNotifyStatus = {
  smtpConfigured: boolean;
  smsConfigured: boolean;
  smsFrom: string | null;
  mailFrom: string | null;
};

export function getGabNotifyStatus(): GabNotifyStatus {
  const smtpConfigured = Boolean(
    process.env.SMTP_HOST?.trim() && process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim()
  );
  const smsConfigured = Boolean(process.env.GAB_SMSAPI_TOKEN?.trim() || process.env.SMSAPI_TOKEN?.trim());
  return {
    smtpConfigured,
    smsConfigured,
    smsFrom: process.env.GAB_SMS_FROM?.trim() || process.env.SMS_FROM?.trim() || null,
    mailFrom: process.env.MAIL_FROM?.trim() || process.env.SMTP_USER?.trim() || null,
  };
}
