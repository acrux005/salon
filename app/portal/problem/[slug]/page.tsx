import Link from "next/link";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { notFound } from "next/navigation";

const PROBLEMS: Record<string, { title: string; intro: string }> = {
  tradzik: {
    title: "Trądzik dorosłych",
    intro: "Trądzik u osób dorosłych wymaga delikatnego, ale konsekwentnego podejścia. Dobierzemy terapię i gabinety specjalizujące się w tym obszarze.",
  },
  przebarwienia: {
    title: "Przebarwienia",
    intro: "Przebarwienia i nierówny koloryt skóry — sprawdź dopasowane zabiegi i gabinety z doświadczeniem w terapii przebarwień.",
  },
  "anti-aging": {
    title: "Anti-aging 30+",
    intro: "Zabiegi przeciwstarzeniowe dopasowane do wieku i potrzeb skóry. Znajdź gabinet, który specjalizuje się w terapiach anti-aging.",
  },
  anti_aging: {
    title: "Anti-aging 30+",
    intro: "Zabiegi przeciwstarzeniowe dopasowane do wieku i potrzeb skóry. Znajdź gabinet, który specjalizuje się w terapiach anti-aging.",
  },
  naczynka: {
    title: "Rumień i naczynka",
    intro: "Cera naczynkowa i rumień — rekomendacje zabiegów i gabinetów z delikatnymi, naczyniowymi protokołami.",
  },
  pory: {
    title: "Rozszerzone pory",
    intro: "Oczyszczanie i regulacja — dobierz terapię na rozszerzone pory i znajdź gabinet z odpowiednim sprzętem i doświadczeniem.",
  },
  blizny: {
    title: "Blizny potrądzikowe",
    intro: "Blizny i przebarwienia pozapalne — plan terapii i rekomendowane gabinety (mikronakłuwanie, laser, pielęgnacja).",
  },
  "brwi-rzesy": {
    title: "Brwi i rzęsy",
    intro: "Laminacja, regulacja, przedłużanie — znajdź gabinet oferujący zabiegi brwi i rzęs w Twojej okolicy.",
  },
  brwi_rzesy: {
    title: "Brwi i rzęsy",
    intro: "Laminacja, regulacja, przedłużanie — znajdź gabinet oferujący zabiegi brwi i rzęs w Twojej okolicy.",
  },
  stopy: {
    title: "Stopy",
    intro: "Pedicure, pielęgnacja stóp, zabiegi podologiczne — znajdź gabinet oferujący profesjonalną pielęgnację stóp.",
  },
  masaze: {
    title: "Masaże",
    intro: "Masaż relaksacyjny, sportowy, limfatyczny — znajdź gabinet z masażami dopasowanymi do Twoich potrzeb.",
  },
};

type Props = { params: Promise<{ slug: string }> };

const SITE_URL = "https://salon.odart.pl";

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const problem = PROBLEMS[slug];
  if (!problem) return { title: "Problem" };
  const title = problem.title;
  const canonical = `${SITE_URL}/portal/problem/${slug}`;
  return {
    title,
    description: problem.intro,
    alternates: { canonical },
    openGraph: {
      title,
      description: problem.intro,
      url: canonical,
      type: "website",
      locale: "pl_PL",
    },
  };
}

export default async function ProblemPage({ params }: Props) {
  const { slug } = await params;
  const problem = PROBLEMS[slug];
  if (!problem) notFound();

  const quizUrl = `/portal?problem=${slug}`;

  return (
    <>
      <HeaderPortal />
      <main className="min-h-[60vh] px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
            {problem.title}
          </h1>
          <p className="mt-5 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
            {problem.intro}
          </p>
          <p className="mt-8 font-[var(--font-sans)] text-[15px] text-[#1F1A1C]">
            Rozpocznij krótką analizę — dobierzemy terapię i sprawdzone gabinety.
          </p>
          <Link
            href={quizUrl}
            className="mt-6 inline-block rounded-full bg-pink-500 px-6 py-3 font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600"
          >
            Rozpocznij analizę (z tym problemem)
          </Link>
          <p className="mt-6">
            <Link href="/portal" className="font-[var(--font-sans)] text-[14px] text-pink-600 hover:underline">
              ← Wróć na stronę główną
            </Link>
          </p>
        </div>
      </main>
      <FooterPortal />
    </>
  );
}
