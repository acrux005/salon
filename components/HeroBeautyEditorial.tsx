"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const IMG = {
  model: "/womanbeautyy.jpg",
};

export default function HeroBeautyEditorial() {
  return (
    <section className="hero-grain relative overflow-hidden">
      {/* Delikatny gradient tła (róż/beż) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(165deg, #FBF5F6 0%, #F8EDEF 30%, #F5E6E9 60%, #F2E0E4 100%)",
        }}
      />

      {/* Studio spotlight – miękka lampa fotograficzna za modelką */}
      <div className="hero-light" aria-hidden />

      {/* Grain / texture overlay (fallback) */}
      <div className="grain-overlay pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-[1280px] px-6 py-20 lg:py-28 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-[55%_45%] lg:gap-20">
          {/* LEFT – typografia editorial */}
          <div className="order-2 lg:order-1">
            <h1
              className="font-[var(--font-serif)] text-[#1F1A1C] leading-[0.9] tracking-[-0.03em]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              <span className="block text-[40px] sm:text-5xl lg:text-[52px]">
                Odkryj swój
              </span>
              <span className="mt-1 block text-[48px] text-[#C86D84] sm:text-6xl lg:text-[64px] xl:text-7xl">
                naturalny blask
              </span>
            </h1>

            {/* Podnagłówek – emocja + decyzja w 5 sekund */}
            <p
              className="mt-6 max-w-[42ch] font-[var(--font-sans)] text-[16px] leading-[1.75] text-[#6F5E64]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Kosmetologia estetyczna dopasowana do Twojej skóry. Pierwsza wizyta
              zaczyna się od konsultacji, nie od zabiegu.
            </p>

            {/* CTA – PRIMARY, dominuje wizualnie */}
            <Link
              href="https://salon.odart.pl/panel-umawiania/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#e7a7b4] px-6 py-3.5 font-[var(--font-sans)] text-[14px] font-medium text-white shadow-lg shadow-pink-200/60 transition-colors hover:bg-[#de8fa0]"
            >
              Umów wizytę
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/30">
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </span>
            </Link>

            {/* Dowód – zdejmuje lęk przed kliknięciem */}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-[#6F5E64]" style={{ fontFamily: "var(--font-sans)" }}>
              <span className="flex items-center gap-2">
                <span className="text-pink-400">✓</span> konsultacja 15 min
              </span>
              <span className="flex items-center gap-2">
                <span className="text-pink-400">✓</span> kwalifikacja do zabiegu
              </span>
              <span className="flex items-center gap-2">
                <span className="text-pink-400">✓</span> bez zobowiązań
              </span>
            </div>
          </div>

          {/* RIGHT – photo frame editorial */}
          <div className="relative order-1 lg:order-2">
            {/* Papierowa karta pod spodem – magazine layout layering */}
            <div
              className="absolute inset-0 z-0 translate-x-3 translate-y-3 rounded-[28px] shadow-[0_30px_70px_rgba(0,0,0,0.08)]"
              style={{
                background:
                  "linear-gradient(145deg, #FAF2F4 0%, #F8EEF0 100%)",
              }}
            />

            {/* Główna karta */}
            <div className="relative z-10 overflow-hidden rounded-[28px] border border-[#EDE0E4] bg-[#FCF8F9] p-6 shadow-[0_40px_90px_rgba(0,0,0,0.12)] lg:p-8">
              {/* Image container – card is a sibling, overflow-visible dla hover scale */}
              <div className="relative overflow-visible">
                {/* Hero image – clean img tag for SEO + mikro-gradient separacja planów */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-[#F5EAED] after:absolute after:inset-0 after:rounded-[20px] after:bg-gradient-to-t after:from-white/40 after:to-transparent after:content-[''] after:pointer-events-none">
                  <img
                    src={IMG.model}
                    alt="Zabiegi kosmetologii estetycznej - gabinet Odart"
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                {/* Box zabiegów – zawsze pod zdjęciem (nie zasłania twarzy) */}
                <div
                  className="mt-4 rounded-[20px] border border-white/60 bg-white/80 px-4 py-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all duration-200 hover:scale-[1.02] hover:border-pink-400 hover:bg-pink-50"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <p className="mb-2.5 font-medium text-[13px] text-[#1F1A1C]">
                    Najczęściej wybierane zabiegi
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/zabiegi/twarz?problem=cera-problematyczna"
                      className="rounded-full border border-pink-300 px-4 py-2 text-[13px] font-medium text-[#1F1A1C] transition-all duration-200 hover:border-pink-400 hover:bg-pink-50"
                    >
                      Cera problematyczna
                    </Link>
                    <Link
                      href="/zabiegi/twarz?problem=anti-aging"
                      className="rounded-full border border-pink-300 px-4 py-2 text-[13px] font-medium text-[#1F1A1C] transition-all duration-200 hover:border-pink-400 hover:bg-pink-50"
                    >
                      Anti-aging
                    </Link>
                    <Link
                      href="/zabiegi/twarz?problem=usta"
                      className="rounded-full border border-pink-300 px-4 py-2 text-[13px] font-medium text-[#1F1A1C] transition-all duration-200 hover:border-pink-400 hover:bg-pink-50"
                    >
                      Modelowanie ust
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
