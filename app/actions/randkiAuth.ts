"use server";

import bcrypt from "bcrypt";
import crypto from "crypto";
import { headers } from "next/headers";
import { getPrisma } from "@/lib/db";
import { tryConsume } from "@/lib/rateLimit";
import {
  sendDatingPasswordResetEmail,
  sendDatingVerificationEmail,
} from "@/lib/randki/email";
import type { RandkiActionResult } from "@/app/actions/randki";
import { requireDatingAccountIdWithError } from "@/lib/randki/session";

const MIN_PASSWORD = 8;
const VERIFY_EXPIRES_MS = 24 * 60 * 60 * 1000;
const RESET_EXPIRES_MS = 60 * 60 * 1000;

async function getRequestHost(): Promise<string> {
  return (await headers()).get("host") ?? "";
}

function requireDatingSession() {
  return requireDatingAccountIdWithError();
}

export type DatingLoginHint =
  | { status: "ok" }
  | { status: "invalid" }
  | { status: "unverified" }
  | { status: "banned" };

/** Sprawdza hasło / weryfikację przed signIn — czytelniejsze komunikaty niż generyczny błąd NextAuth. */
export async function checkDatingLoginAction(email: string, password: string): Promise<DatingLoginHint> {
  const emailNorm = email.trim().toLowerCase();
  if (!emailNorm || !password) return { status: "invalid" };
  try {
    const account = await getPrisma().datingAccount.findUnique({ where: { email: emailNorm } });
    if (!account) return { status: "invalid" };
    if (account.bannedAt) return { status: "banned" };
    if (!(await bcrypt.compare(password, account.passwordHash))) return { status: "invalid" };
    if (!account.emailVerifiedAt && process.env.RANDKI_AUTO_VERIFY !== "true") return { status: "unverified" };
    return { status: "ok" };
  } catch {
    return { status: "invalid" };
  }
}

export async function verifyDatingEmailAction(token: string): Promise<RandkiActionResult> {
  if (!token?.trim()) return { ok: false, error: "Brak tokenu." };
  try {
    const prisma = getPrisma();
    const account = await prisma.datingAccount.findFirst({
      where: {
        verificationToken: token.trim(),
        verificationTokenExpires: { gt: new Date() },
      },
    });
    if (!account) return { ok: false, error: "Link wygasł lub jest nieprawidłowy." };
    await prisma.datingAccount.update({
      where: { id: account.id },
      data: {
        emailVerifiedAt: new Date(),
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });
    return { ok: true };
  } catch (e) {
    console.error("verifyDatingEmailAction:", e);
    return { ok: false, error: "Błąd weryfikacji." };
  }
}

export async function resendDatingVerificationAction(email: string): Promise<RandkiActionResult> {
  const emailNorm = email.trim().toLowerCase();
  if (!emailNorm || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
    return { ok: false, error: "Podaj prawidłowy adres e-mail." };
  }
  if (!tryConsume("randki-resend-verify:" + emailNorm, 3, 60 * 60 * 1000)) {
    return { ok: false, error: "Zbyt wiele prób. Spróbuj za godzinę." };
  }
  try {
    const prisma = getPrisma();
    const account = await prisma.datingAccount.findUnique({ where: { email: emailNorm } });
    if (!account) return { ok: true };
    if (account.emailVerifiedAt) {
      return { ok: false, error: "Konto jest już aktywne. Zaloguj się." };
    }
    const verificationToken = crypto.randomBytes(32).toString("hex");
    await prisma.datingAccount.update({
      where: { id: account.id },
      data: {
        verificationToken,
        verificationTokenExpires: new Date(Date.now() + VERIFY_EXPIRES_MS),
      },
    });
    const host = await getRequestHost();
    const sent = await sendDatingVerificationEmail(emailNorm, verificationToken, host);
    if (!sent) return { ok: false, error: "Nie udało się wysłać maila." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Błąd wysyłki." };
  }
}

export async function requestDatingPasswordResetAction(email: string): Promise<RandkiActionResult> {
  const emailNorm = email.trim().toLowerCase();
  if (!emailNorm || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
    return { ok: false, error: "Podaj prawidłowy adres e-mail." };
  }
  if (!tryConsume("randki-reset:" + emailNorm, 5, 60 * 60 * 1000)) {
    return { ok: false, error: "Zbyt wiele prób. Spróbuj za godzinę." };
  }
  try {
    const prisma = getPrisma();
    const account = await prisma.datingAccount.findUnique({ where: { email: emailNorm } });
    if (!account) return { ok: true };
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.datingAccount.update({
      where: { id: account.id },
      data: {
        passwordResetToken: token,
        passwordResetTokenExpires: new Date(Date.now() + RESET_EXPIRES_MS),
      },
    });
    const host = await getRequestHost();
    await sendDatingPasswordResetEmail(emailNorm, token, host);
    return { ok: true };
  } catch (e) {
    console.error("requestDatingPasswordResetAction:", e);
    return { ok: false, error: "Błąd wysyłki." };
  }
}

export async function resetDatingPasswordAction(token: string, password: string): Promise<RandkiActionResult> {
  if (!token?.trim()) return { ok: false, error: "Brak tokenu." };
  if (!password || password.length < MIN_PASSWORD) {
    return { ok: false, error: `Hasło musi mieć co najmniej ${MIN_PASSWORD} znaków.` };
  }
  try {
    const prisma = getPrisma();
    const account = await prisma.datingAccount.findFirst({
      where: {
        passwordResetToken: token.trim(),
        passwordResetTokenExpires: { gt: new Date() },
      },
    });
    if (!account) return { ok: false, error: "Link wygasł lub jest nieprawidłowy." };
    const hash = await bcrypt.hash(password, 10);
    await prisma.datingAccount.update({
      where: { id: account.id },
      data: {
        passwordHash: hash,
        passwordResetToken: null,
        passwordResetTokenExpires: null,
        emailVerifiedAt: account.emailVerifiedAt ?? new Date(),
      },
    });
    return { ok: true };
  } catch (e) {
    console.error("resetDatingPasswordAction:", e);
    return { ok: false, error: "Nie udało się ustawić hasła." };
  }
}

export async function changeDatingPasswordAction(
  currentPassword: string,
  newPassword: string
): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;
  if (!newPassword || newPassword.length < MIN_PASSWORD) {
    return { ok: false, error: `Nowe hasło — min. ${MIN_PASSWORD} znaków.` };
  }
  if (!tryConsume("randki-change-pw:" + accountId, 5, 60 * 60 * 1000)) {
    return { ok: false, error: "Zbyt wiele prób. Spróbuj za godzinę." };
  }
  try {
    const prisma = getPrisma();
    const account = await prisma.datingAccount.findUnique({ where: { id: accountId } });
    if (!account || !(await bcrypt.compare(currentPassword, account.passwordHash))) {
      return { ok: false, error: "Obecne hasło jest nieprawidłowe." };
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.datingAccount.update({ where: { id: accountId }, data: { passwordHash: hash } });
    return { ok: true };
  } catch (e) {
    console.error("changeDatingPasswordAction:", e);
    return { ok: false, error: "Nie udało się zmienić hasła." };
  }
}

export async function deleteDatingAccountAction(password: string): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;
  try {
    const prisma = getPrisma();
    const account = await prisma.datingAccount.findUnique({ where: { id: accountId } });
    if (!account || !(await bcrypt.compare(password, account.passwordHash))) {
      return { ok: false, error: "Hasło jest nieprawidłowe." };
    }
    const { deleteAllAccountPhotos } = await import("@/lib/randki/photos");
    await deleteAllAccountPhotos(accountId);
    await prisma.datingAccount.delete({ where: { id: accountId } });
    return { ok: true };
  } catch (e) {
    console.error("deleteDatingAccountAction:", e);
    return { ok: false, error: "Nie udało się usunąć konta." };
  }
}

export async function exportDatingDataAction(): Promise<
  { ok: true; json: string } | { ok: false; error: string }
> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;
  try {
    const prisma = getPrisma();
    const account = await prisma.datingAccount.findUnique({
      where: { id: accountId },
      include: {
        profile: true,
        photos: true,
        likesSent: true,
        messagesSent: { select: { body: true, createdAt: true, matchId: true } },
      },
    });
    if (!account) return { ok: false, error: "Brak konta." };
    const { passwordHash: _, verificationToken: __, ...safe } = account;
    return { ok: true, json: JSON.stringify(safe, null, 2) };
  } catch (e) {
    console.error("exportDatingDataAction:", e);
    return { ok: false, error: "Błąd eksportu." };
  }
}

export async function toggleDatingProfileActiveAction(active: boolean): Promise<RandkiActionResult> {
  const session = await requireDatingSession();
  if (!session.ok) return session;
  const accountId = session.accountId;
  try {
    await getPrisma().datingProfile.update({ where: { accountId }, data: { active } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zaktualizować profilu." };
  }
}
