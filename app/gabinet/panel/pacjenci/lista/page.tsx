import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { gabPrisma, type GabPatientRow } from "@/lib/gabinet/prismaGab";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { GabPacjenciListaClient } from "./GabPacjenciListaClient";

export default async function GabPacjenciListaPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view: viewParam } = await searchParams;
  const view = viewParam === "archived" ? "archived" : "active";

  const session = await getServerSession(authOptions);
  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId ?? "";
  let patients: GabPatientRow[] = [];
  try {
    patients = await gabPrisma().gabPatient.findMany({
      where: { gabClinicId, status: view === "archived" ? "archived" : "active" },
      orderBy: { name: "asc" },
    });
  } catch {
    /* po migracji */
  }

  return (
    <>
      <GabPanelPageHeader
        title={view === "archived" ? "Archiwum pacjentów" : "Lista pacjentów"}
        description={`${patients.length} ${view === "archived" ? "zarchiwizowanych" : "aktywnych"} w kartotece.`}
      />
      <div className="px-4 py-6 lg:px-8">
        <GabPacjenciListaClient patients={patients} view={view} />
      </div>
    </>
  );
}
