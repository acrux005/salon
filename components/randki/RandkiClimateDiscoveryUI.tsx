"use client";

import { useEffect, useMemo, useState } from "react";
import { useClimateDiscovery, CLIMATE_SEARCH_TAGS } from "@/components/randki/RandkiClimateDiscoveryContext";
import { activeClimateLabels } from "@/lib/randki/climateDiscovery";
import { getRoomClimateForCard } from "@/lib/randki/roomClimate";
import { todayStateLabel } from "@/lib/randki/todayState";
import { RandkiClimateScene } from "@/components/randki/RandkiClimateScene";
import { climateClass } from "@/lib/randki/roomClimate";

export function RandkiClimateSearchPill() {
  const { openPalette, activeTags } = useClimateDiscovery();
  const label = activeClimateLabels(activeTags);

  return (
    <button
      type="button"
      onClick={openPalette}
      className="randki-climate-search-pill inline-flex max-w-[160px] items-center gap-1.5 truncate rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/45 transition hover:border-violet-400/30 hover:bg-white/[0.07] hover:text-white/70 sm:max-w-[220px] lg:max-w-[280px]"
      aria-label="Szukaj klimatu"
    >
      <span className="shrink-0 opacity-70">🔍</span>
      <span className="truncate">{label || "szukaj klimatu, nie ludzi…"}</span>
      <kbd className="ml-1 hidden shrink-0 rounded border border-white/10 px-1 text-[9px] text-white/30 lg:inline">⌘K</kbd>
    </button>
  );
}

export function RandkiDriftButton() {
  const { driftActive, toggleDrift, filteredCards, startDrift } = useClimateDiscovery();

  return (
    <button
      type="button"
      onClick={() => (filteredCards.length > 0 ? toggleDrift() : startDrift())}
      disabled={filteredCards.length === 0}
      className={`randki-drift-btn rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
        driftActive
          ? "border-violet-400/40 bg-violet-500/20 text-violet-100 shadow-[0_0_16px_rgba(139,92,246,0.25)]"
          : "border-white/12 bg-white/[0.04] text-white/55 hover:border-white/20 hover:text-white/85"
      } disabled:opacity-40`}
    >
      {driftActive ? "⏸ Dryf" : "🌙 Dryfuj"}
    </button>
  );
}

export function RandkiClimateDiscoveryPalette() {
  const {
    paletteOpen,
    closePalette,
    activeTags,
    toggleTag,
    clearTags,
    secondary,
    setSecondary,
    startDrift,
    filteredCards,
  } = useClimateDiscovery();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!paletteOpen) setQuery("");
  }, [paletteOpen]);

  const visibleTags = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CLIMATE_SEARCH_TAGS;
    return CLIMATE_SEARCH_TAGS.filter(
      (t) =>
        t.label.toLowerCase().includes(q) ||
        t.hint.toLowerCase().includes(q) ||
        t.emoji.includes(q)
    );
  }, [query]);

  if (!paletteOpen) return null;

  return (
    <div className="randki-climate-palette fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm">
      <div
        className="randki-climate-palette-panel w-full max-w-lg overflow-hidden rounded-2xl border border-white/12 bg-[#120c18]/95 shadow-2xl shadow-violet-950/50"
        role="dialog"
        aria-modal
        aria-label="Szukaj klimatu"
      >
        <div className="border-b border-white/10 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300/80">
            Szukaj energii
          </p>
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jakiego klimatu dziś szukasz?"
            className="randki-input mt-2 w-full border-0 bg-transparent px-0 text-[15px] text-white placeholder:text-white/35 focus:ring-0"
          />
          <p className="mt-1 text-[11px] text-white/35">Pokoje · obecności · głosy · momenty — nie katalog twarzy.</p>
        </div>

        <div className="max-h-[min(50vh,360px)] overflow-y-auto px-4 py-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-white/40">Klimaty</p>
          <div className="flex flex-wrap gap-1.5">
            {visibleTags.map((tag) => {
              const on = activeTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-full px-2.5 py-1.5 text-left text-[11px] transition ${
                    on
                      ? "bg-violet-500/90 text-white shadow-md shadow-violet-500/25"
                      : "bg-white/8 text-white/75 hover:bg-white/12"
                  }`}
                >
                  <span className="font-medium">
                    {tag.emoji} {tag.label}
                  </span>
                  <span className="mt-0.5 block text-[9px] opacity-70">{tag.hint}</span>
                </button>
              );
            })}
          </div>

          <p className="mb-2 mt-4 text-[10px] font-medium uppercase tracking-wide text-white/40">Subtelnie</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSecondary({ voiceOnly: !secondary.voiceOnly, textPreferred: false })}
              className={`rounded-full px-2.5 py-1 text-[11px] ${secondary.voiceOnly ? "bg-emerald-500/25 text-emerald-100" : "bg-white/8 text-white/60"}`}
            >
              🎙 tylko voice
            </button>
            <button
              type="button"
              onClick={() => setSecondary({ textPreferred: !secondary.textPreferred, voiceOnly: false })}
              className={`rounded-full px-2.5 py-1 text-[11px] ${secondary.textPreferred ? "bg-sky-500/25 text-sky-100" : "bg-white/8 text-white/60"}`}
            >
              💬 wolę pisanie
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-white/10 px-4 py-3">
          <p className="text-[11px] text-white/40">
            {filteredCards.length} {filteredCards.length === 1 ? "obecność" : "obecności"}
            {activeTags.length > 0 && ` · ${activeClimateLabels(activeTags)}`}
          </p>
          <div className="flex gap-2">
            {(activeTags.length > 0 || secondary.voiceOnly || secondary.textPreferred) && (
              <button type="button" onClick={clearTags} className="text-[11px] text-white/40 hover:text-white/70">
                Wyczyść
              </button>
            )}
            <button
              type="button"
              disabled={filteredCards.length === 0}
              onClick={() => {
                startDrift();
                closePalette();
                document.getElementById("randki-discovery")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="randki-btn-primary px-3 py-1.5 text-[12px] disabled:opacity-40"
            >
              🌙 Dryfuj
            </button>
            <button type="button" onClick={closePalette} className="randki-btn-outline px-3 py-1.5 text-[12px]">
              Zamknij
            </button>
          </div>
        </div>
      </div>
      <button type="button" className="absolute inset-0 -z-10" aria-label="Zamknij" onClick={closePalette} />
    </div>
  );
}

export function RandkiDriftOverlay() {
  const { driftActive, stopDrift, filteredCards, driftIndex, setDriftIndex, advanceDrift } = useClimateDiscovery();
  const card = filteredCards[driftIndex];

  if (!driftActive || !card) return null;

  const climate = getRoomClimateForCard(card);
  const quote = card.prompts[0]?.answer ?? card.whyReason;
  const micro = todayStateLabel(card.todayState);
  const name = card.displayName.split(" ")[0];

  return (
    <div className="randki-drift-overlay pointer-events-none fixed inset-x-0 bottom-20 z-[90] flex justify-center px-4 md:bottom-8">
      <div
        className={`pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/15 shadow-2xl ${climateClass(climate.id)}`}
      >
        <div className="relative p-4">
          <RandkiClimateScene climateId={climate.id} />
          <div className="relative">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] uppercase tracking-[0.14em] text-white/50">
                dryf · {climate.emoji} {climate.label}
              </p>
              <button
                type="button"
                onClick={stopDrift}
                className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] text-white/60 hover:text-white"
              >
                stop
              </button>
            </div>
            <p className="mt-2 text-lg font-semibold text-white">{name}</p>
            {micro && <p className="mt-1 text-[11px] text-amber-200/85">{micro}</p>}
            <p className="mt-2 line-clamp-2 text-[13px] italic text-white/75">„{quote}”</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setDriftIndex(Math.max(0, driftIndex - 1));
                }}
                className="randki-btn-outline flex-1 text-[11px]"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => {
                  document.getElementById("randki-discovery")?.scrollIntoView({ behavior: "smooth" });
                  stopDrift();
                }}
                className="randki-btn-primary flex-[2] text-[11px]"
              >
                Wejdź do pokoju
              </button>
              <button type="button" onClick={advanceDrift} className="randki-btn-outline flex-1 text-[11px]">
                →
              </button>
            </div>
            <p className="mt-2 text-center text-[9px] text-white/30">
              {driftIndex + 1} / {filteredCards.length} · portal dryfuje sam
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
