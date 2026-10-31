import type { Metadata } from "next";
import { GabShowcaseLanding } from "@/components/gabinet/GabShowcaseLanding";
import { ADENT_KOLOBRZEG } from "@/lib/gabinet/showcaseLandings";

const landing = ADENT_KOLOBRZEG;
const title = `${landing.doctorTitle} ${landing.doctorName} — ${landing.clinicName}`;
const description = `${landing.specialty} w ${landing.city}. ${landing.address}. ${landing.reviewCount} opinii. Umów wizytę telefonicznie: ${landing.phoneDisplay}.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `https://dentysta.odart.pl/${landing.slug}` },
  openGraph: {
    title,
    description,
    url: `https://dentysta.odart.pl/${landing.slug}`,
    locale: "pl_PL",
    type: "website",
  },
};

export default function AdentKolobrzegPage() {
  return <GabShowcaseLanding landing={landing} />;
}
