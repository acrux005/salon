"use client";

import { completeGabOnboardingAction } from "@/app/actions/gabinetSettings";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { BookOpen, Building2, Calendar, CheckCircle2, Users } from "lucide-react";

const STEPS = [
  { n: 1, title: "Branding", desc: "Nazwa, opis, logo, publikacja profilu", href: "/panel/gabinet", icon: Building2 },
  { n: 2, title: "Godziny pracy", desc: "Dostępność i sloty rezerwacji", href: "/panel/ustawienia/godziny", icon: Calendar },
  { n: 3, title: "Personel", desc: "Lekarze widoczni w kalendarzu", href: "/panel/personel", icon: Users },
  { n: 4, title: "Katalog zabiegów", desc: "Cennik używany w planach i rezerwacji", href: "/panel/ustawienia/katalog", icon: BookOpen },
  { n: 5, title: "Gotowe", desc: "Zakończ konfigurację", href: null, icon: CheckCircle2 },
];

export function GabOnboardingClient({ step, done }: { step: number; done: boolean }) {
  async function finish() {
    await completeGabOnboardingAction();
    window.location.href = "/gabinet/panel";
  }

  return (
    <>
      <GabPanelPageHeader
        title="Konfiguracja gabinetu"
        description={done ? "Konfiguracja zakończona — możesz edytować ustawienia w dowolnym momencie." : "Kilka kroków przed pełnym uruchomieniem."}
      />
      <div className="px-4 py-6 lg:px-8">
        <ol className="mx-auto max-w-2xl space-y-4">
          {STEPS.map((s) => {
            const completed = step >= s.n || done;
            const current = !done && step + 1 === s.n;
            return (
              <li
                key={s.n}
                className={`rounded-xl border p-5 ${current ? "border-gab-sky bg-sky-50/50" : "border-slate-200 bg-white"}`}
              >
                <div className="flex items-start gap-3">
                  <s.icon className={`mt-0.5 h-5 w-5 ${completed ? "text-green-600" : "text-gab-sky"}`} />
                  <div>
                    <p className="font-semibold text-gab-navy">
                      {s.n}. {s.title} {completed && "✓"}
                    </p>
                    <p className="mt-1 text-[14px] text-slate-600">{s.desc}</p>
                    {s.href ? (
                      <GabLink href={s.href} className="mt-3 inline-block text-[14px] font-medium text-gab-sky hover:underline">
                        Przejdź →
                      </GabLink>
                    ) : (
                      !done && (
                        <button type="button" onClick={finish} className="gab-btn-primary mt-3">
                          Zakończ konfigurację
                        </button>
                      )
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
