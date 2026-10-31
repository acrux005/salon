import type { Metadata } from "next";
import { BeautySalonWebsiteLanding } from "@/components/seo/BeautySalonWebsiteLanding";
import { SALON_SITE_URL } from "@/lib/salonSeo";

const PATH = "/strona-internetowa-dla-gabinetu-kosmetycznego";
const canonical = `${SALON_SITE_URL}${PATH}`;

export const metadata: Metadata = {
  title: {
    absolute:
      "Strona internetowa dla gabinetu kosmetycznego i urody od 1500 zł | ODART",
  },
  description:
    "Strona WWW dla gabinetu kosmetycznego / salonu urody: mobile, SEO lokalne, cennik zabiegów, rezerwacje. Od ok. 1500 zł — Rafał Kowalkowski, ODART. Tel. 695 432 415.",
  keywords: [
    "strona internetowa dla gabinetu kosmetycznego",
    "strona internetowa dla gabinetu urody",
    "strona internetowa gabinetu kosmetycznego",
    "strona dla gabinetu kosmetycznego",
    "strona dla gabinetu urody",
    "strona www gabinet kosmetyczny",
    "strona salonu kosmetycznego",
    "tworzenie strony dla gabinetu",
  ],
  alternates: { canonical },
  openGraph: {
    title: "Strona internetowa dla gabinetu kosmetycznego i urody | ODART",
    description:
      "Strona WWW pod gabinet kosmetyczny i salon urody — SEO, mobile, rezerwacje. Wycena od 1500 zł.",
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
      h1Suffix="dla gabinetu kosmetycznego i salonu urody"
    />
  );
}
