"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function OdartBackToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      aria-label="Wróć na górę"
      className="fixed bottom-6 right-6 z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white backdrop-blur hover:border-odart-accent/50 hover:text-odart-accent"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUp className="h-5 w-5" aria-hidden />
    </button>
  );
}
