import { WetAuthBenefits } from "@/components/wet/WetAuthBenefits";
import { WetTrustBadges } from "@/components/wet/WetTrustBadges";

type AuthVariant = "login" | "forgot" | "reset";

export function WetAuthShell({
  variant,
  children,
  showTrust = true,
}: {
  variant: AuthVariant;
  children: React.ReactNode;
  showTrust?: boolean;
}) {
  return (
    <section className="wet-auth-hero flex-1 px-4 pb-16 pt-8 sm:pt-12 lg:pb-24 lg:pt-14">
      <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[1fr_minmax(0,28rem)] lg:gap-16 xl:grid-cols-[1fr_30rem]">
        <WetAuthBenefits variant={variant} />

        <div className="w-full lg:sticky lg:top-24">
          <div className="rounded-2xl border border-white/80 bg-white/90 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-sm sm:p-8">
            {children}
            {showTrust && (
              <div className="mt-6 border-t border-slate-100 pt-6">
                <WetTrustBadges compact />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
