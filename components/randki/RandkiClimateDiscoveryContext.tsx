"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { RandkiDiscoveryCard } from "@/lib/randki/matching";
import {
  CLIMATE_SEARCH_TAGS,
  DEFAULT_CLIMATE_SECONDARY,
  filterCardsByClimateSearch,
  type ClimateSecondaryFilters,
} from "@/lib/randki/climateDiscovery";

type ClimateDiscoveryContextValue = {
  paletteOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
  activeTags: string[];
  toggleTag: (id: string) => void;
  clearTags: () => void;
  secondary: ClimateSecondaryFilters;
  setSecondary: (patch: Partial<ClimateSecondaryFilters>) => void;
  registerCards: (cards: RandkiDiscoveryCard[]) => void;
  allCards: RandkiDiscoveryCard[];
  filteredCards: RandkiDiscoveryCard[];
  driftActive: boolean;
  startDrift: () => void;
  stopDrift: () => void;
  toggleDrift: () => void;
  driftIndex: number;
  setDriftIndex: (i: number) => void;
  advanceDrift: () => void;
};

const ClimateDiscoveryContext = createContext<ClimateDiscoveryContextValue | null>(null);

export function RandkiClimateDiscoveryProvider({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [secondary, setSecondaryState] = useState<ClimateSecondaryFilters>(DEFAULT_CLIMATE_SECONDARY);
  const [allCards, setAllCards] = useState<RandkiDiscoveryCard[]>([]);
  const [driftActive, setDriftActive] = useState(false);
  const [driftIndex, setDriftIndex] = useState(0);

  const filteredCards = useMemo(
    () => filterCardsByClimateSearch(allCards, activeTags, secondary),
    [allCards, activeTags, secondary]
  );

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const togglePalette = useCallback(() => setPaletteOpen((v) => !v), []);

  const toggleTag = useCallback((id: string) => {
    setActiveTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
    setDriftIndex(0);
  }, []);

  const clearTags = useCallback(() => {
    setActiveTags([]);
    setSecondaryState(DEFAULT_CLIMATE_SECONDARY);
    setDriftIndex(0);
  }, []);

  const setSecondary = useCallback((patch: Partial<ClimateSecondaryFilters>) => {
    setSecondaryState((s) => ({ ...s, ...patch }));
    setDriftIndex(0);
  }, []);

  const registerCards = useCallback((cards: RandkiDiscoveryCard[]) => {
    setAllCards(cards);
  }, []);

  const startDrift = useCallback(() => {
    setDriftActive(true);
    setDriftIndex(0);
    setPaletteOpen(false);
  }, []);

  const stopDrift = useCallback(() => setDriftActive(false), []);
  const toggleDrift = useCallback(() => setDriftActive((v) => !v), []);

  const advanceDrift = useCallback(() => {
    setDriftIndex((i) => {
      const len = filterCardsByClimateSearch(allCards, activeTags, secondary).length;
      if (len <= 1) return 0;
      return (i + 1) % len;
    });
  }, [allCards, activeTags, secondary]);

  useEffect(() => {
    if (!driftActive) return;
    const ms = 9000 + (driftIndex % 3) * 1500;
    const t = window.setTimeout(advanceDrift, ms);
    return () => window.clearTimeout(t);
  }, [driftActive, driftIndex, advanceDrift]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      const inField = tag === "input" || tag === "textarea" || (e.target as HTMLElement)?.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        togglePalette();
        return;
      }
      if (!inField && e.key === "/") {
        e.preventDefault();
        openPalette();
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setDriftActive(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePalette, openPalette]);

  const value = useMemo(
    () => ({
      paletteOpen,
      openPalette,
      closePalette,
      togglePalette,
      activeTags,
      toggleTag,
      clearTags,
      secondary,
      setSecondary,
      registerCards,
      allCards,
      filteredCards,
      driftActive,
      startDrift,
      stopDrift,
      toggleDrift,
      driftIndex,
      setDriftIndex,
      advanceDrift,
    }),
    [
      paletteOpen,
      openPalette,
      closePalette,
      togglePalette,
      activeTags,
      toggleTag,
      clearTags,
      secondary,
      setSecondary,
      registerCards,
      allCards,
      filteredCards,
      driftActive,
      startDrift,
      stopDrift,
      toggleDrift,
      driftIndex,
      advanceDrift,
    ]
  );

  return <ClimateDiscoveryContext.Provider value={value}>{children}</ClimateDiscoveryContext.Provider>;
}

export function useClimateDiscovery() {
  const ctx = useContext(ClimateDiscoveryContext);
  if (!ctx) {
    throw new Error("useClimateDiscovery must be used within RandkiClimateDiscoveryProvider");
  }
  return ctx;
}

export function useClimateDiscoveryOptional() {
  return useContext(ClimateDiscoveryContext);
}

export { CLIMATE_SEARCH_TAGS };
