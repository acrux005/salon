const SITE_URL = "https://salon.odart.pl";

export const metadata = {
  title: "Logowanie | Zabiegi Odart",
  description: "Zaloguj się do panelu gabinetu lub konta klienta – Zabiegi Odart.",
  alternates: { canonical: `${SITE_URL}/portal/login` },
  openGraph: {
    title: "Logowanie | Zabiegi Odart",
    description: "Zaloguj się do panelu – Zabiegi Odart.",
    url: `${SITE_URL}/portal/login`,
    type: "website",
    locale: "pl_PL",
  },
  robots: "noindex, follow",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
