import Link from "next/link";
import { redirect } from "next/navigation";
import { getWetRedirectPath } from "@/lib/wetRedirect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_OWNER_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { buildPreventionChecklist } from "@/lib/vet/preventionEngine";
import { getAccountPets } from "@/lib/vet/ownerAccount";
import { speciesLabel } from "@/lib/vet/species";
import { WetPetAvatar } from "@/components/wet/WetPetAvatar";

export default async function WetOwnerPanelPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_OWNER_ROLE) {
    redirect(await getWetRedirectPath("/klient/logowanie"));
  }
  const accountId = (session?.user as { vetOwnerAccountId?: string })?.vetOwnerAccountId;
  if (!accountId) redirect(await getWetRedirectPath("/klient/logowanie"));

  const prisma = getPrisma();
  const [account, petsRaw] = await Promise.all([
    prisma.vetOwnerAccount.findUnique({
      where: { id: accountId },
      include: { activeClinic: { select: { name: true, city: true, slug: true } } },
    }),
    prisma.pet.findMany({
      where: { accountId },
      include: {
        vaccinations: { include: { vaccineType: true }, orderBy: { administeredAt: "desc" } },
        preventionRecords: { orderBy: { doneAt: "asc" } },
        owner: { include: { vetClinic: { select: { id: true, name: true, slug: true } } } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!account) redirect(await getWetRedirectPath("/klient/logowanie"));

  const pets = petsRaw.map((pet) => {
    const checklist = buildPreventionChecklist({
      species: pet.species,
      birthDate: pet.birthDate,
      catLifestyle: pet.catLifestyle,
      planDisabled: pet.preventionPlanDisabled,
      vaccinations: pet.vaccinations.map((v) => ({
        vaccineName: v.vaccineType.name,
        administeredAt: v.administeredAt.toISOString(),
      })),
      records: pet.preventionRecords.map((r) => ({
        itemKey: r.itemKey,
        doneAt: r.doneAt.toISOString(),
      })),
    });
    return { pet, checklist };
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-wet-navy">Witaj, {account.name}</h1>
          <p className="mt-1 text-[14px] text-wet-navy-muted">
            Aktywna przychodnia:{" "}
            <strong>{account.activeClinic?.name ?? "—"}</strong>
            {account.activeClinic?.city ? ` · ${account.activeClinic.city}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/wet/klient/panel/zwierzeta/nowe" className="wet-btn-primary text-[13px]">
            + Dodaj zwierzę
          </Link>
          <Link href="/wet/klient/panel/ustawienia" className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-medium hover:bg-slate-50">
            Ustawienia
          </Link>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-wet-navy">Twoje zwierzęta</h2>
        <p className="mt-1 text-[13px] text-wet-navy-muted">
          Pełna historia szczepień i wizyt jest przypisana do zwierzęcia — niezależnie od wybranej przychodni.
        </p>
        <div className="mt-4 space-y-3">
          {pets.length === 0 ? (
            <p className="rounded-xl border border-wet-teal-100 bg-wet-teal-50/40 px-4 py-6 text-[14px] text-wet-navy-muted">
              Brak zwierząt. Dodaj pierwsze lub zeskanuj dokument paszportu / karty szczepień.
            </p>
          ) : (
            pets.map(({ pet, checklist }) => (
              <Link
                key={pet.id}
                href={`/wet/klient/panel/zwierzeta/${pet.id}`}
                className="block rounded-xl border border-wet-teal-200 bg-white px-4 py-3 hover:bg-wet-mint/30"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <WetPetAvatar species={pet.species} name={pet.name} photoUrl={pet.photoUrl} size="md" />
                    <div>
                      <p className="font-semibold text-wet-navy">{pet.name}</p>
                      <p className="text-[13px] text-wet-navy-muted">
                        {speciesLabel(pet.species)}
                        {pet.breed ? ` · ${pet.breed}` : ""}
                        {pet.chipNumber ? ` · chip ${pet.chipNumber}` : ""}
                      </p>
                      {checklist.planId && !pet.preventionPlanDisabled && (
                        <p className="mt-1 text-[12px] text-wet-teal-700">
                          Plan profilaktyki
                          {checklist.overdue > 0 && (
                            <span className="ml-1 font-medium text-red-700">· {checklist.overdue} zaległe</span>
                          )}
                          {checklist.dueSoon > 0 && (
                            <span className="ml-1 text-amber-700">· {checklist.dueSoon} wkrótce</span>
                          )}
                          {checklist.overdue === 0 && checklist.dueSoon === 0 && (
                            <span className="ml-1 text-wet-navy-muted">· {checklist.done}/{checklist.total} wykonane</span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[12px] text-wet-teal">{pet.vaccinations.length} szczepień</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
