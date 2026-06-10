"use client";

import { useId } from "react";

/**
 * Spirala — wężąca się linia przez środek sekcji (jak demo dev.rafalkowalkowski.pl).
 */
function buildSpiralPath(segments: number): string {
  const parts: string[] = ["M 50 0"];
  for (let i = 0; i < segments; i++) {
    const y0 = i * 50;
    const y1 = y0 + 25;
    const y2 = y0 + 50;
    const right = i % 2 === 0;
    const x1 = right ? 92 : 8;
    const x2 = right ? 8 : 92;
    parts.push(`C ${x1} ${y1} ${x2} ${y2} 50 ${y2}`);
  }
  return parts.join(" ");
}

type Props = {
  /**
   * `hero` — tylko pierwsza sekcja (strona główna).
   * `page` — jak demo dev: `fixed` + wysoki SVG przez cały scroll (strony-internetowe, opieka IT).
   */
  mode?: "hero" | "page";
  segments?: number;
  className?: string;
};

export function OdartSpiralLine({ mode = "hero", segments: segmentsProp, className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const gradId = `odart-spiral-grad-${uid}`;
  const segments = segmentsProp ?? (mode === "page" ? 40 : 28);

  const gradientStops =
    mode === "page" ? (
      <>
        <stop offset="0%" stopColor="rgba(217,91,58,0.1)" />
        <stop offset="20%" stopColor="rgba(255,255,255,0.15)" />
        <stop offset="50%" stopColor="rgba(217,91,58,0.7)" />
        <stop offset="80%" stopColor="rgba(255,255,255,0.15)" />
        <stop offset="100%" stopColor="rgba(217,91,58,0.1)" />
      </>
    ) : (
      <>
        <stop offset="0%" stopColor="rgba(217,91,58,0.12)" />
        <stop offset="20%" stopColor="rgba(255,255,255,0.12)" />
        <stop offset="50%" stopColor="rgba(217,91,58,0.55)" />
        <stop offset="80%" stopColor="rgba(255,255,255,0.12)" />
        <stop offset="100%" stopColor="rgba(217,91,58,0.12)" />
      </>
    );

  if (mode === "page") {
    return (
      <div
        className={`odart-spiral-line pointer-events-none fixed inset-0 z-[5] overflow-hidden ${className}`}
        aria-hidden
      >
        <svg
          viewBox="0 0 100 2000"
          preserveAspectRatio="xMidYMin slice"
          className="h-[400vh] w-full min-h-screen"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
              {gradientStops}
            </linearGradient>
          </defs>
          <path
            d={buildSpiralPath(segments)}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="odart-spiral-path"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`odart-spiral-line pointer-events-none absolute inset-0 z-[1] overflow-hidden ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 100 2000"
        preserveAspectRatio="xMidYMin slice"
        className="h-[min(140%,52rem)] w-full min-h-[22rem] sm:min-h-[26rem] lg:min-h-[32rem]"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            {gradientStops}
          </linearGradient>
        </defs>
        <path
          d={buildSpiralPath(segments)}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="odart-spiral-path"
        />
      </svg>
    </div>
  );
}
