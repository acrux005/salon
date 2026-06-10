"use client";

import Link from "next/link";
import { CalendarCheck } from "lucide-react";

const IMG = {
  model: "/images/hero-model.svg",
  avatar: "/images/avatar.svg",
};

export default function HeroBeauty() {
  return (
    <section className="bg-[#F6E7EB]">
      <div className="mx-auto max-w-[1240px] px-6 pt-16 pb-14">
        <div className="grid items-center gap-10 lg:grid-cols-[520px_1fr]">
          {/* LEFT */}
          <div>
            {/* small icon */}
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#E7A9B6] bg-[#F8D9E0]">
              <span className="h-3 w-3 rounded-full bg-[#D86786]" />
            </div>

            {/* TITLE – editorial beauty: ciasny leading, negatywny tracking */}
            <h1
              className={[
                "font-[var(--font-serif)] text-[#1E1E1E]",
                "text-[56px] md:text-[68px] leading-[0.95] tracking-[-0.03em]",
              ].join(" ")}
            >
              Odkryj swój <br />
              <span className="text-[#D86786]">naturalny blask</span>
            </h1>

            {/* SUBTITLE – luksusowa kosmetologia, nie blog post */}
            <p className="mt-6 max-w-[420px] font-[var(--font-sans)] text-[15px] leading-[1.7] text-[#7A6A70]">
              Doświadcz transformacyjnej mocy profesjonalnych zabiegów
              kosmetycznych i odsłoń swój wyjątkowy blask już dziś.
            </p>

            {/* CTA – capsule, delikatna obwódka, mniejszy padding */}
            <Link
              href="https://salon.odart.pl/panel-umawiania/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#E5B1BE] bg-[#F6E7EB] px-5 py-[10px] font-[var(--font-sans)] text-[14px] font-medium text-[#2A2A2A] transition-colors hover:bg-[#F3DDE3]"
            >
              Umów wizytę
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
                <CalendarCheck className="h-3.5 w-3.5 text-[#D86786]" aria-hidden />
              </span>
            </Link>

            {/* BENEFITS – mniejsze karty, mniejsza density */}
            <div className="mt-8 grid max-w-[520px] grid-cols-1 gap-3 sm:grid-cols-2">
              <Benefit
                title="Darmowa konsultacja"
                desc="Przed pierwszym zabiegiem"
              />
              <Benefit
                title="Elastyczne terminy"
                desc="Odwołanie do 24h"
              />
              <div className="sm:col-span-2">
                <Benefit
                  title="100% autentyczne"
                  desc="Najwyższa jakość"
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            {/* big card – prawie niewidoczna, luksusowa subtelność */}
            <div className="relative mx-auto max-w-[640px] rounded-[28px] border border-[#F0D8DF] bg-[#F2E4E8] p-8 shadow-none">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[22px] bg-[#F4D9E0]">
                <img
                  src={IMG.model}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              {/* category widget */}
              <div className="absolute right-6 top-6 w-[280px] rounded-[18px] border border-[#E7A9B6] bg-white/70 p-4 backdrop-blur">
                <div className="mb-3 font-[var(--font-sans)] text-[13px] font-semibold text-[#2A2A2A]">
                  Popularne kategorie
                </div>
                <div className="flex gap-3">
                  <Link href="/zabiegi/twarz">
                    <Chip>Twarz</Chip>
                  </Link>
                  <Link href="/zabiegi/cialo">
                    <Chip>Ciało</Chip>
                  </Link>
                </div>
              </div>

              {/* avatar */}
              <div className="absolute -right-2 -bottom-6 flex flex-col items-center">
                <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-[#1F1F1F] shadow-[0_12px_25px_rgba(216,103,134,0.35)]">
                  <img
                    src={IMG.avatar}
                    alt="Seraphina"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-2 font-[var(--font-sans)] text-[12px] font-semibold text-[#2A2A2A]">
                  Seraphina
                </div>
              </div>
            </div>

            {/* subtle decorative blob */}
            <div className="pointer-events-none absolute -left-10 -bottom-10 h-56 w-56 rounded-full bg-white/25 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Benefit({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-[#E5B1BE] bg-[#F7E9ED] px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5B1BE] bg-[#F8D9E0]">
        <span className="h-4 w-4 rounded-full border border-[#D86786]" />
      </div>
      <div>
        <div className="font-[var(--font-sans)] text-[13px] font-semibold text-[#2A2A2A]">
          {title}
        </div>
        <div className="font-[var(--font-sans)] text-[12px] text-[#8A7A80]">
          {desc}
        </div>
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-[#E7A9B6] bg-[#F9EEF1] px-4 py-2 transition-colors hover:bg-[#F8D9E0]">
      <span className="h-4 w-4 shrink-0 rounded-full bg-[#F1C7D1]" />
      <span className="font-[var(--font-sans)] text-[13px] font-semibold text-[#2A2A2A]">
        {children}
      </span>
    </div>
  );
}
