import type { LucideIcon } from "lucide-react";
import { wetInternalPath } from "@/lib/wetPaths";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  List,
  MessageSquare,
  CalendarClock,
  Receipt,
  Calendar,
  Syringe,
  Stethoscope,
  Clock,
  Building2,
  Bell,
  PawPrint,
  Plus,
  Layers,
  Package,
  ClipboardList,
  Wrench,
  Upload,
  Download,
  FileText,
  History,
  Archive,
  Settings,
  User,
  Inbox,
} from "lucide-react";

export type WetNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: "exact" | "prefix";
};

export type WetNavGroup = {
  id: string;
  label: string;
  icon: LucideIcon;
  items: WetNavItem[];
};

/** Codzienna praca recepcji — bez ustawień i ERP. */
export const WET_PANEL_MAIN_NAV: WetNavItem[] = [
  { href: "/wet/panel", label: "Pulpit", icon: LayoutDashboard, match: "exact" },
  { href: "/wet/panel/kalendarz", label: "Kalendarz", icon: Calendar, match: "prefix" },
  { href: "/wet/panel/szczepienia", label: "Szczepienia", icon: Syringe, match: "prefix" },
];

export const WET_PANEL_KLIENCI_NAV: WetNavItem[] = [
  { href: "/wet/panel/klienci/nowy", label: "Nowy klient", icon: UserPlus, match: "prefix" },
  { href: "/wet/panel/klienci/lista", label: "Lista klientów", icon: List, match: "prefix" },
  { href: "/wet/panel/klienci/wiadomosci", label: "Wiadomości", icon: MessageSquare, match: "prefix" },
  {
    href: "/wet/panel/klienci/wiadomosci-zaplanowane",
    label: "Wiadomości cykliczne i zaplanowane",
    icon: CalendarClock,
    match: "prefix",
  },
  { href: "/wet/panel/klienci/rozliczenia", label: "Rozliczenia", icon: Receipt, match: "prefix" },
];

export const WET_PANEL_ZWIERZETA_NAV: WetNavItem[] = [
  { href: "/wet/panel/zwierzeta/nowe", label: "Nowe zwierzę", icon: Plus, match: "prefix" },
  { href: "/wet/panel/zwierzeta/lista", label: "Lista zwierząt", icon: List, match: "prefix" },
  { href: "/wet/panel/zwierzeta/stada/nowe", label: "Nowe stado", icon: Plus, match: "prefix" },
  { href: "/wet/panel/zwierzeta/stada/lista", label: "Lista stad", icon: Layers, match: "prefix" },
];

export const WET_PANEL_USTAWIENIA_NAV: WetNavItem[] = [
  { href: "/wet/panel/ustawienia", label: "Przegląd", icon: Settings, match: "exact" },
  { href: "/wet/panel/ustawienia/konto", label: "Moje konto", icon: User, match: "prefix" },
  { href: "/wet/panel/lekarze", label: "Pracownicy", icon: Stethoscope, match: "prefix" },
  { href: "/wet/panel/ustawienia/punkty-przyjec", label: "Punkty przyjęć", icon: Building2, match: "prefix" },
  { href: "/wet/panel/godziny-pracy", label: "Godziny pracy", icon: Clock, match: "prefix" },
  { href: "/wet/panel/przychodnia", label: "Branding", icon: Building2, match: "prefix" },
  { href: "/wet/panel/ustawienia/powiadomienia", label: "SMS i przypomnienia", icon: Bell, match: "prefix" },
  { href: "/wet/panel/powiadomienia", label: "Skrzynka", icon: Inbox, match: "prefix" },
  { href: "/wet/panel/narzedzia/import", label: "Import CSV", icon: Upload, match: "prefix" },
  { href: "/wet/panel/narzedzia/eksport", label: "Eksport danych", icon: Download, match: "prefix" },
  { href: "/wet/panel/narzedzia/archiwum", label: "Archiwum", icon: Archive, match: "prefix" },
  { href: "/wet/panel/katalog", label: "Cennik", icon: Package, match: "prefix" },
  { href: "/wet/panel/ustawienia/pakiety", label: "Pakiety wizyt", icon: Layers, match: "prefix" },
  { href: "/wet/panel/profilaktyka", label: "Szablony szczepień", icon: ClipboardList, match: "prefix" },
];

export const WET_PANEL_NARZEDZIA_NAV: WetNavItem[] = [
  { href: "/wet/panel/narzedzia", label: "Przegląd", icon: Wrench, match: "exact" },
  { href: "/wet/panel/narzedzia/raporty", label: "Raport szczepień", icon: FileText, match: "prefix" },
  { href: "/wet/panel/narzedzia/raporty/wizyty", label: "Historia wizyt", icon: History, match: "prefix" },
];

export function isNavActive(pathname: string, item: WetNavItem): boolean {
  const path = wetInternalPath(pathname);
  if (item.match === "exact") return path === item.href;
  return path === item.href || path.startsWith(item.href + "/");
}

export function isKlienciSectionActive(pathname: string): boolean {
  return wetInternalPath(pathname).startsWith("/wet/panel/klienci");
}

export function isZwierzetaSectionActive(pathname: string): boolean {
  const path = wetInternalPath(pathname);
  return path.startsWith("/wet/panel/zwierzeta") || path === "/wet/panel/pacjenci";
}

export function isUstawieniaSectionActive(pathname: string): boolean {
  const path = wetInternalPath(pathname);
  return (
    path.startsWith("/wet/panel/ustawienia") ||
    path.startsWith("/wet/panel/lekarze") ||
    path.startsWith("/wet/panel/godziny-pracy") ||
    path.startsWith("/wet/panel/przychodnia") ||
    path.startsWith("/wet/panel/katalog") ||
    path.startsWith("/wet/panel/profilaktyka") ||
    path === "/wet/panel/powiadomienia" ||
    path.startsWith("/wet/panel/narzedzia/import") ||
    path.startsWith("/wet/panel/narzedzia/eksport") ||
    path.startsWith("/wet/panel/narzedzia/archiwum")
  );
}

export function isNarzedziaSectionActive(pathname: string): boolean {
  const path = wetInternalPath(pathname);
  if (
    path.startsWith("/wet/panel/narzedzia/import") ||
    path.startsWith("/wet/panel/narzedzia/eksport") ||
    path.startsWith("/wet/panel/narzedzia/archiwum")
  ) {
    return false;
  }
  return path.startsWith("/wet/panel/narzedzia");
}
