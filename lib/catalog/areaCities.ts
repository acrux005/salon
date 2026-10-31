/** Miasta i miejscowości pokazywane razem na stronie katalogu. */
export const CITY_CATALOG_AREA: Record<string, string[]> = {
  Kołobrzeg: [
    "Kołobrzeg",
    "Grzybowo",
    "Dźwirzyno",
    "Zieleniewo",
    "Ustronie Morskie",
    "Sianożęty",
    "Gościno",
    "Karlino",
    "Dygowo",
    "Niekanin",
    "Budzistowo",
    "Mielno",
  ],
};

export function catalogCitiesFor(cityName: string): string[] {
  return CITY_CATALOG_AREA[cityName] ?? [cityName];
}

export function isAreaCatalogCity(cityName: string): boolean {
  return cityName in CITY_CATALOG_AREA;
}
