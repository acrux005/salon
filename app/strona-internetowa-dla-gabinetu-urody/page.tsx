import type { Metadata } from "next";
import { BeautySalonWebsiteLanding } from "@/components/seo/BeautySalonWebsiteLanding";
import { SALON_SITE_URL } from "@/lib/salonSeo";

/** Alias pod frazę GSC „strona internetowa dla gabinetu urody” — kanonicznie główny landing. */
const CANONICAL = `${SALON_SITE_URL}/strona-internetowa-dla-gabinetu-kosmetycznego`;

export const metadata: Metadata = {
  title: {
    absolute: "Strona internetowa dla gabinetu urody od 1500 zł | ODART",
  },
  description:
    "Strona WWW dla gabinetu urody i salonu kosmetycznego: mobile, SEO lokalne, cennik, rezerwacje. Od ok. 1500 zł — ODART. Tel. 695 432 415.",
  keywords: [
    "strona internetowa dla gabinetu urody",
    "strona dla gabinetu urody",
    "strona internetowa dla gabinetu kosmetycznego",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Strona internetowa dla gabinetu urody | ODART",
    description: "Strona WWW pod gabinet urody — SEO, mobile, rezerwacje. Wycena od 1500 zł.",
    url: CANONICAL,
    locale: "pl_PL",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function StronaDlaGabinetuUrodyPage() {
  return (
    <BeautySalonWebsiteLanding
      audiencePhrase="dla gabinetu urody"
      h1Suffix="dla gabinetu urody i salonu kosmetycznego"
    />
  );
}
