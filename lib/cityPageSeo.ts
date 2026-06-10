import type { PortalSeoCity } from "@/content/portalCities";
import { formatCityLocativePhrase } from "@/content/portalCities";

/** Meta pod frazy typu „gabinet kosmetyczny Koszalin”, „salon kosmetyczny …”. */
export function buildCitySeoMeta(city: PortalSeoCity, clinicsCount: number) {
  const name = city.name;
  const locPhrase = formatCityLocativePhrase(city);
  const title = `Gabinet kosmetyczny ${name} — salony, zabiegi i opinie`;
  const description =
    clinicsCount > 0
      ? `Gabinet kosmetyczny ${name}: sprawdź ${clinicsCount} salonów, zabiegi na twarz i ciało, opinie i rezerwacja online. Salon kosmetyczny w ${locPhrase}.`
      : `Szukasz gabinetu kosmetycznego w ${name}? Lista salonów kosmetycznych, zabiegi, analiza skóry i rezerwacja w ${locPhrase}.`;
  const keywords = [
    `gabinet kosmetyczny ${name}`,
    `salon kosmetyczny ${name}`,
    `gabinet kosmetyczny ${name.toLowerCase()}`,
    `zabiegi kosmetyczne ${name}`,
    `kosmetyczka ${name}`,
    `gabinety kosmetyczne ${name}`,
  ];
  return { title, description, keywords, locPhrase };
}
