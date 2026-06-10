"use client";

import Link from "next/link";
import { ShoppingBag, Truck, RotateCcw, ShieldCheck } from "lucide-react";

/**
 * Beauty Hero - dokładnie jak na screenie Figma
 * GlowGenics design z polską adaptacją
 */
export function BeautyHero() {
  return (
    <section
      className="relative w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[650px] overflow-hidden"
      style={{ background: "#F8CAD7" }}
    >
      {/* Dekoracyjne elementy - różowe gwiazdki */}
      <div className="absolute top-20 right-[15%] w-8 h-8 rounded-sm opacity-90 rotate-[22deg]" style={{ background: "#E42B5F" }} />
      <div className="absolute top-28 right-[20%] w-4 h-4 rounded-sm opacity-80" style={{ background: "#EB6187" }} />
      <div className="absolute bottom-40 left-[55%] w-8 h-8 rounded-sm opacity-90" style={{ background: "#E42B5F" }} />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
          {/* Lewa kolumna - Headline + CTA + Features */}
          <div className="flex flex-col gap-6 lg:gap-8 w-full max-w-[566px] order-2 lg:order-1">
            {/* Headline z okrągłymi akcentami w tekście */}
            <div className="flex flex-col gap-3">
              <h1
                className="font-display font-normal tracking-[0.005em] flex flex-wrap items-center gap-0.5"
                style={{ color: "#191D2D", fontSize: "clamp(2rem, 5vw, 62px)", lineHeight: "72px" }}
              >
                <span
                  className="inline-flex w-10 h-8 sm:w-12 sm:h-10 lg:w-[52px] lg:h-[42px] rounded-full overflow-hidden flex-shrink-0 border-2 align-middle"
                  style={{ borderColor: "#E42B5F", background: "#FFEBF1" }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-[#F195AE] to-[#E42B5F]/30" />
                </span>
                <span>dkryj swój naturalny bla</span>
                <span
                  className="inline-flex w-10 h-8 sm:w-12 sm:h-10 lg:w-[52px] lg:h-[42px] rounded-full overflow-hidden flex-shrink-0 border-2 align-middle"
                  style={{ borderColor: "#E42B5F", background: "#FFEBF1" }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-[#F195AE] to-[#E42B5F]/30" />
                </span>
                <span>sk</span>
              </h1>
              <p
                className="font-sans font-light text-base leading-[1.35] tracking-[0.015em] max-w-[502px]"
                style={{ color: "#191D2D" }}
              >
                Doświadcz transformacyjnej mocy profesjonalnych zabiegów
                kosmetycznych i odsłoń swój wyjątkowy blask już dziś.
              </p>
              {/* Button - Shop now style: jasne tło, różowa obwódka */}
              <a
                href="https://salon.odart.pl/panel-umawiania/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[44px] font-semibold text-[15px] tracking-[0.005em] transition-colors hover:opacity-90"
                style={{
                  background: "transparent",
                  border: "1px solid #E42B5F",
                  color: "#191D2D",
                }}
              >
                Umów wizytę
                <ShoppingBag className="w-4 h-4" />
              </a>
            </div>

            {/* Feature pills - light pink bg, dark border */}
            <div className="flex flex-row flex-wrap gap-3">
              {[
                { icon: Truck, title: "Darmowa konsultacja", subtitle: "Przed pierwszym zabiegiem" },
                { icon: RotateCcw, title: "Elastyczne terminy", subtitle: "Odwołanie do 24h" },
                { icon: ShieldCheck, title: "100% autentyczne", subtitle: "Najwyższa jakość" },
              ].map(({ icon: Icon, title, subtitle }) => (
                <div
                  key={title}
                  className="flex items-center gap-2 px-3 py-2 pl-2 pr-4 rounded-[50px]"
                  style={{
                    border: "1px solid #E42B5F",
                    background: "rgba(255,255,255,0.6)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ border: "1px solid #E42B5F", background: "#FFF" }}
                  >
                    <Icon className="w-6 h-6" style={{ color: "#E42B5F" }} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-sans font-normal text-xs leading-4" style={{ color: "#191D2D" }}>{title}</span>
                    <span className="font-sans font-normal text-[10px] leading-[14px]" style={{ color: "#4E515D" }}>{subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prawa kolumna - Obraz + Trending + Seraphina */}
          <div className="relative w-full max-w-[620px] order-1 lg:order-2">
            {/* Główny obraz */}
            <div
              className="relative w-full aspect-[519/502] max-h-[400px] sm:max-h-[502px] rounded-2xl overflow-hidden"
              style={{ background: "#FFEBF1" }}
            >
              {/* Placeholder - zdjęcie modelki */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-b from-[#FFEBF1] to-[#F8CAD7] flex items-center justify-center">
                  <div className="text-6xl opacity-30">💆</div>
                </div>
              </div>

              {/* Trending category - biała karta top right */}
              <div
                className="absolute top-4 right-4 w-[280px] sm:w-[302px] p-5 rounded-[24px] flex flex-col gap-3"
                style={{
                  border: "1px solid #191D2D",
                  background: "rgba(255,255,255,0.98)",
                }}
              >
                <p className="font-sans font-semibold text-base leading-[1.35] text-center" style={{ color: "#191D2D" }}>
                  Popularne kategorie
                </p>
                <div className="flex flex-row gap-4">
                  <Link href="/zabiegi/twarz" className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-[115px] h-[58px] rounded-[50px] overflow-hidden border flex flex-col items-center justify-center gap-1"
                      style={{ borderColor: "#E42B5F", background: "#FFF" }}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#F195AE]/40" />
                      <span className="font-sans font-semibold text-[15px]" style={{ color: "#191D2D" }}>Twarz</span>
                    </div>
                  </Link>
                  <Link href="/zabiegi/cialo" className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-[115px] h-[58px] rounded-[50px] overflow-hidden border flex flex-col items-center justify-center gap-1"
                      style={{ borderColor: "#E42B5F", background: "#FFF" }}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#F195AE]/40" />
                      <span className="font-sans font-semibold text-[15px]" style={{ color: "#191D2D" }}>Ciało</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Seraphina - profil bottom right */}
              <div
                className="absolute bottom-4 right-4 flex flex-col items-center gap-1"
                style={{ width: 116 }}
              >
                <div
                  className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 flex items-center justify-center"
                  style={{ borderColor: "#191D2D", background: "#F195AE" }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-[#EB6187] to-[#F195AE]" />
                </div>
                <span className="font-sans font-semibold text-base leading-[1.35] text-center" style={{ color: "#191D2D" }}>
                  Seraphina
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
