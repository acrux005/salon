import Link from "next/link";
import { getPendingClinicTreatmentRequestsAsync } from "@/lib/clinicTreatmentRequest";
import { AdminPropozycjeList } from "./AdminPropozycjeList";

export default async function AdminPropozycjePage() {
  const pending = await getPendingClinicTreatmentRequestsAsync();

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Link
          href="/portal/admin"
          className="text-[14px] font-medium text-pink-600 hover:underline"
        >
          ← Panel admina
        </Link>
        <h1 className="mt-4 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
          Propozycje zabiegów od gabinetów
        </h1>
        <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          Akceptacja dodaje zabieg do katalogu i do oferty gabinetu. Odrzucenie tylko zmienia status propozycji.
        </p>

        <AdminPropozycjeList initialRequests={pending} className="mt-8" />
      </div>
    </main>
  );
}
