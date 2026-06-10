"use client";

import { RandkiRoom } from "@/components/randki/RandkiRoom";
import { DEMO_LANDING_ROOM } from "@/lib/randki/roomTypes";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function RandkiLandingPreview() {
  function resolveUrl(url: string | null) {
    if (!url) return "";
    return url.startsWith("http") ? url : `${BASE_PATH}${url}`;
  }

  return (
    <div className="randki-phone-mockup group mx-auto w-full max-w-[340px] lg:max-w-[300px]">
      <div className="randki-preview-ring pointer-events-none absolute -inset-3 hidden rounded-[44px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 lg:block" />

      <div className="randki-phone-frame">
        <div className="randki-phone-notch" aria-hidden>
          <span className="randki-phone-notch-pill" />
        </div>

        <div className="randki-phone-scroll">
          <RandkiRoom room={DEMO_LANDING_ROOM} mode="visit" resolveUrl={resolveUrl} compact photoRevealed={false} />
        </div>

        <div className="randki-phone-fade pointer-events-none" aria-hidden />
      </div>

      <p className="mt-3 text-center text-[11px] text-white/35 lg:mt-2 lg:text-[10px]">Zajrzyj · bez pełnego dostępu</p>
    </div>
  );
}
