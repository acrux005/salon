import { NextRequest, NextResponse } from "next/server";
import {
  dispatchGabAppointmentDayBeforeReminders,
  dispatchGabDueScheduledReminders,
  syncGabRecallRemindersBatch,
} from "@/lib/gabinet/recallReminders";
import { assertCronSecret } from "@/lib/cronSecret";

export const dynamic = "force-dynamic";

/** Wysyła zaplanowane przypomnienia recall/SMS i przypomnienia dzień przed wizytą. */
export async function GET(request: NextRequest) {
  const denied = assertCronSecret(request);
  if (denied) return denied;

  const synced = await syncGabRecallRemindersBatch(50);
  const recallSent = await dispatchGabDueScheduledReminders(100);
  const apptSent = await dispatchGabAppointmentDayBeforeReminders(50);

  return NextResponse.json({ ok: true, sent: recallSent + apptSent, synced });
}
