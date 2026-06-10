import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GAB_PATIENT_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { getGabinetRedirectPath } from "@/lib/gabinetRedirect";
import { ensureGabPatientCalendarToken } from "@/lib/gabinet/patientCalendar";
import { GabPatientSettingsClient } from "./GabPatientSettingsClient";

export default async function GabPatientSettingsPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== GAB_PATIENT_ROLE) {
    redirect(await getGabinetRedirectPath("/klient/logowanie"));
  }
  const accountId = (session?.user as { gabPatientAccountId?: string })?.gabPatientAccountId;
  if (!accountId) redirect(await getGabinetRedirectPath("/klient/logowanie"));

  const account = await getPrisma().gabPatientAccount.findUnique({ where: { id: accountId } });
  if (!account) redirect(await getGabinetRedirectPath("/klient/logowanie"));

  const patients = await getPrisma().gabPatient.findMany({
    where: { accountId },
    include: { gabClinic: { select: { id: true, name: true } } },
  });

  const linkedClinics = patients.map((p) => ({
    id: p.gabClinic.id,
    name: p.gabClinic.name,
    active: p.gabClinicId === account.activeGabClinicId,
  }));

  const token = await ensureGabPatientCalendarToken(accountId);
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const calendarFeedUrl = `${base}/api/gabinet/klient/ical?token=${encodeURIComponent(token)}`;

  return (
    <GabPatientSettingsClient
      name={account.name}
      phone={account.phone}
      email={account.email}
      emailVerified={!!account.emailVerifiedAt}
      linkedClinics={linkedClinics}
      calendarFeedUrl={calendarFeedUrl}
    />
  );
}
