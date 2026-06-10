"use client";

import type { VibeCatalogRow } from "@/lib/randki/vibeCatalogTypes";
import { RANDKI_MOODS } from "@/lib/randki/onboarding";

type Props = {
  catalog: VibeCatalogRow[];
  userMood: string | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function moodLabel(value: string | null): string | null {
  if (!value) return null;
  return RANDKI_MOODS.find((m) => m.value === value)?.label ?? null;
}

export function RandkiVibeCatalogPicker({ catalog, userMood, selectedId, onSelect }: Props) {
  if (catalog.length === 0) {
    return (
      <p className="text-[12px] text-white/45">
        Katalog jest pusty — wklej link ręcznie albo poczekaj na odświeżenie platformy.
      </p>
    );
  }

  const moodHint = moodLabel(userMood);

  return (
    <div className="space-y-2">
      <p className="text-[12px] text-white/55">
        Wybierz z katalogu na dziś
        {moodHint ? ` · dopasowane do: ${moodHint}` : " · wszystkie klimaty"}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {catalog.map((item) => {
          const selected = selectedId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`w-[140px] shrink-0 rounded-xl border p-2 text-left transition ${
                selected ? "border-violet-400 bg-violet-500/20" : "border-white/10 bg-black/20 hover:border-white/20"
              }`}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black/30">
                {item.thumbnailUrl ? (
                  <img src={item.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl">
                    {item.platform === "spotify" ? "🎵" : item.platform === "tmdb" ? "🎬" : "▶️"}
                  </div>
                )}
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[9px] uppercase text-white/80">
                  {item.platform === "spotify" ? "Spotify" : item.platform === "tmdb" ? "Film" : "YouTube"}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-[11px] font-medium leading-snug text-white">{item.title}</p>
              {item.artistName && <p className="mt-0.5 truncate text-[10px] text-white/45">{item.artistName}</p>}
            </button>
          );
        })}
      </div>
      <p className="text-[10px] text-white/35">
        {catalog.some((item) => item.platform === "tmdb") ? "Filmy: Powered by TMDB" : null}
      </p>
    </div>
  );
}
