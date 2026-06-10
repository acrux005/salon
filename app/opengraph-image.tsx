import { headers } from "next/headers";
import { portalOgImageResponse } from "@/lib/og/portalOgImage";
import { isWetPortalHost } from "@/lib/wetHost";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const host = (await headers()).get("host") ?? "";
  if (isWetPortalHost(host)) {
    return portalOgImageResponse({
      eyebrow: "VetHarmonogram",
      title: "Przychodnia weterynaryjna w harmonii",
      subtitle: "Wizyty, szczepienia, przypomnienia i historia pacjenta — bez ERP",
      fontSubset: "ACĆĘŁŃÓŚŹŻąćęłńóśźż",
      accent: "#0d9488",
      footerLabel: "weterynaria.odart.pl",
      background: "linear-gradient(135deg, #f0fdfa 0%, #ecfeff 45%, #f8fafc 100%)",
    });
  }
  return portalOgImageResponse({
    eyebrow: "Salon Odart",
    title: "Zabiegi kosmetyczne w Polsce",
    subtitle: "Portal Zabiegi Odart — dobór zabiegów, gabinetów i rezerwacje online",
    fontSubset: "ACĆĘŁŃÓŚŹŻąćęłńóśźż",
  });
}
