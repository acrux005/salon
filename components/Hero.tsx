import Link from "next/link";
import { ShoppingBag, Truck, RotateCcw, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[650px] flex items-center overflow-hidden bg-beauty-hero">
      <div className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16">
          {/* Left: Headline + CTA */}
          <div className="flex flex-col gap-6 lg:gap-8 max-w-[567px]">
            <div className="flex flex-col gap-5">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[62px] leading-[72px] text-beauty-charcoal tracking-[0.005em]">
                Odkryj swój naturalny blask
              </h1>
              <p className="font-sans font-light text-base leading-[1.35] tracking-[0.015em] text-beauty-charcoal max-w-[502px]">
                Doświadcz transformacyjnej mocy profesjonalnych zabiegów
                kosmetycznych i odsłoń swój wyjątkowy blask już dziś.
              </p>
              <a
                href="https://salon.odart.pl/panel-umawiania/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1 px-5 py-3 w-[130px] h-11 border border-beauty-charcoal rounded-[44px] text-beauty-charcoal font-semibold text-[15px] leading-5 tracking-[0.005em] hover:bg-beauty-charcoal hover:text-white transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Umów wizytę
              </a>
            </div>

            {/* Features - pill cards (Figma Frame 38) */}
            <div className="flex flex-row flex-wrap gap-3">
              <div className="flex items-center gap-2 px-2 py-2 pl-2 pr-3 rounded-[50px] border border-beauty-charcoal">
                <div className="w-12 h-12 rounded-full border border-beauty-pink-300 flex items-center justify-center p-1">
                  <div className="w-10 h-10 rounded-full bg-beauty-pink-300 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-beauty-charcoal" />
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs leading-4 tracking-[0.005em] text-beauty-charcoal font-normal">
                    Darmowa konsultacja
                  </span>
                  <span className="text-[10px] leading-[14px] tracking-[0.005em] text-beauty-charcoal-muted">
                    Przed pierwszym zabiegiem
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-2 py-2 pl-2 pr-3 rounded-[50px] border border-beauty-charcoal">
                <div className="w-12 h-12 rounded-full border border-beauty-pink-300 flex items-center justify-center p-1">
                  <div className="w-10 h-10 rounded-full bg-beauty-pink-300 flex items-center justify-center">
                    <RotateCcw className="w-6 h-6 text-beauty-charcoal" />
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs leading-4 tracking-[0.005em] text-beauty-charcoal font-normal">
                    Elastyczne terminy
                  </span>
                  <span className="text-[10px] leading-[14px] tracking-[0.005em] text-beauty-charcoal-muted">
                    Odwołanie do 24h
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-2 py-2 pl-2 pr-3 rounded-[50px] border border-beauty-charcoal">
                <div className="w-12 h-12 rounded-full border border-beauty-pink-300 flex items-center justify-center p-1">
                  <div className="w-10 h-10 rounded-full bg-beauty-pink-300 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-beauty-charcoal" />
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs leading-4 tracking-[0.005em] text-beauty-charcoal font-normal">
                    100% autentyczne
                  </span>
                  <span className="text-[10px] leading-[14px] tracking-[0.005em] text-beauty-charcoal-muted">
                    Najwyższa jakość
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Image area + Trending category */}
          <div className="relative flex-1 max-w-[620px] w-full">
            {/* Main image area - Rectangle 1 + placeholder */}
            <div className="relative w-full aspect-[519/502] max-h-[502px] rounded-2xl overflow-hidden bg-beauty-hero-light">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-beauty-pink-300/40 border-2 border-beauty-pink-400 flex items-center justify-center">
                    <span className="text-5xl">✨</span>
                  </div>
                  <p className="text-beauty-charcoal/70 text-sm">
                    Zdjęcie gabinetu
                  </p>
                </div>
              </div>
            </div>

            {/* Trending category - Frame 22 */}
            <div className="absolute top-4 right-0 lg:right-4 w-[302px] p-5 gap-3 flex flex-col border border-beauty-charcoal rounded-[24px] bg-white/95">
              <p className="font-semibold text-base leading-[1.35] tracking-[0.015em] text-beauty-charcoal text-center">
                Popularne kategorie
              </p>
              <div className="flex flex-row gap-4">
                <Link
                  href="/zabiegi/twarz"
                  className="flex flex-col items-center gap-2 flex-1"
                >
                  <div className="w-[115px] h-[50px] rounded-[50px] border border-beauty-pink-400 overflow-hidden bg-beauty-pink-200/50" />
                  <span className="text-[15px] font-semibold leading-5 tracking-[0.005em] text-beauty-charcoal">
                    Twarz
                  </span>
                </Link>
                <Link
                  href="/zabiegi/cialo"
                  className="flex flex-col items-center gap-2 flex-1"
                >
                  <div className="w-[115px] h-[50px] rounded-[50px] border border-beauty-pink-400 overflow-hidden bg-beauty-pink-200/50" />
                  <span className="text-[15px] font-semibold leading-5 tracking-[0.005em] text-beauty-charcoal">
                    Ciało
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
