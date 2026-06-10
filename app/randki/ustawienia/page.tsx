import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RANDKI_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { RandkiSettingsForm } from "@/components/randki/RandkiSettingsForm";
import { RandkiCirclePicker } from "@/components/randki/RandkiCirclePicker";
import { RandkiPremiumCard } from "@/components/randki/RandkiPremiumCard";
import { RandkiPwaInstall, RandkiPushToggle } from "@/components/randki/RandkiPwaClient";
import { isPremiumActive } from "@/lib/randki/premium";
import { isStripeConfigured } from "@/lib/randki/stripe";

export default async function RandkiSettingsPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const accountId = (session?.user as { datingAccountId?: string })?.datingAccountId;
  if (role !== RANDKI_ROLE || !accountId) redirect("/randki/logowanie");

  const account = await getPrisma().datingAccount.findUnique({
    where: { id: accountId },
    include: { profile: true },
  });
  if (!account?.profile) redirect("/randki/rejestracja");
  const isPremium = await isPremiumActive(accountId);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-white">Ustawienia konta</h1>
      <p className="mt-2 text-[14px] text-white/60">Krąg, premium, bezpieczeństwo — Ty decydujesz, kogo poznajesz.</p>
      <div className="mt-8 space-y-6">
        <RandkiPremiumCard
          isPremium={isPremium}
          premiumUntil={account.premiumUntil}
          isDemoAccount={account.email.endsWith("@randka.odart.pl")}
          stripeEnabled={isStripeConfigured()}
        />
        <section className="randki-glass p-5">
          <h2 className="font-semibold text-white">Aplikacja (PWA)</h2>
          <RandkiPwaInstall />
        </section>
        <RandkiPushToggle />
        <section className="randki-glass p-5">
          <h2 className="font-semibold text-white">Twój krąg</h2>
          <div className="mt-4">
            <RandkiCirclePicker initialSlug={account.profile.circleSlug} isPremium={isPremium} />
          </div>
        </section>
        <RandkiSettingsForm
          email={account.email}
          emailVerified={!!account.emailVerifiedAt}
          profileActive={account.profile.active}
          warnedAt={account.warnedAt}
          bannedAt={account.bannedAt}
          banReason={account.banReason}
        />
      </div>
    </main>
  );
}
