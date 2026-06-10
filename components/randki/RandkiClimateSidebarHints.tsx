"use client";

import { useClimateDiscovery, CLIMATE_SEARCH_TAGS } from "@/components/randki/RandkiClimateDiscoveryContext";

/** Szybkie tagi klimatu — bez klasycznego search. */
export function RandkiClimateSidebarHints() {
  const { activeTags, toggleTag, openPalette } = useClimateDiscovery();
  const quick = CLIMATE_SEARCH_TAGS.slice(0, 5);

  return (
    <div className="randki-climate-sidebar-hints shrink-0 rounded-xl border border-white/8 bg-black/20 px-2.5 py-2">
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/38">Szukaj energii</p>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {quick.map((tag) => {
          const on = activeTags.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`rounded-full px-2 py-0.5 text-[10px] transition ${
                on ? "bg-violet-500/80 text-white" : "bg-white/8 text-white/55 hover:bg-white/12"
              }`}
            >
              {tag.emoji} {tag.label.split(" ")[0]}
            </button>
          );
        })}
        <button
          type="button"
          onClick={openPalette}
          className="rounded-full border border-dashed border-white/15 px-2 py-0.5 text-[10px] text-white/40 hover:text-white/65"
        >
          + więcej
        </button>
      </div>
    </div>
  );
}
