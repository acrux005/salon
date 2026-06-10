"use client";

export function DemoSprzedaz() {
  return (
    <section id="przyklad-strony" className="border-t border-neutral-200/60 bg-white py-16 lg:py-24 scroll-mt-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h2 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl lg:text-4xl">
            Ta strona jest przykładem modelu strony dla gabinetów
          </h2>
          <p className="mt-2 text-sm font-[var(--font-sans)] text-neutral-500">
            Strona demonstracyjna — przykład realizacji
          </p>
        </header>

        <div className="space-y-6 font-[var(--font-sans)] text-[15px] leading-[1.8] text-[#4a3f42]">
          <p>
            To nie jest przypadkowy układ sekcji. Strona została zaprojektowana tak, aby klient trafiał najpierw na konsultację, a nie na listę zabiegów.
          </p>
          <p className="font-medium text-[#1F1A1C]">Dzięki temu:</p>
          <ul className="list-none space-y-2 pl-0">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-pink-400" aria-hidden />
              <span>mniej przypadkowych wizyt</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-pink-400" aria-hidden />
              <span>mniej wiadomości z pytaniem „co wybrać”</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-pink-400" aria-hidden />
              <span>więcej klientów zdecydowanych na terapię</span>
            </li>
          </ul>
          <p>
            Tworzę takie strony indywidualnie dla gabinetów — dopasowane do specjalizacji i stylu pracy.
          </p>
          <p>
            Jeśli prowadzisz gabinet i chcesz podobny system u siebie —{" "}
            <a
              href="mailto:kontakt@example.com?subject=Strona dla gabinetu"
              className="font-medium text-pink-600 underline decoration-pink-300 underline-offset-2 transition-colors hover:text-pink-700 hover:decoration-pink-500"
            >
              napisz
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
