import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RANDKI_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

export const DATING_BANNED_ERROR = "Twoje konto zostało zablokowane. Skontaktuj się z moderacją: kontakt@odart.pl";

export type DatingSessionState =
  | { status: "ok"; accountId: string }
  | { status: "unauthorized" }
  | { status: "banned" };

export async function getDatingSessionState(): Promise<DatingSessionState> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const accountId = (session?.user as { datingAccountId?: string })?.datingAccountId;
  if (role !== RANDKI_ROLE || !accountId) return { status: "unauthorized" };

  const account = await getPrisma().datingAccount.findUnique({
    where: { id: accountId },
    select: { bannedAt: true },
  });
  if (account?.bannedAt) return { status: "banned" };
  return { status: "ok", accountId };
}

/** Zwraca accountId lub null (brak sesji / ban). */
export async function requireDatingAccountId(): Promise<string | null> {
  const state = await getDatingSessionState();
  return state.status === "ok" ? state.accountId : null;
}

export async function requireDatingAccountIdWithError(): Promise<
  { ok: true; accountId: string } | { ok: false; error: string }
> {
  const state = await getDatingSessionState();
  if (state.status === "ok") return { ok: true, accountId: state.accountId };
  if (state.status === "banned") return { ok: false, error: DATING_BANNED_ERROR };
  return { ok: false, error: "Zaloguj się, aby kontynuować." };
}

export async function isDatingAccountBanned(accountId: string): Promise<boolean> {
  const account = await getPrisma().datingAccount.findUnique({
    where: { id: accountId },
    select: { bannedAt: true },
  });
  return !!account?.bannedAt;
}
