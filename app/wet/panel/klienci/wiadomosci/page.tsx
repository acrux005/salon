import { redirect } from "next/navigation"
import { getWetRedirectPath } from "@/lib/wetRedirect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { WetMessagesInbox } from "@/components/wet/WetMessagesInbox";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";
import Link from "next/link";

export const metadata = {
  title: "Wiadomości z klientami",
  description: "Rozmowy z właścicielami zwierząt.",
};

export default async function WetKlienciWiadomosciPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (role !== VET_CLINIC_ROLE || !vetClinicId) {
    redirect(await getWetRedirectPath("/login?callbackUrl=/wet/panel/klienci/wiadomosci"));
  }

  return (
    <>
      <WetPanelPageHeader
        title="Wiadomości"
        description="Rozmowy z właścicielami — odpowiedzi na SMS-y i pytania o wizyty w jednym miejscu."
      />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 pb-2 pt-1 text-[13px] text-wet-navy-muted lg:px-8">
        <span>Szukasz automatycznych SMS?</span>
        <Link href="/wet/panel/klienci/wiadomosci-zaplanowane" className="font-medium text-wet-teal hover:underline">
          Wiadomości cykliczne i zaplanowane →
        </Link>
      </div>
      <WetMessagesInbox myType="vet_clinic" myId={vetClinicId} />
    </>
  );
}
