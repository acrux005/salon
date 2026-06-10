"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  joinVoiceMatchAction,
  leaveVoiceMatchAction,
  resonateWithRoomAction,
  pollVoiceMatchAction,
  skipVoiceMatchAction,
} from "@/app/actions/randki";
import { RandkiVoiceCallLive } from "@/components/randki/RandkiVoiceCallLive";
import { INTERACTION_COPY } from "@/lib/randki/presenceInteractions";
import { randkiPublicHref } from "@/lib/randkiPaths";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Partner = {
  accountId: string;
  displayName: string;
  age: number;
  city: string;
  voiceIntroUrl: string | null;
  photoUrl: string | null;
  whySnippet: string;
};

type State =
  | { status: "idle" }
  | { status: "waiting"; expiresAt: string }
  | { status: "paired"; partner: Partner; callId: string; expiresAt: string };

function resolveUrl(url: string | null) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BASE}${url}`;
}

export function RandkiVoiceMatchClient({
  initialState,
  myAccountId,
  turnEnabled = false,
}: {
  initialState: State;
  myAccountId: string;
  turnEnabled?: boolean;
}) {
  const [state, setState] = useState<State>(initialState);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (state.status !== "waiting") return;
    const id = setInterval(() => {
      start(async () => {
        const res = await pollVoiceMatchAction();
        if (res.ok) setState(res.state as State);
      });
    }, 2500);
    return () => clearInterval(id);
  }, [state.status]);

  function join() {
    start(async () => {
      const res = await joinVoiceMatchAction();
      if (!res.ok) setMsg(res.error);
      else if (res.state) setState(res.state as State);
    });
  }

  function leave() {
    start(async () => {
      const res = await leaveVoiceMatchAction();
      if (res.ok) setState({ status: "idle" });
    });
  }

  function skip() {
    start(async () => {
      const res = await skipVoiceMatchAction();
      if (res.ok) setState(res.state as State);
    });
  }

  function resonate() {
    if (state.status !== "paired") return;
    start(async () => {
      const res = await resonateWithRoomAction(state.partner.accountId);
      if (res.ok && res.matched && res.matchId) {
        setMsg("Wzajemny rezonans — otwórz wspólną przestrzeń.");
        window.location.href = randkiPublicHref(`/przestrzen/${res.matchId}`);
      } else if (res.ok) {
        setMsg("Zostawiłeś ślad — jeśli on/ona też, macie wspólną przestrzeń.");
      } else {
        setMsg(res.error);
      }
    });
  }

  return (
    <div className="mx-auto max-w-md">
      <p className="text-center text-[14px] text-white/60">
        Kolejka + voice intro + <strong className="text-emerald-300">WebRTC live call</strong> — {INTERACTION_COPY.voiceResonance}
      </p>

      {!turnEnabled && (
        <p className="mt-3 rounded-lg border border-amber-500/25 bg-amber-950/30 px-3 py-2 text-center text-[12px] text-amber-100/85">
          Połączenia mogą być niestabilne bez TURN — skonfiguruj TURN_URLS w produkcji dla niezawodnego voice match.
        </p>
      )}

      {state.status === "idle" && (
        <div className="randki-glass mt-6 p-6 text-center">
          <p className="text-[15px] text-white/85">Dołącz do kolejki voice match w swoim mieście.</p>
          <button type="button" disabled={pending} onClick={join} className="randki-btn-primary mt-4">
            {pending ? "Szukam…" : "🎙 Start voice match"}
          </button>
        </div>
      )}

      {state.status === "waiting" && (
        <div className="randki-glass mt-6 p-6 text-center">
          <p className="text-lg font-semibold text-white">Szukamy kogoś z podobnym vibe…</p>
          <p className="mt-2 text-[13px] text-white/50">Dostaniesz push, gdy znajdziemy parę.</p>
          <button type="button" disabled={pending} onClick={leave} className="randki-btn-outline mt-4 text-[13px]">
            Anuluj
          </button>
        </div>
      )}

      {state.status === "paired" && (
        <article className="randki-glass mt-6 overflow-hidden">
          <div className="border-b border-white/10 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-300">Voice match · live</p>
            <h2 className="mt-1 text-2xl font-bold text-white">
              {state.partner.displayName}, {state.partner.age}
            </h2>
            <p className="text-[14px] text-white/50">{state.partner.city}</p>
          </div>
          <RandkiVoiceCallLive
            callId={state.callId}
            myAccountId={myAccountId}
            partnerName={state.partner.displayName}
          />
          {state.partner.voiceIntroUrl && (
            <div className="border-b border-white/10 bg-violet-500/10 px-4 py-3">
              <p className="text-[12px] font-semibold text-violet-200">Voice intro (nagranie profilowe)</p>
              <audio controls className="mt-2 w-full" src={resolveUrl(state.partner.voiceIntroUrl) ?? undefined} preload="none" />
            </div>
          )}
          <div className="p-4">
            <p className="text-[14px] text-white/80">{state.partner.whySnippet}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={resonate} className="randki-btn-primary flex-1 min-w-[120px]">
                {INTERACTION_COPY.stayInRoom}
              </button>
              <button type="button" onClick={skip} disabled={pending} className="randki-btn-outline flex-1 min-w-[120px]">
                {INTERACTION_COPY.leaveRoom}
              </button>
            </div>
            <button type="button" onClick={leave} className="mt-3 text-[12px] text-white/40 underline">
              Zakończ sesję
            </button>
          </div>
        </article>
      )}

      {msg && <p className="mt-4 text-center text-[13px] text-violet-200">{msg}</p>}

      <p className="mt-6 text-center">
        <Link href={randkiPublicHref("/panel")} className="text-[12px] text-white/40 hover:text-white/65">
          ← Panel
        </Link>
      </p>
    </div>
  );
}
