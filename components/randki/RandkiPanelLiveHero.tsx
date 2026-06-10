"use client";

import { useEffect, useMemo, useState } from "react";
import type { LiveFeedItem } from "@/lib/randki/liveFeed";
import type { RandkiDiscoveryCard } from "@/lib/randki/matching";
import type { DayPhaseMeta } from "@/lib/randki/dayRhythm";
import { INTERACTION_COPY } from "@/lib/randki/presenceInteractions";
import { softPhaseLabel } from "@/lib/randki/softPresence";
import { climateClass, getRoomClimateForCard, type RoomClimateId } from "@/lib/randki/roomClimate";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const FLOATING_BY_PHASE: Record<DayPhaseMeta["id"], { top: string; left: string; text: string }[]> = {
  morning: [
    { top: "16%", left: "56%", text: "kawa parzy się" },
    { top: "34%", left: "70%", text: "powolny start" },
    { top: "58%", left: "52%", text: "miękka obecność" },
  ],
  day: [
    { top: "16%", left: "56%", text: "cowork w tle" },
    { top: "34%", left: "70%", text: "ktoś pisze" },
    { top: "58%", left: "52%", text: "lunch break" },
  ],
  sunset: [
    { top: "16%", left: "56%", text: "golden hour" },
    { top: "34%", left: "70%", text: "spacer powrotny" },
    { top: "58%", left: "52%", text: "muzyka w tle" },
  ],
  evening: [
    { top: "16%", left: "56%", text: "voice aktywny" },
    { top: "34%", left: "70%", text: "ktoś słucha" },
    { top: "58%", left: "52%", text: "nowy moment" },
  ],
  night: [
    { top: "16%", left: "56%", text: "ambient voice" },
    { top: "34%", left: "70%", text: "ktoś nie śpi" },
    { top: "58%", left: "52%", text: "cisza w pokoju" },
  ],
};

export type RandkiPanelLiveHeroProps = {
  featuredCard: RandkiDiscoveryCard | null;
  guestCards: RandkiDiscoveryCard[];
  microEvents: LiveFeedItem[];
  onlineCount: number;
  presentCount: number;
  isEvening: boolean;
  voiceActive?: boolean;
  dayPhase: DayPhaseMeta;
  /** Niższy hero gdy pod spodem jest siatka pokoi. */
  compact?: boolean;
};

function resolveUrl(url: string | null | undefined, fallback: string) {
  if (!url) return fallback;
  return url.startsWith("http") ? url : `${BASE_PATH}${url}`;
}

function listeningFromCard(card: RandkiDiscoveryCard): string {
  const music = card.vibeMaterials.find((m) => m.slotType === "music");
  if (card.interests.some((i) => /jazz/i.test(i))) return "słucha jazzu";
  if (music?.title) return `puszcza „${music.title}”`;
  if (music?.caption) return music.caption.split(",")[0]?.trim() ?? "coś gra w tle";
  return "coś cicho gra w tle";
}

function formatVoiceTime(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function RandkiPanelLiveHero({
  featuredCard,
  guestCards,
  microEvents,
  onlineCount,
  presentCount,
  isEvening,
  voiceActive = true,
  dayPhase,
  compact = false,
}: RandkiPanelLiveHeroProps) {
  const [voiceSec, setVoiceSec] = useState(192);
  const [floatIdx, setFloatIdx] = useState(0);
  const [momentIdx, setMomentIdx] = useState(0);

  const fallbackPhoto = "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80";
  const climate = featuredCard ? getRoomClimateForCard(featuredCard) : null;
  const heroPhoto = resolveUrl(
    featuredCard?.auraImageUrl ?? featuredCard?.dailyMomentUrl ?? featuredCard?.photoUrl,
    fallbackPhoto
  );
  const hostName = featuredCard?.displayName?.split(" ")[0] ?? "Ania";
  const listening = featuredCard ? listeningFromCard(featuredCard) : "słucha jazzu";
  const joiner = guestCards[0]?.displayName?.split(" ")[0] ?? "Kuba";
  const quote =
    featuredCard?.prompts[0]?.answer?.slice(0, 72) ??
    featuredCard?.auraCaption ??
    "nie chce mi się jeszcze spać";

  const microMoments = useMemo(() => {
    const fromFeed = microEvents.slice(0, 4).map((e) => e.text);
    const fromCards = guestCards.map(
      (g) => `${g.displayName.split(" ")[0]} — ${g.whyReason.split("—").pop()?.trim() ?? "obecny"}`
    );
    return [...fromFeed, ...fromCards, `${hostName} ${listening}`].filter(Boolean);
  }, [microEvents, guestCards, hostName, listening]);

  const floatingStatuses = FLOATING_BY_PHASE[dayPhase.id];

  useEffect(() => {
    if (!voiceActive) return;
    const t = setInterval(() => setVoiceSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [voiceActive]);

  useEffect(() => {
    const t = setInterval(() => setFloatIdx((i) => (i + 1) % floatingStatuses.length), 5200);
    return () => clearInterval(t);
  }, [floatingStatuses.length]);

  useEffect(() => {
    if (microMoments.length === 0) return;
    const t = setInterval(() => setMomentIdx((i) => (i + 1) % microMoments.length), 3800);
    return () => clearInterval(t);
  }, [microMoments.length]);

  function enterRoom() {
    document.getElementById("randki-discovery")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const title = dayPhase.heroTitle;
  const roomLabel = climate?.label ?? dayPhase.heroRoomLabel;
  const peopleHere = Math.max(presentCount, 1 + guestCards.length);
  const float = floatingStatuses[floatIdx];
  const rollingMoment = microMoments[momentIdx % microMoments.length] ?? `${hostName} ${listening}`;

  return (
    <div
      className={`randki-live-hero randki-live-hero--stage relative min-h-0 overflow-hidden rounded-[1.25rem] ${
        compact ? "randki-live-hero--compact shrink-0" : "flex-1"
      } ${climate ? climateClass(climate.id) : ""}`}
    >
      <LiveHeroLayers
        isEvening={isEvening}
        heroPhoto={heroPhoto}
        dayPhaseId={dayPhase.id}
        climateId={climate?.id}
      />

      {float && (
        <span
          key={float.text}
          className="randki-live-hero-float pointer-events-none absolute z-10 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[10px] text-white/75 backdrop-blur-md"
          style={{ top: float.top, left: float.left }}
        >
          ✨ {float.text}
        </span>
      )}

      <div className="relative flex h-full min-h-[280px] flex-col p-4 sm:p-5 lg:min-h-[320px] lg:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-medium text-white/50">
              <span>{climate?.emoji ?? "🌙"}</span>
              <span className="uppercase tracking-[0.14em]">Pokój {roomLabel}</span>
            </p>
            <h2 className="mt-0.5 text-xl font-bold tracking-tight text-white sm:text-2xl">„{title}”</h2>
          </div>
          <span className="randki-live-hero-live shrink-0 rounded-full border border-violet-400/25 bg-violet-950/40 px-2.5 py-1 text-[10px] font-medium text-violet-200/90">
            {softPhaseLabel(dayPhase.emoji, onlineCount)}
          </span>
        </div>

        <div className="mt-3 flex flex-1 flex-col justify-between gap-3">
          <ul className="space-y-1.5 text-[13px] text-white/85">
            <li className="flex items-center gap-2">
              <span className="text-sm">🎧</span> {hostName} {listening}
            </li>
            <li className="randki-live-hero-join flex items-center gap-2 text-violet-200/90">
              <span className="text-sm">✨</span> {joiner} właśnie dołączył
            </li>
            {voiceActive && (
              <li className="flex items-center gap-2 text-white/70">
                <span className="text-sm">🎙</span> voice trwa {formatVoiceTime(voiceSec)}
              </li>
            )}
          </ul>

          <div className="flex flex-wrap gap-1.5 text-[11px] text-white/60">
            {dayPhase.ambientChips.map((chip) => (
              <span key={chip} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                {chip}
              </span>
            ))}
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">👥 {peopleHere} osoby</span>
          </div>

          <div className="randki-live-hero-wave flex h-7 items-end gap-[3px] opacity-85 sm:h-8">
            {Array.from({ length: 32 }).map((_, i) => (
              <span
                key={i}
                className="randki-live-hero-bar w-[3px] rounded-full bg-gradient-to-t from-violet-600/45 via-rose-300/90 to-amber-100"
                style={{ animationDelay: `${(i % 11) * 0.05}s`, height: `${30 + ((i * 9) % 70)}%` }}
              />
            ))}
          </div>

          <blockquote className="max-w-md border-l-2 border-amber-400/35 pl-3 text-[13px] italic leading-snug text-white/72 sm:text-[14px]">
            „{quote}”
          </blockquote>

          <p key={rollingMoment} className="randki-live-hero-moment truncate text-[11px] text-white/40">
            · {rollingMoment}
          </p>
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <HeroAvatars
            guestCards={guestCards}
            hostName={hostName}
            featuredCard={featuredCard}
            heroPhoto={heroPhoto}
            fallbackPhoto={fallbackPhoto}
          />
          <button
            type="button"
            onClick={enterRoom}
            className="randki-live-hero-cta randki-btn-primary w-full px-6 py-3 text-[14px] font-semibold sm:w-auto"
          >
            {INTERACTION_COPY.enterRoom} →
          </button>
        </div>
      </div>
    </div>
  );
}

function LiveHeroLayers({
  isEvening,
  heroPhoto,
  dayPhaseId,
  climateId,
}: {
  isEvening: boolean;
  heroPhoto: string;
  dayPhaseId: DayPhaseMeta["id"];
  climateId?: RoomClimateId;
}) {
  const showWindows = isEvening || dayPhaseId === "sunset" || dayPhaseId === "night";
  const showMorningMist = dayPhaseId === "morning";
  const photoOpacity = dayPhaseId === "morning" || dayPhaseId === "day" ? 0.1 : 0.16;
  return (
    <>
      <div className="randki-live-hero-ambient pointer-events-none absolute inset-0" />
      {climateId && <div className={`randki-live-hero-climate-wash randki-climate--${climateId} pointer-events-none absolute inset-0`} />}
      {showMorningMist && <div className="randki-live-hero-mist pointer-events-none absolute inset-0" />}
      <div className="randki-live-hero-rain pointer-events-none absolute inset-0 opacity-[0.1]" />
      <div className="randki-live-hero-particles pointer-events-none absolute inset-0">
        {Array.from({ length: 32 }).map((_, i) => (
          <span
            key={i}
            className="randki-live-hero-particle absolute rounded-full bg-white/20"
            style={{
              width: i % 4 === 0 ? 3 : 2,
              height: i % 4 === 0 ? 3 : 2,
              left: `${(i * 13 + 4) % 100}%`,
              top: `${(i * 19 + 7) % 100}%`,
              animationDelay: `${(i % 8) * 0.65}s`,
              animationDuration: `${4 + (i % 5)}s`,
            }}
          />
        ))}
      </div>
      {showWindows && (
        <div className="randki-live-hero-windows pointer-events-none absolute inset-0">
          {[
            { t: "14%", l: "10%", w: 12, h: 14 },
            { t: "8%", l: "78%", w: 14, h: 16 },
            { t: "48%", l: "84%", w: 11, h: 13 },
          ].map((w, i) => (
            <span
              key={i}
              className="randki-live-hero-window absolute rounded-sm bg-amber-200/28"
              style={{ top: w.t, left: w.l, width: w.w, height: w.h, animationDelay: `${i * 0.8}s` }}
            />
          ))}
        </div>
      )}
      <div
        className="randki-live-hero-drift absolute inset-0 scale-105 bg-cover bg-center blur-[3px]"
        style={{ backgroundImage: `url(${heroPhoto})`, opacity: photoOpacity }}
      />
      <div className="randki-live-hero-vignette pointer-events-none absolute inset-0" />
      <div className="randki-live-hero-color-veil pointer-events-none absolute inset-0" />
      <div className="randki-live-hero-lamp-glow pointer-events-none absolute left-[10%] top-[20%] h-16 w-16 rounded-full bg-amber-300/18 blur-2xl" />
    </>
  );
}

function HeroAvatars({
  guestCards,
  hostName,
  featuredCard,
  heroPhoto,
  fallbackPhoto,
}: {
  guestCards: RandkiDiscoveryCard[];
  hostName: string;
  featuredCard: RandkiDiscoveryCard | null;
  heroPhoto: string;
  fallbackPhoto: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex -space-x-2.5">
        <div
          title={hostName}
          className="relative h-9 w-9 rounded-full border-2 border-[#1a1028] bg-cover bg-center ring-2 ring-amber-400/25"
          style={{ backgroundImage: `url(${resolveUrl(featuredCard?.photoUrl, heroPhoto)})`, zIndex: 4 }}
        />
        {guestCards.slice(0, 3).map((g, idx) => (
          <div
            key={g.accountId}
            title={g.displayName}
            className="h-9 w-9 rounded-full border-2 border-[#1a1028] bg-cover bg-center"
            style={{
              backgroundImage: `url(${resolveUrl(g.photoUrl, fallbackPhoto)})`,
              zIndex: 3 - idx,
            }}
          />
        ))}
      </div>
      <p className="text-[11px] text-white/45">
        <span className="randki-live-hero-lamp mr-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-300 align-middle" />
        {hostName} prowadzi
      </p>
    </div>
  );
}
