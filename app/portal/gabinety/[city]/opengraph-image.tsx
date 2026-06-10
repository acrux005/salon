import { portalOgImageResponse } from "@/lib/og/portalOgImage";
import { getPortalCityBySlug } from "@/content/portalCities";

export const alt = "Gabinety kosmetyczne — miasto | Zabiegi Odart";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ city: string }> };

export default async function Image({ params }: Props) {
  const { city } = await params;
  const row = getPortalCityBySlug(city);
  const title = row ? `Gabinety: ${row.name}` : "Gabinety kosmetyczne";
  const subtitle = row ? `Zabiegi Odart · ${row.locative}` : "Zabiegi Odart · Polska";

  return portalOgImageResponse({
    eyebrow: "Zabiegi Odart",
    title,
    subtitle,
    fontSubset: `${row?.name ?? ""}ACĆĘŁŃÓŚŹŻąćęłńóśźż`,
  });
}
