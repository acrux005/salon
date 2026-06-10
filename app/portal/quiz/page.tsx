import Link from "next/link";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";

const SITE_URL = "https://salon.odart.pl";

export const metadata = {
  title: "Quiz analizy skóry",
  description:
    "Rozpocznij analizę skóry i dobierz terapię — quiz na stronie głównej portalu. Dopasowanie zabiegów i gabinetów.",
  alternates: { canonical: `${SITE_URL}/portal/quiz` },
  openGraph: {
    title: "Quiz analizy skóry",
    description: "Rozpocznij analizę skóry i dobierz terapię — wygodny quiz w oknie.",
    url: `${SITE_URL}/portal/quiz`,
    type: "website",
    locale: "pl_PL",
  },
};

export default function PortalQuizPage() {
  return (
    <>
      <HeaderPortal />
      <main className="min-h-[60vh] px-4 py-16">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
            Analiza skóry — quiz w modalu
          </h1>
          <p className="mt-4 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
            Quiz uruchamiasz na stronie głównej portalu. Kliknij „Rozpocznij analizę” — otworzy się okno z kilkoma pytaniami, bez przeładowania strony.
          </p>
          <Link
            href="/portal"
            className="mt-8 inline-block rounded-full bg-pink-500 px-6 py-3 font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600"
          >
            Przejdź na stronę główną i rozpocznij
          </Link>
        </div>
      </main>
      <FooterPortal />
    </>
  );
}
