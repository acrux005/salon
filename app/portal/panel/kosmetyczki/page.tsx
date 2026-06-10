import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ADMIN_ROLE } from "@/lib/auth";
import { getClinicByIdAsync } from "@/lib/skinmatch/clinics";
import { getStaffByClinicIdAsync } from "@/lib/skinmatch/staffDb";
import { getSubCabinetsByClinicIdAsync } from "@/lib/skinmatch/subCabinetDb";
import { getStaffTreatmentIdsAsync } from "@/lib/skinmatch/staffTreatmentDb";
import { getCatalogAsync } from "@/lib/skinmatch/treatmentsDb";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { KosmetyczkiClient } from "./KosmetyczkiClient";

export default async function PanelKosmetyczkiPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role === ADMIN_ROLE) redirect("/portal/admin");
  const clinicId = (session?.user as { clinicId?: string } | undefined)?.clinicId;
  if (!clinicId) redirect("/portal/login");

  const [clinic, initialStaff, initialSubCabinets, catalog] = await Promise.all([
    getClinicByIdAsync(clinicId),
    getStaffByClinicIdAsync(clinicId),
    getSubCabinetsByClinicIdAsync(clinicId),
    getCatalogAsync(),
  ]);
  if (!clinic) redirect("/portal/login");
  const catalogMap = new Map(catalog.map((t) => [t.id, { id: t.id, nazwa: t.nazwa }]));
  const availableTreatments = (clinic.treatmentIds ?? [])
    .map((id) => catalogMap.get(id))
    .filter(Boolean) as { id: string; nazwa: string }[];

  const initialStaffTreatments: Record<string, { id: string; nazwa: string }[]> = {};
  await Promise.all(
    initialStaff.map(async (s) => {
      const ids = await getStaffTreatmentIdsAsync(s.id);
      initialStaffTreatments[s.id] = ids
        .map((id) => catalogMap.get(id))
        .filter(Boolean) as { id: string; nazwa: string }[];
    })
  );

  return (
    <>
      <HeaderPortal />
      <main className="min-h-screen bg-white py-12">
        <div className="mx-auto max-w-2xl px-4">
          <Link href="/portal/panel" className="text-[14px] font-medium text-pink-600 hover:underline">
            ← Panel
          </Link>
          <h1 className="mt-4 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
            Pracownicy
          </h1>
          <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
            Dodaj pracowników gabinetu. Każdy może mieć przypisane zabiegi i podgabinet.
          </p>
          <div className="mt-8">
            <KosmetyczkiClient
              initialStaff={initialStaff}
              initialSubCabinets={initialSubCabinets}
              initialStaffTreatments={initialStaffTreatments}
              availableTreatments={availableTreatments}
            />
          </div>
        </div>
      </main>
      <FooterPortal />
    </>
  );
}
