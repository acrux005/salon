import HeroBeautyEditorial from "@/components/HeroBeautyEditorial";
import { Features } from "@/components/Features";
import { ProblemRozwiazanie } from "@/components/ProblemRozwiazanie";
import { FirstVisit } from "@/components/FirstVisit";
import { Metamorfozy } from "@/components/Metamorfozy";
import { DemoSprzedaz } from "@/components/DemoSprzedaz";
import { OMnie } from "@/components/OMnie";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { BeautySection } from "@/components/BeautySection";
import { StronaKosmetyczkiTreatments } from "./StronaKosmetyczkiTreatments";
import { Sparkles } from "lucide-react";

const categoryCards = [
  {
    title: "Twarz",
    description: "Pielęgnacja i zabiegi na twarz",
    href: "/strona-gabinetu/zabiegi",
    cta: "Zobacz zabiegi",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80",
  },
  {
    title: "Ciało",
    description: "Masaże i zabiegi na ciało",
    href: "/strona-gabinetu/zabiegi",
    cta: "Zobacz zabiegi",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
  },
  {
    title: "Dłonie i stopy",
    description: "Manicure, pedicure, pielęgnacja",
    href: "/strona-gabinetu/zabiegi",
    cta: "Zobacz zabiegi",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
  },
];

export function StronaKosmetyczkiContent() {
  return (
    <>
      <div
        className="relative border-b border-pink-200/40 bg-gradient-to-r from-pink-50/90 via-rose-50/80 to-pink-50/90 py-3"
        role="status"
        aria-label="Informacja o stronie demo"
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 text-center sm:flex-nowrap sm:gap-3">
          <Sparkles className="h-4 w-4 shrink-0 text-pink-500" aria-hidden />
          <p className="font-[var(--font-sans)] text-[13px] font-medium text-[#6F5E64] sm:text-[14px]">
            <span className="text-[#C86D84]">Strona demo</span>
            <span className="mx-1.5 hidden sm:inline">—</span>
            <span className="block sm:inline">
              może być dopasowana pod każdą branżę beauty
            </span>
          </p>
        </div>
      </div>
      <HeroBeautyEditorial />
      <StronaKosmetyczkiTreatments />
      <Features />
      <ProblemRozwiazanie />
      <FirstVisit />
      <Metamorfozy />
      <DemoSprzedaz />
      <OMnie />
      <FAQ />
      <BeautySection
        heading="Popularne kategorie"
        subheading="Wybierz kategorię zabiegów dopasowaną do Twoich potrzeb"
        cards={categoryCards}
        columns={3}
      />
      <FinalCTA />
    </>
  );
}
