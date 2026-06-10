"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GAB_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { logGabClientConsentChange } from "@/lib/gabinet/consentLog";
import { sendGabSms } from "@/lib/gabinet/gabNotify";
import { sendGabPatientReminderEmail } from "@/lib/email";
import { gabPrisma } from "@/lib/gabinet/prismaGab";

export type GabClientActionResult = { ok: true } | { ok: false; error: string };

async function requireGabClinicId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== GAB_CLINIC_ROLE) return null;
  return (session?.user as { gabClinicId?: string })?.gabClinicId ?? null;
}

export async function addGabClientAction(
  formData: FormData
): Promise<GabClientActionResult & { clientId?: string }> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };

  const name = formData.get("name")?.toString()?.trim();
  const phone = formData.get("phone")?.toString()?.trim();
  const email = formData.get("email")?.toString()?.trim() || null;
  const notes = formData.get("notes")?.toString()?.trim() || null;
  const smsConsent = formData.get("smsConsent") !== "false";
  const emailConsent = formData.get("emailConsent") !== "false";
  const marketingConsent = formData.get("marketingConsent") === "true";

  if (!name || !phone) return { ok: false, error: "Imię i telefon są wymagane." };

  try {
    const client = await gabPrisma().gabClient.create({
      data: {
        gabClinicId,
        name,
        phone,
        email,
        notes,
        smsConsent,
        emailConsent,
        marketingConsent,
      },
    });
    if (smsConsent) await logGabClientConsentChange(gabClinicId, client.id, "sms", true, "create");
    if (emailConsent) await logGabClientConsentChange(gabClinicId, client.id, "email", true, "create");
    if (marketingConsent) await logGabClientConsentChange(gabClinicId, client.id, "marketing", true, "create");
    return { ok: true, clientId: client.id };
  } catch {
    return { ok: false, error: "Nie udało się dodać klienta." };
  }
}

export async function sendGabClientMessageAction(formData: FormData): Promise<GabClientActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };

  const clientId = formData.get("clientId")?.toString()?.trim() || null;
  const channelRaw = formData.get("channel")?.toString()?.trim() ?? "sms";
  const channel = channelRaw === "email" ? "email" : channelRaw === "push" ? "push" : "sms";
  const subject = formData.get("subject")?.toString()?.trim() || null;
  const body = formData.get("body")?.toString()?.trim();
  if (!body) return { ok: false, error: "Treść wiadomości jest wymagana." };

  try {
    let client: {
      id: string;
      name: string;
      phone: string;
      smsConsent: boolean;
      email: string | null;
      emailConsent: boolean;
      pushConsent: boolean;
    } | null = null;
    if (clientId) {
      client = await getPrisma().gabClient.findFirst({
        where: { id: clientId, gabClinicId },
        select: {
          id: true,
          name: true,
          phone: true,
          smsConsent: true,
          email: true,
          emailConsent: true,
          pushConsent: true,
        },
      });
      if (!client) return { ok: false, error: "Nie znaleziono klienta." };
    }

    let dispatched = false;
    if (channel === "sms" && client?.smsConsent && client.phone?.trim()) {
      dispatched = await sendGabSms(client.phone, body);
      if (!dispatched) return { ok: false, error: "Nie udało się wysłać SMS." };
    }
    if (channel === "email" && client?.emailConsent && client.email?.trim()) {
      dispatched = await sendGabPatientReminderEmail(client.email, {
        clinicName: "Gabinet",
        patientName: client.name,
        subject: subject ?? "Wiadomość z gabinetu",
        message: body,
      });
      if (!dispatched) return { ok: false, error: "Nie udało się wysłać e-maila." };
    }
    if (channel === "push" && client?.pushConsent) {
      const { sendGabPushToClient } = await import("@/lib/gabinet/push");
      const count = await sendGabPushToClient(client.id, {
        title: subject ?? "Wiadomość z gabinetu",
        body,
      });
      dispatched = count > 0;
      if (!dispatched) return { ok: false, error: "Brak aktywnej subskrypcji push u klienta." };
    }

    await gabPrisma().gabClientMessage.create({
      data: {
        gabClinicId,
        clientId,
        channel,
        subject,
        body,
        status: dispatched || channel === "email" ? "sent" : "logged",
        sentAt: new Date(),
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zapisać wiadomości." };
  }
}

export async function addGabSettlementAction(formData: FormData): Promise<GabClientActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };

  const clientId = formData.get("clientId")?.toString()?.trim();
  const amountPln = parseFloat(formData.get("amountPln")?.toString() ?? "");
  const description = formData.get("description")?.toString()?.trim();
  const dueAtStr = formData.get("dueAt")?.toString()?.trim();

  if (!clientId || !description) return { ok: false, error: "Klient i opis są wymagane." };
  if (Number.isNaN(amountPln) || amountPln < 0) return { ok: false, error: "Podaj poprawną kwotę." };

  let dueAt: Date | null = null;
  if (dueAtStr) {
    dueAt = new Date(`${dueAtStr}T12:00:00`);
    if (Number.isNaN(dueAt.getTime())) return { ok: false, error: "Nieprawidłowa data." };
  }

  try {
    const client = await gabPrisma().gabClient.findFirst({ where: { id: clientId, gabClinicId } });
    if (!client) return { ok: false, error: "Nie znaleziono klienta." };
    await gabPrisma().gabClientSettlement.create({
      data: { gabClinicId, clientId, amountPln, description, dueAt, status: "open" },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się dodać rozliczenia." };
  }
}

export async function markGabSettlementPaidAction(id: string): Promise<GabClientActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    await getPrisma().gabClientSettlement.updateMany({
      where: { id, gabClinicId },
      data: { status: "paid", paidAt: new Date() },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się oznaczyć jako opłacone." };
  }
}

export async function saveGabMessageScheduleAction(formData: FormData): Promise<GabClientActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };

  const name = formData.get("name")?.toString()?.trim();
  const body = formData.get("body")?.toString()?.trim();
  const channel = formData.get("channel")?.toString() === "email" ? "email" : "sms";
  const scheduleKind = formData.get("scheduleKind")?.toString() === "once" ? "once" : "cyclic";
  const intervalDays = parseInt(formData.get("intervalDays")?.toString() ?? "30", 10);
  const runAtStr = formData.get("runAt")?.toString()?.trim();

  if (!name || !body) return { ok: false, error: "Nazwa i treść są wymagane." };

  let runAt: Date | null = null;
  if (scheduleKind === "once" && runAtStr) {
    runAt = new Date(`${runAtStr}T09:00:00`);
    if (Number.isNaN(runAt.getTime())) return { ok: false, error: "Nieprawidłowa data." };
  }

  try {
    await getPrisma().gabClientMessageSchedule.create({
      data: {
        gabClinicId,
        name,
        body,
        channel,
        scheduleKind,
        intervalDays: scheduleKind === "cyclic" ? intervalDays : null,
        runAt,
        active: true,
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się utworzyć harmonogramu." };
  }
}

export async function deleteGabMessageScheduleAction(id: string): Promise<GabClientActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    await getPrisma().gabClientMessageSchedule.deleteMany({ where: { id, gabClinicId } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się usunąć harmonogramu." };
  }
}

export async function deleteGabClientAction(id: string): Promise<GabClientActionResult> {
  const gabClinicId = await requireGabClinicId();
  if (!gabClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    const db = getPrisma();
    const client = await db.gabClient.findFirst({ where: { id, gabClinicId } });
    if (!client) return { ok: false, error: "Nie znaleziono klienta." };
    const openSettlements = await db.gabClientSettlement.count({ where: { clientId: id, status: "open" } });
    if (openSettlements > 0) {
      return { ok: false, error: "Klient ma otwarte rozliczenia — zamknij je przed usunięciem." };
    }
    await db.gabClient.delete({ where: { id } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się usunąć klienta." };
  }
}
