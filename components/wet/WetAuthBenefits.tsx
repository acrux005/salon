import { Calendar, KeyRound, Mail, Shield, Syringe } from "lucide-react";

type Variant = "login" | "forgot" | "reset";

const COPY: Record<
  Variant,
  { badge: string; title: string; subtitle: string; items: { icon: typeof Calendar; text: string }[] }
> = {
  login: {
    badge: "Panel przychodni",
    title: "Witaj z powrotem",
    subtitle:
      "Zaloguj się do VetHarmonogram — kalendarz, kartoteka pacjentów i przypomnienia w jednym miejscu.",
    items: [
      { icon: Calendar, text: "Dzisiejsze wizyty i rezerwacje online" },
      { icon: Syringe, text: "Szczepienia z automatycznymi przypomnieniami" },
      { icon: Mail, text: "Wiadomości do właścicieli zwierząt" },
      { icon: Shield, text: "Bezpieczne logowanie i szyfrowane połączenie" },
    ],
  },
  forgot: {
    badge: "Reset hasła",
    title: "Odzyskaj dostęp",
    subtitle:
      "Wyślemy jednorazowy link na e-mail konta administratora. Link jest ważny przez godzinę.",
    items: [
      { icon: Mail, text: "Sprawdź skrzynkę i folder spam" },
      { icon: KeyRound, text: "Ustaw nowe hasło w jednym kroku" },
      { icon: Shield, text: "Stare hasło przestaje działać po zmianie" },
    ],
  },
  reset: {
    badge: "Nowe hasło",
    title: "Zabezpiecz konto",
    subtitle: "Wybierz silne hasło — min. 10 znaków. Nie udostępniaj go personelowi w wiadomościach.",
    items: [
      { icon: KeyRound, text: "Hasło szyfrowane w bazie (bcrypt)" },
      { icon: Shield, text: "Po zapisie zaloguj się nowym hasłem" },
      { icon: Calendar, text: "Wróć do panelu i kontynuuj pracę" },
    ],
  },
};

export function WetAuthBenefits({ variant }: { variant: Variant }) {
  const { badge, title, subtitle, items } = COPY[variant];

  return (
    <div className="lg:pt-2">
      <p className="inline-flex items-center rounded-full border border-wet-teal-200/80 bg-white/80 px-3 py-1 text-[13px] font-medium text-wet-teal-800 shadow-sm">
        {badge}
      </p>
      <h1 className="mt-5 text-3xl font-bold tracking-tight text-wet-navy sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-wet-navy-muted">{subtitle}</p>
      <ul className="mt-8 space-y-4">
        {items.map(({ icon: Icon, text }) => (
          <li key={text} className="flex gap-3 text-[15px] text-wet-navy">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-wet-teal/10 text-wet-teal">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="pt-2 font-medium leading-snug">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
