/** Katalog niezweryfikowany: ścieżki i dane administratora (bezpieczne po stronie klienta). */

export const CATALOG_ADMIN_EMAIL = "biuro@odart.pl";
export const CATALOG_ADMIN_NAME = "ODART Rafał Kowalkowski";
export const CATALOG_ADMIN_ADDRESS = "ul. Makowskiego 3, 78-100 Kołobrzeg";
export const CATALOG_ADMIN_NIP = "5791020696";
export const CATALOG_ADMIN_PHONE = "695 432 415";
export const CATALOG_RODO_PATH = "/zrodlo-i-przetwarzanie-danych";

export function clinicClaimPath(slug: string): string {
  return `/portal/gabinet/${slug}/przejmij`;
}

export function clinicReportPath(slug: string): string {
  return `/portal/gabinet/${slug}/zglos`;
}
