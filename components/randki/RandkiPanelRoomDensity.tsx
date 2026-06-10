"use client";

import type { RandkiDiscoveryCard } from "@/lib/randki/matching";
import { getRoomClimateForCard, getRoomTemperatureForCard } from "@/lib/randki/roomClimate";
import { todayStateLabel } from "@/lib/randki/todayState";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function scrollToDiscovery() {
  document.getElementById("randki-discovery")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function firstName(name: string) {
  return name.split(" ")[0];
}

/** Kompaktowa lista aktywnych pokoi — wypełnia pustkę w kolumnach. */
export function RandkiPanelActiveRoomList({
  cards,
  max = 6,
  title = "Aktywne teraz",
}: {
  cards: RandkiDiscoveryCard[];
  max?: number;
  title?: string;
}) {
  if (cards.length === 0) return null;

  return (
    <div className="randki-panel-active-rooms shrink-0">
      <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/40">{title}</p>
      <ul className="space-y-1">
        {cards.slice(0, max).map((card) => {
          const climate = getRoomClimateForCard(card);
          const temp = getRoomTemperatureForCard(card);
          const quote = card.prompts[0]?.answer?.slice(0, 36);
          const micro = todayStateLabel(card.todayState);
          return (
            <li key={card.accountId}>
              <button
                type="button"
                onClick={scrollToDiscovery}
                className="randki-panel-active-room-row grid w-full grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-2 rounded-lg border border-white/8 bg-[#0c0814]/80 px-2 py-1.5 text-left transition hover:border-white/15 hover:bg-white/[0.06]"
              >
                <span
                  className="relative z-[1] h-7 w-7 shrink-0 rounded-full border border-white/10 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${card.photoUrl?.startsWith("http") ? card.photoUrl : `${BASE}${card.photoUrl ?? ""}`})`,
                  }}
                />
                <span className="min-w-0 overflow-hidden">
                  <span className="flex items-center gap-1 truncate text-[10px] font-medium text-white/85">
                    <span className="shrink-0">{climate.emoji}</span>
                    <span className="truncate">{firstName(card.displayName)}</span>
                  </span>
                  <span className="block truncate text-[9px] text-white/38">
                    {micro ? micro : quote ? `„${quote}…”` : temp}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Poziomy pasek mini-pokoi pod hero. */
export function RandkiPanelGuestStrip({ cards }: { cards: RandkiDiscoveryCard[] }) {
  if (cards.length === 0) return null;

  return (
    <div className="randki-panel-guest-strip shrink-0 rounded-xl border border-white/10 bg-black/25 p-2">
      <p className="mb-2 px-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/38">
        Inne pokoje w tej porze
      </p>
      <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cards.map((card) => {
          const climate = getRoomClimateForCard(card);
          return (
            <button
              key={card.accountId}
              type="button"
              onClick={scrollToDiscovery}
              className={`randki-panel-guest-chip shrink-0 rounded-lg border px-2.5 py-2 text-left transition hover:border-white/20 randki-climate--${climate.id}`}
            >
              <p className="text-[10px] font-medium text-white/90">
                {climate.emoji} {firstName(card.displayName)}
              </p>
              <p className="mt-0.5 max-w-[88px] truncate text-[9px] text-white/45">{climate.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Statystyki pory — dół lewej kolumny. */
export function RandkiPanelPhasePulse({
  onlineCount,
  activeRooms,
  dayPhaseLabel,
}: {
  onlineCount: number;
  activeRooms: number;
  dayPhaseLabel: string;
}) {
  return (
    <div className="randki-panel-phase-pulse rounded-xl border border-white/10 bg-gradient-to-br from-violet-950/40 to-black/30 p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-violet-200/70">Obecność · {dayPhaseLabel}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-black/25 px-2 py-1.5">
          <p className="text-lg font-semibold tabular-nums text-white/90">{onlineCount}</p>
          <p className="text-[9px] text-white/40">obecności w porze</p>
        </div>
        <div className="rounded-lg bg-black/25 px-2 py-1.5">
          <p className="text-lg font-semibold tabular-nums text-white/90">{activeRooms}</p>
          <p className="text-[9px] text-white/40">pokoi aktywnych</p>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="randki-room-life-pulse h-1 flex-1 rounded-full bg-gradient-to-r from-emerald-500/40 to-violet-500/30"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <p className="mt-2 text-[9px] italic text-white/30">miasto oddycha w tej porze</p>
    </div>
  );
}
