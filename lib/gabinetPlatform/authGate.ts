import type { JWT } from "next-auth/jwt";
import { isGabinetMarketingOrAuthPath } from "@/lib/gabinetPlatform/paths";

export function isGabinetPublicPath(internalPath: string): boolean {
  if (isGabinetMarketingOrAuthPath(internalPath)) return true;
  if (
    internalPath.startsWith("/gabinet/login") ||
    internalPath.startsWith("/gabinet/register") ||
    internalPath.startsWith("/gabinet/klient/logowanie") ||
    internalPath.startsWith("/gabinet/klient/rejestracja") ||
    internalPath.startsWith("/gabinet/potwierdz-email") ||
    internalPath.startsWith("/gabinet/zapomniane-haslo") ||
    internalPath.startsWith("/gabinet/ustaw-haslo") ||
    internalPath.startsWith("/gabinet/klient/potwierdz-email") ||
    internalPath.startsWith("/gabinet/klient/zapomniane-haslo") ||
    internalPath.startsWith("/gabinet/klient/ustaw-haslo")
  ) {
    return true;
  }
  return false;
}

export function isAuthorizedGabinetPath(token: JWT | null, internalPath: string): boolean {
  if (isGabinetPublicPath(internalPath)) return true;
  if (internalPath.startsWith("/gabinet/panel")) {
    return !!token && (token.role === "gab_clinic" || token.role === "admin");
  }
  if (internalPath.startsWith("/gabinet/klient/panel")) {
    return !!token && token.role === "gab_patient";
  }
  if (internalPath.startsWith("/api/gabinet/")) {
    if (internalPath.startsWith("/api/gabinet/clinic")) return true;
    if (internalPath.startsWith("/api/gabinet/availability")) return true;
    if (internalPath.startsWith("/api/gabinet/booking/staff")) return true;
    if (internalPath.startsWith("/api/gabinet/booking/calendar")) return true;
    if (internalPath === "/api/gabinet/booking") return true;
    if (internalPath.startsWith("/api/gabinet/booking/appointments/")) return !!token;
    return !!token;
  }
  return true;
}
