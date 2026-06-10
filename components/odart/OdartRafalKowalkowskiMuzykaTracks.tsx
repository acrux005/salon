"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import {
  RAFAL_MUZYKA_TELEDYSKI,
  youtubeEmbedAutoplayUrl,
  youtubeWatchUrl,
} from "@/lib/rafalKowalkowskiMuzyka";
export function OdartRafalKowalkowskiMuzykaTracks() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = RAFAL_MUZYKA_TELEDYSKI.find((t) => t.id === activeId);

  return (
    <div className="space-y-10">
      <ul className="grid gap-6 md:grid-cols-3">
        {RAFAL_MUZYKA_TELEDYSKI.map((track) => (
          <li key={track.id}>
            <button
              type="button"
              onClick={() => setActiveId(track.id)}
              className={`group w-full overflow-hidden rounded-2xl border text-left transition ${
                activeId === track.id
                  ? "border-odart-accent ring-1 ring-odart-accent/40"
                  : "border-white/10 hover:border-odart-accent/50"
              }`}
            >
              <span className="relative block aspect-[4/3] w-full bg-neutral-900">
                <Image
                  src={track.image}
                  alt={`Okładka teledysku — ${track.title}`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <span className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-odart-accent text-white">
                    <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden />
                  </span>
                </span>
              </span>
              <span className="block px-4 py-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-odart-accent">Muzyka autorska</span>
                <span className="mt-1 block text-lg font-semibold text-white">{track.title}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/50">
          <div className="relative aspect-video w-full">
            <iframe
              src={youtubeEmbedAutoplayUrl(active.youtubeId, false)}
              title={`Rafał Kowalkowski — ${active.title}`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <p className="border-t border-white/10 px-4 py-3 text-center text-sm text-neutral-500">
            {active.title}
            {" · "}
            <a
              href={youtubeWatchUrl(active.youtubeId)}
              className="text-odart-accent hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              YouTube
            </a>
          </p>
        </div>
      ) : null}
    </div>
  );
}
