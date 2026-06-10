import { portalOgImageResponse } from "@/lib/og/portalOgImage";

export const alt = "Zabiegi kosmetyczne — portal Zabiegi Odart";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return portalOgImageResponse({
    eyebrow: "Zabiegi Odart",
    title: "Zabiegi kosmetyczne w Polsce",
    subtitle: "Dobór terapii, lista gabinetów i rezerwacja online",
    fontSubset: "ACĆĘŁŃÓŚŹŻąćęłńóśźż",
  });
}
