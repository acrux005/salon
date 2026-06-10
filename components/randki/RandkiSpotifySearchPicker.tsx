"use client";

import { useEffect, useState, useTransition } from "react";
import { searchSpotifyCatalogAction } from "@/app/actions/randki";
import type { SpotifySearchHit, SpotifySearchType } from "@/lib/randki/spotifySearch";

type Props = {
  selected: SpotifySearchHit | null;
  onSelect: (hit: SpotifySearchHit) => void;
  defaultSearchType?: SpotifySearchType;
};

const SEARCH_TYPES: { value: SpotifySearchType; label: string }[] = [
  { value: "track", label: "Utwory" },
  { value: "artist", label: "Artysta" },
  { value: "album", label: "Albumy" },
  { value: "playlist", label: "Playlisty" },
];

export function RandkiSpotifySearchPicker({ selected, onSelect, defaultSearchType = "track" }: Props) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<SpotifySearchType>(defaultSearchType);
  const [results, setResults] = useState<SpotifySearchHit[]>([]);
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
        const res = await searchSpotifyCatalogAction(query, searchType);
        if (!res.ok) {
          setResults([]);
          setError(res.error);
          return;
        }
        setResults(res.items);
      });
    }, 450);

    return () => clearTimeout(timer);
  }, [query, searchType]);

  return (
    <div className="space-y-2">
      <p className="text-[12px] text-white/55">Szukaj w katalogu Spotify — utwór, artysta, album, playlista lub klimat.</p>
      <div className="flex flex-wrap gap-2">
        {SEARCH_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setSearchType(t.value)}
            className={`rounded-full px-3 py-1 text-[11px] ${searchType === t.value ? "bg-emerald-600 text-white" : "bg-white/10 text-white/70"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <input
        className="randki-input w-full"
        placeholder="np. The xx, Arctic Monkeys, spokojny wieczór…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {pending && <p className="text-[11px] text-white/40">Szukam…</p>}
      {error && query.trim().length >= 2 && !pending && <p className="text-[11px] text-rose-300">{error}</p>}
      {results.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {results.map((item) => {
            const isSelected = selected?.id === item.id && selected?.type === item.type;
            return (
              <button
                key={`${item.type}-${item.id}`}
                type="button"
                onClick={() => onSelect(item)}
                className={`w-[140px] shrink-0 rounded-xl border p-2 text-left transition ${
                  isSelected ? "border-emerald-400 bg-emerald-500/20" : "border-white/10 bg-black/20 hover:border-white/20"
                }`}
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black/30">
                  {item.thumbnailUrl ? (
                    <img src={item.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl">🎵</div>
                  )}
                  <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[9px] uppercase text-white/80">
                    {item.type === "playlist" ? "Playlista" : item.type === "album" ? "Album" : "Spotify"}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-[11px] font-medium leading-snug text-white">{item.title}</p>
                {item.artistName && <p className="mt-0.5 truncate text-[10px] text-white/45">{item.artistName}</p>}
              </button>
            );
          })}
        </div>
      )}
      <p className="text-[10px] text-white/35">To cały katalog Spotify — nie Twoja prywatna biblioteka (bez logowania).</p>
    </div>
  );
}
