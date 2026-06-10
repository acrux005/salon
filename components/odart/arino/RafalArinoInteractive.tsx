"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import type { RafalKowalkowskiGalleryItem } from "@/lib/rafalKowalkowskiGallery";
import { RAFAL_ARINO_TESTIMONIALS } from "@/lib/rafalKowalkowskiArinoContent";
import { RAFAL_KOWALKOWSKI_PORTRAIT_URL } from "@/lib/rafalKowalkowskiMedia";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1" aria-label={`Ocena ${count} na 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`text-lg ${i < count ? "text-odart-accent" : "text-neutral-700"}`}
          aria-hidden
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function RafalArinoPortfolioCarousel({
  items,
  galleryHref,
}: {
  items: RafalKowalkowskiGalleryItem[];
  galleryHref: string;
}) {
  const [idx, setIdx] = useState(0);
  const n = items.length;
  const prev = useCallback(() => setIdx((i) => (i - 1 + n) % n), [n]);
  const next = useCallback(() => setIdx((i) => (i + 1) % n), [n]);
  const current = items[idx];
  const prevItem = items[(idx - 1 + n) % n];
  const nextItem = items[(idx + 1) % n];

  if (!current) return null;

  return (
    <section id="portfolio" className="relative z-10 scroll-mt-28 bg-black py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Portfolio do odkrycia
        </h2>
        <div className="relative mt-14 flex items-center justify-center gap-4 md:gap-8">
          <button
            type="button"
            onClick={prev}
            className="absolute left-0 z-20 hidden rounded-full border border-white/20 bg-black/60 p-3 text-white backdrop-blur transition hover:border-odart-accent/60 sm:flex"
            aria-label="Poprzednie zdjęcie"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="relative flex w-full max-w-5xl items-end justify-center gap-3 md:gap-6">
            <div className="hidden w-[18%] shrink-0 overflow-hidden rounded-2xl opacity-40 md:block">
              <div className="relative aspect-[3/4]">
                <Image src={prevItem.src} alt="" fill className="object-cover" sizes="200px" />
              </div>
            </div>

            <div className="relative w-full max-w-md shrink-0 md:max-w-lg">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/60">
                <Image
                  src={current.src}
                  alt={current.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 480px"
                  priority
                />
              </div>
              <Link
                href={galleryHref}
                className="absolute -bottom-4 -left-4 flex h-36 w-36 flex-col items-center justify-center rounded-full bg-odart-accent p-4 text-center text-white shadow-xl transition hover:brightness-110 sm:-bottom-6 sm:-left-6 sm:h-44 sm:w-44"
              >
                <span className="text-sm font-bold leading-tight sm:text-base">{current.title}</span>
                <span className="mt-2 text-xs opacity-90">Zobacz galerię →</span>
              </Link>
            </div>

            <div className="hidden w-[18%] shrink-0 overflow-hidden rounded-2xl opacity-40 md:block">
              <div className="relative aspect-[3/4]">
                <Image src={nextItem.src} alt="" fill className="object-cover" sizes="200px" />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={next}
            className="absolute right-0 z-20 hidden rounded-full border border-white/20 bg-black/60 p-3 text-white backdrop-blur transition hover:border-odart-accent/60 sm:flex"
            aria-label="Następne zdjęcie"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-3 sm:hidden">
          <button
            type="button"
            onClick={prev}
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white"
          >
            Wstecz
          </button>
          <button
            type="button"
            onClick={next}
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white"
          >
            Dalej
          </button>
        </div>
      </div>
    </section>
  );
}

export function RafalArinoTestimonials() {
  const [idx, setIdx] = useState(0);
  const t = RAFAL_ARINO_TESTIMONIALS[idx];

  return (
    <section id="customers" className="relative z-10 scroll-mt-28 border-t border-white/[0.06] bg-black py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className="relative mx-auto flex max-w-sm items-center justify-center">
          <div className="relative h-48 w-48 rotate-45 overflow-hidden rounded-lg border border-white/10 bg-neutral-900 shadow-xl">
            <Image
              src={RAFAL_KOWALKOWSKI_PORTRAIT_URL}
              alt=""
              fill
              className="-rotate-45 scale-150 object-cover"
              sizes="200px"
            />
          </div>
          <div
            className="absolute -left-8 top-4 h-32 w-32 rotate-45 overflow-hidden rounded-lg border border-white/10 opacity-60"
            aria-hidden
          >
            <div className="relative h-full w-full bg-neutral-800" />
          </div>
          <div
            className="absolute -right-8 bottom-4 h-32 w-32 rotate-45 overflow-hidden rounded-lg border border-white/10 opacity-60"
            aria-hidden
          >
            <div className="relative h-full w-full bg-neutral-800" />
          </div>
        </div>

        <div>
          <Quote className="h-12 w-12 text-white/80" aria-hidden />
          <blockquote className="mt-6 text-xl leading-relaxed text-white sm:text-2xl">{t.quote}</blockquote>
          <Stars count={t.rating} />
          <p className="mt-6 font-semibold text-white">{t.name}</p>
          <p className="text-sm text-neutral-500">— {t.role}</p>
          <div className="mt-8 flex gap-2">
            <button
              type="button"
              onClick={() => setIdx((i) => (i - 1 + RAFAL_ARINO_TESTIMONIALS.length) % RAFAL_ARINO_TESTIMONIALS.length)}
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/20 text-white transition hover:border-odart-accent/50"
              aria-label="Poprzednia opinia"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setIdx((i) => (i + 1) % RAFAL_ARINO_TESTIMONIALS.length)}
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/20 text-white transition hover:border-odart-accent/50"
              aria-label="Następna opinia"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
