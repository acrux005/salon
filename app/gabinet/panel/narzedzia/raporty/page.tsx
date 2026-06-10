import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { BarChart3, CalendarDays } from "lucide-react";

export default function GabNarzedziaRaportyPage() {
  return (
    <>
      <GabPanelPageHeader title="Raporty" description="Historia wizyt, statystyki okresu i wydruk do kontroli." />
      <div className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <GabLink href="/panel/narzedzia" className="text-[14px] font-medium text-gab-sky hover:underline">
            ← Narzędzia
          </GabLink>

          <section className="rounded-xl border border-gab-sky/20 bg-white p-5">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-6 w-6 text-gab-sky" aria-hidden />
              <div>
                <h2 className="font-semibold text-gab-navy">Historia wizyt</h2>
                <p className="mt-1 text-[13px] text-slate-600">
                  Lista wizyt w wybranym okresie — pacjent, personel, status. Do druku lub archiwum.
                </p>
                <GabLink href="/panel/narzedzia/raporty/wizyty" className="mt-4 inline-block gab-btn-primary text-[13px]">
                  Generuj raport wizyt →
                </GabLink>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gab-sky/20 bg-white p-5">
            <div className="flex items-start gap-3">
              <BarChart3 className="mt-0.5 h-6 w-6 text-gab-sky" aria-hidden />
              <div>
                <h2 className="font-semibold text-gab-navy">Statystyki okresu</h2>
                <p className="mt-1 text-[13px] text-slate-600">
                  Podsumowanie liczby wizyt (zakończone, anulowane, zaplanowane) widoczne w nagłówku raportu druku.
                </p>
                <p className="mt-2 text-[13px] text-slate-500">Wybierz okres w raporcie wizyt — statystyki generują się automatycznie.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
