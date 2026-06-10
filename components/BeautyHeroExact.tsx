"use client";

import Link from "next/link";
import { Truck, RotateCcw, ShieldCheck, CalendarCheck } from "lucide-react";

// Images from public/
const IMG = {
  model: "/images/hero-model.svg",
  leaf: "/images/hero-leaf.svg",
  chip1: "/images/chip1.svg",
  chip2: "/images/chip2.svg",
  avatar: "/images/avatar.svg",
};

/**
 * Pixel-perfect Beauty Hero matching Figma (1440×650)
 * Desktop: 2-column layout. Mobile: stacked.
 */
export function BeautyHeroExact() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "650px",
        background: "linear-gradient(180deg, #F8CAD7 0%, #FFEBF1 50%, #F8CAD7 100%)",
      }}
      aria-labelledby="hero-heading"
    >
      <div
        className="relative mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12 px-6 lg:px-16 py-8 lg:py-12"
        style={{ maxWidth: "1440px", minHeight: "650px" }}
      >
        {/* Left: Text block */}
        <div
          className="order-2 lg:order-1 flex flex-col justify-center gap-6"
          style={{ maxWidth: "566px" }}
        >
          {/* Headline with inline image chips */}
          <h1
            id="hero-heading"
            className="font-display font-normal flex flex-wrap items-center gap-0.5 leading-[1.16] tracking-[0.005em] text-3xl sm:text-4xl lg:text-[62px] lg:leading-[72px]"
            style={{ color: "#191D2D" }}
          >
            <span
              className="inline-flex w-[52px] h-[42px] flex-shrink-0 rounded-full overflow-hidden border-2 border-beauty-pink-400 align-middle"
              style={{ verticalAlign: "middle" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.chip1} alt="" className="h-full w-full object-cover" />
            </span>
            <span>dkryj swój naturalny bla</span>
            <span
              className="inline-flex w-[52px] h-[42px] flex-shrink-0 rounded-full overflow-hidden border-2 border-beauty-pink-400 align-middle"
              style={{ verticalAlign: "middle" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.chip2} alt="" className="h-full w-full object-cover" />
            </span>
            <span>sk</span>
          </h1>

          {/* Description */}
          <p
            className="font-sans font-light text-base leading-[1.35] tracking-[0.015em]"
            style={{ color: "#191D2D", maxWidth: "502px" }}
          >
            Doświadcz transformacyjnej mocy profesjonalnych zabiegów kosmetycznych i
            odsłoń swój wyjątkowy blask już dziś.
          </p>

          {/* CTA: Rounded outline "Shop now" */}
          <Link
            href="https://salon.odart.pl/panel-umawiania/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-[44px] font-semibold text-[15px] leading-5 tracking-[0.005em] transition-opacity hover:opacity-90 w-[130px] h-11"
            style={{
              border: "1px solid #E42B5F",
              background: "transparent",
              color: "#191D2D",
            }}
          >
            Umów wizytę
            <CalendarCheck className="w-4 h-4" strokeWidth={2} />
          </Link>

          {/* 3 pill badges */}
          <div className="flex flex-row flex-wrap gap-3">
            {[
              {
                icon: Truck,
                title: "Darmowa konsultacja",
                subtitle: "Przed pierwszym zabiegiem",
              },
              {
                icon: RotateCcw,
                title: "Elastyczne terminy",
                subtitle: "Odwołanie do 24h",
              },
              {
                icon: ShieldCheck,
                title: "100% autentyczne",
                subtitle: "Najwyższa jakość",
              },
            ].map(({ icon: Icon, title, subtitle }) => (
              <div
                key={title}
                className="flex items-center gap-2 rounded-[50px] pl-2 pr-4 py-2"
                style={{
                  border: "1px solid #E42B5F",
                  background: "rgba(255,255,255,0.6)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    border: "1px solid #E42B5F",
                    background: "#FFF",
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: "#E42B5F" }} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span
                    className="font-sans font-normal"
                    style={{ color: "#191D2D", fontSize: "12px", lineHeight: "16px" }}
                  >
                    {title}
                  </span>
                  <span
                    className="font-sans font-normal"
                    style={{ color: "#4E515D", fontSize: "10px", lineHeight: "14px" }}
                  >
                    {subtitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Image block - min-w ensures it stays visible on desktop */}
        <div
          className="order-1 lg:order-2 relative shrink-0 w-full min-w-[280px] max-w-[620px] mx-auto lg:mx-0 aspect-[620/502] lg:min-w-[520px] lg:w-[620px] lg:h-[502px]"
        >
          {/* Soft rounded/arched background shape */}
          <div
            className="absolute inset-0 rounded-[24px] -z-10"
            style={{
              background: "linear-gradient(135deg, #FFEBF1 0%, #F8CAD7 100%)",
              transform: "scale(1.08)",
            }}
          />

          {/* Green leaf decoration - behind */}
          <div
            className="absolute -z-[1] opacity-90"
            style={{ left: "-40px", top: "80px", width: "180px", height: "260px" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG.leaf} alt="" className="h-full w-full object-contain" />
          </div>

          {/* Main model image */}
          <div
            className="absolute rounded-2xl overflow-hidden w-full h-full left-0 top-0"
            style={{ maxWidth: "519px", maxHeight: "502px" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMG.model}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>

          {/* Top-right: Floating card "Trending category" */}
          <div
            className="absolute rounded-[24px] p-5"
            style={{
              top: "16px",
              right: "16px",
              width: "302px",
              border: "1px solid #191D2D",
              background: "rgba(255,255,255,0.98)",
            }}
          >
            <p
              className="font-sans font-semibold text-base leading-[1.35] text-center mb-3"
              style={{ color: "#191D2D" }}
            >
              Popularne kategorie
            </p>
            <div className="flex flex-row gap-4 justify-center">
              <Link
                href="/zabiegi/twarz"
                className="flex flex-col items-center gap-1"
              >
                <div
                  className="w-[115px] h-[58px] rounded-[50px] overflow-hidden border flex flex-col items-center justify-center gap-1"
                  style={{ borderColor: "#E42B5F", background: "#FFF" }}
                >
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{ background: "rgba(241,149,174,0.4)" }}
                  />
                  <span
                    className="font-sans font-semibold"
                    style={{ color: "#191D2D", fontSize: "15px" }}
                  >
                    Twarz
                  </span>
                </div>
              </Link>
              <Link
                href="/zabiegi/cialo"
                className="flex flex-col items-center gap-1"
              >
                <div
                  className="w-[115px] h-[58px] rounded-[50px] overflow-hidden border flex flex-col items-center justify-center gap-1"
                  style={{ borderColor: "#E42B5F", background: "#FFF" }}
                >
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{ background: "rgba(241,149,174,0.4)" }}
                  />
                  <span
                    className="font-sans font-semibold"
                    style={{ color: "#191D2D", fontSize: "15px" }}
                  >
                    Ciało
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Bottom-right: Circular avatar badge */}
          <div
            className="absolute flex flex-col items-center gap-1"
            style={{ bottom: "16px", right: "16px", width: "116px" }}
          >
            <div
              className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 flex items-center justify-center"
              style={{ borderColor: "#191D2D" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.avatar} alt="" className="h-full w-full object-cover" />
            </div>
            <span
              className="font-sans font-semibold text-base leading-[1.35] text-center"
              style={{ color: "#191D2D" }}
            >
              Seraphina
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
