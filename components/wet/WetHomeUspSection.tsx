import { CalendarClock, ShieldCheck, Zap } from "lucide-react";

const USP = [
  {
    icon: ShieldCheck,
    title: "Nigdy więcej zaległych szczepień",
    body: "Automatyczne SMS 30, 7 i 0 dni przed terminem — bez Excela i kartek na lodówce.",
    accent: "from-violet-50 to-white border-violet-100",
    iconClass: "bg-violet-600 text-white shadow-violet-600/25",
  },
  {
    icon: CalendarClock,
    title: "Kalendarz online dla recepcji",
    body: "Rezerwacje z internetu, zapis w gabinecie i przypomnienie 24 h przed wizytą.",
    accent: "from-teal-50 to-white border-teal-100",
    iconClass: "bg-wet-teal text-white shadow-wet-teal/25",
  },
  {
    icon: Zap,
    title: "Bez ciężkiego ERP",
    body: "Uruchomienie w 5 minut — bez magazynu, księgowości i wdrożenia za dziesiątki tysięcy.",
    accent: "from-amber-50 to-white border-amber-100",
    iconClass: "bg-amber-500 text-white shadow-amber-500/25",
  },
] as const;

export function WetHomeUspSection() {
  return (
    <section className="border-y border-wet-teal-100 bg-gradient-to-b from-white via-wet-teal-50/30 to-white px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-wet-teal">Dla małych klinik</p>
          <h2 className="mt-3 text-2xl font-bold text-wet-navy sm:text-3xl">Trzy rzeczy, które naprawdę robią różnicę</h2>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {USP.map((item, i) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${item.accent} wet-home-fade-up`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl shadow-md ${item.iconClass}`}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="text-lg font-bold text-wet-navy">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-wet-navy-muted">{item.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
