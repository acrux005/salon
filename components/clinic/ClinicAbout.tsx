"use client";

import { useClinicData } from "@/contexts/ClinicDataContext";
import { useClinicContactModal } from "@/contexts/ClinicContactModalContext";

export function ClinicAbout() {
  const { about } = useClinicData();
  const { openContactModal } = useClinicContactModal();
  const sectionEnabled = (about as { enabled?: boolean }).enabled !== false;
  if (!sectionEnabled) return null;

  const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const imageUrl = (about as { imageUrl?: string }).imageUrl;
  const imgSrc = imageUrl
    ? (imageUrl.startsWith("http") ? imageUrl : `${BASE_PATH}${imageUrl}`)
    : "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80";
  return (
    <section className="border-b border-neutral-200/60 bg-neutral-50/50 py-14 lg:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
          {about.title}
        </h2>
        <div className="mt-12 grid gap-10 lg:grid-cols-[280px_1fr] lg:items-start">
          <div className="mx-auto w-56 overflow-hidden rounded-2xl border border-pink-100 shadow-lg lg:w-full">
            <img
              src={imgSrc}
              alt={about.imageAlt}
              className="aspect-[3/4] w-full object-cover object-center"
            />
          </div>
          <div className="space-y-5">
            {about.paragraphs.map((p, i) => (
              <p key={i} className="font-[var(--font-sans)] text-[15px] leading-relaxed text-[#4a3f42]">
                {p}
              </p>
            ))}
            <button
              type="button"
              onClick={openContactModal}
              className="inline-block rounded-full bg-pink-500 px-6 py-3 font-[var(--font-sans)] text-[15px] font-medium text-white shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              {about.ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
