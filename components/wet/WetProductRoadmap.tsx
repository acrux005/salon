const ROADMAP_ITEMS = [
  {
    title: "Magazyn ERP (stany, dostawy, FIFO)",
    status: "planowane" as const,
    description: "Świadomie poza scope produktu. Zamiast tego: katalog preparatów (✓) → serie partii → opcjonalny licznik dawek.",
  },
  {
    title: "Eksport SAFE-ANIMAL / EUROPETNET",
    status: "w przygotowaniu" as const,
    description: "Pola identyfikacyjne i status synchronizacji są już na karcie zwierzęcia. Kolejny krok: automatyczny eksport do bazy SAFE-ANIMAL.",
  },
  {
    title: "Konsultacje online",
    status: "planowane" as const,
    description: "Wizyty zdalne: czat, telefon i wideo — moduł rozszerzający harmonogram po MVP.",
  },
  {
    title: "Pliki medyczne na karcie zwierzęcia",
    status: "w przygotowaniu" as const,
    description: "Skany wyników badań, RTG i dokumentacja — uzupełnienie historii wizyt i szczepień.",
  },
];

function statusBadge(status: "planowane" | "w przygotowaniu") {
  if (status === "w przygotowaniu") {
    return (
      <span className="rounded-full bg-wet-teal-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-wet-teal-800">
        W przygotowaniu
      </span>
    );
  }
  return (
    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-slate-600">
      Planowane
    </span>
  );
}

export function WetProductRoadmap() {
  return (
    <section className="mt-10 rounded-xl border border-dashed border-wet-teal-200 bg-wet-teal-50/30 p-5">
      <h2 className="text-lg font-semibold text-wet-navy">Plan rozwoju VetHarmonogram</h2>
      <p className="mt-1 text-[14px] text-wet-navy-muted">
        Funkcje konkurencyjne zaplanowane na kolejne wersje produktu.
      </p>
      <ul className="mt-4 space-y-3">
        {ROADMAP_ITEMS.map((item) => (
          <li
            key={item.title}
            className="rounded-lg border border-wet-teal-100 bg-white px-4 py-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[14px] font-semibold text-wet-navy">{item.title}</h3>
              {statusBadge(item.status)}
            </div>
            <p className="mt-1 text-[13px] text-wet-navy-muted">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
