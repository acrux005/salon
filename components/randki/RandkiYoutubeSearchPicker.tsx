"use client";

import { useEffect, useState, useTransition } from "react";
import { searchYoutubeCatalogAction } from "@/app/actions/randki";
import type { YoutubeSearchHit } from "@/lib/randki/youtubeSearch";

type Props = {
  selected: YoutubeSearchHit | null;
  onSelect: (hit: YoutubeSearchHit) => void;
};

export function RandkiYoutubeSearchPicker({ selected, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<YoutubeSearchHit[]>([]);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setError("");
      return;
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        setError("");
        const res = await searchYoutubeCatalogAction(query);
        if (!res.ok) {
          setResults([]);
          setError(res.error);
          return;
        }
        setResults(res.items);
      });
    }, 450);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-2">
      <p className="text-[12px] text-white/55">Szukaj sceny na YouTube — klip, fragment, vibe.</p>
      <input
        className="randki-input w-full"
        placeholder="np. lofi hip hop, jazz bar scene, rainy window…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {pending && <p className="text-[11px] text-white/40">Szukam…</p>}
      {error && query.trim().length >= 2 && !pending && <p className="text-[11px] text-rose-300">{error}</p>}
      {results.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {results.map((item) => {
            const isSelected = selected?.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className={`w-[140px] shrink-0 rounded-xl border p-2 text-left transition ${
                  isSelected ? "border-red-400 bg-red-500/20" : "border-white/10 bg-black/20 hover:border-white/20"
                }`}
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/30">
                  {item.thumbnailUrl ? (
                    <img src={item.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl">📺</div>
                  )}
                  <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[9px] text-white/80">YT</span>
                </div>
                <p className="mt-2 line-clamp-2 text-[11px] font-medium leading-snug text-white">{item.title}</p>
                {item.channelTitle && <p className="mt-0.5 truncate text-[10px] text-white/45">{item.channelTitle}</p>}
              </button>
            );
          })}
        </div>
      )}
      <p className="text-[10px] text-white/35">Limit wyszukiwań chroniony — wyniki cache’owane 15 min.</p>
    </div>
  );
}
