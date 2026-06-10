import type { Metadata } from "next";
import { BeautySalonWebsiteLanding } from "@/components/seo/BeautySalonWebsiteLanding";
import { SALON_SITE_URL } from "@/lib/salonSeo";

const PATH = "/strona-internetowa-dla-gabinetu-kosmetycznego";
const canonical = `${SALON_SITE_URL}${PATH}`;

export const metadata: Metadata = {
  title: "Strona internetowa dla gabinetu kosmetycznego — projekt, SEO, od 1500 zł",
  description:
    "Strona internetowa dla gabinetu kosmetycznego i salonu beauty: mobile, SEO lokalne („gabinet kosmetyczny + miasto”), cennik zabiegów, rezerwacje. Wycena od ok. 1500 zł — Zabiegi Odart / ODART.",
  keywords: [
    "strona internetowa dla gabinetu",
    "strona internetowa dla gabinetu kosmetycznego",
    "strona dla gabinetu kosmetycznego",
    "strona www gabinet kosmetyczny",
    "strona salonu kosmetycznego",
    "tworzenie strony dla gabinetu",
  ],
  alternates: { canonical },
  openGraph: {
    title: "Strona internetowa dla gabinetu kosmetycznego | Zabiegi Odart",
    description:
      "Profesjonalna strona WWW pod gabinet kosmetyczny — SEO, mobile i integracja z portalem Zabiegi Odart.",
    url: canonical,
    locale: "pl_PL",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function StronaDlaGabinetuKosmetycznegoPage() {
  return (
    <BeautySalonWebsiteLanding
      audiencePhrase="dla gabinetu kosmetycznego"
      h1Suffix="dla gabinetu kosmetycznego i salonu beauty"
    />
  );
}
