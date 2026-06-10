import Link from "next/link";
import { redirect } from "next/navigation"
import { getWetRedirectPath } from "@/lib/wetRedirect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getVetSettingsSnapshot } from "@/app/actions/vetSettings";
import { WetAccountPasswordForm } from "@/components/wet/settings/WetAccountPasswordForm";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";

export default async function WetUstawieniaKontoPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login"));
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) redirect(await getWetRedirectPath("/login"));

  const snapshot = await getVetSettingsSnapshot(vetClinicId);

  return (
    <>
      <WetPanelPageHeader title="Moje konto" description="Dane logowania gabinetu — lekki standard SaaS." />
      <div className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-xl space-y-8">
          <Link href="/wet/panel/ustawienia" className="text-[14px] font-medium text-wet-teal hover:underline">
            ← Ustawienia
          </Link>

          <section className="rounded-xl border border-wet-teal-200 bg-white p-5">
            <h2 className="font-semibold text-wet-navy">Dane konta</h2>
            <dl className="mt-3 space-y-2 text-[14px]">
              <div>
                <dt className="text-wet-navy-muted">E-mail logowania</dt>
                <dd className="font-medium text-wet-navy">{snapshot.email}</dd>
              </div>
              <div>
                <dt className="text-wet-navy-muted">Weryfikacja e-mail</dt>
                <dd>{snapshot.emailVerified ? "Zweryfikowany" : "Niezweryfikowany"}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-wet-teal-200 bg-white p-5">
            <h2 className="font-semibold text-wet-navy">Zmiana hasła</h2>
            <div className="mt-4">
              <WetAccountPasswordForm />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
