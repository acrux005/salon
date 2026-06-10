import { redirect, notFound } from "next/navigation";
import { getWetRedirectPath } from "@/lib/wetRedirect";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_OWNER_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { speciesLabel } from "@/lib/vet/species";
import { buildPreventionChecklist } from "@/lib/vet/preventionEngine";
import { WetOwnerPreventionPlan } from "@/components/wet/WetOwnerPreventionPlan";
import { WetOwnerPetDocuments } from "@/components/wet/WetOwnerPetDocuments";
import { WetPetPhotoUpload } from "@/components/wet/WetPetPhotoUpload";
import { parsePetDocumentMeta } from "@/lib/vet/petDocumentTypes";

type PageProps = { params: Promise<{ id: string }> };

export default async function WetOwnerPetPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_OWNER_ROLE) redirect(await getWetRedirectPath("/klient/logowanie"));
  const accountId = (session?.user as { vetOwnerAccountId?: string })?.vetOwnerAccountId;
  if (!accountId) redirect(await getWetRedirectPath("/klient/logowanie"));

  const { id } = await params;
  const prisma = getPrisma();
  const pet = await prisma.pet.findFirst({
    where: { id, accountId },
    include: {
      vaccinations: { include: { vaccineType: true }, orderBy: { administeredAt: "desc" } },
      preventionRecords: { orderBy: { doneAt: "asc" } },
      appointments: { orderBy: [{ date: "desc" }, { time: "desc" }], take: 10 },
      owner: { include: { vetClinic: { select: { name: true, phone: true, slug: true, bookingPhoneOnly: true } } } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!pet) notFound();

  const preventionChecklist = buildPreventionChecklist({
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

  let pedigreeLines: string[] = [];
  if (pet.pedigreeJson) {
    try {
      const parsed = JSON.parse(pet.pedigreeJson) as { lines?: string[] };
      pedigreeLines = parsed.lines ?? [];
    } catch {
      /* ignore */
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/wet/klient/panel" className="text-[14px] font-medium text-wet-teal hover:underline">
        ← Panel
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-wet-navy">{pet.name}</h1>
      <div className="mt-4">
        <WetPetPhotoUpload
          petId={pet.id}
          petName={pet.name}
          species={pet.species}
          photoUrl={pet.photoUrl}
          size="md"
        />
      </div>
      <p className="mt-3 text-[14px] text-wet-navy-muted">
        {speciesLabel(pet.species)}
        {pet.breed ? ` · ${pet.breed}` : ""}
        {pet.chipNumber ? ` · chip ${pet.chipNumber}` : ""}
      </p>
      <p className="mt-1 text-[13px] text-wet-navy-muted">
        Gabinet: {pet.owner.vetClinic.name}
        {pet.owner.vetClinic.phone ? ` · tel. ${pet.owner.vetClinic.phone}` : ""}
      </p>

      {!pet.preventionPlanDisabled && (
        <WetOwnerPreventionPlan
          checklist={preventionChecklist}
          clinicSlug={pet.owner.vetClinic.slug}
          clinicPhone={pet.owner.vetClinic.phone}
          bookingPhoneOnly={pet.owner.vetClinic.bookingPhoneOnly}
        />
      )}

      {(pet.pedigreeNotes || pedigreeLines.length > 0) && (
        <section className="mt-6 rounded-xl border border-wet-teal-100 bg-wet-teal-50/40 p-4">
          <h2 className="font-semibold text-wet-teal-900">Rodowód</h2>
          {pet.pedigreeNotes && <p className="mt-2 text-[14px] whitespace-pre-wrap">{pet.pedigreeNotes}</p>}
          {pedigreeLines.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-[14px]">
              {pedigreeLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="mt-6">
        <h2 className="text-lg font-semibold">Szczepienia</h2>
        {pet.vaccinations.length === 0 ? (
          <p className="mt-2 text-[14px] text-wet-navy-muted">Brak zapisanych szczepień.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {pet.vaccinations.map((v) => (
              <li key={v.id} className="rounded-lg border border-wet-teal-100 px-3 py-2 text-[14px]">
                <strong>{v.vaccineType.name}</strong> · {new Date(v.administeredAt).toLocaleDateString("pl-PL")}
                {v.nextDueAt && (
                  <span className="text-wet-navy-muted">
                    {" "}
                    · następne {new Date(v.nextDueAt).toLocaleDateString("pl-PL")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">Wizyty</h2>
        {pet.appointments.length === 0 ? (
          <p className="mt-2 text-[14px] text-wet-navy-muted">Brak wizyt.</p>
        ) : (
          <ul className="mt-2 space-y-2 text-[14px]">
            {pet.appointments.map((a) => (
              <li key={a.id} className="rounded-lg border border-slate-100 px-3 py-2">
                {a.date} {a.time} · {a.visitType ?? "wizyta"} · {a.status}
              </li>
            ))}
          </ul>
        )}
      </section>

      <WetOwnerPetDocuments
        petId={pet.id}
        documents={pet.documents.map((d) => {
          const meta = parsePetDocumentMeta(d.extractedJson);
          return {
            id: d.id,
            fileName: d.fileName,
            documentType: d.documentType,
            fileUrl: meta.fileUrl ?? null,
            mimeType: meta.mimeType ?? null,
            createdAt: d.createdAt.toISOString(),
            uploadedByClinic: !d.accountId,
          };
        })}
      />
    </main>
  );
}
