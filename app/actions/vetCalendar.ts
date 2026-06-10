"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import {
  getOrCreateCalendarFeedToken,
  regenerateCalendarFeedToken,
} from "@/lib/vet/calendarFeed";

export type VetCalendarActionResult =
  | { ok: true; feedUrl: string }
  | { ok: false; error: string };

async function requireVetClinicId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) return null;
  return (session?.user as { vetClinicId?: string })?.vetClinicId ?? null;
}

function buildFeedUrl(token: string): string {
  const base =
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://salon.odart.pl";
  return `${base}/api/wet/panel/calendar/ical?token=${encodeURIComponent(token)}`;
}

export async function getCalendarFeedUrlAction(): Promise<VetCalendarActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    const token = await getOrCreateCalendarFeedToken(vetClinicId);
    return { ok: true, feedUrl: buildFeedUrl(token) };
  } catch {
    return { ok: false, error: "Nie udało się przygotować subskrypcji kalendarza." };
  }
}

export async function regenerateCalendarFeedUrlAction(): Promise<VetCalendarActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    const token = await regenerateCalendarFeedToken(vetClinicId);
    return { ok: true, feedUrl: buildFeedUrl(token) };
  } catch {
    return { ok: false, error: "Nie udało się wygenerować nowego linku." };
  }
}

export async function getGoogleCalendarSubscribeUrlAction(): Promise<
  VetCalendarActionResult & { googleUrl?: string }
> {
  const result = await getCalendarFeedUrlAction();
  if (!result.ok) return result;
  const googleUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(result.feedUrl.replace(/^https?:/, "webcal:"))}`;
  return { ok: true, feedUrl: result.feedUrl, googleUrl };
}
