"use client";

import { useEffect } from "react";

/** Przy pierwszym wejściu bez kotwicy — na górę (unika „widać od razu O mnie” po restore scrolla). */
export function OdartScrollToTopOnLanding() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, []);
  return null;
}
