import { Calendar, Mail, PawPrint, Shield, Users } from "lucide-react";

const BENEFITS = [
  { icon: Calendar, text: "Kalendarz wizyt online i panel recepcji" },
  { icon: Mail, text: "Przypomnienia e-mail i SMS o szczepieniach" },
  { icon: PawPrint, text: "Historia pacjentów, właścicieli i szczepień" },
  { icon: Users, text: "Dostęp dla całego zespołu (lekarze, recepcja)" },
  { icon: Shield, text: "14 dni testu — bez karty, pełny dostęp" },
] as const;

export function WetRegisterBenefits() {
  return (
    <div className="lg:pt-4">
      <p className="inline-flex items-center rounded-full border border-wet-teal-200 bg-white/80 px-3 py-1 text-[13px] font-medium text-wet-teal-800 shadow-sm">
        Dla przychodni weterynaryjnych w Polsce
      </p>
      <h1 className="mt-5 text-3xl font-bold tracking-tight text-wet-navy sm:text-4xl">
        Uruchom przychodnię w kilka minut
      </h1>
      <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-wet-navy-muted">
        VetHarmonogram łączy rezerwacje, kartotekę zwierząt i przypomnienia — jak Booksy, ale pod
        weterynarię, nie fryzjera.
      </p>
      <ul className="mt-8 space-y-4">
        {BENEFITS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex gap-3 text-[15px] text-wet-navy">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-wet-teal/10 text-wet-teal">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="pt-2 font-medium leading-snug">{text}</span>
          </li>
        ))}
      </ul>
      <blockquote className="mt-10 hidden rounded-2xl border border-wet-teal-100 bg-white/70 p-5 shadow-sm lg:block">
        <p className="text-[15px] italic leading-relaxed text-wet-navy-muted">
          „Wreszcie system, w którym szczepienie przypomina się samo — nie tylko kolejna wizyta w
          kalendarzu.”
        </p>
        <footer className="mt-3 text-[13px] font-medium text-wet-teal-800">
          — prototyp z gabinetów pilotażowych
        </footer>
      </blockquote>
    </div>
  );
}
