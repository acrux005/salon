import type { LucideIcon } from "lucide-react";
import { gabinetInternalPath } from "@/lib/gabinetPlatform/paths";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  List,
  MessageSquare,
  Receipt,
  Calendar,
  ClipboardList,
  BellRing,
  Wrench,
  Upload,
  Download,
  Settings,
  Building2,
  UserRound,
  Plus,
  Clock,
  BookOpen,
  UserCog,
  Rocket,
  User,
  Bell,
  BarChart3,
  UsersRound,
} from "lucide-react";

export type GabNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: "exact" | "prefix";
};

export const GAB_PANEL_MAIN_NAV: GabNavItem[] = [
  { href: "/gabinet/panel", label: "Pulpit", icon: LayoutDashboard, match: "exact" },
  { href: "/gabinet/panel/kalendarz", label: "Kalendarz", icon: Calendar, match: "prefix" },
  { href: "/gabinet/panel/plany-leczenia", label: "Plany leczenia", icon: ClipboardList, match: "prefix" },
  { href: "/gabinet/panel/recall", label: "Recall", icon: BellRing, match: "prefix" },
];

export const GAB_PANEL_PACJENCI_NAV: GabNavItem[] = [
  { href: "/gabinet/panel/pacjenci/nowy", label: "Nowy pacjent", icon: Plus, match: "prefix" },
  { href: "/gabinet/panel/pacjenci/lista", label: "Lista pacjentów", icon: List, match: "prefix" },
];

export const GAB_PANEL_KLIENCI_NAV: GabNavItem[] = [
  { href: "/gabinet/panel/klienci/nowy", label: "Nowy klient", icon: UserPlus, match: "prefix" },
  { href: "/gabinet/panel/klienci/lista", label: "Lista klientów", icon: List, match: "prefix" },
  { href: "/gabinet/panel/klienci/wiadomosci", label: "Wiadomości", icon: MessageSquare, match: "prefix" },
  { href: "/gabinet/panel/klienci/wiadomosci-zaplanowane", label: "Wiadomości cykliczne", icon: MessageSquare, match: "prefix" },
  { href: "/gabinet/panel/klienci/rozliczenia", label: "Rozliczenia", icon: Receipt, match: "prefix" },
];

export const GAB_PANEL_USTAWIENIA_NAV: GabNavItem[] = [
  { href: "/gabinet/panel/ustawienia", label: "Przegląd", icon: Settings, match: "exact" },
  { href: "/gabinet/panel/ustawienia/konto", label: "Moje konto", icon: User, match: "prefix" },
  { href: "/gabinet/panel/ustawienia/zespol", label: "Zespół", icon: UsersRound, match: "prefix" },
  { href: "/gabinet/panel/onboarding", label: "Konfiguracja", icon: Rocket, match: "prefix" },
  { href: "/gabinet/panel/gabinet", label: "Branding", icon: Building2, match: "prefix" },
  { href: "/gabinet/panel/ustawienia/godziny", label: "Godziny pracy", icon: Clock, match: "prefix" },
  { href: "/gabinet/panel/personel", label: "Personel", icon: UserCog, match: "prefix" },
  { href: "/gabinet/panel/ustawienia/katalog", label: "Katalog zabiegów", icon: BookOpen, match: "prefix" },
  { href: "/gabinet/panel/ustawienia/powiadomienia", label: "Powiadomienia", icon: Bell, match: "prefix" },
];

export const GAB_PANEL_NARZEDZIA_NAV: GabNavItem[] = [
  { href: "/gabinet/panel/narzedzia", label: "Przegląd", icon: Wrench, match: "exact" },
  { href: "/gabinet/panel/narzedzia/import", label: "Import", icon: Upload, match: "prefix" },
  { href: "/gabinet/panel/narzedzia/eksport", label: "Eksport", icon: Download, match: "prefix" },
  { href: "/gabinet/panel/narzedzia/raporty", label: "Raporty", icon: BarChart3, match: "prefix" },
];

export function isNavActive(pathname: string, item: GabNavItem): boolean {
  const path = gabinetInternalPath(pathname);
  if (item.match === "exact") return path === item.href;
  return path === item.href || path.startsWith(item.href + "/");
}

export function isPacjenciSectionActive(pathname: string): boolean {
  return gabinetInternalPath(pathname).startsWith("/gabinet/panel/pacjenci");
}

export function isKlienciSectionActive(pathname: string): boolean {
  return gabinetInternalPath(pathname).startsWith("/gabinet/panel/klienci");
}

export function isUstawieniaSectionActive(pathname: string): boolean {
  const path = gabinetInternalPath(pathname);
  return (
    path.startsWith("/gabinet/panel/ustawienia") ||
    path.startsWith("/gabinet/panel/gabinet") ||
    path.startsWith("/gabinet/panel/personel") ||
    path.startsWith("/gabinet/panel/onboarding")
  );
}

export function isNarzedziaSectionActive(pathname: string): boolean {
  return gabinetInternalPath(pathname).startsWith("/gabinet/panel/narzedzia");
}
