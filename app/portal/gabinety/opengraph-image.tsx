import { portalOgImageResponse } from "@/lib/og/portalOgImage";

export const alt = "Gabinety kosmetyczne — Polska | Zabiegi Odart";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return portalOgImageResponse({
    eyebrow: "Zabiegi Odart",
    title: "Gabinety kosmetyczne",
    subtitle: "Cała Polska — lista salonów, miasta i rezerwacje",
    fontSubset: "ACĆĘŁŃÓŚŹŻąćęłńóśźż",
  });
}
