import Link from "next/link";

export const metadata = {
  title: "Dla przychodni weterynaryjnych",
  description: "VetHarmonogram — kalendarz, szczepienia i przypomnienia SMS.",
};

export default function WetForClinicsPage() {
  return (
    <main>
      <section className="border-b border-wet-teal-200 bg-wet-teal-800 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">System dla Twojej przychodni</h1>
          <p className="mt-4 text-lg text-wet-teal-100">
            To, czego brakuje w Booksy: zwierzę, szczepienia i przypomnienie za rok — nie tylko „wizyta o 10:00”.
          </p>
          <Link
            href="/wet/register"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-wet-teal-800 hover:bg-wet-teal-50"
          >
            Rozpocznij za darmo
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-xl font-bold text-wet-navy">Funkcje (MVP)</h2>
        <ul className="mt-6 space-y-4">
          {[
            "Kalendarz wizyt z panelem recepcji",
            "Rezerwacja online dla właścicieli",
            "Baza właścicieli i zwierząt",
            "Rejestr szczepień + automatyczne przypomnienia (30 / 7 / 0 dni)",
            "Widok zaległych szczepień",
            "Godziny pracy i dni wolne",
            "Wielu lekarzy w jednej przychodni",
          ].map((item) => (
            <li key={item} className="flex gap-3 text-[15px] text-wet-navy-muted">
              <span className="text-wet-teal" aria-hidden>
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>

        <h2 className="mt-14 text-xl font-bold text-wet-navy">Rynek w Polsce</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-wet-navy-muted">
          Pełne systemy (Vetina, Weter.pl, Lecznica.eu) obejmują dokumentację GIW, magazyn i księgowość.
          VetHarmonogram celuje w małe przychodnie, które chcą przede wszystkim{" "}
          <strong className="text-wet-navy">nie tracić klientów przez zapomniane szczepienia</strong> i mieć
          porządek w kalendarzu — bez miesięcznego wdrożenia ERP.
        </p>

        <div className="mt-10 rounded-2xl border border-wet-teal-200 bg-wet-teal-50 p-6">
          <p className="font-semibold text-wet-teal-900">Orientacyjny abonament (docelowo)</p>
          <p className="mt-2 text-3xl font-bold text-wet-navy">
            99–149 zł <span className="text-base font-normal text-wet-navy-muted">/ miesiąc</span>
          </p>
          <p className="mt-2 text-[14px] text-wet-navy-muted">+ SMS wg zużycia · bez prowizji od wizyty</p>
        </div>
      </section>
    </main>
  );
}
