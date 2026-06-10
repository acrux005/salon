import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { sendVetOwnerReminderEmail } from "@/lib/email";
import { sendVetSms } from "@/lib/vet/vetNotify";
import { syncPreventionRemindersBatch, vetOwnerPanelPetUrl } from "@/lib/vet/preventionReminders";

export const dynamic = "force-dynamic";

const CRON_SECRET = process.env.CRON_SECRET?.trim();

async function dispatchReminder(row: {
  id: string;
  channel: string;
  message: string;
  kind: string;
  petId: string | null;
  ownerId: string | null;
  vetClinic: { name: string; phone: string | null };
}): Promise<boolean> {
  const prisma = getPrisma();
  const owner = row.ownerId
    ? await prisma.petOwner.findUnique({
        where: { id: row.ownerId },
        select: { name: true, email: true, phone: true, emailConsent: true, smsConsent: true },
      })
    : null;

  const pet = row.petId
    ? await prisma.pet.findUnique({ where: { id: row.petId }, select: { name: true } })
    : null;

  let ok = false;

  if (row.channel === "email") {
    if (owner?.emailConsent && owner.email?.trim()) {
      ok = await sendVetOwnerReminderEmail(owner.email, {
        clinicName: row.vetClinic.name,
        clinicPhone: row.vetClinic.phone,
        ownerName: owner.name,
        petName: pet?.name ?? "zwierzę",
        subject:
          row.kind === "prevention"
            ? `Przypomnienie profilaktyki — ${pet?.name ?? "pacjent"}`
            : row.kind === "vaccination"
              ? `Przypomnienie o szczepieniu — ${pet?.name ?? "pacjent"}`
              : `Przypomnienie — ${row.vetClinic.name}`,
        message: row.message,
        panelUrl: row.petId ? vetOwnerPanelPetUrl(row.petId) : undefined,
      });
    } else {
      ok = true;
    }
  } else {
    if (owner?.smsConsent && owner.phone?.trim()) {
      ok = await sendVetSms(owner.phone, row.message);
    } else {
      ok = true;
    }
  }

  if (ok) {
    await prisma.vetScheduledReminder.update({
      where: { id: row.id },
      data: { sentAt: new Date() },
    });
  }

  return ok;
}

/** Wysyła zaplanowane przypomnienia SMS i e-mail; synchronizuje plan profilaktyki. */
export async function GET(request: NextRequest) {
  if (CRON_SECRET && request.nextUrl.searchParams.get("secret") !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const synced = await syncPreventionRemindersBatch(50);

  const prisma = getPrisma();
  const due = await prisma.vetScheduledReminder.findMany({
    where: { sentAt: null, sendAt: { lte: new Date() } },
    take: 100,
    include: { vetClinic: { select: { name: true, phone: true } } },
  });

  let sent = 0;
  for (const row of due) {
    const ok = await dispatchReminder(row);
    if (ok) sent++;
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const apptReminders = await prisma.vetAppointment.findMany({
    where: {
      status: "planned",
      reminderSentAt: null,
      date: tomorrow.toISOString().slice(0, 10),
    },
    take: 50,
    include: { vetClinic: { select: { name: true, phone: true } } },
  });

  for (const a of apptReminders) {
    const owner = a.petId
      ? await prisma.pet.findUnique({
          where: { id: a.petId },
          include: { owner: true },
        })
      : null;

    const msg = `Przypomnienie: wizyta ${a.date} ${a.time} — ${a.petName ?? "pacjent"} (${a.vetClinic.name}).`;
    let ok = false;

    if (owner?.owner.emailConsent && owner.owner.email?.trim()) {
      ok = await sendVetOwnerReminderEmail(owner.owner.email, {
        clinicName: a.vetClinic.name,
        clinicPhone: a.vetClinic.phone,
        ownerName: owner.owner.name,
        petName: a.petName ?? owner.name,
        subject: `Przypomnienie o wizycie — ${a.petName ?? "pacjent"}`,
        message: msg,
        panelUrl: a.petId ? vetOwnerPanelPetUrl(a.petId) : undefined,
      });
    }
    if (owner?.owner.smsConsent && owner.owner.phone?.trim()) {
      ok = (await sendVetSms(owner.owner.phone, msg)) || ok;
    }
    if (!owner) ok = true;

    if (ok) {
      await prisma.vetAppointment.update({
        where: { id: a.id },
        data: { reminderSentAt: new Date() },
      });
      sent++;
    }
  }

  return NextResponse.json({ ok: true, sent, synced });
}
