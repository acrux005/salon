import Link from "next/link";
import type { LiveFeedItem } from "@/lib/randki/liveFeed";
import { RandkiLiveFeedTicker } from "@/components/randki/RandkiLiveFeedTicker";
import { RandkiPanelActiveRoomList } from "@/components/randki/RandkiPanelRoomDensity";
import { RandkiClimateSidebarHints } from "@/components/randki/RandkiClimateSidebarHints";
import type { RandkiDiscoveryCard } from "@/lib/randki/matching";
import type { DayPhaseMeta } from "@/lib/randki/dayRhythm";
import { isVoicePeakPhase } from "@/lib/randki/dayRhythm";
import { softPresenceCount } from "@/lib/randki/softPresence";
import { randkiPublicHref } from "@/lib/randkiPaths";

function VoicePresenceStrip({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="randki-voice-presence shrink-0 rounded-xl border border-violet-500/25 bg-violet-950/40 px-3 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-medium text-violet-200/90">🎙 Obecność głosem</p>
        <span className="flex items-center gap-1 text-[9px] text-violet-200/70">
          <span className="randki-voice-presence-dot h-1.5 w-1.5 rounded-full bg-violet-400/60" />
          w tle
        </span>
      </div>
      <div className="randki-voice-presence-wave mt-2 flex h-5 items-end gap-[2px]">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="randki-voice-presence-bar w-[2px] rounded-full bg-gradient-to-t from-violet-600/50 to-rose-200/80"
            style={{ animationDelay: `${(i % 9) * 0.07}s` }}
          />
        ))}
      </div>
      <Link
        href={randkiPublicHref("/voice-match")}
        className="mt-2 inline-block text-[10px] text-rose-300/85 underline-offset-2 hover:underline"
      >
        Dołącz bez kamery →
      </Link>
    </div>
  );
}

export function RandkiLiveFeed({
  items,
  onlineInCity,
  cityLabel,
  variant = "sidebar",
  dayPhase,
  voiceActive = false,
  roomCards = [],
}: {
  items: LiveFeedItem[];
  onlineInCity: number;
  isEvening: boolean;
  cityLabel: string | null;
  variant?: "hero" | "sidebar";
  dayPhase?: DayPhaseMeta;
  voiceActive?: boolean;
  roomCards?: RandkiDiscoveryCard[];
}) {
  const isHero = variant === "hero";
  const title = dayPhase?.liveFeedTitle ?? "Dzieje się teraz";
  const showVoice = voiceActive || (dayPhase && isVoicePeakPhase(dayPhase.id));

  return (
    <aside className={isHero ? "randki-live-feed-aside lg:sticky lg:top-24 lg:self-start" : "hidden xl:block"}>
      <div
        className={`randki-glass-strong randki-room-life flex flex-col rounded-2xl p-3 ${
          isHero ? "randki-live-feed--hero" : "sticky top-24"
        }`}
      >
        <div className="shrink-0 space-y-1 px-0.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">{title}</p>
              {dayPhase && (
                <p className="mt-0.5 text-[10px] leading-snug text-white/38">
                  {dayPhase.emoji} {dayPhase.liveFeedHint}
                </p>
              )}
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] text-white/45">
              {softPresenceCount(onlineInCity)}
            </span>
          </div>
          {cityLabel && <p className="text-[9px] text-white/28">{cityLabel} · obecność w tej porze</p>}
        </div>

        <VoicePresenceStrip active={!!showVoice} />

        <div className="randki-live-feed-body mt-2 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-y-contain">
          <RandkiLiveFeedTicker items={items} compact={isHero} fill={isHero && roomCards.length === 0} />

          {isHero && <RandkiClimateSidebarHints />}

          {roomCards.length > 0 && (
            <RandkiPanelActiveRoomList cards={roomCards} max={isHero ? 4 : 3} title="Pokoje w tej porze" />
          )}
        </div>

        {roomCards.length === 0 && (
          <div className="randki-room-life-presence mt-auto shrink-0 rounded-lg border border-white/8 bg-[#0c0814]/95 px-2.5 py-2 pt-3">
            <p className="text-[9px] font-medium uppercase tracking-wide text-white/35">Obecność w pokojach</p>
            <div className="mt-1.5 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className="randki-room-life-pulse h-1.5 flex-1 rounded-full bg-gradient-to-r from-violet-500/30 to-rose-400/20"
                  style={{ animationDelay: `${i * 0.35}s` }}
                />
              ))}
            </div>
            <p className="mt-1.5 text-[9px] italic text-white/30">obecność, nie performance</p>
          </div>
        )}
      </div>
    </aside>
  );
}
