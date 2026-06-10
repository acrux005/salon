"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { OdartRafalKowalkowskiAnimatedTitle } from "@/components/odart/OdartRafalKowalkowskiResumoClient";
import { OdartRafalKowalkowskiResumoMenu } from "@/components/odart/OdartRafalKowalkowskiResumoClient";

const MAIN_SCROLL_ID = "rafal-profile-main";

type Social = { href: string; label: string; key: "tiktok" | "facebook" | "instagram" | "youtube" | "spotify" };

type Props = {
  portraitSrc: string;
  social: Social[];
};

/** Skala portretu 1 → ~0.72 w miarę scrolla lewej kolumny (jak w szablonie Pixy). */
function usePortraitScrollScale() {
  const [scale, setScale] = useState(1);

  const update = useCallback(() => {
    const el = document.getElementById(MAIN_SCROLL_ID);
    if (!el) return;
    const y = el.scrollTop;
    const next = Math.max(0.72, Math.min(1, 1 - y / 720));
    setScale(next);
  }, []);

  useEffect(() => {
    const el = document.getElementById(MAIN_SCROLL_ID);
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  return scale;
}

function PixyPortraitFrame({ src, scale }: { src: string; scale: number }) {
  const Wrapper = "div" as const;
  return (
    <Wrapper
      className="relative mx-auto w-full max-w-[300px] origin-top will-change-transform"
      style={{
        transform: `scale(${scale})`,
        transition: "transform 0.12s ease-out",
      }}
    >
      <Wrapper
        className="pointer-events-none absolute -bottom-14 -right-6 left-4 top-8 border border-white/[0.1]"
        aria-hidden
      />
      <Wrapper
        className="pointer-events-none absolute -left-2 -right-4 bottom-0 top-2 border border-white/[0.16]"
        aria-hidden
      />

      <Wrapper className="relative border border-white/20 bg-[#121212]">
        <Wrapper
          className="pointer-events-none absolute -left-px -top-px z-10 h-14 w-14 border-l border-t border-white/30"
          aria-hidden
        />
        <Wrapper
          className="pointer-events-none absolute -bottom-px -right-px z-10 h-14 w-14 border-b border-r border-white/30"
          aria-hidden
        />

        <Wrapper className="relative mx-auto aspect-[3/4] w-[88%] max-w-[260px] overflow-hidden bg-neutral-900">
          <Image src={src} alt="Rafał Kowalkowski" fill className="object-cover" sizes="300px" priority />
        </Wrapper>

        <Wrapper className="border-t border-white/[0.08] px-5 pb-6 pt-5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-neutral-500">Cześć! Jestem</p>
          <p className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            <span className="text-odart-accent">[</span>
            <span className="mx-1">Rafał Kowalkowski</span>
            <span className="text-odart-accent">]</span>
          </p>
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
}

export function OdartRafalKowalkowskiProfileSidebar({ portraitSrc, social }: Props) {
  const scale = usePortraitScrollScale();

  return (
    <>
      <div className="pointer-events-none absolute right-8 top-8 z-10 lg:right-10 lg:top-10">
        <div className="pointer-events-auto">
          <OdartRafalKowalkowskiResumoMenu social={social} />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-between px-8 pb-10 pt-16 sm:px-10 lg:sticky lg:top-0 lg:max-h-[calc(100vh-7rem)] lg:px-10 lg:pb-12 lg:pt-20">
        <div>
          <PixyPortraitFrame src={portraitSrc} scale={scale} />
          <div className="mt-8 text-center lg:text-left">
            <OdartRafalKowalkowskiAnimatedTitle />
          </div>
        </div>

        <Link
          href="#contact"
          className="mt-10 flex items-center gap-4 rounded-full border border-white/10 bg-black/30 px-5 py-4 text-sm text-neutral-200 backdrop-blur transition hover:border-odart-accent/50 hover:text-white"
        >
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-odart-accent/40">
            <span className="absolute h-full w-full animate-ping rounded-full bg-odart-accent/20" aria-hidden />
            <span className="relative block h-2 w-2 rounded-full bg-odart-accent" />
          </span>
          <span className="text-left leading-snug">
            Dostępny na projekty freelance.
            <span className="mt-0.5 block font-semibold text-odart-accent underline decoration-odart-accent/40 underline-offset-2">
              Napisz — umówimy termin
            </span>
          </span>
        </Link>
      </div>
    </>
  );
}

export { MAIN_SCROLL_ID as RAFAL_PROFILE_MAIN_SCROLL_ID };
