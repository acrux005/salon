"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  blockDatingUserAction,
  resonateWithRoomAction,
  driftFromRoomAction,
  refreshDiscoveryAction,
  reportDatingUserAction,
  undoDriftAction,
} from "@/app/actions/randki";
import type { RandkiDiscoveryCard } from "@/lib/randki/matching";
import { isDemoDiscoveryAccountId } from "@/lib/randki/demoDiscoveryCards";
import { RandkiRoom, discoveryCardToRoom } from "@/components/randki/RandkiRoom";
import { RandkiRoomPreviewCard } from "@/components/randki/RandkiRoomPreviewCard";
import { getRoomClimateForCard, getRoomTemperatureForCard } from "@/lib/randki/roomClimate";
import { useRandkiDayPhase } from "@/lib/randki/useRandkiDayPhase";
import { randkiPublicHref } from "@/lib/randkiPaths";
import { enterGuestRoomAction } from "@/app/actions/randki";
import { useClimateDiscovery } from "@/components/randki/RandkiClimateDiscoveryContext";
import { INTERACTION_COPY } from "@/lib/randki/presenceInteractions";
import { activeClimateLabels, filterCardsByClimateSearch } from "@/lib/randki/climateDiscovery";
import { filterExpiredEphemeralCards } from "@/lib/randki/roomRotation";
import { RandkiEphemeralRoomTimer } from "@/components/randki/RandkiEphemeralRoomTimer";
import { RandkiPresenceReactions } from "@/components/randki/RandkiPresenceReactions";
import { RandkiPresenceDialog } from "@/components/randki/RandkiPresenceDialog";
import { RandkiMomentHero } from "@/components/randki/RandkiMomentHero";
import { RandkiSharedListening } from "@/components/randki/RandkiSharedListening";
import { pickSharedListeningFromCard, listeningScopeForRoom } from "@/lib/randki/sharedListening";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const FALLBACK = "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80";

function resolveUrl(url: string | null) {
  if (!url) return FALLBACK;
  return url.startsWith("http") ? url : `${BASE_PATH}${url}`;
}

export function RandkiDiscoveryClient({
  initialCards,
  profileIncomplete,
  incompleteReason = "complete",
  initialDailyResonances = 0,
  dailyLimit = 15,
  impressionsToday = 0,
  discoveryLimit = 1,
  demoBrowseMode = false,
  embedded = false,
}: {
  initialCards: RandkiDiscoveryCard[];
  profileIncomplete: boolean;
  incompleteReason?: "complete" | "photo" | "onboarding";
  initialDailyResonances?: number;
  dailyLimit?: number;
  impressionsToday?: number;
  discoveryLimit?: number;
  demoBrowseMode?: boolean;
  embedded?: boolean;
}) {
  const [cards, setCards] = useState(initialCards);
  const [current, setCurrent] = useState(0);
  const [msg, setMsg] = useState("");
  const [matchBanner, setMatchBanner] = useState<string | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [dailyResonances, setDailyResonances] = useState(initialDailyResonances);
  const [impressions, setImpressions] = useState(impressionsToday);
  const [lastPass, setLastPass] = useState<{ card: RandkiDiscoveryCard; index: number } | null>(null);
  const [photoRevealed, setPhotoRevealed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [guestPending, startGuest] = useTransition();
  const [, startLoadMore] = useTransition();
  const dayPhase = useRandkiDayPhase();
  const { activeTags, secondary, registerCards, setDriftIndex, openPalette } = useClimateDiscovery();

  const displayCards = useMemo(
    () => filterExpiredEphemeralCards(filterCardsByClimateSearch(cards, activeTags, secondary)),
    [cards, activeTags, secondary]
  );

  useEffect(() => {
    registerCards(cards);
  }, [cards, registerCards]);

  useEffect(() => {
    setCurrent(0);
    setExpanded(false);
    setDriftIndex(0);
  }, [activeTags, secondary, setDriftIndex]);

  const card = displayCards[Math.min(current, Math.max(0, displayCards.length - 1))];

  function selectCard(index: number) {
    setCurrent(index);
    setExpanded(true);
    setPhotoRevealed(false);
    setShowReport(false);
    setMsg("");
  }

  function joinAsGuest() {
    if (!card) return;
    startGuest(async () => {
      const res = await enterGuestRoomAction(card.accountId);
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      window.location.href = randkiPublicHref(`/pokoj/${encodeURIComponent(card.accountId)}?guest=1`);
    });
  }

  async function loadMore() {
    startLoadMore(async () => {
      const res = await refreshDiscoveryAction(cards.length);
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      if (res.cards.length === 0) {
        setMsg("Na dziś wykorzystałeś limit pokoi. Wróć jutro!");
        return;
      }
      setCards((prev) => [...prev, ...res.cards]);
      setDailyResonances(res.dailyResonances);
      setImpressions(res.impressionsToday);
      setMsg("");
    });
  }

  async function act(liked: boolean) {
    if (!card) return;
    setMsg("");
    setShowReport(false);
    if (demoBrowseMode || isDemoDiscoveryAccountId(card.accountId)) {
      if (liked) setDailyResonances((d) => d + 1);
      setPhotoRevealed(false);
      setExpanded(false);
      setCurrent((i) => i + 1);
      return;
    }
    if (liked) {
      const res = await resonateWithRoomAction(card.accountId);
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      setDailyResonances((d) => d + 1);
      if (res.matched) {
        setMatchBanner(INTERACTION_COPY.matchOrganic(card.displayName));
        setMatchId(res.matchId ?? null);
        setLastPass(null);
      }
    } else {
      const res = await driftFromRoomAction(card.accountId);
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      setLastPass({ card, index: current });
    }
    setPhotoRevealed(false);
    setExpanded(false);
    setCurrent((i) => i + 1);
  }

  async function blockUser() {
    if (!card) return;
    if (demoBrowseMode || isDemoDiscoveryAccountId(card.accountId)) {
      setMsg("Podgląd — blokada niedostępna.");
      setCurrent((i) => i + 1);
      setExpanded(false);
      setPhotoRevealed(false);
      return;
    }
    const res = await blockDatingUserAction(card.accountId);
    if (!res.ok) setMsg(res.error);
    else {
      setMsg("Użytkownik zablokowany.");
      setCurrent((i) => i + 1);
      setExpanded(false);
      setPhotoRevealed(false);
    }
  }

  async function submitReport() {
    if (!card) return;
    if (demoBrowseMode || isDemoDiscoveryAccountId(card.accountId)) {
      setMsg("Podgląd — zgłoszenia niedostępne.");
      setShowReport(false);
      setCurrent((i) => i + 1);
      setExpanded(false);
      setPhotoRevealed(false);
      return;
    }
    const res = await reportDatingUserAction(card.accountId, reportReason);
    if (!res.ok) setMsg(res.error);
    else {
      setMsg("Zgłoszenie wysłane. Pokój ukryty.");
      setShowReport(false);
      setCurrent((i) => i + 1);
      setExpanded(false);
      setPhotoRevealed(false);
    }
  }

  async function undoPass() {
    if (!lastPass) return;
    if (demoBrowseMode || isDemoDiscoveryAccountId(lastPass.card.accountId)) {
      setCards((prev) => {
        const next = [...prev];
        next.splice(lastPass.index, 0, lastPass.card);
        return next;
      });
      setCurrent(lastPass.index);
      setLastPass(null);
      setPhotoRevealed(false);
      setExpanded(true);
      setMsg("");
      return;
    }
    const res = await undoDriftAction(lastPass.card.accountId);
    if (!res.ok) {
      setMsg(res.error);
      return;
    }
    setCards((prev) => {
      const next = [...prev];
      next.splice(lastPass.index, 0, lastPass.card);
      return next;
    });
    setCurrent(lastPass.index);
    setLastPass(null);
    setPhotoRevealed(false);
    setExpanded(true);
    setMsg("");
  }

  if (profileIncomplete) {
    const titles = {
      photo: "Dodaj polaroid",
      onboarding: "Poznajmy Cię lepiej",
      complete: "Uzupełnij pokój",
    };
    const descs = {
      photo: "Bez co najmniej jednego zdjęcia nie zaprosimy gości do Twojego pokoju.",
      onboarding: "Krótki quiz o stylu życia — lepsze dopasowania niż sam wygląd.",
      complete: "Bez pokoju nie pokażemy Ci innych przestrzeni.",
    };
    const href = incompleteReason === "onboarding" ? "/onboarding" : "/profil";
    return (
      <div className="randki-glass mx-auto max-w-lg p-8 text-center">
        <h2 className="text-xl font-bold text-white">{titles[incompleteReason]}</h2>
        <p className="mt-2 text-[14px] text-white/60">{descs[incompleteReason]}</p>
        <Link href={randkiPublicHref(href)} className="randki-btn-primary mt-6 inline-block">
          {incompleteReason === "onboarding" ? "Rozpocznij quiz →" : "Udekoruj pokój →"}
        </Link>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="randki-glass mx-auto max-w-lg p-8 text-center">
        <h2 className="text-xl font-bold text-white">Na dziś wszystko</h2>
        <p className="mt-2 text-[14px] text-white/60">Jedna przestrzeń dziennie — slow intimacy zamiast katalogu profili.</p>
        <Link href={randkiPublicHref("/dopasowania")} className="randki-btn-primary mt-6 inline-block">
          Zobacz dopasowania
        </Link>
      </div>
    );
  }

  const room = discoveryCardToRoom(card);
  const photoUrls = card.photoUrls.length > 0 ? card.photoUrls : card.photoUrl ? [card.photoUrl] : [];
  const climate = getRoomClimateForCard(card);
  const temperature = getRoomTemperatureForCard(card);
  const sharedListening = pickSharedListeningFromCard(card, dayPhase.id);

  return (
    <div className={`randki-discovery-cards ${embedded ? "randki-discovery-cards--embedded max-w-none" : "mx-auto max-w-5xl"}`}>
      <p className="mb-3 text-center text-[12px] text-white/45">
        {activeTags.length > 0 ? (
          <>
            {activeClimateLabels(activeTags)} · {displayCards.length}{" "}
            {displayCards.length === 1 ? "obecność" : "obecności"}
          </>
        ) : demoBrowseMode ? (
          `${dayPhase.discoveryEyebrow} · ${displayCards.length} pokoi · ${dayPhase.emoji} ${dayPhase.label.toLowerCase()}`
        ) : (
          INTERACTION_COPY.resonanceToday(dailyResonances, dailyLimit)
        )}
        {!demoBrowseMode && impressions >= discoveryLimit && " · ten wieczór odwiedzony"}
      </p>
      {matchBanner && (
        <div className="mb-4 rounded-xl border border-violet-500/25 bg-violet-950/35 px-4 py-3">
          <p className="text-[14px] font-medium text-violet-100/95">{matchBanner}</p>
          {matchId && (
            <Link href={randkiPublicHref(`/przestrzen/${matchId}`)} className="mt-2 inline-block text-[12px] text-rose-300 underline-offset-2 hover:underline">
              {INTERACTION_COPY.matchCta} →
            </Link>
          )}
        </div>
      )}
      {msg && <p className="mb-4 text-[14px] text-rose-300">{msg}</p>}

      <div className={`grid gap-2.5 ${embedded ? "grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {displayCards.map((c, idx) => (
          <RandkiRoomPreviewCard key={c.accountId} card={c} selected={idx === current} onSelect={() => selectCard(idx)} />
        ))}
      </div>

      {displayCards.length === 0 && (
        <p className="mt-6 text-center text-[13px] text-white/45">
          Ten klimat jest dziś rzadki — spróbuj innej energii albo{" "}
          <button type="button" className="text-violet-300 underline" onClick={openPalette}>
            otwórz paletę
          </button>
          .
        </p>
      )}

      {expanded && (
        <div
          className={`randki-discovery-expanded mx-auto mt-5 max-w-2xl overflow-hidden rounded-2xl border border-white/10 ${climate.id ? `randki-climate--${climate.id}` : ""}`}
        >
          <p className="border-b border-white/10 px-4 py-2 text-[11px] uppercase tracking-widest text-white/45">
            {climate.emoji} {card.displayName.split(" ")[0]} · {climate.label}
            <span className="ml-2 normal-case tracking-normal text-white/35">· {temperature}</span>
          </p>
          <RandkiMomentHero card={card} resolveUrl={resolveUrl} />
          <RandkiRoom
            room={{ ...room, photoUrls }}
            mode="visit"
            resolveUrl={resolveUrl}
            photoRevealed={photoRevealed}
            onRevealPhotos={() => setPhotoRevealed(true)}
            fallbackPhoto={FALLBACK}
            compact
          />
          <div className="border-t border-white/10 px-4 py-3">
            <RandkiSharedListening source={sharedListening} compact scopeKey={listeningScopeForRoom(card.accountId)} />
          </div>
          {(card.ephemeralExpiresAt || card.rotationClosing) && (
            <div className="border-t border-white/10 px-4 py-3">
              <RandkiEphemeralRoomTimer
                expiresAt={card.ephemeralExpiresAt ?? new Date(Date.now() + 30 * 60 * 1000).toISOString()}
                durationLabel={card.ephemeralDurationLabel ?? "30 min"}
                onExpired={() => {
                  setExpanded(false);
                  setCards((prev) => filterExpiredEphemeralCards(prev));
                }}
              />
            </div>
          )}
          <div className="border-t border-white/10 px-4 py-3">
            <RandkiPresenceReactions roomAccountId={card.accountId} />
          </div>
          <div className="border-t border-white/10 px-4 py-3">
            <RandkiPresenceDialog roomAccountId={card.accountId} compact />
          </div>
          {showReport ? (
            <div className="space-y-2 border-t border-white/10 p-3">
              <textarea className="randki-input" rows={2} placeholder="Powód zgłoszenia…" value={reportReason} onChange={(e) => setReportReason(e.target.value)} />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowReport(false)} className="randki-btn-outline flex-1 text-[13px]">
                  Anuluj
                </button>
                <button type="button" onClick={submitReport} className="randki-btn-primary flex-1 text-[13px]">
                  Wyślij
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 border-t border-white/10 p-3">
              {(demoBrowseMode || card.voiceIntroUrl) && (
                <button
                  type="button"
                  disabled={guestPending}
                  onClick={joinAsGuest}
                  className="randki-btn-outline w-full text-[13px] border-violet-400/30 text-violet-100 hover:bg-violet-500/15"
                >
                  🎧 Dołącz anonimowo — tylko klimat i głos
                </button>
              )}
              <button type="button" onClick={() => act(false)} className="randki-btn-outline flex-1 min-w-[88px] text-[13px]">
                {INTERACTION_COPY.leaveRoom}
              </button>
              <button type="button" onClick={() => act(true)} className="randki-btn-primary flex-1 min-w-[88px] text-[13px]">
                {INTERACTION_COPY.stayInRoom}
              </button>
              <button type="button" onClick={blockUser} className="text-[11px] text-white/40 underline">
                Zablokuj
              </button>
              <button type="button" onClick={() => setShowReport(true)} className="text-[11px] text-white/40 underline">
                Zgłoś
              </button>
            </div>
          )}
        </div>
      )}

      {!expanded && (
        <p className="mt-4 text-center text-[13px] text-white/40">
          {demoBrowseMode
            ? `Wybierz pokój — każdy wygląda inaczej o ${dayPhase.label.toLowerCase()}.`
            : "Wybierz pokój — każdy ma inny klimat."}
        </p>
      )}

      {lastPass && (
        <p className="mt-3 text-center text-[12px] text-white/35">
          <button type="button" onClick={undoPass} className="text-rose-400 underline">
            Cofnij wyjście
          </button>
        </p>
      )}
    </div>
  );
}