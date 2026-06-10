"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { logOwnerConsent } from "@/lib/vet/consentLog";

export type VetClientActionResult = { ok: true } | { ok: false; error: string };

async function requireVetClinicId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) return null;
  return (session?.user as { vetClinicId?: string })?.vetClinicId ?? null;
}

export async function addVetClientAction(formData: FormData): Promise<VetClientActionResult & { ownerId?: string }> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const name = formData.get("name")?.toString()?.trim();
  const phone = formData.get("phone")?.toString()?.trim();
  const email = formData.get("email")?.toString()?.trim() || null;
  const notes = formData.get("notes")?.toString()?.trim() || null;
  const smsConsent = formData.get("smsConsent") !== "false";
  const emailConsent = formData.get("emailConsent") !== "false";
  const pushConsent = formData.get("pushConsent") === "true";
  const marketingConsent = formData.get("marketingConsent") === "true";
  const petName = formData.get("petName")?.toString()?.trim();
  const species = formData.get("species")?.toString()?.trim() || "pies";

  if (!name || !phone) return { ok: false, error: "Imię i nazwisko oraz telefon są wymagane." };

  try {
    const prisma = getPrisma();
    const linkedAccount = email
      ? await prisma.vetOwnerAccount.findUnique({ where: { email }, select: { id: true } })
      : null;
    const owner = await prisma.petOwner.create({
      data: {
        vetClinicId,
        accountId: linkedAccount?.id ?? null,
        name,
        phone,
        email,
        notes,
        smsConsent,
        emailConsent,
        pushConsent,
        marketingConsent,
      },
    });
    await logOwnerConsent({
      vetClinicId,
      ownerId: owner.id,
      consentType: "sms",
      granted: smsConsent,
      source: "panel",
      note: "Rejestracja klienta",
    });
    await logOwnerConsent({
      vetClinicId,
      ownerId: owner.id,
      consentType: "email",
      granted: emailConsent,
      source: "panel",
      note: "Rejestracja klienta",
    });
    await logOwnerConsent({
      vetClinicId,
      ownerId: owner.id,
      consentType: "push",
      granted: pushConsent,
      source: "panel",
      note: "Rejestracja klienta",
    });
    await logOwnerConsent({
      vetClinicId,
      ownerId: owner.id,
      consentType: "marketing",
      granted: marketingConsent,
      source: "panel",
      note: "Rejestracja klienta",
    });
    if (petName) {
      await prisma.pet.create({
        data: { ownerId: owner.id, name: petName, species },
      });
    }
    return { ok: true, ownerId: owner.id };
  } catch {
    return { ok: false, error: "Nie udało się dodać klienta." };
  }
}

export async function sendVetClientMessageAction(formData: FormData): Promise<VetClientActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const ownerId = formData.get("ownerId")?.toString()?.trim() || null;
  const channel = formData.get("channel")?.toString() === "email" ? "email" : "sms";
  const subject = formData.get("subject")?.toString()?.trim() || null;
  const body = formData.get("body")?.toString()?.trim();
  if (!body) return { ok: false, error: "Treść wiadomości jest wymagana." };

  try {
    const prisma = getPrisma();
    if (ownerId) {
      const owner = await prisma.petOwner.findFirst({ where: { id: ownerId, vetClinicId } });
      if (!owner) return { ok: false, error: "Nie znaleziono klienta." };
    }
    await prisma.vetClientMessage.create({
      data: {
        vetClinicId,
        ownerId,
        channel,
        subject,
        body,
        status: "sent",
        sentAt: new Date(),
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zapisać wiadomości." };
  }
}

export async function addVetMessageScheduleAction(formData: FormData): Promise<VetClientActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const name = formData.get("name")?.toString()?.trim();
  const body = formData.get("body")?.toString()?.trim();
  const channel = formData.get("channel")?.toString() === "email" ? "email" : "sms";
  const scheduleKind = formData.get("scheduleKind")?.toString() === "once" ? "once" : "cyclic";
  const intervalDays = parseInt(formData.get("intervalDays")?.toString() ?? "", 10);
  const runAtStr = formData.get("runAt")?.toString()?.trim();

  if (!name || !body) return { ok: false, error: "Nazwa i treść są wymagane." };
  if (scheduleKind === "cyclic" && (Number.isNaN(intervalDays) || intervalDays < 1)) {
    return { ok: false, error: "Podaj interwał w dniach (min. 1)." };
  }
  let runAt: Date | null = null;
  if (scheduleKind === "once") {
    if (!runAtStr) return { ok: false, error: "Podaj datę wysyłki." };
    runAt = new Date(`${runAtStr}T09:00:00`);
    if (Number.isNaN(runAt.getTime())) return { ok: false, error: "Nieprawidłowa data." };
  }

  try {
    const prisma = getPrisma();
    await prisma.vetClientMessageSchedule.create({
      data: {
        vetClinicId,
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

export async function toggleVetMessageScheduleAction(id: string, active: boolean): Promise<VetClientActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    const prisma = getPrisma();
    await prisma.vetClientMessageSchedule.updateMany({
      where: { id, vetClinicId },
      data: { active },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zaktualizować." };
  }
}

export async function addVetSettlementAction(formData: FormData): Promise<VetClientActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const ownerId = formData.get("ownerId")?.toString()?.trim();
  const amountPln = parseFloat(formData.get("amountPln")?.toString() ?? "");
  const description = formData.get("description")?.toString()?.trim();
  const dueAtStr = formData.get("dueAt")?.toString()?.trim();

  if (!ownerId || !description) return { ok: false, error: "Klient i opis są wymagane." };
  if (Number.isNaN(amountPln) || amountPln < 0) return { ok: false, error: "Podaj poprawną kwotę." };

  let dueAt: Date | null = null;
  if (dueAtStr) {
    dueAt = new Date(`${dueAtStr}T12:00:00`);
    if (Number.isNaN(dueAt.getTime())) return { ok: false, error: "Nieprawidłowa data terminu." };
  }

  try {
    const prisma = getPrisma();
    const owner = await prisma.petOwner.findFirst({ where: { id: ownerId, vetClinicId } });
    if (!owner) return { ok: false, error: "Nie znaleziono klienta." };
    await prisma.vetClientSettlement.create({
      data: { vetClinicId, ownerId, amountPln, description, dueAt, status: "open" },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się dodać rozliczenia." };
  }
}

export async function markVetSettlementPaidAction(id: string): Promise<VetClientActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };
  try {
    const prisma = getPrisma();
    await prisma.vetClientSettlement.updateMany({
      where: { id, vetClinicId },
      data: { status: "paid", paidAt: new Date() },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się oznaczyć jako opłacone." };
  }
}

export async function updateOwnerConsentsAction(formData: FormData): Promise<VetClientActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const ownerId = formData.get("ownerId")?.toString()?.trim();
  const consentType = formData.get("consentType")?.toString();
  const granted = formData.get("granted") === "true";
  const note = formData.get("note")?.toString()?.trim() || null;

  if (!ownerId) return { ok: false, error: "Brak identyfikatora klienta." };
  if (consentType !== "sms" && consentType !== "marketing" && consentType !== "email" && consentType !== "push") {
    return { ok: false, error: "Nieprawidłowy typ zgody." };
  }

  try {
    const prisma = getPrisma();
    const owner = await prisma.petOwner.findFirst({ where: { id: ownerId, vetClinicId } });
    if (!owner) return { ok: false, error: "Nie znaleziono klienta." };

    const data =
      consentType === "sms"
        ? { smsConsent: granted }
        : consentType === "email"
          ? { emailConsent: granted }
          : consentType === "push"
            ? { pushConsent: granted }
            : { marketingConsent: granted };

    await prisma.petOwner.update({ where: { id: ownerId }, data });
    await logOwnerConsent({
      vetClinicId,
      ownerId,
      consentType,
      granted,
      source: "panel",
      note,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zaktualizować zgody." };
  }
}
