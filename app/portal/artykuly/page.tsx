import Link from "next/link";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";

const SITE_URL = "https://salon.odart.pl";

export const metadata = {
  title: "Poradnik zabiegów i pielęgnacji",
  description:
    "Wiedza o zabiegach twarzy, ciała, paznokci i pielęgnacji — bez marketingowych obietnic. Artykuły eksperckie.",
  alternates: { canonical: `${SITE_URL}/portal/artykuly` },
  openGraph: {
    title: "Poradnik zabiegów i pielęgnacji",
    description: "Wiedza o zabiegach twarzy, ciała, paznokci i pielęgnacji — bez marketingowych obietnic.",
    url: `${SITE_URL}/portal/artykuly`,
    type: "website",
    locale: "pl_PL",
  },
};

const ARTICLES = [
  { slug: "przygotowanie-skory", title: "Jak przygotować skórę do zabiegu?" },
  { slug: "tradzik-doroslych", title: "Trądzik dorosłych: co działa, a co szkodzi?" },
  { slug: "przebarwienia-plan", title: "Przebarwienia: plan terapii na 6 tygodni" },
  { slug: "anti-aging-dom", title: "Pielęgnacja anti-aging w domu" },
  { slug: "naczynka-cera", title: "Cera naczynkowa — czego unikać?" },
  { slug: "manicure-wybor", title: "Jak wybrać manicure, który naprawdę się trzyma?" },
  { slug: "masaz-relaksacyjny-sportowy", title: "Masaż relaksacyjny czy sportowy — co wybrać?" },
];

export default function ArtykulyPage() {
  return (
    <>
      <HeaderPortal />
      <main className="min-h-[60vh] px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
            Poradnik zabiegów i pielęgnacji
          </h1>
          <p className="mt-4 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
            Wiedza o twarzy, ciele, paznokciach i zabiegach — w stylu premium.
          </p>
          <ul className="mt-10 space-y-4">
            {ARTICLES.map(({ slug, title }) => (
              <li key={slug}>
                <Link
                  href={`/portal/artykuly/${slug}`}
                  className="block rounded-xl border border-neutral-200 bg-white p-5 font-[var(--font-sans)] text-[16px] font-medium text-[#1F1A1C] transition-all hover:border-pink-200 hover:shadow-md"
                >
                  {title}
                  <span className="ml-2 text-pink-600">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <FooterPortal />
    </>
  );
}
