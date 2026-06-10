import { redirect } from "next/navigation"
import { getWetRedirectPath } from "@/lib/wetRedirect";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { WetVaccinationReception } from "@/components/wet/WetVaccinationReception";
import { normalizeReceptionMode } from "@/lib/vet/deworming";

export default async function WetPanelVaccinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ petId?: string; mode?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login"));
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) redirect(await getWetRedirectPath("/login"));

  const { petId: defaultPetId, mode: defaultMode } = await searchParams;

  const prisma = getPrisma();
  const now = new Date();
  const [overdue, upcoming, vaccineTypes, pets] = await Promise.all([
    prisma.vaccination.findMany({
      where: { nextDueAt: { lt: now }, pet: { owner: { vetClinicId } } },
      include: {
        pet: { include: { owner: true } },
        vaccineType: true,
      },
      orderBy: { nextDueAt: "asc" },
      take: 50,
    }),
    prisma.vaccination.findMany({
      where: {
        nextDueAt: { gte: now, lte: new Date(Date.now() + 30 * 86400000) },
        pet: { owner: { vetClinicId } },
      },
      include: {
        pet: { include: { owner: true } },
        vaccineType: true,
      },
      orderBy: { nextDueAt: "asc" },
      take: 50,
    }),
    prisma.vaccineType.findMany({
      where: { vetClinicId, active: true, category: "szczepienie" },
      orderBy: { order: "asc" },
    }),
    prisma.pet.findMany({
      where: { owner: { vetClinicId } },
      include: { owner: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/wet/panel" className="text-[14px] font-medium text-wet-teal hover:underline">
        ← Panel
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-wet-navy">Książeczka — recepcja</h1>
      <p className="mt-2 text-[15px] text-wet-navy-muted">
        Szczepienia, endo-/ektopasożyty i leczenie — każda strona książeczki osobno.
      </p>

      <Link href="/wet/panel/katalog" className="mt-4 inline-block text-[14px] font-medium text-wet-teal hover:underline">
        Zarządzaj preparatami w katalogu →
      </Link>

      <WetVaccinationReception
        pets={pets.map((p) => ({
          id: p.id,
          name: p.name,
          species: p.species,
          birthDate: p.birthDate,
          ownerName: p.owner.name,
          ownerPhone: p.owner.phone,
          smsConsent: p.owner.smsConsent,
          emailConsent: p.owner.emailConsent ?? false,
        }))}
        vaccineTypes={vaccineTypes.map((v) => ({
          id: v.id,
          name: v.name,
          manufacturer: v.manufacturer,
          defaultIntervalDays: v.defaultIntervalDays,
          defaultPrice: v.defaultPrice,
          trackStock: v.trackStock,
          stockDoses: v.stockDoses,
        }))}
        defaultPetId={defaultPetId}
        defaultMode={normalizeReceptionMode(defaultMode)}
      />

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-amber-800">Zaległe ({overdue.length})</h2>
        <ul className="mt-4 space-y-2">
          {overdue.length === 0 ? (
            <li className="text-[14px] text-wet-navy-muted">Brak zaległych — super!</li>
          ) : (
            overdue.map((v) => (
              <li key={v.id} className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[14px]">
                <strong>{v.pet.name}</strong> — {v.vaccineType.name} · termin{" "}
                {v.nextDueAt.toLocaleDateString("pl-PL")} · {v.pet.owner.phone}
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-wet-teal-800">W ciągu 30 dni</h2>
        <ul className="mt-4 space-y-2">
          {upcoming.length === 0 ? (
            <li className="text-[14px] text-wet-navy-muted">Brak zbliżających się terminów.</li>
          ) : (
            upcoming.map((v) => (
              <li key={v.id} className="rounded-lg border border-wet-teal-100 bg-white px-4 py-3 text-[14px]">
                <strong>{v.pet.name}</strong> — {v.vaccineType.name} ·{" "}
                {v.nextDueAt.toLocaleDateString("pl-PL")} · {v.pet.owner.name}
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  );
}
