import crypto from "crypto";
import { getPrisma } from "@/lib/db";

export async function ensureGabPatientCalendarToken(accountId: string): Promise<string> {
  const db = getPrisma();
  const account = await db.gabPatientAccount.findUnique({
    where: { id: accountId },
    select: { calendarToken: true },
  });
  if (account?.calendarToken) return account.calendarToken;
  const token = crypto.randomBytes(24).toString("hex");
  await db.gabPatientAccount.update({
    where: { id: accountId },
    data: { calendarToken: token },
  });
  return token;
}

export async function findGabPatientAccountIdByCalendarToken(token: string): Promise<string | null> {
  const row = await getPrisma().gabPatientAccount.findFirst({
    where: { calendarToken: token },
    select: { id: true },
  });
  return row?.id ?? null;
}
