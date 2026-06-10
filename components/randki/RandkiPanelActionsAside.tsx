"use client";

import { RandkiDailyMomentBanner } from "@/components/randki/RandkiDailyMomentBanner";
import { RandkiDailyFlow } from "@/components/randki/RandkiPanelChrome";
import { RandkiVoicePromo } from "@/components/randki/RandkiVoicePromo";
import { RandkiVibePicker } from "@/components/randki/RandkiVibePicker";
import { RandkiTodayStatePicker } from "@/components/randki/RandkiTodayStatePicker";
import { RandkiPanelActiveRoomList, RandkiPanelPhasePulse } from "@/components/randki/RandkiPanelRoomDensity";
import { RandkiPresenceInbox } from "@/components/randki/RandkiPresenceDialog";
import type { RandkiDiscoveryCard } from "@/lib/randki/matching";
import type { DayPhaseMeta } from "@/lib/randki/dayRhythm";

type Props = {
  ready: boolean;
  hasMoment: boolean;
  hasPerson: boolean;
  discoveryDone: boolean;
  momentUrl: string | null;
  momentSecondaryUrl?: string | null;
  capturedAt?: string;
  mood: string | null;
  activityIntent: string | null;
  todayState?: string | null;
  todayStateUpdatedAt?: string | null;
  isEvening: boolean;
  dayPhase: DayPhaseMeta;
  onlineCount?: number;
  activeRoomCards?: RandkiDiscoveryCard[];
  presenceInbox?: {
    id: string;
    traceLabel: string;
    reactionId: string;
    guestAlias: string | null;
    replies: { traceLabel: string; reactionId: string }[];
  }[];
};

export function RandkiPanelActionsAside({
  ready,
  hasMoment,
  hasPerson,
  discoveryDone,
  momentUrl,
  momentSecondaryUrl,
  capturedAt,
  mood,
  activityIntent,
  todayState = null,
  todayStateUpdatedAt = null,
  isEvening,
  dayPhase,
  onlineCount = 0,
  activeRoomCards = [],
  presenceInbox = [],
}: Props) {
  return (
    <aside className="randki-panel-actions flex flex-col gap-3">
      <div className="text-center lg:text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-400">{dayPhase.actionEyebrow}</p>
        <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-white">{dayPhase.actionTitle}</h1>
        <p className="mt-1 text-[11px] text-white/40">{dayPhase.energy}</p>
      </div>

      {ready && (
        <RandkiDailyFlow hasMoment={hasMoment} hasPerson={hasPerson} discoveryDone={discoveryDone} />
      )}

      {ready && (
        <RandkiDailyMomentBanner
          hasMomentToday={hasMoment}
          momentUrl={momentUrl}
          momentSecondaryUrl={momentSecondaryUrl}
          capturedAt={capturedAt}
          compact
        />
      )}

      {presenceInbox.length > 0 && <RandkiPresenceInbox entries={presenceInbox} />}

      <RandkiVoicePromo isEvening={isEvening} />
      <RandkiTodayStatePicker initialState={todayState} initialUpdatedAt={todayStateUpdatedAt} />
      <RandkiVibePicker initialMood={mood} initialActivity={activityIntent} isEvening={isEvening} />

      {activeRoomCards.length > 0 && (
        <RandkiPanelActiveRoomList cards={activeRoomCards} max={4} title="Teraz obecni" />
      )}

      {(onlineCount > 0 || activeRoomCards.length > 0) && (
        <div className="pt-1">
          <RandkiPanelPhasePulse
            onlineCount={onlineCount}
            activeRooms={activeRoomCards.length}
            dayPhaseLabel={dayPhase.label}
          />
        </div>
      )}
    </aside>
  );
}
