"use client";

import { useTransition, useState } from "react";
import { activatePremiumDemoAction, createPremiumCheckoutAction } from "@/app/actions/randki";
import { PREMIUM_PERKS } from "@/lib/randki/premiumPerks";

export function RandkiPremiumCard({
  isPremium,
  premiumUntil,
  isDemoAccount,
  stripeEnabled,
}: {
  isPremium: boolean;
  premiumUntil: Date | string | null;
  isDemoAccount: boolean;
  stripeEnabled?: boolean;
}) {
  const [active, setActive] = useState(isPremium);
  const [until, setUntil] = useState(premiumUntil);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState("");

  function activateDemo() {
    start(async () => {
      const res = await activatePremiumDemoAction();
      if (!res.ok) {
        setMsg(res.error ?? "Błąd.");
        return;
      }
      setActive(true);
      setUntil(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
      setMsg("Premium aktywne na 30 dni (konto demo).");
    });
  }

  function payWithStripe() {
    start(async () => {
      const res = await createPremiumCheckoutAction();
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      window.location.href = res.url;
    });
  }

  return (
    <div className="randki-glass p-5">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-amber-300">Randki Odart Premium</p>
      <p className="mt-1 text-[15px] font-semibold text-white">Więcej przestrzeni. Wolniejsze tempo. Głos bez limitu.</p>
      <ul className="mt-4 space-y-2">
        {PREMIUM_PERKS.map((p) => (
          <li key={p} className="text-[13px] text-white/70">✓ {p}</li>
        ))}
      </ul>
      {active ? (
        <p className="mt-4 text-[13px] text-emerald-300">
          Premium aktywne{until ? ` do ${new Date(until).toLocaleDateString("pl-PL")}` : ""}.
        </p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {stripeEnabled && (
            <button type="button" disabled={pending} onClick={payWithStripe} className="randki-btn-primary text-[13px]">
              Kup Premium — Stripe
            </button>
          )}
          {isDemoAccount && (
            <button type="button" disabled={pending} onClick={activateDemo} className="randki-btn-outline text-[13px]">
              Demo Premium (30 dni)
            </button>
          )}
          {!stripeEnabled && !isDemoAccount && (
            <p className="text-[13px] text-white/50">Płatności wkrótce — kontakt@odart.pl</p>
          )}
        </div>
      )}
      {msg && <p className="mt-2 text-[13px] text-white/70">{msg}</p>}
    </div>
  );
}
