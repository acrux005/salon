"use client";

import { useEffect, useRef, useState } from "react";
import { shouldDisableAuraMotion } from "@/lib/randki/clientDevice";
import {
  auraSilhouetteKind,
  getAuraKonturySet,
  getAuraKonturyUrl,
  hasAnyAuraPlaneImage,
  normalizeAuraPlaneImages,
  pickAuraBaseUrl,
  resolveAuraPlaneImages,
  usesAuraKonturyImage,
  AURA_RULES_HINT,
  type AuraPlaneImages,
} from "@/lib/randki/auraSilhouettes";

type Props = {
  /** Płaszczyzny 1–3: głowa, serce, korzenie */
  imageUrls?: AuraPlaneImages;
  /** @deprecated użyj imageUrls */
  imageUrl?: string;
  caption?: string | null;
  gender?: string | null;
  resolveUrl: (url: string | null) => string;
  compact?: boolean;
  hero?: boolean;
  showHint?: boolean;
  /** Wsteczna zgodność: jedno zdjęcie na wszystkie płaszczyzny */
  legacyFill?: boolean;
  /** Telefon: bez animacji i parallax */
  staticMode?: boolean;
};

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function RandkiAuraDisplayCss({
  imageUrls: imageUrlsProp,
  imageUrl,
  caption,
  gender,
  resolveUrl,
  compact,
  hero,
  showHint,
  legacyFill = true,
  staticMode: staticModeProp,
}: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState({ x: 0, y: 0 });
  const kind = auraSilhouetteKind(gender);
  const kontury = getAuraKonturySet(kind);
  const useKontury = usesAuraKonturyImage(kind);
  const rawUrls = imageUrlsProp ?? normalizeAuraPlaneImages(imageUrl);
  const planeUrls = legacyFill ? resolveAuraPlaneImages(rawUrls) : rawUrls;
  const isHero = hero && !compact;
  const staticMode = staticModeProp ?? shouldDisableAuraMotion();

  useEffect(() => {
    if (staticMode || !useKontury || !stageRef.current) return;
    const el = stageRef.current;

    const strength = isHero ? 10 : compact ? 4 : 6;

    function onMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const nx = (e.clientX - cx) / rect.width;
      const ny = (e.clientY - cy) / rect.height;
      setShift({ x: nx * strength, y: ny * (strength * 0.8) });
    }

    function onLeave() {
      setShift({ x: 0, y: 0 });
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [useKontury, isHero, compact, staticMode]);

  if (!hasAnyAuraPlaneImage(rawUrls)) return null;

  const stageStyle =
    staticMode
      ? undefined
      : useKontury && (shift.x || shift.y)
        ? { transform: `translate3d(${shift.x}px, ${shift.y}px, 0)` }
        : useKontury
          ? { transition: "transform 0.45s ease-out" }
          : isHero
            ? { transform: `translate3d(${shift.x}px, ${shift.y}px, 0)` }
            : undefined;

  const maskVar = `${BASE_PATH}${kontury.mask}`;
  const contourUrl = getAuraKonturyUrl(kind, BASE_PATH);

  const photoLayers = useKontury
    ? kontury.planes.flatMap((plane, idx) => {
        const src = planeUrls[idx];
        if (!src) return [];
        const maskSrc = `${BASE_PATH}${plane.maskPath}`;
        return [{ key: plane.id, src, maskSrc, planeId: plane.id, zIndex: idx + 1 }];
      })
    : [];

  return (
    <section
      className={`randki-room-zone randki-room-aura randki-room-aura--${kind}${compact ? " randki-room-aura--compact" : ""}${isHero ? " randki-room-aura--hero" : ""}${useKontury ? " randki-room-aura--kontury" : ""}${staticMode ? " randki-room-aura--static" : ""}`}
    >
      {!isHero && (
        <>
          <p className="randki-room-zone-label">✨ Aura</p>
          <p className="randki-room-zone-hint mb-2">Emocja, która świeci w pokoju.</p>
        </>
      )}

      <div ref={stageRef} className="randki-room-aura-stage" style={stageStyle}>
        <div className="randki-room-aura-glow" aria-hidden />

        {useKontury ? (
          <div
            className="randki-room-aura-composite"
            style={
              {
                aspectRatio: String(kontury.aspect),
                ["--aura-mask-full" as string]: `url(${maskVar})`,
              } as React.CSSProperties
            }
          >
            <div className="randki-room-aura-living">
              <div className="randki-room-aura-planes">
                <div className="randki-room-aura-fill" aria-hidden />
                {photoLayers.length === 0 && pickAuraBaseUrl(planeUrls) && (
                  <img
                    src={resolveUrl(pickAuraBaseUrl(planeUrls))}
                    alt=""
                    className="randki-room-aura-photo randki-room-aura-photo--single"
                    style={
                      {
                        zIndex: 1,
                        WebkitMaskImage: `url(${maskVar})`,
                        maskImage: `url(${maskVar})`,
                      } as React.CSSProperties
                    }
                  />
                )}
                {photoLayers.map((layer) => (
                  <img
                    key={layer.key}
                    src={resolveUrl(layer.src)}
                    alt=""
                    className={`randki-room-aura-photo randki-room-aura-photo--plane randki-room-aura-photo--${layer.planeId}`}
                    style={
                      {
                        zIndex: layer.zIndex + 1,
                        WebkitMaskImage: `url(${layer.maskSrc})`,
                        maskImage: `url(${layer.maskSrc})`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
              <div className="randki-room-aura-light-drift" aria-hidden />
              <div className="randki-room-aura-mist" aria-hidden />
            </div>
            <div className="randki-room-aura-contour-stack" aria-hidden>
              <div className="randki-room-aura-contour-ambient" />
              <img src={contourUrl} alt="" className="randki-room-aura-contour" />
            </div>
          </div>
        ) : null}

        {isHero && caption?.trim() && (
          <p className="randki-room-aura-caption-hero">&ldquo;{caption.trim()}&rdquo;</p>
        )}
      </div>

      {!isHero && caption?.trim() && (
        <p className="randki-room-aura-caption mt-3 text-center text-[13px] italic leading-relaxed text-violet-200/85">
          &ldquo;{caption.trim()}&rdquo;
        </p>
      )}
      {showHint && !isHero && <p className="randki-room-zone-hint mt-2 text-center">{AURA_RULES_HINT}</p>}
    </section>
  );
}
