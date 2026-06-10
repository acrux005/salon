import { portalOgImageResponse } from "@/lib/og/portalOgImage";

export const alt = "Zabiegi Odart — gabinety kosmetyczne w Polsce";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return portalOgImageResponse({
    eyebrow: "Zabiegi Odart",
    title: "Dobierz zabieg lub gabinet",
    subtitle: "Polska — analiza skóry, katalog usług, sprawdzone salony",
    fontSubset: "ACĆĘŁŃÓŚŹŻąćęłńóśźż",
  });
}
