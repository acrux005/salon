import Link from "next/link";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { Building2, BookOpen, Bell, Clock, Download, Rocket, Upload, User, UserCog } from "lucide-react";

const SECTIONS = [
  {
    title: "Konto",
    items: [
      { href: "/gabinet/panel/ustawienia/konto", label: "Moje konto", desc: "Hasło administratora i weryfikacja e-mail", icon: User },
    ],
  },
  {
    title: "Gabinet",
    items: [
      { href: "/gabinet/panel/onboarding", label: "Konfiguracja (onboarding)", desc: "Kreator pierwszego uruchomienia", icon: Rocket },
      { href: "/gabinet/panel/gabinet", label: "Branding", desc: "Nazwa, opis, logo, NIP, profil publiczny", icon: Building2 },
      { href: "/gabinet/panel/ustawienia/godziny", label: "Godziny pracy", desc: "Sloty rezerwacji i dni wolne", icon: Clock },
      { href: "/gabinet/panel/personel", label: "Personel", desc: "Lekarze i specjaliści", icon: UserCog },
      { href: "/gabinet/panel/ustawienia/katalog", label: "Katalog zabiegów", desc: "Cennik i czasy trwania", icon: BookOpen },
      { href: "/gabinet/panel/ustawienia/powiadomienia", label: "Powiadomienia", desc: "Status SMTP/SMS, test i log", icon: Bell },
    ],
  },
  {
    title: "Dane",
    items: [
      { href: "/gabinet/panel/narzedzia/import", label: "Import", desc: "Pacjenci, klienci i wizyty z CSV", icon: Upload },
      { href: "/gabinet/panel/narzedzia/eksport", label: "Eksport", desc: "Backup danych", icon: Download },
    ],
  },
];

export default function GabUstawieniaPage() {
  return (
    <>
      <GabPanelPageHeader title="Ustawienia" description="Konto gabinetu, branding, personel i dane." />
      <div className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-gab-navy">{section.title}</h2>
              <ul className="mt-3 space-y-2">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 rounded-xl border border-gab-sky/15 bg-white p-4 transition hover:border-gab-sky/35"
                    >
                      <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-gab-sky" aria-hidden />
                      <span>
                        <span className="font-medium text-gab-navy">{item.label}</span>
                        <span className="mt-0.5 block text-[13px] text-slate-500">{item.desc}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
