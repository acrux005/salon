import Link from "next/link";
import { redirect } from "next/navigation"
import { getWetRedirectPath } from "@/lib/wetRedirect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { petStatusBadgeClass, petStatusLabel } from "@/lib/vet/petStatus";
import { speciesLabel } from "@/lib/vet/species";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";

function visitStatusLabel(status: string): string {
  if (status === "done") return "Odbyta";
  if (status === "cancelled") return "Anulowana";
  if (status === "no_show") return "Nie stawił się";
  return "Zaplanowana";
}

export default async function WetNarzedziaArchiwumPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login"));
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) redirect(await getWetRedirectPath("/login"));

  const prisma = getPrisma();
  const [archivedPets, archivedVisits] = await Promise.all([
    prisma.pet.findMany({
      where: { owner: { vetClinicId }, status: { in: ["deceased", "transferred"] } },
      include: { owner: { select: { name: true, phone: true } }, herd: { select: { name: true } } },
      orderBy: { updatedAt: "desc" },
      take: 100,
    }),
    prisma.vetAppointment.findMany({
      where: { vetClinicId, status: { in: ["done", "cancelled", "no_show"] } },
      orderBy: [{ date: "desc" }, { time: "desc" }],
      take: 50,
    }),
  ]);

  return (
    <>
      <WetPanelPageHeader
        title="Archiwum"
        description="Zmarłe i nieaktywne zwierzęta oraz zakończone wizyty — bez enterprise backup managera."
      />
      <div className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <Link href="/wet/panel/narzedzia" className="text-[14px] font-medium text-wet-teal hover:underline">
            ← Narzędzia
          </Link>

          <section>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="font-semibold text-wet-navy">Archiwalne zwierzęta</h2>
                <p className="text-[13px] text-wet-navy-muted">Zmarłe i przeniesione — {archivedPets.length} wpisów</p>
              </div>
              <Link href="/wet/panel/narzedzia/eksport" className="text-[13px] font-medium text-wet-teal hover:underline">
                Eksport backupu CSV →
              </Link>
            </div>
            {archivedPets.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-[14px] text-wet-navy-muted">
                Brak zwierząt w archiwum.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-wet-teal-200">
                <table className="w-full min-w-[540px] text-left text-[13px]">
                  <thead className="bg-wet-teal-50/60 text-[11px] uppercase text-wet-navy-muted">
                    <tr>
                      <th className="px-3 py-2">Zwierzę</th>
                      <th className="px-3 py-2">Właściciel</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {archivedPets.map((pet) => (
                      <tr key={pet.id} className="border-t border-slate-100">
                        <td className="px-3 py-2">
                          <p className="font-medium text-wet-navy">{pet.name}</p>
                          <p className="text-[12px] text-wet-navy-muted">
                            {speciesLabel(pet.species)}
                            {pet.herd ? ` · ${pet.herd.name}` : ""}
                          </p>
                        </td>
                        <td className="px-3 py-2">
                          {pet.owner.name}
                          <span className="block text-[12px] text-wet-navy-muted">{pet.owner.phone}</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${petStatusBadgeClass(pet.status)}`}>
                            {petStatusLabel(pet.status)}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Link href={`/wet/panel/zwierzeta/${pet.id}`} className="text-wet-teal hover:underline">
                            Karta
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h2 className="font-semibold text-wet-navy">Archiwalne wizyty</h2>
            <p className="mt-1 text-[13px] text-wet-navy-muted">Ostatnie 50 zakończonych lub anulowanych wizyt</p>
            {archivedVisits.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-[14px] text-wet-navy-muted">
                Brak wizyt w archiwum.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto rounded-xl border border-wet-teal-200">
                <table className="w-full min-w-[540px] text-left text-[13px]">
                  <thead className="bg-wet-teal-50/60 text-[11px] uppercase text-wet-navy-muted">
                    <tr>
                      <th className="px-3 py-2">Data</th>
                      <th className="px-3 py-2">Pacjent</th>
                      <th className="px-3 py-2">Typ</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archivedVisits.map((visit) => (
                      <tr key={visit.id} className="border-t border-slate-100">
                        <td className="px-3 py-2">
                          {visit.date} {visit.time}
                        </td>
                        <td className="px-3 py-2">{visit.petName ?? visit.ownerName ?? "—"}</td>
                        <td className="px-3 py-2">{visit.visitType ?? "—"}</td>
                        <td className="px-3 py-2">{visitStatusLabel(visit.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Link
              href="/wet/panel/narzedzia/raporty/wizyty"
              className="mt-4 inline-block text-[13px] font-medium text-wet-teal hover:underline"
            >
              Pełny raport wizyt z wybranym okresem →
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
