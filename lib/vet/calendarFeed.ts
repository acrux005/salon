import { randomBytes } from "crypto";
import { getPrisma } from "@/lib/db";
import { parseVetClinicSettings, type VetClinicSettings } from "@/lib/vet/onboarding";

function newCalendarToken(): string {
  return randomBytes(24).toString("hex");
}

export async function getOrCreateCalendarFeedToken(vetClinicId: string): Promise<string> {
  const prisma = getPrisma();
  const row = await prisma.vetClinic.findUnique({
    where: { id: vetClinicId },
    select: { settingsJson: true },
  });
  const settings = parseVetClinicSettings(row?.settingsJson);
  if (settings.calendarFeedToken) return settings.calendarFeedToken;

  const token = newCalendarToken();
  await saveCalendarFeedToken(vetClinicId, settings, token);
  return token;
}

export async function regenerateCalendarFeedToken(vetClinicId: string): Promise<string> {
  const prisma = getPrisma();
  const row = await prisma.vetClinic.findUnique({
    where: { id: vetClinicId },
    select: { settingsJson: true },
  });
  const settings = parseVetClinicSettings(row?.settingsJson);
  const token = newCalendarToken();
  await saveCalendarFeedToken(vetClinicId, settings, token);
  return token;
}

async function saveCalendarFeedToken(
  vetClinicId: string,
  settings: VetClinicSettings,
  token: string
): Promise<void> {
  const prisma = getPrisma();
  await prisma.vetClinic.update({
    where: { id: vetClinicId },
    data: { settingsJson: JSON.stringify({ ...settings, calendarFeedToken: token }) },
  });
}

export async function findVetClinicIdByCalendarToken(token: string): Promise<string | null> {
  const prisma = getPrisma();
  const clinics = await prisma.vetClinic.findMany({
    where: { settingsJson: { not: null } },
    select: { id: true, settingsJson: true },
  });
  for (const clinic of clinics) {
    const settings = parseVetClinicSettings(clinic.settingsJson);
    if (settings.calendarFeedToken === token) return clinic.id;
  }
  return null;
}
