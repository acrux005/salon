import type { Metadata } from "next";
import { BeautySalonWebsiteLanding } from "@/components/seo/BeautySalonWebsiteLanding";
import { SALON_SITE_URL } from "@/lib/salonSeo";

const PATH = "/strona-internetowa-dla-kosmetyczek";
const canonical = `${SALON_SITE_URL}${PATH}`;

export const metadata: Metadata = {
  title: {
    absolute: "Strona internetowa dla kosmetyczek od 1500 zł | ODART",
  },
  description:
    "Strona internetowa dla kosmetyczek i salonów beauty: wizytówka, cennik zabiegów, opinie, rezerwacja. Pozycjonowanie na „gabinet kosmetyczny” + Twoje miasto. Wycena — biuro@odart.pl.",
  keywords: [
    "strona internetowa dla kosmetyczek",
    "strona dla kosmetyczki",
    "strona www kosmetyczka",
    "strona internetowa salon kosmetyczny",
    "strona dla gabinetu kosmetycznego",
  ],
  alternates: { canonical },
  openGraph: {
    title: "Strona internetowa dla kosmetyczek | ODART",
    description: "Strona WWW dla kosmetyczek — projekt pod beauty, SEO lokalne. Wycena od 1500 zł.",
    url: canonical,
    locale: "pl_PL",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function StronaDlaKosmetyczekPage() {
  return (
    <BeautySalonWebsiteLanding
      audiencePhrase="dla kosmetyczek"
      h1Suffix="dla kosmetyczek i salonów kosmetycznych"
    />
  );
}
