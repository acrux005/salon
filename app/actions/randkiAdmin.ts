"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ADMIN_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { sendDatingBanEmail, sendDatingWarnEmail } from "@/lib/randki/email";
import { deleteDatingPhotoFile } from "@/lib/randki/fileCleanup";

export type RandkiAdminResult = { ok: true } | { ok: false; error: string };

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== ADMIN_ROLE) return null;
  return session;
}

export type DatingReportRow = {
  id: string;
  reason: string;
  status: string;
  actionTaken: string | null;
  createdAt: Date;
  reviewedAt: Date | null;
  reporterEmail: string;
  reportedAccountId: string;
  reportedName: string;
};

export type DatingUserRow = {
  accountId: string;
  email: string;
  displayName: string;
  city: string;
  active: boolean;
  bannedAt: Date | null;
  warnedAt: Date | null;
  createdAt: Date;
};

export type DatingPhotoModRow = {
  id: string;
  accountId: string;
  url: string;
  displayName: string;
  hidden: boolean;
  createdAt: Date;
};

export async function listPendingDatingReportsAction(): Promise<
  { ok: true; rows: DatingReportRow[] } | { ok: false; error: string }
> {
  if (!(await requireAdmin())) return { ok: false, error: "Brak uprawnień." };
  return listDatingReportsByStatus("pending");
}

export async function listResolvedDatingReportsAction(): Promise<
  { ok: true; rows: DatingReportRow[] } | { ok: false; error: string }
> {
  if (!(await requireAdmin())) return { ok: false, error: "Brak uprawnień." };
  return listDatingReportsByStatus("resolved");
}

async function listDatingReportsByStatus(
  status: string
): Promise<{ ok: true; rows: DatingReportRow[] } | { ok: false; error: string }> {
  try {
    const reports = await getPrisma().datingReport.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    const rows: DatingReportRow[] = [];
    for (const r of reports) {
      const reporter = await getPrisma().datingAccount.findUnique({
        where: { id: r.reporterAccountId },
        select: { email: true },
      });
      const reported = await getPrisma().datingProfile.findUnique({
        where: { accountId: r.reportedAccountId },
        select: { displayName: true },
      });
      rows.push({
        id: r.id,
        reason: r.reason,
        status: r.status,
        actionTaken: r.actionTaken,
        createdAt: r.createdAt,
        reviewedAt: r.reviewedAt,
        reporterEmail: reporter?.email ?? "—",
        reportedAccountId: r.reportedAccountId,
        reportedName: reported?.displayName ?? "—",
      });
    }
    return { ok: true as const, rows };
  } catch (e) {
    console.error("listDatingReportsByStatus:", e);
    return { ok: false as const, error: "Błąd ładowania zgłoszeń." };
  }
}

export async function searchDatingUsersAction(query: string): Promise<
  { ok: true; rows: DatingUserRow[] } | { ok: false; error: string }
> {
  if (!(await requireAdmin())) return { ok: false, error: "Brak uprawnień." };
  const q = query.trim().toLowerCase();
  if (q.length < 2) return { ok: false, error: "Podaj min. 2 znaki." };
  try {
    const prisma = getPrisma();
    const accounts = await prisma.datingAccount.findMany({
      where: {
        OR: [{ email: { contains: q } }, { profile: { displayName: { contains: q } } }],
      },
      include: { profile: true },
      take: 50,
      orderBy: { createdAt: "desc" },
    });
    const rows: DatingUserRow[] = accounts.map((a) => ({
      accountId: a.id,
      email: a.email,
      displayName: a.profile?.displayName ?? "—",
      city: a.profile?.city ?? "—",
      active: a.profile?.active ?? false,
      bannedAt: a.bannedAt,
      warnedAt: a.warnedAt,
      createdAt: a.createdAt,
    }));
    return { ok: true, rows };
  } catch (e) {
    console.error("searchDatingUsersAction:", e);
    return { ok: false, error: "Błąd wyszukiwania." };
  }
}

export async function listRecentDatingPhotosAction(): Promise<
  { ok: true; rows: DatingPhotoModRow[] } | { ok: false; error: string }
> {
  if (!(await requireAdmin())) return { ok: false, error: "Brak uprawnień." };
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const photos = await getPrisma().datingPhoto.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 80,
    });
    const rows: DatingPhotoModRow[] = [];
    for (const p of photos) {
      const profile = await getPrisma().datingProfile.findUnique({
        where: { accountId: p.accountId },
        select: { displayName: true },
      });
      rows.push({
        id: p.id,
        accountId: p.accountId,
        url: p.url,
        displayName: profile?.displayName ?? "—",
        hidden: p.hidden,
        createdAt: p.createdAt,
      });
    }
    return { ok: true, rows };
  } catch (e) {
    console.error("listRecentDatingPhotosAction:", e);
    return { ok: false, error: "Błąd ładowania zdjęć." };
  }
}

export async function hideDatingPhotoAction(photoId: string): Promise<RandkiAdminResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Brak uprawnień." };
  try {
    const photo = await getPrisma().datingPhoto.findUnique({ where: { id: photoId } });
    if (!photo) return { ok: false, error: "Nie znaleziono zdjęcia." };
    await getPrisma().datingPhoto.update({ where: { id: photoId }, data: { hidden: true } });
    const { syncPrimaryPhotoUrl } = await import("@/lib/randki/photos");
    await syncPrimaryPhotoUrl(photo.accountId);
    return { ok: true };
  } catch {
    return { ok: false, error: "Błąd zapisu." };
  }
}

export async function deleteDatingPhotoAdminAction(photoId: string): Promise<RandkiAdminResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Brak uprawnień." };
  try {
    const photo = await getPrisma().datingPhoto.findUnique({ where: { id: photoId } });
    if (!photo) return { ok: false, error: "Nie znaleziono zdjęcia." };
    await deleteDatingPhotoFile(photo.url);
    await getPrisma().datingPhoto.delete({ where: { id: photoId } });
    const { syncPrimaryPhotoUrl } = await import("@/lib/randki/photos");
    await syncPrimaryPhotoUrl(photo.accountId);
    return { ok: true };
  } catch {
    return { ok: false, error: "Błąd usuwania." };
  }
}

export async function resolveDatingReportAction(
  reportId: string,
  action: "dismiss" | "warn" | "suspend" | "ban"
): Promise<RandkiAdminResult> {
  const session = await requireAdmin();
  if (!session) return { ok: false, error: "Brak uprawnień." };
  try {
    const prisma = getPrisma();
    const report = await prisma.datingReport.findUnique({ where: { id: reportId } });
    if (!report) return { ok: false, error: "Nie znaleziono zgłoszenia." };
    const adminEmail = session.user?.email ?? "admin";
    await prisma.datingReport.update({
      where: { id: reportId },
      data: {
        status: "resolved",
        reviewedAt: new Date(),
        reviewedBy: adminEmail,
        actionTaken: action,
      },
    });
    if (action === "warn") {
      await prisma.datingAccount.update({
        where: { id: report.reportedAccountId },
        data: { warnedAt: new Date() },
      });
      const warned = await prisma.datingAccount.findUnique({
        where: { id: report.reportedAccountId },
        select: { email: true },
      });
      if (warned?.email) sendDatingWarnEmail(warned.email).catch((e) => console.error("sendDatingWarnEmail:", e));
    }
    if (action === "suspend") {
      await prisma.datingProfile.updateMany({
        where: { accountId: report.reportedAccountId },
        data: { active: false },
      });
    }
    if (action === "ban") {
      const banReason = report.reason.slice(0, 200);
      await prisma.datingAccount.update({
        where: { id: report.reportedAccountId },
        data: { bannedAt: new Date(), banReason },
      });
      await prisma.datingProfile.updateMany({
        where: { accountId: report.reportedAccountId },
        data: { active: false },
      });
      const banned = await prisma.datingAccount.findUnique({
        where: { id: report.reportedAccountId },
        select: { email: true },
      });
      if (banned?.email) sendDatingBanEmail(banned.email, banReason).catch((e) => console.error("sendDatingBanEmail:", e));
    }
    return { ok: true };
  } catch (e) {
    console.error("resolveDatingReportAction:", e);
    return { ok: false, error: "Błąd zapisu." };
  }
}

export async function adminBanDatingUserAction(accountId: string, reason: string): Promise<RandkiAdminResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Brak uprawnień." };
  try {
    const banReason = reason.slice(0, 200);
    const account = await getPrisma().datingAccount.update({
      where: { id: accountId },
      data: { bannedAt: new Date(), banReason },
      select: { email: true },
    });
    await getPrisma().datingProfile.updateMany({ where: { accountId }, data: { active: false } });
    sendDatingBanEmail(account.email, banReason).catch((e) => console.error("sendDatingBanEmail:", e));
    return { ok: true };
  } catch {
    return { ok: false, error: "Błąd banu." };
  }
}

export async function adminUnbanDatingUserAction(accountId: string): Promise<RandkiAdminResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Brak uprawnień." };
  try {
    await getPrisma().datingAccount.update({
      where: { id: accountId },
      data: { bannedAt: null, banReason: null },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Błąd odbanowania." };
  }
}

export async function adminGetDatingRoomPreviewAction(accountId: string): Promise<
  | { ok: true; room: import("@/lib/randki/roomTypes").RandkiRoomData; displayName: string }
  | { ok: false; error: string }
> {
  if (!(await requireAdmin())) return { ok: false, error: "Brak uprawnień." };
  if (!accountId?.trim()) return { ok: false, error: "Brak ID konta." };
  try {
    const { getRoomDataForAccount } = await import("@/lib/randki/roomData");
    const room = await getRoomDataForAccount(accountId, { includeDailyMoment: true });
    if (!room) return { ok: false, error: "Brak profilu / pokoju dla tego konta." };
    return { ok: true, room, displayName: room.displayName };
  } catch (e) {
    console.error("adminGetDatingRoomPreviewAction:", e);
    return { ok: false, error: "Błąd ładowania pokoju." };
  }
}

export type DatingPremiumStats = {
  stripeConfigured: boolean;
  turnConfigured: boolean;
  activePremiumCount: number;
  stripePremiumCount: number;
  manualPremiumCount: number;
  expiringSoonCount: number;
};

export type DatingPremiumRow = {
  accountId: string;
  email: string;
  displayName: string;
  isPremium: boolean;
  premiumUntil: Date | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  source: "stripe" | "manual" | "inactive";
};

export async function getDatingPremiumStatsAction(): Promise<
  { ok: true; stats: DatingPremiumStats } | { ok: false; error: string }
> {
  if (!(await requireAdmin())) return { ok: false, error: "Brak uprawnień." };
  try {
    const { isStripeConfigured } = await import("@/lib/randki/stripe");
    const { isTurnConfigured } = await import("@/lib/randki/webrtc");
    const prisma = getPrisma();
    const now = new Date();
    const week = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const active = await prisma.datingAccount.findMany({
      where: {
        isPremium: true,
        OR: [{ premiumUntil: null }, { premiumUntil: { gt: now } }],
      },
      select: { stripeSubscriptionId: true, premiumUntil: true },
    });

    const stripePremiumCount = active.filter((a) => !!a.stripeSubscriptionId).length;
    const expiringSoonCount = active.filter(
      (a) => a.premiumUntil && a.premiumUntil > now && a.premiumUntil <= week
    ).length;

    return {
      ok: true,
      stats: {
        stripeConfigured: isStripeConfigured(),
        turnConfigured: isTurnConfigured(),
        activePremiumCount: active.length,
        stripePremiumCount,
        manualPremiumCount: active.length - stripePremiumCount,
        expiringSoonCount,
      },
    };
  } catch (e) {
    console.error("getDatingPremiumStatsAction:", e);
    return { ok: false, error: "Błąd statystyk Premium." };
  }
}

export async function listDatingPremiumUsersAction(): Promise<
  { ok: true; rows: DatingPremiumRow[] } | { ok: false; error: string }
> {
  if (!(await requireAdmin())) return { ok: false, error: "Brak uprawnień." };
  try {
    const prisma = getPrisma();
    const now = new Date();
    const accounts = await prisma.datingAccount.findMany({
      where: {
        OR: [
          { isPremium: true },
          { stripeCustomerId: { not: null } },
          { stripeSubscriptionId: { not: null } },
        ],
      },
      include: { profile: { select: { displayName: true } } },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });

    const rows: DatingPremiumRow[] = accounts.map((a) => {
      const active = a.isPremium && (!a.premiumUntil || a.premiumUntil > now);
      let source: DatingPremiumRow["source"] = "inactive";
      if (active) source = a.stripeSubscriptionId ? "stripe" : "manual";
      return {
        accountId: a.id,
        email: a.email,
        displayName: a.profile?.displayName ?? "—",
        isPremium: active,
        premiumUntil: a.premiumUntil,
        stripeCustomerId: a.stripeCustomerId,
        stripeSubscriptionId: a.stripeSubscriptionId,
        source,
      };
    });

    rows.sort((a, b) => Number(b.isPremium) - Number(a.isPremium));
    return { ok: true, rows };
  } catch (e) {
    console.error("listDatingPremiumUsersAction:", e);
    return { ok: false, error: "Błąd listy Premium." };
  }
}

export async function grantDatingPremiumAdminAction(
  accountId: string,
  days: number
): Promise<RandkiAdminResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Brak uprawnień." };
  const d = Math.min(Math.max(Math.floor(days), 1), 365);
  try {
    const until = new Date(Date.now() + d * 24 * 60 * 60 * 1000);
    await getPrisma().datingAccount.update({
      where: { id: accountId },
      data: { isPremium: true, premiumUntil: until },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się nadać Premium." };
  }
}

export async function revokeDatingPremiumAdminAction(accountId: string): Promise<RandkiAdminResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Brak uprawnień." };
  try {
    const account = await getPrisma().datingAccount.findUnique({
      where: { id: accountId },
      select: { stripeSubscriptionId: true },
    });
    if (account?.stripeSubscriptionId) {
      const { cancelStripeSubscription } = await import("@/lib/randki/stripe");
      await cancelStripeSubscription(account.stripeSubscriptionId).catch((e) =>
        console.error("cancelStripeSubscription:", e)
      );
    }
    await getPrisma().datingAccount.update({
      where: { id: accountId },
      data: { isPremium: false, premiumUntil: null, stripeSubscriptionId: null },
    });
    return { ok: true };
  } catch (e) {
    console.error("revokeDatingPremiumAdminAction:", e);
    return { ok: false, error: "Nie udało się odebrać Premium." };
  }
}
