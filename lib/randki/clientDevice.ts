/** Heurystyki po stronie klienta — lekkie strony na telefonie (Safari pada przy WebGL + 14k cząstek). */

export function isMobileLikeDevice(): boolean {
  if (typeof window === "undefined") return false;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 900px)").matches;
  const ua = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  return ua || (coarse && narrow);
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Bez animacji / parallax (reduce motion lub telefon). */
export function shouldDisableAuraMotion(): boolean {
  if (typeof window === "undefined") return false;
  return prefersReducedMotion() || isMobileLikeDevice();
}

/** @deprecated alias */
export function shouldUseStaticAura(): boolean {
  return shouldDisableAuraMotion();
}

function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Desktop: pełna animacja WebGL. */
export function shouldUseAuraWebGL(): boolean {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion() || isMobileLikeDevice()) return false;
  return supportsWebGL();
}

/** Telefon: jedna klatka WebGL — zdjęcia w konturach jak wczoraj, bez ticker (stabilne). */
export function shouldUseAuraWebGLMobileStatic(): boolean {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;
  if (!isMobileLikeDevice()) return false;
  return supportsWebGL();
}
