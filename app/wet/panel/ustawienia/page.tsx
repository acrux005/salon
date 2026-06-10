import Link from "next/link";
import { redirect } from "next/navigation"
import { getWetRedirectPath } from "@/lib/wetRedirect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";
import {
  Archive,
  Bell,
  Building2,
  Clock,
  Download,
  FileText,
  Layers,
  Stethoscope,
  Upload,
  User,
  Users,
} from "lucide-react";

const SECTIONS = [
  {
    title: "Konto",
    description: "Użytkownik gabinetu, lekarze i role — core moduł pracowników.",
    items: [
      { href: "/wet/panel/ustawienia/konto", label: "Moje konto", desc: "Hasło i dane logowania", icon: User },
      { href: "/wet/panel/lekarze", label: "Pracownicy", desc: "Lekarze widoczni w kalendarzu", icon: Stethoscope },
      { href: "/wet/panel/ustawienia/role", label: "Role", desc: "Recepcja, lekarz — wkrótce", icon: Users },
    ],
  },
  {
    title: "Klinika",
    description: "Punkty przyjęć, grafik i branding — bez magazynu i faktur.",
    items: [
      { href: "/wet/panel/ustawienia/punkty-przyjec", label: "Punkty przyjęć", desc: "Gabinet, teren, oddział", icon: Building2 },
      { href: "/wet/panel/godziny-pracy", label: "Godziny pracy", desc: "Grafik i blokady rezerwacji", icon: Clock },
      { href: "/wet/panel/przychodnia", label: "Branding", desc: "Nazwa, opis, profil publiczny", icon: Building2 },
    ],
  },
  {
    title: "Powiadomienia",
    description: "SMS, e-mail i przypomnienia — prosto, bez ERP.",
    items: [
      { href: "/wet/panel/ustawienia/powiadomienia", label: "SMS i przypomnienia", desc: "Terminy, kanały, podpis SMS", icon: Bell },
      { href: "/wet/panel/powiadomienia", label: "Skrzynka", desc: "Powiadomienia systemowe w panelu", icon: Bell },
    ],
  },
  {
    title: "Dane",
    description: "Import, eksport i archiwum — onboarding bez przepisywania.",
    items: [
      { href: "/wet/panel/narzedzia/import", label: "Import CSV", desc: "Właściciele i zwierzęta", icon: Upload },
      { href: "/wet/panel/narzedzia/eksport", label: "Eksport danych", desc: "Backup CSV", icon: Download },
      { href: "/wet/panel/narzedzia/archiwum", label: "Archiwizacja", desc: "Zmarłe i nieaktywne", icon: Archive },
    ],
  },
  {
    title: "Usługi",
    description: "Cennik i schematy — nie magazyn enterprise.",
    items: [
      { href: "/wet/panel/katalog", label: "Cennik i preparaty", desc: "Szczepionki, zabiegi, ceny", icon: FileText },
      { href: "/wet/panel/ustawienia/pakiety", label: "Pakiety wizyt", desc: "Schematy typu „Szczeniak Start”", icon: Layers },
      { href: "/wet/panel/profilaktyka", label: "Szablony szczepień", desc: "Wytyczne profilaktyki", icon: FileText },
    ],
  },
] as const;

export default async function WetUstawieniaPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login"));
  if (!(session?.user as { vetClinicId?: string })?.vetClinicId) redirect(await getWetRedirectPath("/login"));

  return (
    <>
      <WetPanelPageHeader
        title="Ustawienia"
        description="Lekki SaaS, nie ERP — konto, klinika, powiadomienia, dane i usługi."
      />
      <div className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="font-semibold text-wet-navy">{section.title}</h2>
              <p className="mt-1 text-[13px] text-wet-navy-muted">{section.description}</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex h-full gap-3 rounded-xl border border-wet-teal-200 bg-white p-4 transition hover:border-wet-teal-400 hover:shadow-sm"
                    >
                      <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-wet-teal" aria-hidden />
                      <div>
                        <p className="font-medium text-wet-navy group-hover:text-wet-teal-800">{item.label}</p>
                        <p className="mt-0.5 text-[12px] text-wet-navy-muted">{item.desc}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-wet-navy-muted">
            Celowo nie ma tu: magazynów, faktur, SignOnTab, planów fakturowania ani grup towarów — to granica
            VetHarmonogram vs pełnego ERP weterynaryjnego.
          </p>
        </div>
      </div>
    </>
  );
}
