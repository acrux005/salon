"use client";

import { useEffect, useState } from "react";

type Item = { quote: string; author: string };

export function OdartOpiekaTestimonialCarousel({ items }: { items: Item[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 8000);
    return () => clearInterval(t);
  }, [items.length]);

  const t = items[i]!;
  const initial = t.author.trim().charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-2xl">
      <blockquote className="rounded-2xl border border-white/10 bg-black/40 p-8 text-center">
        <p className="text-sm leading-relaxed text-neutral-300 md:text-base">&ldquo;{t.quote}&rdquo;</p>
        <footer className="mt-8 flex flex-col items-center gap-3">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full bg-odart-accent/25 text-lg font-bold text-odart-accent"
            aria-hidden
          >
            {initial}
          </span>
          <span className="text-sm font-semibold text-odart-accent">{t.author}</span>
        </footer>
      </blockquote>
      <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label="Opinie — slajdy">
        {items.map((_, idx) => (
          <button
            key={idx}
            type="button"
            role="tab"
            aria-selected={idx === i}
            className={`h-2 rounded-full transition-all ${
              idx === i ? "w-8 bg-odart-accent" : "w-2 bg-neutral-600 hover:bg-neutral-500"
            }`}
            onClick={() => setI(idx)}
          />
        ))}
      </div>
    </div>
  );
}
