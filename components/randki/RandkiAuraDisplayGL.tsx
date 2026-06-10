"use client";

import { useEffect, useRef, useState } from "react";
import {
  auraSilhouetteKind,
  auraPlanesAreDistinct,
  getAuraKonturySet,
  getAuraKonturyUrl,
  hasAnyAuraPlaneImage,
  normalizeAuraPlaneImages,
  pickAuraBaseUrl,
  resolveAuraPlaneImages,
  usesAuraKonturyImage,
  AURA_RULES_HINT,
  type AuraPlaneId,
  type AuraPlaneImages,
} from "@/lib/randki/auraSilhouettes";
import { isMobileLikeDevice } from "@/lib/randki/clientDevice";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Props = {
  imageUrls?: AuraPlaneImages;
  imageUrl?: string;
  caption?: string | null;
  gender?: string | null;
  resolveUrl: (url: string | null) => string;
  compact?: boolean;
  hero?: boolean;
  showHint?: boolean;
  legacyFill?: boolean;
  /** Jedna klatka — telefon bez animacji ticker */
  freezeAnimation?: boolean;
  /** Korzenie jako zdjęcie w masce (mobile), nie tylko pył */
  rootsAsPhoto?: boolean;
  particleBudget?: number;
};

const PLANE_Y_RATIO: Record<AuraPlaneId, number> = {
  head: 0.18,
  heart: 0.5,
  roots: 0.82,
};

const NAT_W = 660;
const NAT_H = 1009;

function loadHTMLImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = (e) => rej(e);
    img.src = src;
  });
}

function coverFit(natW: number, natH: number, targetW: number, targetH: number, objYRatio = 0.5) {
  const ar = natW / natH;
  const tr = targetW / targetH;
  if (ar >= tr) {
    const drawH = targetH;
    const drawW = targetH * ar;
    return { drawW, drawH, drawX: (targetW - drawW) / 2, drawY: 0 };
  }
  const drawW = targetW;
  const drawH = targetW / ar;
  return { drawW, drawH, drawX: 0, drawY: -(drawH - targetH) * objYRatio };
}

function makeParticleTexture(PIXI: any, size = 64) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) return PIXI.Texture.WHITE;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return PIXI.Texture.from(c);
}

function makeContourGlowTexture(PIXI: any, contourImg: HTMLImageElement) {
  const W = contourImg.naturalWidth || NAT_W;
  const H = contourImg.naturalHeight || NAT_H;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) return PIXI.Texture.from(contourImg);
  ctx.drawImage(contourImg, 0, 0, W, H);
  return PIXI.Texture.from(c);
}

type RGB = { r: number; g: number; b: number };
type SampledPoint = RGB & {
  x: number;
  y: number;
  planeId: AuraPlaneId | "single";
};

const PLANE_BAND: Record<AuraPlaneId, [number, number]> = {
  head: [0, 0.38],
  heart: [0.32, 0.7],
  roots: [0.62, 1.0],
};

/** Multiply RGB by `mul`, preserving hue and saturation. Clamps softly. */
function scaleColor(r: number, g: number, b: number, mul: number): RGB {
  const max = Math.max(r, g, b);
  const target = Math.min(255, max * mul);
  const k = max > 0 ? target / max : 0;
  return {
    r: Math.min(255, Math.round(r * k)),
    g: Math.min(255, Math.round(g * k)),
    b: Math.min(255, Math.round(b * k)),
  };
}

function buildPalette(img: HTMLImageElement, targetCount = 40): RGB[] {
  const W = 200;
  const H = Math.max(80, Math.round((img.naturalHeight / img.naturalWidth) * W));
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) return [{ r: 220, g: 180, b: 220 }];
  ctx.drawImage(img, 0, 0, W, H);
  const data = ctx.getImageData(0, 0, W, H).data;

  const pool: { r: number; g: number; b: number; score: number }[] = [];
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 200) continue;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lightness = (max + min) / 2;
    if (lightness < 18) continue;
    const sat = max === 0 ? 0 : (max - min) / max;
    // Prefer pixels that have CHROMA — saturation matters more than brightness
    const score = sat * 3.0 + Math.min(1, lightness / 220) * 0.5;
    pool.push({ r, g, b, score });
  }
  if (!pool.length) return [{ r: 220, g: 180, b: 220 }];
  pool.sort((a, b) => b.score - a.score);
  // Take a wider but still chromatic slice
  const slice = pool.slice(0, Math.min(targetCount * 8, pool.length));
  const out: RGB[] = [];
  for (let k = 0; k < Math.min(targetCount, slice.length); k++) {
    const idx = Math.floor(Math.random() * slice.length);
    const c0 = slice[idx];
    const maxC = Math.max(c0.r, c0.g, c0.b);
    // Lift each color to a target luminance band WITHOUT washing out hue
    const target = maxC < 60 ? 200 : maxC < 110 ? 220 : maxC < 170 ? 235 : 240;
    const mul = target / Math.max(1, maxC);
    out.push(scaleColor(c0.r, c0.g, c0.b, mul));
  }
  return out;
}

function pickFromPalette(pal: RGB[]): RGB {
  if (!pal.length) return { r: 220, g: 200, b: 240 };
  return pal[Math.floor(Math.random() * pal.length)];
}

function planeIdForY(y: number, distinct: boolean): AuraPlaneId | "single" {
  if (!distinct) return "single";
  const rel = y / NAT_H;
  if (rel < 0.4) return "head";
  if (rel < 0.7) return "heart";
  return "roots";
}

type ExcludeBand = { top: number; bottom: number; feather: number };

/**
 * Sample particle positions in the silhouette mask, skipping any vertical bands
 * already covered by sharp photo planes. Particles feather at band edges to
 * blend smoothly with photo zones.
 */
function samplePointsFromMask(
  maskImg: HTMLImageElement,
  palettes: Partial<Record<AuraPlaneId | "single", RGB[]>>,
  distinctPlanes: boolean,
  count: number,
  excludeBands: ExcludeBand[]
): SampledPoint[] {
  const mc = document.createElement("canvas");
  mc.width = NAT_W;
  mc.height = NAT_H;
  const mctx = mc.getContext("2d");
  if (!mctx) return [];
  mctx.drawImage(maskImg, 0, 0, NAT_W, NAT_H);
  const maskData = mctx.getImageData(0, 0, NAT_W, NAT_H).data;

  const result: SampledPoint[] = [];
  let tries = 0;
  const maxTries = count * 30;
  outer: while (result.length < count && tries < maxTries) {
    tries++;
    const x = Math.floor(Math.random() * NAT_W);
    const y = Math.floor(Math.random() * NAT_H);
    const idx = (y * NAT_W + x) * 4;
    const maskA = maskData[idx + 3];
    if (maskA < 60) continue;
    if (Math.random() * 255 > maskA) continue;

    const rel = y / NAT_H;

    let edgeFadeChance = 1;
    for (const band of excludeBands) {
      const { top, bottom, feather } = band;
      if (rel >= top && rel <= bottom) continue outer;
      if (rel > top - feather && rel < top) {
        const p = (top - rel) / feather;
        edgeFadeChance = Math.min(edgeFadeChance, p);
      } else if (rel > bottom && rel < bottom + feather) {
        const p = (rel - bottom) / feather;
        edgeFadeChance = Math.min(edgeFadeChance, p);
      }
    }
    if (edgeFadeChance < 1 && Math.random() > edgeFadeChance) continue;

    const planeId = planeIdForY(y, distinctPlanes);
    let palette = palettes[planeId] || palettes.single || [];

    // Soft cross-fade near boundaries between head and roots palettes
    if (distinctPlanes) {
      if (planeId === "head" && rel > 0.32) {
        if (Math.random() < (rel - 0.32) / 0.1) palette = palettes.heart || palette;
      } else if (planeId === "roots" && rel < 0.72) {
        if (Math.random() < (0.72 - rel) / 0.1) palette = palettes.heart || palette;
      }
    }

    const c = pickFromPalette(palette);
    result.push({ x, y, r: c.r, g: c.g, b: c.b, planeId });
  }
  return result;
}

export default function RandkiAuraDisplayGL(props: Props) {
  const {
    imageUrls: imageUrlsProp,
    imageUrl,
    caption,
    gender,
    resolveUrl,
    compact,
    hero,
    showHint,
    legacyFill = true,
    freezeAnimation = false,
    rootsAsPhoto = false,
    particleBudget,
  } = props;

  const kind = auraSilhouetteKind(gender);
  const kontury = getAuraKonturySet(kind);
  const useKontury = usesAuraKonturyImage(kind);
  const rawUrls = imageUrlsProp ?? normalizeAuraPlaneImages(imageUrl);
  const planeUrls = legacyFill ? resolveAuraPlaneImages(rawUrls) : rawUrls;
  const distinctPlanes = auraPlanesAreDistinct(planeUrls);
  const baseUrl = pickAuraBaseUrl(planeUrls);
  const isHero = hero && !compact;

  const stageRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!useKontury || !stageRef.current) return;
    const el = stageRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const strength = isHero ? 14 : compact ? 4 : 8;
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
  }, [useKontury, isHero, compact]);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host || !useKontury) return;
    if (!hasAnyAuraPlaneImage(rawUrls)) return;

    let destroyed = false;
    let app: any = null;
    let cleanup: (() => void) | null = null;

    (async () => {
      try {
        const PIXI: any = await import("pixi.js");
        if (destroyed) return;
        const { Application, Assets, Container, Sprite, BlurFilter, ColorMatrixFilter } = PIXI;

        const mobile = isMobileLikeDevice();
        app = new Application();
        await app.init({
          resizeTo: host,
          backgroundAlpha: 0,
          antialias: !mobile,
          resolution: mobile ? 1 : Math.min(window.devicePixelRatio || 1, 2),
          autoDensity: true,
          preference: "webgl",
          powerPreference: mobile ? "default" : "high-performance",
        });
        if (destroyed) {
          app.destroy?.(true, { children: true, texture: true });
          return;
        }
        host.appendChild(app.canvas);
        app.canvas.style.display = "block";
        app.canvas.style.width = "100%";
        app.canvas.style.height = "100%";

        const url = (p: string) => `${BASE_PATH}${p}`;

        const [maskImg, contourImg] = await Promise.all([
          loadHTMLImage(url(kontury.mask)),
          loadHTMLImage(getAuraKonturyUrl(kind, BASE_PATH)),
        ]);
        if (destroyed) return;

        type LoadedPlane = {
          img: HTMLImageElement;
          planeId: AuraPlaneId | "single";
        };
        let loadedPlanes: LoadedPlane[] = [];
        if (distinctPlanes) {
          const items = await Promise.all(
            kontury.planes.map(async (plane, i) => {
              const src = planeUrls[i];
              if (!src) return null;
              const resolved = resolveUrl(src) || "";
              const img = await loadHTMLImage(resolved);
              return { img, planeId: plane.id } as LoadedPlane;
            })
          );
          loadedPlanes = items.filter(Boolean) as LoadedPlane[];
        } else if (baseUrl) {
          const img = await loadHTMLImage(resolveUrl(baseUrl) || "");
          loadedPlanes = [{ img, planeId: "single" }];
        }
        if (destroyed) return;

        const palettes: Partial<Record<AuraPlaneId | "single", RGB[]>> = {};
        for (const p of loadedPlanes) {
          palettes[p.planeId] = buildPalette(p.img, 48);
        }

        const heartPlane = loadedPlanes.find((p) => p.planeId === "heart");
        const headPlaneLoaded = loadedPlanes.find((p) => p.planeId === "head");
        const hasSharpHeart = !!heartPlane && distinctPlanes;
        const hasSharpHead = !!headPlaneLoaded && distinctPlanes;
        const hasSharpRoots = rootsAsPhoto && distinctPlanes;
        const excludeBands: ExcludeBand[] = [];
        if (hasSharpHead) excludeBands.push({ top: PLANE_BAND.head[0], bottom: PLANE_BAND.head[1], feather: 0.05 });
        if (hasSharpHeart) excludeBands.push({ top: PLANE_BAND.heart[0], bottom: PLANE_BAND.heart[1], feather: 0.05 });
        if (hasSharpRoots) excludeBands.push({ top: PLANE_BAND.roots[0], bottom: PLANE_BAND.roots[1], feather: 0.05 });

        const desiredParticles =
          particleBudget ??
          (mobile
            ? freezeAnimation
              ? 900
              : isHero
                ? 2200
                : compact
                  ? 900
                  : 1400
            : isHero
              ? 14000
              : compact
                ? 3600
                : 7200);
        const points = samplePointsFromMask(
          maskImg,
          palettes,
          distinctPlanes,
          desiredParticles,
          excludeBands
        );

        const root = new Container();
        app.stage.addChild(root);
        const composite = new Container();
        root.addChild(composite);

        // ───── 1. Subtle silhouette base — gives particles something to glow against ─────
        const baseCanvas = document.createElement("canvas");
        baseCanvas.width = NAT_W;
        baseCanvas.height = NAT_H;
        const bctx = baseCanvas.getContext("2d");
        if (bctx) {
          const g = bctx.createLinearGradient(0, 0, 0, NAT_H);
          g.addColorStop(0, "rgba(96,72,140,0.7)");
          g.addColorStop(0.4, "rgba(124,84,160,0.62)");
          g.addColorStop(0.7, "rgba(96,72,148,0.58)");
          g.addColorStop(1, "rgba(56,48,112,0.55)");
          bctx.fillStyle = g;
          bctx.fillRect(0, 0, NAT_W, NAT_H);
          bctx.globalCompositeOperation = "destination-in";
          bctx.drawImage(maskImg, 0, 0, NAT_W, NAT_H);
        }
        const baseTex = PIXI.Texture.from(baseCanvas);
        const base = new Sprite(baseTex);
        base.width = NAT_W;
        base.height = NAT_H;
        composite.addChild(base);

        // ───── 2. Sharp plane photos — each fitted into its silhouette region ─────
        type SharpPhoto = {
          sprite: any;
          planeId: AuraPlaneId;
        };
        const sharpPhotos: SharpPhoto[] = [];

        const PLANE_PHOTO_TUNE: Record<AuraPlaneId, { brightness: number; contrast: number; saturate: number }> = {
          head: { brightness: 2.0, contrast: 0.22, saturate: 0.55 },
          heart: { brightness: 1.6, contrast: 0.18, saturate: 0.65 },
          roots: { brightness: 1.8, contrast: 0.2, saturate: 0.6 },
        };

        const makeSharpPhoto = async (
          planeId: AuraPlaneId,
          zoom: number,
          loaded: { img: HTMLImageElement } | undefined,
          maskPath: string
        ) => {
          if (!loaded) return;
          const tex = await Assets.load(resolveUrl(loaded.img.src) || loaded.img.src);
          const mTex = await Assets.load(url(maskPath));
          if (destroyed) return;
          const [bandTopR, bandBottomR] = PLANE_BAND[planeId];
          const bandTop = bandTopR * NAT_H;
          const bandHeight = (bandBottomR - bandTopR) * NAT_H;
          const bandCenterY = bandTop + bandHeight / 2;
          const ar = tex.width / tex.height;
          const bandAr = NAT_W / bandHeight;
          let baseW: number;
          let baseH: number;
          if (ar >= bandAr) {
            baseH = bandHeight;
            baseW = bandHeight * ar;
          } else {
            baseW = NAT_W;
            baseH = NAT_W / ar;
          }
          const drawW = baseW * zoom;
          const drawH = baseH * zoom;
          const sp = new Sprite(tex);
          sp.position.set(
            (NAT_W - drawW) / 2,
            bandCenterY - drawH / 2
          );
          sp.width = drawW;
          sp.height = drawH;
          const tune = PLANE_PHOTO_TUNE[planeId];
          const cm = new ColorMatrixFilter();
          cm.brightness(tune.brightness, true);
          cm.contrast(tune.contrast, true);
          cm.saturate(tune.saturate, true);
          sp.filters = [cm];

          const mSprite = new Sprite(mTex);
          mSprite.width = NAT_W;
          mSprite.height = NAT_H;
          composite.addChild(sp);
          composite.addChild(mSprite);
          sp.mask = mSprite;

          sharpPhotos.push({ sprite: sp, planeId });
        };

        if (distinctPlanes) {
          const headLoaded = loadedPlanes.find((p) => p.planeId === "head");
          const heartLoaded = loadedPlanes.find((p) => p.planeId === "heart");
          const rootsLoaded = loadedPlanes.find((p) => p.planeId === "roots");
          await makeSharpPhoto("head", 1.05, headLoaded, kontury.planes[0].maskPath);
          await makeSharpPhoto("heart", 1.1, heartLoaded, kontury.planes[1].maskPath);
          if (rootsAsPhoto) {
            await makeSharpPhoto("roots", 1.08, rootsLoaded, kontury.planes[2].maskPath);
          }
        } else if (loadedPlanes[0]) {
          await makeSharpPhoto("head", 1.05, loadedPlanes[0], kontury.mask);
        }
        const heart: any =
          sharpPhotos.find((s) => s.planeId === "heart")?.sprite ?? null;

        // ───── 3. Particle field (head + roots) ─────
        const particleTex = makeParticleTexture(PIXI, 64);
        const particles = new Container();
        composite.addChild(particles);

        type ParticleEntry = {
          sprite: any;
          baseX: number;
          baseY: number;
          baseAlpha: number;
          baseScale: number;
          phase: number;
          driftX: number;
          driftY: number;
          fallSpeed: number;
          fallRange: number;
          isRoots: boolean;
        };
        const particleList: ParticleEntry[] = [];

        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          const sp = new Sprite(particleTex);
          sp.anchor.set(0.5);
          sp.x = pt.x;
          sp.y = pt.y;

          const isRoots = pt.planeId === "roots";

          const sizeRoll = Math.random();
          let scale: number;
          let alpha: number;
          if (sizeRoll < 0.7) {
            scale = 0.1 + Math.random() * 0.08;
            alpha = 0.55 + Math.random() * 0.25;
          } else if (sizeRoll < 0.93) {
            scale = 0.18 + Math.random() * 0.1;
            alpha = 0.7 + Math.random() * 0.2;
          } else {
            scale = 0.32 + Math.random() * 0.18;
            alpha = 0.85 + Math.random() * 0.15;
          }
          if (isRoots) {
            scale *= 1.4;
            alpha = Math.min(1, alpha * 1.25);
          }

          sp.scale.set(scale);
          sp.alpha = alpha;
          sp.tint = (pt.r << 16) | (pt.g << 8) | pt.b;
          sp.blendMode = "screen";

          particles.addChild(sp);
          particleList.push({
            sprite: sp,
            baseX: pt.x,
            baseY: pt.y,
            baseAlpha: alpha,
            baseScale: scale,
            phase: Math.random() * Math.PI * 2,
            driftX: 6 + Math.random() * 10,
            driftY: 4 + Math.random() * 8,
            fallSpeed: isRoots ? 8 + Math.random() * 16 : 0,
            fallRange: isRoots ? 40 + Math.random() * 80 : 0,
            isRoots,
          });
        }

        // ───── 4. Soft contour glow (breathing) ─────
        const contourTex = makeContourGlowTexture(PIXI, contourImg);
        const cFit = coverFit(
          contourImg.naturalWidth || NAT_W,
          contourImg.naturalHeight || NAT_H,
          NAT_W,
          NAT_H,
          1
        );
        const contour = new Sprite(contourTex);
        contour.position.set(cFit.drawX, cFit.drawY);
        contour.width = cFit.drawW;
        contour.height = cFit.drawH;
        contour.blendMode = "screen";
        contour.alpha = 0.85;
        const contourBlur = new BlurFilter({ strength: 2, quality: 4 });
        contour.filters = [contourBlur];
        composite.addChild(contour);

        // ───── Layout ─────
        const layout = () => {
          const W = app.screen.width;
          const H = app.screen.height;
          const sx = W / NAT_W;
          const sy = H / NAT_H;
          const s = Math.min(sx, sy);
          composite.scale.set(s);
          composite.position.set((W - NAT_W * s) / 2, H - NAT_H * s);
        };
        layout();
        const ro = new ResizeObserver(() => layout());
        ro.observe(host);

        // ───── Ticker animation ─────
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const skipTicker = freezeAnimation || reduced;
        let paused = document.visibilityState === "hidden";
        const onVis = () => {
          if (skipTicker) return;
          paused = document.visibilityState === "hidden";
          if (paused) app.ticker?.stop();
          else app.ticker?.start();
        };
        if (!skipTicker) document.addEventListener("visibilitychange", onVis);

        const tickerFn = () => {
          if (paused) return;
          const t = performance.now() / 1000;

          if (!reduced && !freezeAnimation) {
            const len = particleList.length;
            for (let i = 0; i < len; i++) {
              const p = particleList[i];
              const a = t * 0.6 + p.phase;
              p.sprite.x = p.baseX + Math.sin(a) * p.driftX;
              if (p.isRoots) {
                // Falling dust: continuous downward drift wrapped within fallRange
                const fall = ((t * p.fallSpeed + p.phase * 12) % p.fallRange);
                p.sprite.y = p.baseY + fall + Math.cos(a * 0.6) * p.driftY * 0.6;
                // Gentle fade only at the wrap-around to hide the jump
                const fadeIn = Math.min(1, fall / (p.fallRange * 0.08));
                const fadeOut = Math.min(1, (p.fallRange - fall) / (p.fallRange * 0.1));
                const cycleAlpha = Math.min(fadeIn, fadeOut);
                const pulse = 0.85 + 0.15 * (0.5 + 0.5 * Math.sin(t * 1.4 + p.phase * 4));
                p.sprite.alpha = p.baseAlpha * cycleAlpha * pulse;
              } else {
                p.sprite.y = p.baseY + Math.cos(a * 0.85) * p.driftY;
                const pulse = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * 1.1 + p.phase * 3));
                p.sprite.alpha = p.baseAlpha * pulse;
              }
              const scl = p.baseScale * (0.88 + 0.18 * (0.5 + 0.5 * Math.sin(t * 0.9 + p.phase * 2)));
              p.sprite.scale.set(scl);
            }
            contourBlur.strength = 2 + Math.sin(t * 0.7) * 1.2;
            contour.alpha = 0.8 + Math.sin(t * 0.55) * 0.12;
            base.alpha = 0.95 + Math.sin(t * 0.32) * 0.05;
            if (heart) {
              heart.alpha = 0.96 + Math.sin(t * 0.45) * 0.04;
            }
          }
        };
        if (!skipTicker) app.ticker.add(tickerFn);

        cleanup = () => {
          if (!skipTicker) document.removeEventListener("visibilitychange", onVis);
          ro.disconnect();
          if (!skipTicker) app.ticker?.remove(tickerFn);
        };
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[AuraGL] init failed", err);
      }
    })();

    return () => {
      destroyed = true;
      cleanup?.();
      try {
        app?.destroy?.(true, { children: true, texture: false });
      } catch {
        /* noop */
      }
      while (host.firstChild) host.removeChild(host.firstChild);
    };
  }, [
    useKontury,
    kind,
    kontury,
    distinctPlanes,
    baseUrl,
    planeUrls[0],
    planeUrls[1],
    planeUrls[2],
    resolveUrl,
    isHero,
    compact,
  ]);

  if (!hasAnyAuraPlaneImage(rawUrls)) return null;

  const stageStyle =
    useKontury && (shift.x || shift.y)
      ? { transform: `translate3d(${shift.x}px, ${shift.y}px, 0)` }
      : useKontury
        ? { transition: "transform 0.45s ease-out" }
        : undefined;

  return (
    <section
      className={`randki-room-zone randki-room-aura randki-room-aura--${kind}${compact ? " randki-room-aura--compact" : ""}${isHero ? " randki-room-aura--hero" : ""}${useKontury ? " randki-room-aura--kontury randki-room-aura--gl" : ""}`}
    >
      {!isHero && (
        <>
          <p className="randki-room-zone-label">✨ Aura</p>
          <p className="randki-room-zone-hint mb-2">Emocja, która świeci w pokoju.</p>
        </>
      )}

      <div ref={stageRef} className="randki-room-aura-stage" style={stageStyle}>
        <div className="randki-room-aura-glow" aria-hidden />
        <div
          className="randki-room-aura-composite"
          style={{ aspectRatio: String(kontury.aspect) } as React.CSSProperties}
        >
          <div ref={canvasHostRef} className="randki-room-aura-canvas-host" />
        </div>
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
