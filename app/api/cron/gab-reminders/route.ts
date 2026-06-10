import { NextRequest, NextResponse } from "next/server";
import {
  dispatchGabAppointmentDayBeforeReminders,
  dispatchGabDueScheduledReminders,
  syncGabRecallRemindersBatch,
} from "@/lib/gabinet/recallReminders";

export const dynamic = "force-dynamic";

const CRON_SECRET = process.env.CRON_SECRET?.trim();

/** Wysyła zaplanowane przypomnienia recall/SMS i przypomnienia dzień przed wizytą. */
export async function GET(request: NextRequest) {
  if (CRON_SECRET && request.nextUrl.searchParams.get("secret") !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const synced = await syncGabRecallRemindersBatch(50);
  const recallSent = await dispatchGabDueScheduledReminders(100);
  const apptSent = await dispatchGabAppointmentDayBeforeReminders(50);

  return NextResponse.json({ ok: true, sent: recallSent + apptSent, synced });
}
