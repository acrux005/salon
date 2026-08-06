"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { rafalGalleryHasCaption, rafalGalleryItemAlt } from "@/lib/rafalKowalkowskiGallery";

export type RafalGalleryLightboxItem = { src: string; cat: string; title: string };

type Layout = "grid" | "strip";

type Props = {
  items: readonly RafalGalleryLightboxItem[];
  layout?: Layout;
  /** Domyślnie: wszystkie. Na profilu np. 20 miniaturek, ale lightbox po kolei przez całe `items`. */
  maxThumbnails?: number;
  /** Dodatkowe klasy na kontenerze miniaturek */
  className?: string;
};

export function OdartRafalKowalkowskiGalleryLightboxGrid({
  items,
  layout = "grid",
  maxThumbnails,
  className = "",
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const close = useCallback(() => setOpenIndex(null), []);

  const go = useCallback(
    (delta: number) => {
      setOpenIndex((i) => {
        if (i === null || items.length === 0) return null;
        const n = (i + delta + items.length) % items.length;
        return n;
      });
    },
    [items.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openIndex, close, go]);

  useEffect(() => {
    if (openIndex !== null) closeBtnRef.current?.focus();
  }, [openIndex]);

  const current = openIndex !== null ? items[openIndex] : null;

  const thumbs = maxThumbnails != null ? items.slice(0, maxThumbnails) : items;

  const thumbWrap =
    layout === "strip"
      ? `-mx-2 flex gap-4 overflow-x-auto pb-3 pt-2 sm:-mx-0 sm:gap-5
         [scrollbar-color:theme(colors.neutral.500)_theme(colors.neutral.800)]
         [scrollbar-width:thin]
         [&::-webkit-scrollbar]:h-1.5
         [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-400
         [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-800`
      : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <div className={`${thumbWrap} ${className}`.trim()}>
        {thumbs.map((g, i) => (
          <button
            key={g.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className={
              layout === "strip"
                ? "group relative w-[72vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 text-left shadow-lg shadow-black/40 outline-none ring-odart-accent/0 transition hover:border-odart-accent/40 focus-visible:ring-2 focus-visible:ring-odart-accent sm:w-72"
                : "group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 text-left shadow-lg shadow-black/30 outline-none ring-odart-accent/0 transition hover:border-odart-accent/40 focus-visible:ring-2 focus-visible:ring-odart-accent"
            }
            aria-label={`Powiększ: ${rafalGalleryItemAlt(g, i)}`}
          >
            <div className="relative aspect-[4/5]">
              <Image
                src={g.src}
                alt=""
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes={layout === "strip" ? "(max-width: 640px) 72vw, 288px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
              />
              {rafalGalleryHasCaption(g) ? (
                <>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-90" />
                  <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-odart-accent">{g.cat}</p>
                    <p className="mt-1.5 text-lg font-semibold text-white sm:text-xl">{g.title}</p>
                  </figcaption>
                </>
              ) : null}
            </div>
          </button>
        ))}
      </div>

      {current != null && openIndex !== null ? (
        <div
          className="fixed inset-0 z-[400] flex"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/88 backdrop-blur-md"
            aria-label="Zamknij podgląd"
            onClick={close}
          />

          <div className="pointer-events-none relative z-[1] flex min-h-0 w-full flex-1 flex-col p-3 sm:p-6">
            <div className="pointer-events-auto mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between gap-3 pb-3 text-white">
              <p className="text-sm tabular-nums text-neutral-400">
                <span className="font-semibold text-white">{openIndex + 1}</span>
                <span className="mx-1.5 text-neutral-600">/</span>
                {items.length}
              </p>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={close}
                className="rounded-full border border-white/15 bg-white/5 p-2.5 text-white transition hover:border-odart-accent/60 hover:bg-odart-accent/20"
                aria-label="Zamknij"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="pointer-events-auto relative mx-auto flex min-h-0 w-full max-w-6xl flex-1 items-center justify-center">
              <button
                type="button"
                onClick={() => go(-1)}
                className="pointer-events-auto absolute left-0 top-1/2 z-[2] hidden -translate-y-1/2 rounded-full border border-white/15 bg-black/50 p-3 text-white backdrop-blur-sm transition hover:border-odart-accent/50 hover:bg-odart-accent/25 sm:flex"
                aria-label="Poprzednie zdjęcie"
              >
                <ChevronLeft className="h-7 w-7" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="pointer-events-auto absolute right-0 top-1/2 z-[2] hidden -translate-y-1/2 rounded-full border border-white/15 bg-black/50 p-3 text-white backdrop-blur-sm transition hover:border-odart-accent/50 hover:bg-odart-accent/25 sm:flex"
                aria-label="Następne zdjęcie"
              >
                <ChevronRight className="h-7 w-7" aria-hidden />
              </button>

              <div className="relative flex max-h-[min(78vh,1200px)] w-full max-w-[min(100%,1200px)] items-center justify-center px-10 sm:px-14">
                <div className="relative h-[min(78vh,85vw)] w-full max-h-[78vh]">
                  <Image
                    src={current.src}
                    alt={rafalGalleryItemAlt(current, openIndex)}
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="100vw"
                    priority
                  />
                </div>
              </div>
            </div>

            <div className="pointer-events-auto mx-auto w-full max-w-6xl shrink-0 pt-4 text-center">
              {rafalGalleryHasCaption(current) ? (
                <>
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-odart-accent">{current.cat}</p>
                  <p id={titleId} className="mt-1 text-lg font-semibold text-white sm:text-xl">
                    {current.title}
                  </p>
                </>
              ) : (
                <p id={titleId} className="sr-only">
                  {rafalGalleryItemAlt(current, openIndex)}
                </p>
              )}
              <p className="mt-3 text-xs text-neutral-500 sm:hidden">← → na klawiaturze · Escape zamyka</p>
            </div>

            <div className="pointer-events-auto mx-auto mt-4 flex max-w-6xl justify-center gap-2 sm:hidden">
              <button
                type="button"
                onClick={() => go(-1)}
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white"
              >
                Wstecz
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white"
              >
                Dalej
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
