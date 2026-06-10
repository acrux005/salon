import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RANDKI_ROLE } from "@/lib/auth";
import { getMyProfile, profileReadyForDiscovery } from "@/lib/randki/matching";
import { isRandkiPortalHost } from "@/lib/randkiHost";
import { RandkiOnboardingClient } from "@/components/randki/RandkiOnboardingClient";

export default async function RandkiOnboardingPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const accountId = (session?.user as { datingAccountId?: string })?.datingAccountId;
  if (role !== RANDKI_ROLE || !accountId) redirect("/randki/logowanie");

  const profile = await getMyProfile(accountId);
  if (!profile) redirect("/randki/rejestracja");
  if (profile.onboardingDone && (await profileReadyForDiscovery(accountId))) {
    redirect("/randki/panel");
  }

  const host = (await headers()).get("host") ?? "";

  return (
    <main className="px-4 py-10">
      <p className="mb-2 text-center text-[13px] font-medium uppercase tracking-widest text-violet-300/80">Randki Odart</p>
      <h2 className="mb-8 text-center text-lg text-white/70">Wolniej. Głębiej. Bez pośpiechu.</h2>
      <RandkiOnboardingClient isRandkiPortal={isRandkiPortalHost(host)} />
    </main>
  );
}
