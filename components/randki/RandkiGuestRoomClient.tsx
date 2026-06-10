"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { enterGuestRoomAction, leaveGuestRoomAction } from "@/app/actions/randki";
import { RandkiClimateScene } from "@/components/randki/RandkiClimateScene";
import { RandkiSharedListening } from "@/components/randki/RandkiSharedListening";
import { RandkiEphemeralRoomTimer } from "@/components/randki/RandkiEphemeralRoomTimer";
import { RandkiPresenceReactions, RandkiRoomPresenceTrace } from "@/components/randki/RandkiPresenceReactions";
import { RandkiPresenceDialog } from "@/components/randki/RandkiPresenceDialog";
import { listeningScopeForRoom } from "@/lib/randki/sharedListening";
import { climateClass, getRoomClimateForCard, type RoomClimateId } from "@/lib/randki/roomClimate";
import { todayStateLabel } from "@/lib/randki/todayState";
import type { RandkiDiscoveryCard } from "@/lib/randki/matching";
import type { SharedListeningSource } from "@/lib/randki/sharedListening";
import { randkiPublicHref } from "@/lib/randkiPaths";

type Props = {
  rooms: RandkiDiscoveryCard[];
  phaseLabel: string;
};

export function RandkiGuestLandingClient({ rooms, phaseLabel }: Props) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState("");

  function enter(roomId: string) {
    setMsg("");
    start(async () => {
      const res = await enterGuestRoomAction(roomId);
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      window.location.href = randkiPublicHref(`/pokoj/${encodeURIComponent(roomId)}?guest=1`);
    });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-center text-[13px] text-white/50">
        Wejdź bez profilu — tylko klimat, obecność i opcjonalnie głos. {phaseLabel}.
      </p>
      {msg && <p className="mt-3 text-center text-[13px] text-rose-300">{msg}</p>}
      <ul className="mt-6 space-y-3">
        {rooms.map((card) => {
          const climate = getRoomClimateForCard(card);
          const quote = card.prompts[0]?.answer ?? card.whyReason;
          const micro = todayStateLabel(card.todayState);
          return (
            <li key={card.accountId}>
              <button
                type="button"
                disabled={pending}
                onClick={() => enter(card.accountId)}
                className={`w-full overflow-hidden rounded-2xl border text-left transition hover:border-white/25 ${climateClass(climate.id)}`}
              >
                <div className="relative p-4">
                  <RandkiClimateScene climateId={climate.id} />
                  <div className="relative">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-white/45">
                      {climate.emoji} {climate.label}
                      {card.rotationNew && <span className="ml-2 text-emerald-300">· nowy</span>}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">{card.displayName}</p>
                    {micro && <p className="mt-1 text-[11px] text-amber-200/80">{micro}</p>}
                    <p className="mt-2 text-[13px] italic text-white/65">„{quote}”</p>
                    <p className="mt-3 text-[11px] text-violet-200/80">Dołącz anonimowo →</p>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-8 text-center text-[12px] text-white/35">
        <Link href={randkiPublicHref("/rejestracja")} className="text-rose-300 underline-offset-2 hover:underline">
          Załóż konto
        </Link>
        {" · "}
        gdy poczujesz, że chcesz zostać na dłużej.
      </p>
    </div>
  );
}

type RoomProps = {
  roomId: string;
  displayName: string;
  climateId: RoomClimateId;
  climateLabel: string;
  quote: string;
  microState: string | null;
  guestAlias: string | null;
  isGuest: boolean;
  voiceIntroUrl: string | null;
  listening: SharedListeningSource;
  recentTrace?: string | null;
  ephemeralExpiresAt?: string | null;
  ephemeralDurationLabel?: string | null;
};

export function RandkiGuestRoomClient({
  roomId,
  displayName,
  climateId,
  climateLabel,
  quote,
  microState,
  guestAlias,
  isGuest,
  voiceIntroUrl,
  listening,
  recentTrace,
  ephemeralExpiresAt,
  ephemeralDurationLabel,
}: RoomProps) {
  const [pending, start] = useTransition();
  const [present, setPresent] = useState(isGuest);
  const [alias, setAlias] = useState(guestAlias);
  const [msg, setMsg] = useState("");
  const [trace, setTrace] = useState(recentTrace ?? null);

  function join() {
    start(async () => {
      const res = await enterGuestRoomAction(roomId);
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      setPresent(true);
      setAlias(res.alias);
    });
  }

  function leave() {
    start(async () => {
      await leaveGuestRoomAction();
      setPresent(false);
      setAlias(null);
    });
  }

  return (
    <div className={`mx-auto max-w-2xl overflow-hidden rounded-2xl border border-white/10 ${climateClass(climateId)}`}>
      <div className="relative min-h-[320px] p-6">
        <RandkiClimateScene climateId={climateId} />
        <div className="relative flex min-h-[280px] flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">Pokój · {climateLabel}</p>
            <h1 className="mt-1 text-2xl font-bold text-white">{displayName}</h1>
            {microState && <p className="mt-2 text-[12px] text-amber-200/85">{microState}</p>}
            <p className="mt-4 max-w-md text-[15px] leading-relaxed italic text-white/75">„{quote}”</p>
            {trace && <RandkiRoomPresenceTrace trace={trace} />}
          </div>

          <div className="mt-6 space-y-3">
            {ephemeralExpiresAt && (
              <RandkiEphemeralRoomTimer
                expiresAt={ephemeralExpiresAt}
                durationLabel={ephemeralDurationLabel ?? "30 min"}
              />
            )}
            <RandkiSharedListening source={listening} compact scopeKey={listeningScopeForRoom(roomId)} />
            {present ? (
              <>
                <div className="rounded-xl border border-violet-400/20 bg-violet-950/30 px-4 py-3">
                  <p className="text-[11px] font-medium text-violet-200/90">Obecność anonimowa</p>
                  <p className="mt-1 text-[13px] text-white/80">{alias ?? "Gość · obecny"}</p>
                  <p className="mt-1 text-[10px] text-white/40">Bez zdjęcia · bez profilu · tylko klimat</p>
                </div>
                <RandkiPresenceReactions roomAccountId={roomId} guestMode compact onTrace={setTrace} />
                <RandkiPresenceDialog roomAccountId={roomId} compact />
                {voiceIntroUrl && (
                  <audio controls preload="none" src={voiceIntroUrl} className="w-full opacity-80" />
                )}
                <div className="randki-voice-presence-wave flex h-8 items-end gap-[3px]">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <span
                      key={i}
                      className="randki-voice-presence-bar w-[3px] rounded-full bg-gradient-to-t from-violet-600/40 to-rose-200/70"
                      style={{ animationDelay: `${(i % 11) * 0.06}s` }}
                    />
                  ))}
                </div>
                <button type="button" disabled={pending} onClick={leave} className="randki-btn-outline w-full text-[13px]">
                  Wyjdź cicho
                </button>
              </>
            ) : (
              <>
                <p className="text-[12px] text-white/45">Wejdź bez rejestracji — usłysz klimat, poczuj obecność.</p>
                <button type="button" disabled={pending} onClick={join} className="randki-btn-primary w-full text-[14px]">
                  Dołącz anonimowo
                </button>
              </>
            )}
            {msg && <p className="text-[12px] text-rose-300">{msg}</p>}
            <Link href={randkiPublicHref("/rejestracja")} className="block text-center text-[11px] text-white/35 hover:text-rose-300">
              Chcesz zostać? Załóż konto →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
