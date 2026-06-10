import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ADMIN_ROLE, CLIENT_ROLE } from "@/lib/auth";
import { getClinicByIdAsync } from "@/lib/skinmatch/clinics";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { PushToggle } from "./PushToggle";

export default async function PanelDashboardPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role === ADMIN_ROLE) redirect("/portal/admin");
  if ((session?.user as { role?: string })?.role === CLIENT_ROLE) redirect("/portal/moje-rezerwacje");
  const clinicId = (session?.user as { clinicId?: string } | undefined)?.clinicId;
  const clinicSlug = (session?.user as { clinicSlug?: string } | undefined)?.clinicSlug;
  if (!clinicId || !clinicSlug) redirect("/portal/login");

  const clinic = await getClinicByIdAsync(clinicId);
  if (!clinic) redirect("/portal/login");

  return (
    <>
      <HeaderPortal />
      <main className="min-h-screen bg-white py-12">
        <div className="mx-auto max-w-2xl px-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
                Panel gabinetu
              </h1>
              <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
                Witaj, {clinic.name}. Zarządzaj danymi widocznymi na stronie profilu.
              </p>
            </div>
            <PushToggle />
          </div>
          <div className="mt-8 flex flex-col gap-4">
            <Link
              href="/portal/panel/kalendarz"
              className="rounded-xl border border-pink-200 bg-pink-50/50 px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-pink-700 shadow-sm transition-colors hover:bg-pink-100/50"
            >
              Kalendarz wizyt
            </Link>
            <Link
              href="/portal/panel/klinika"
              className="rounded-xl border border-neutral-200 bg-white px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] shadow-sm transition-colors hover:border-pink-300 hover:bg-pink-50/50"
            >
              Edytuj dane gabinetu
            </Link>
            <Link
              href="/portal/panel/kosmetyczki"
              className="rounded-xl border border-neutral-200 bg-white px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] shadow-sm transition-colors hover:border-pink-300 hover:bg-pink-50/50"
            >
              Pracownicy
            </Link>
            <Link
              href="/portal/panel/podgabinety"
              className="rounded-xl border border-neutral-200 bg-white px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] shadow-sm transition-colors hover:border-pink-300 hover:bg-pink-50/50"
            >
              Podgabinety
            </Link>
            <Link
              href="/portal/panel/godziny-pracy"
              className="rounded-xl border border-neutral-200 bg-white px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] shadow-sm transition-colors hover:border-pink-300 hover:bg-pink-50/50"
            >
              Godziny pracy gabinetu
            </Link>
            <Link
              href="/portal/panel/wiadomosci"
              className="rounded-xl border border-neutral-200 bg-white px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] shadow-sm transition-colors hover:border-pink-300 hover:bg-pink-50/50"
            >
              Wiadomości
            </Link>
            <Link
              href="/portal/panel/powiadomienia"
              className="rounded-xl border border-neutral-200 bg-white px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] shadow-sm transition-colors hover:border-pink-300 hover:bg-pink-50/50"
            >
              Powiadomienia
            </Link>
            <Link
              href="/portal/panel/ustawienia"
              className="rounded-xl border border-neutral-200 bg-white px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] shadow-sm transition-colors hover:border-pink-300 hover:bg-pink-50/50"
            >
              Ustawienia
            </Link>
            <Link
              href={`/portal/gabinet/${clinicSlug}`}
              className="rounded-xl border border-pink-200 bg-pink-50/50 px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-pink-700 transition-colors hover:bg-pink-100/50"
            >
              Zobacz publiczny profil →
            </Link>
            <Link
              href="/portal/dla-gabinetow/panel"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-neutral-200 bg-white px-6 py-4 font-[var(--font-sans)] text-[14px] font-medium text-[#6F5E64] shadow-sm transition-colors hover:border-pink-300 hover:bg-pink-50/50 hover:text-pink-600"
            >
              📖 Przewodnik: jak korzystać z panelu
            </Link>
          </div>
        </div>
      </main>
      <FooterPortal />
    </>
  );
}
