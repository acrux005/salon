"use client";

import { usePortalQuiz } from "./PortalQuizContext";
import { PORTAL_LOCALE } from "@/content/portalLocale";

export function YourTherapy() {
  const { openModal } = usePortalQuiz();

  return (
    <section className="border-b border-neutral-200/40 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-[var(--font-serif)] text-[2.03rem] font-semibold leading-snug tracking-[-0.5px] text-[#1F1A1C] sm:text-[2.43rem]">
          Nie wybierasz w ciemno.
        </h2>
        <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex min-w-0 flex-[0_0_100%] flex-col justify-center lg:flex-[0_0_40%]">
            <p className="font-[var(--font-sans)] text-[15px] font-semibold text-[#1F1A1C]">
              Zabieg to nie nazwa z menu.
            </p>
            <p className="mt-2 font-[var(--font-sans)] text-[14px] leading-relaxed text-[#4a3f42]">
              To decyzja, która wpływa na Twoją skórę przez tygodnie — czasem miesiące.
            </p>
            <p className="mt-4 font-[var(--font-sans)] text-[14px] leading-relaxed text-[#4a3f42]">
              Dlatego zaczynamy od dopasowania, nie od promocji.
            </p>
            <p className="mt-3 font-[var(--font-sans)] text-[14px] leading-relaxed text-[#4a3f42]">
              Analizujemy problem albo wybraną usługę i pokazujemy tylko te rozwiązania, które mają sens w Twoim przypadku — w {PORTAL_LOCALE.regionLong}.
            </p>
            <p className="mt-4 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C]">
              Co to oznacza w praktyce?
            </p>
            <ul className="mt-2 space-y-1.5 font-[var(--font-sans)] text-[14px] leading-relaxed text-[#4a3f42]">
              <li>– konkretna propozycja terapii zamiast listy 20 zabiegów</li>
              <li>– informacja, ile wizyt realnie może być potrzebnych</li>
              <li>– jasne wskazówki, czego nie robić na początku</li>
              <li>– wybrane gabinety, które faktycznie pracują z danym problemem</li>
            </ul>
          </div>

          <div
            className="min-w-0 flex-[0_0_100%] rounded-[20px] border-0 p-7 leading-[1.5] lg:flex-[0_0_60%]"
            style={{ background: "#FFF0F5", boxShadow: "0 15px 40px rgba(222,31,64,0.08)" }}
          >
            <p className="font-[var(--font-sans)] text-[13px] font-medium uppercase tracking-wider text-[#DE1F40]">
              Przykładowe dopasowanie
            </p>

            <div className="mt-3 space-y-3">
              <div className="space-y-0.5">
                <p className="font-[var(--font-sans)] text-[13px] font-medium text-[#6F5E64]">
                  Jeśli użytkownik wybrał problem:
                </p>
                <p className="font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C]">
                  Proponowana terapia: Oczyszczanie + regulacja sebum
                </p>
                <p className="font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
                  Ile wizyt: 3–5
                </p>
                <p className="font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
                  Czego unikać: Agresywne peelingi
                </p>
              </div>

              <div className="space-y-0.5 pt-3">
                <p className="font-[var(--font-sans)] text-[13px] font-medium text-[#6F5E64]">
                  Jeśli wybrał usługę:
                </p>
                <p className="font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C]">
                  Wybrana usługa: Manicure hybrydowy
                </p>
                <p className="font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
                  Dostępne terminy: Dziś 17:30 · Jutro 12:00
                </p>
                <p className="font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
                  Ocena gabinetu: ⭐ 4.9
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openModal}
              className="mt-3 font-[var(--font-sans)] text-[14px] font-medium text-[#DE1F40] hover:underline"
            >
              Zobacz jak wygląda dopasowanie
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
