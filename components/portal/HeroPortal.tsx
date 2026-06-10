"use client";

import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { usePortalQuiz } from "./PortalQuizContext";
import { PORTAL_LOCALE } from "@/content/portalLocale";

/** Zdjęcie z /public (np. /zabiegihero.jpg) albo pełny URL. */
const HERO_SRC =
  process.env.NEXT_PUBLIC_PORTAL_HERO_IMAGE?.trim() || "/zabiegihero.jpg";

const TRUST = [
  "Rekomendacje w oparciu o praktykę gabinetów",
  "1–3 dopasowane propozycje, bez spamu",
  `Działamy w ${PORTAL_LOCALE.regionIn}`,
];

export function HeroPortal() {
  const { openModal } = usePortalQuiz();

  return (
    <section
      id="rozpocznij"
      className="border-b border-neutral-200/40 py-20 lg:py-28"
      style={{ background: "linear-gradient(to bottom, #ffffff 0%, #fef9fb 50%, #fafafa 100%)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <h1 className="font-[var(--font-serif)] text-3xl font-normal leading-tight text-[#1F1A1C] sm:text-4xl lg:text-[2.75rem]">
              Dobierz idealny zabieg lub gabinet w {PORTAL_LOCALE.regionIn} — w 2 minuty.
            </h1>
            <p className="mt-5 max-w-lg font-[var(--font-sans)] text-[16px] leading-relaxed text-[#6F5E64]">
              Odpowiedz na kilka pytań albo przeglądaj usługi. Paznokcie, brwi, masaże, twarz i więcej — sprawdzone miejsca w {PORTAL_LOCALE.regionLong}.
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={openModal}
                className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-6 py-3.5 font-[var(--font-sans)] text-[15px] font-medium text-white shadow-md transition-all hover:bg-pink-600"
              >
                Analiza skóry
              </button>
              <Link
                href="/portal/gabinety"
                className="inline-flex items-center rounded-full border border-neutral-300 px-5 py-3 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C] transition-colors hover:border-pink-300 hover:bg-pink-50/50"
              >
                Wybierz gabinet
              </Link>
            </div>
            <ul className="mt-8 flex flex-col gap-2">
              {TRUST.map((text) => (
                <li key={text} className="flex items-center gap-2 font-[var(--font-sans)] text-[13px] text-neutral-500">
                  <Check className="h-4 w-4 shrink-0 text-pink-400" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-lg lg:max-w-none">
              <Image
                src={HERO_SRC}
                alt={`Zabiegi — dobierz idealny zabieg lub gabinet w ${PORTAL_LOCALE.regionIn}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
