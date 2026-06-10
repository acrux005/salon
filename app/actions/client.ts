"use server";

import bcrypt from "bcrypt";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { CLIENT_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { tryConsume } from "@/lib/rateLimit";

const VERIFY_EXPIRES_MS = 24 * 60 * 60 * 1000; // 24 h
const MIN_PASSWORD_LENGTH = 8;

export type RegisterClientResult = { ok: true; message?: string } | { ok: false; error: string };

/** Salon: rejestracja klienta (email, hasło, opcjonalnie imię i telefon). */
export async function registerClientAction(formData: FormData): Promise<RegisterClientResult> {
  const email = formData.get("email")?.toString()?.trim()?.toLowerCase();
  const password = formData.get("password")?.toString();
  const name = (formData.get("name") as string | null)?.trim() || null;
  const phone = (formData.get("phone") as string | null)?.trim() || null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Podaj prawidłowy adres e-mail." };
  }
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, error: `Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków.` };
  }

  const registerKey = "client-register:" + email;
  if (!tryConsume(registerKey, 5, 60 * 60 * 1000)) {
    return { ok: false, error: "Zbyt wiele prób rejestracji. Spróbuj za godzinę." };
  }

  try {
    const prisma = getPrisma();
    const existing = await prisma.client.findUnique({ where: { email } });
    if (existing) return { ok: false, error: "Konto z tym adresem e-mail już istnieje." };

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + VERIFY_EXPIRES_MS);

    await prisma.client.create({
      data: {
        email,
        passwordHash,
        name,
        phone,
        verificationToken,
        verificationTokenExpires,
      },
    });
    return {
      ok: true,
      message: "Konto utworzone. Możesz się zalogować.",
    };
  } catch (e) {
    console.error("registerClientAction:", e);
    return { ok: false, error: "Błąd rejestracji. Spróbuj ponownie." };
  }
}

export type VerifyEmailResult = { ok: true } | { ok: false; error: string };

/** Salon: potwierdzenie adresu e-mail klienta (link z tokenem). */
export async function verifyEmailAction(token: string): Promise<VerifyEmailResult> {
  if (!token?.trim()) return { ok: false, error: "Brak tokenu." };
  try {
    const prisma = getPrisma();
    const client = await prisma.client.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: { gt: new Date() },
      },
    });
    if (!client) {
      return { ok: false, error: "Link wygasł lub jest nieprawidłowy." };
    }
    await prisma.client.update({
      where: { id: client.id },
      data: {
        emailVerifiedAt: new Date(),
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });
    return { ok: true };
  } catch (e) {
    console.error("verifyEmailAction:", e);
    return { ok: false, error: "Błąd potwierdzenia. Spróbuj ponownie." };
  }
}

export type SaveClientBookingResult = { ok: true } | { ok: false; error: string };

type SaveClientBookingBody = {
  cosmoAppointmentId?: number;
  clinicSlug?: string;
  clinicName?: string;
  date?: string;
  time?: string;
  serviceName?: string;
};

/** Salon: zapis rezerwacji z zewnętrznego systemu (np. Cosmo) do panelu klienta. */
export async function saveClientBookingAction(body: unknown): Promise<SaveClientBookingResult> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const clientId = (session?.user as { clientId?: string })?.clientId;
  if (role !== CLIENT_ROLE || !clientId) return { ok: false, error: "Brak sesji klienta." };

  const b = body as SaveClientBookingBody;
  const cosmoAppointmentId = typeof b?.cosmoAppointmentId === "number" ? b.cosmoAppointmentId : undefined;
  const clinicSlug = typeof b?.clinicSlug === "string" ? b.clinicSlug.trim() : "";
  const clinicName = typeof b?.clinicName === "string" ? b.clinicName.trim() || undefined : undefined;
  const date = typeof b?.date === "string" ? b.date.trim() : "";
  const time = typeof b?.time === "string" ? b.time.trim() : "";
  const serviceName = typeof b?.serviceName === "string" ? b.serviceName.trim() || undefined : undefined;

  if (cosmoAppointmentId == null || !clinicSlug || !date || !time) {
    return { ok: false, error: "Brak wymaganych danych rezerwacji." };
  }

  try {
    const prisma = getPrisma();
    const existing = await prisma.clientBooking.findFirst({
      where: { clientId, cosmoAppointmentId, clinicSlug },
    });
    if (existing) return { ok: true };

    await prisma.clientBooking.create({
      data: {
        clientId,
        cosmoAppointmentId,
        clinicSlug,
        clinicName,
        date,
        time,
        serviceName,
        status: "planned",
      },
    });
    return { ok: true };
  } catch (e) {
    console.error("saveClientBookingAction:", e);
    return { ok: false, error: "Nie udało się zapisać rezerwacji." };
  }
}

export type UpdateClientSettingsResult = { ok: true } | { ok: false; error: string };

export async function updateClientSettingsAction(formData: FormData): Promise<UpdateClientSettingsResult> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const clientId = (session?.user as { clientId?: string })?.clientId;
  if (role !== CLIENT_ROLE || !clientId) return { ok: false, error: "Brak sesji klienta." };

  const notifyReminders = formData.get("notifyReminders") === "1";
  const notifyPromo = formData.get("notifyPromo") === "1";
  const name = (formData.get("name") as string | null)?.trim() ?? null;
  const phone = (formData.get("phone") as string | null)?.trim() ?? null;
  const invoiceName = (formData.get("invoiceName") as string | null)?.trim() ?? null;
  const invoiceNip = (formData.get("invoiceNip") as string | null)?.trim() ?? null;
  const invoiceAddress = (formData.get("invoiceAddress") as string | null)?.trim() ?? null;

  try {
    const prisma = getPrisma();
    await prisma.client.update({
      where: { id: clientId },
      data: {
        name: name || null,
        phone: phone || null,
        notifyReminders,
        notifyPromo,
        invoiceName: invoiceName || null,
        invoiceNip: invoiceNip || null,
        invoiceAddress: invoiceAddress || null,
      },
    });
    return { ok: true };
  } catch (e) {
    console.error("updateClientSettingsAction:", e);
    return { ok: false, error: "Nie udało się zapisać ustawień. Spróbuj ponownie." };
  }
}
