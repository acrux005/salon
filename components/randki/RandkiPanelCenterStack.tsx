"use client";

import { useEffect } from "react";
import { RandkiPanelLiveHero, type RandkiPanelLiveHeroProps } from "@/components/randki/RandkiPanelLiveHero";
import { RandkiDiscoveryClient } from "@/components/randki/RandkiDiscoveryClient";
import { useClimateDiscovery } from "@/components/randki/RandkiClimateDiscoveryContext";
import type { DayPhaseMeta } from "@/lib/randki/dayRhythm";
import type { RandkiDiscoveryCard } from "@/lib/randki/matching";
import { RandkiAmbientPresence } from "@/components/randki/RandkiAmbientPresence";
import type { AmbientPanelContext } from "@/lib/randki/ambientPresence";

type DiscoveryProps = {
  initialCards: RandkiDiscoveryCard[];
  profileIncomplete: boolean;
  incompleteReason?: "complete" | "photo" | "onboarding";
  initialDailyResonances?: number;
  dailyLimit?: number;
  impressionsToday?: number;
  discoveryLimit?: number;
  demoBrowseMode?: boolean;
};

type Props = {
  hero: RandkiPanelLiveHeroProps;
  discovery: DiscoveryProps;
  dayPhase: DayPhaseMeta;
  ambient?: AmbientPanelContext | null;
};

export function RandkiPanelCenterStack({ hero, discovery, dayPhase, ambient }: Props) {
  const { registerCards } = useClimateDiscovery();

  useEffect(() => {
    registerCards(discovery.initialCards);
  }, [discovery.initialCards, registerCards]);

  return (
    <div className="randki-panel-hero-center flex w-full flex-col gap-4">
      <RandkiPanelLiveHero {...hero} compact />

      <div id="randki-discovery" className="scroll-mt-24">
        <div className="mb-3 border-b border-white/10 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300/90">
            {dayPhase.discoveryEyebrow}
          </p>
          <h2 className="mt-0.5 text-base font-semibold text-white/90">{dayPhase.discoveryTitle}</h2>
          <p className="mt-0.5 text-[11px] text-white/40">
            {dayPhase.emoji} {dayPhase.energy}
          </p>
        </div>
        {ambient && discovery.initialCards.length === 0 && !discovery.demoBrowseMode && (
          <RandkiAmbientPresence ambient={ambient} />
        )}
        <RandkiDiscoveryClient embedded {...discovery} />
      </div>
    </div>
  );
}
