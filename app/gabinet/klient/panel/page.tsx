import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GAB_PATIENT_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { getGabinetRedirectPath } from "@/lib/gabinetRedirect";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { PLAN_STATUS_LABELS } from "@/lib/gabinet/fdiTeeth";
import { GAB_DOCUMENT_TYPES, parseGabDocumentMeta } from "@/lib/gabinet/patientDocumentTypes";
import { GabPatientAppointmentsList } from "./GabPatientAppointmentsList";
import { visitTypeLabel } from "@/lib/gabinet/visitTypes";
import { visitStatusLabel } from "@/lib/gabinet/visitStatus";

export default async function GabPatientPanelPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== GAB_PATIENT_ROLE) {
    redirect(await getGabinetRedirectPath("/klient/logowanie"));
  }
  const name = session?.user?.name ?? session?.user?.email ?? "Pacjent";
  const accountId = (session?.user as { gabPatientAccountId?: string })?.gabPatientAccountId;

  const today = new Date().toISOString().slice(0, 10);
  const [appointments, pastAppointments, treatmentPlans, documents] = accountId
    ? await Promise.all([
        getPrisma().gabAppointment.findMany({
          where: {
            patient: { accountId },
            date: { gte: today },
            status: { in: ["planned", "confirmed"] },
          },
          include: { gabClinic: { select: { name: true, phone: true } } },
          orderBy: [{ date: "asc" }, { time: "asc" }],
          take: 20,
        }),
        getPrisma().gabAppointment.findMany({
          where: {
            patient: { accountId },
            OR: [{ date: { lt: today } }, { status: { in: ["completed", "cancelled", "no_show"] } }],
          },
          include: { gabClinic: { select: { name: true } } },
          orderBy: [{ date: "desc" }, { time: "desc" }],
          take: 30,
        }),
        getPrisma().gabTreatmentPlan.findMany({
          where: {
            patient: { accountId },
            status: { not: "draft" },
          },
          include: { gabClinic: { select: { name: true } } },
          orderBy: [{ presentedAt: "desc" }, { updatedAt: "desc" }],
          take: 20,
        }),
        getPrisma().gabPatientDocument.findMany({
          where: { accountId },
          orderBy: { createdAt: "desc" },
          take: 30,
        }),
      ])
    : [[], [], [], []];

  const pendingPlans = treatmentPlans.filter((p) => p.status === "pending_acceptance");

  const clinicIds = Array.from(
    new Set(documents.map((d) => d.gabClinicId).filter((id): id is string => Boolean(id)))
  );
  const clinics =
    clinicIds.length > 0
      ? await getPrisma().gabClinic.findMany({
          where: { id: { in: clinicIds } },
          select: { id: true, name: true },
        })
      : [];
  const clinicNameById = Object.fromEntries(clinics.map((c) => [c.id, c.name]));

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gab-navy">Witaj, {name}</h1>
          <p className="mt-2 text-[15px] text-slate-600">Nadchodzące wizyty, historia, plany leczenia i ustawienia konta.</p>
        </div>
        <GabLink href="/klient/panel/ustawienia" className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] font-medium hover:bg-slate-50">
          Ustawienia
        </GabLink>
      </div>

      {pendingPlans.length > 0 && (
        <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50/60 p-6">
          <h2 className="font-semibold text-gab-navy">Plany do akceptacji</h2>
          <ul className="mt-4 space-y-3">
            {pendingPlans.map((p) => (
              <li key={p.id}>
                <GabLink
                  href={`/klient/panel/plany/${p.id}`}
                  className="block rounded-lg border border-amber-200 bg-white px-4 py-3 transition hover:border-gab-sky/40"
                >
                  <p className="font-medium text-gab-navy">{p.title}</p>
                  <p className="text-[13px] text-slate-500">
                    {p.gabClinic.name} · {p.totalPln.toFixed(2)} PLN · {PLAN_STATUS_LABELS[p.status] ?? p.status}
                  </p>
                </GabLink>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8 rounded-xl border border-gab-sky/20 bg-white p-6">
        <h2 className="font-semibold text-gab-navy">Plany leczenia</h2>
        {treatmentPlans.length === 0 ? (
          <p className="mt-2 text-[14px] text-slate-500">Brak planów przesłanych przez gabinet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {treatmentPlans.map((p) => (
              <li key={p.id}>
                <GabLink
                  href={`/klient/panel/plany/${p.id}`}
                  className="block rounded-lg border border-slate-100 px-3 py-2 text-[14px] transition hover:border-gab-sky/30"
                >
                  <p className="font-medium text-gab-navy">{p.title}</p>
                  <p className="text-slate-500">
                    {p.gabClinic.name} · {p.totalPln.toFixed(2)} PLN · {PLAN_STATUS_LABELS[p.status] ?? p.status}
                  </p>
                </GabLink>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 rounded-xl border border-gab-sky/20 bg-white p-6">
        <h2 className="font-semibold text-gab-navy">Nadchodzące wizyty</h2>
        <GabPatientAppointmentsList
          appointments={appointments.map((a) => ({
            id: a.id,
            date: a.date,
            time: a.time,
            visitType: a.visitType,
            status: a.status,
            clinicName: a.gabClinic.name,
            clinicPhone: a.gabClinic.phone,
          }))}
        />
      </section>

      <section className="mt-8 rounded-xl border border-gab-sky/20 bg-white p-6">
        <h2 className="font-semibold text-gab-navy">Historia wizyt</h2>
        {pastAppointments.length === 0 ? (
          <p className="mt-2 text-[14px] text-slate-500">Brak zakończonych lub anulowanych wizyt.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {pastAppointments.map((a) => (
              <li key={a.id} className="rounded-lg border border-slate-100 px-3 py-2 text-[14px]">
                <p className="font-medium text-gab-navy">
                  {a.date} · {a.time} — {a.gabClinic.name}
                </p>
                <p className="text-slate-500">
                  {visitTypeLabel(a.visitType)} · {visitStatusLabel(a.status)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 rounded-xl border border-gab-sky/20 bg-white p-6">
        <h2 className="font-semibold text-gab-navy">Dokumenty</h2>
        {documents.length === 0 ? (
          <p className="mt-2 text-[14px] text-slate-500">Brak dokumentów udostępnionych przez gabinet.</p>
        ) : (
          <ul className="mt-4 space-y-2 text-[14px]">
            {documents.map((doc) => {
              const meta = parseGabDocumentMeta(doc.extractedJson);
              const typeLabel = GAB_DOCUMENT_TYPES.find((t) => t.value === doc.documentType)?.label ?? "Dokument";
              return (
                <li key={doc.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 px-3 py-2">
                  <span>
                    {typeLabel} · {doc.fileName}
                    <span className="ml-2 text-[12px] text-slate-500">
                      {doc.gabClinicId ? clinicNameById[doc.gabClinicId] ?? "Gabinet" : ""}
                    </span>
                  </span>
                  {meta?.fileUrl ? (
                    <a href={meta.fileUrl} target="_blank" rel="noopener noreferrer" className="text-gab-sky hover:underline">
                      Pobierz
                    </a>
                  ) : (
                    <span className="text-slate-400">Brak pliku</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
