const SITE_URL = "https://salon.odart.pl";

export const metadata = {
  title: "Analiza skóry – dobierz zabieg i gabinet",
  description:
    "Krótki quiz analizy skóry – dobierz zabieg do typu cery i problemu. Zobacz rekomendowane gabinety kosmetyczne w Kołobrzegu i okolicach.",
  alternates: { canonical: `${SITE_URL}/analiza-skory` },
  openGraph: {
    title: "Analiza skóry – dobierz zabieg i gabinet",
    description: "Quiz analizy skóry – dobierz zabieg i zobacz polecane gabinety.",
    url: `${SITE_URL}/analiza-skory`,
    type: "website",
    locale: "pl_PL",
  },
  robots: "index, follow",
};

export default function AnalizaSkoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
