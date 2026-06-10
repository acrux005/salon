const SITE_URL = "https://salon.odart.pl";

export const metadata = {
  title: "Logowanie panelu | Zabiegi Odart",
  description: "Logowanie do panelu – Zabiegi Odart.",
  alternates: { canonical: `${SITE_URL}/panel/logowanie` },
  robots: { index: false, follow: true },
};

export default function PanelLogowanieLayout({ children }: { children: React.ReactNode }) {
  return children;
}
