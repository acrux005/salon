import { PORTAL_CITY_BY_NAME } from "./portalCities";
import { formatCityLocativePhrase } from "./portalCities";

export function getCityLocative(city: string): string {
  const row = PORTAL_CITY_BY_NAME[city];
  if (!row) return city;
  if (row.locativeManual && row.locative !== row.name) return row.locative;
  return formatCityLocativePhrase(row);
}

/**
 * Fraza z przyimkiem: „we Wrocławiu”, „w Warszawie”.
 * (getCityLocative zwraca sam miejscownik bez „w/we”.)
 */
export function cityInPhrase(city: string): string {
  const loc = getCityLocative(city).trim();
  if (!loc) return city;
  if (/^(w|we)\s+/i.test(loc)) return loc;
  // „we” przed w+spółgłoska (Wrocławiu, Wrześni) oraz przed niektórymi samogłoskami
  if (/^w[^aeiouyąęó]/i.test(loc) || /^[aoeęóuyią]/i.test(loc)) {
    return `we ${loc}`;
  }
  return `w ${loc}`;
}

/**
 * Lokalizacja portalu — jedna zmienna do zmiany przy skalowaniu na inne rynki.
 * Odmiana: region (mianownik), regionIn (miejscownik: w …), regionFrom (dopełniacz: z …).
 */
export const PORTAL_LOCALE = {
  /** Mianownik: „Polska” */
  region: "Polska",
  /** Miejscownik bez przyimka: „całej Polsce” */
  regionIn: "całej Polsce",
  /** Dopełniacz bez przyimka: „całej Polski” */
  regionFrom: "całej Polski",
  /** Miejscownik bez przyimka: „całej Polsce” */
  regionLong: "całej Polsce",
  /** Etykieta: „Cała Polska” */
  regionLabel: "Cała Polska",
} as const;
