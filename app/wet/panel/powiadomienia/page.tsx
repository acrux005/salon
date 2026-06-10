import { redirect } from "next/navigation"
import { getWetRedirectPath } from "@/lib/wetRedirect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getNotificationsForRecipient } from "@/lib/notificationsDb";
import { NotificationList } from "@/components/portal/NotificationList";
import type { NotificationItem } from "@/app/actions/notifications";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";

export const metadata = {
  title: "Powiadomienia",
  description: "Powiadomienia przychodni weterynaryjnej.",
};

export default async function WetPanelPowiadomieniaPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (role !== VET_CLINIC_ROLE || !vetClinicId) {
    redirect(await getWetRedirectPath("/login?callbackUrl=/wet/panel/powiadomienia"));
  }

  const list = await getNotificationsForRecipient("vet_clinic", vetClinicId);
  const initialList: NotificationItem[] = list.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body,
    link: n.link,
    readAt: n.readAt,
    createdAt: n.createdAt,
  }));

  return (
    <div>
      <WetPanelPageHeader
        title="Powiadomienia"
        description="Nowe wizyty, wiadomości od klientów i inne alerty."
      />
      <NotificationList initialList={initialList} />
    </div>
  );
}
