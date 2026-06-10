"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  blockDatingUserAction,
  getAiDateSuggestionsAction,
  proposeDatingDateAction,
  reportDatingUserAction,
  respondDatingDateAction,
  sendChatVoiceNoteAction,
  sendDatingMessageAction,
  unmatchDatingMatchAction,
} from "@/app/actions/randki";
import { isVoiceChatMessage, voiceUrlFromChatMessage } from "@/lib/randki/chatMessage";
import { INTERACTION_COPY } from "@/lib/randki/presenceInteractions";
import { randkiPublicHref } from "@/lib/randkiPaths";
import { RandkiMatchedRoom } from "@/components/randki/RandkiMatchedRoom";
import type { RandkiRoomData } from "@/lib/randki/roomTypes";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Msg = {
  id: string;
  senderAccountId: string;
  body: string;
  createdAt: Date | string;
};

type Proposal = {
  id: string;
  proposerAccountId: string;
  proposedDate: string;
  proposedTime: string;
  place: string | null;
  note: string | null;
  status: string;
};

type Restaurant = { id: string; slug: string; name: string; city: string; orderUrl: string };

type ChatPayload = {
  messages: Msg[];
  proposals: Proposal[];
  icebreakers?: string[];
};

function resolveMedia(url: string) {
  return url.startsWith("http") ? url : `${BASE_PATH}${url}`;
}

function formatTime(value: Date | string) {
  return new Date(value).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
}

export function RandkiChatClient({
  matchId,
  myAccountId,
  otherAccountId,
  otherName,
  myCity,
  initialMessages,
  initialProposals,
  initialIcebreakers,
  compatibilityNote,
  otherRoom,
  dateSlots,
}: {
  matchId: string;
  myAccountId: string;
  otherAccountId: string;
  otherName: string;
  myCity: string;
  initialMessages: Msg[];
  initialProposals: Proposal[];
  initialIcebreakers: string[];
  compatibilityNote: string | null;
  otherRoom?: RandkiRoomData | null;
  dateSlots: { date: string; time: string; label: string }[];
}) {
  const router = useRouter();
  const voiceInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState(initialMessages);
  const [proposals, setProposals] = useState(initialProposals);
  const [icebreakers, setIcebreakers] = useState(initialIcebreakers);
  const [showHints, setShowHints] = useState(false);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [showDateForm, setShowDateForm] = useState(false);
  const [aiDateIdeas, setAiDateIdeas] = useState<string[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [dateForm, setDateForm] = useState({ slot: "", place: "", restaurantSlug: "", note: "" });
  const [sending, startSend] = useTransition();
  const [responding, startRespond] = useTransition();
  const firstName = otherName.split(" ")[0];

  useEffect(() => {
    const es = new EventSource(`/api/randki/chat/stream?matchId=${encodeURIComponent(matchId)}`);
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data) as ChatPayload;
        setMessages(data.messages);
        setProposals(data.proposals);
        if (data.icebreakers?.length) setIcebreakers(data.icebreakers);
      } catch {
        /* ignore */
      }
    };
    return () => es.close();
  }, [matchId]);

  useEffect(() => {
    if (!showDateForm) return;
    fetch(`/api/randki/restaurants?city=${encodeURIComponent(myCity)}`)
      .then((r) => r.json())
      .then((d: { restaurants: Restaurant[] }) => setRestaurants(d.restaurants ?? []))
      .catch(() => setRestaurants([]));
    getAiDateSuggestionsAction(matchId).then((res) => {
      if (res.ok) setAiDateIdeas(res.suggestions);
    });
  }, [showDateForm, myCity, matchId]);

  function send(text?: string) {
    const msg = (text ?? body).trim();
    if (!msg) return;
    startSend(async () => {
      setError("");
      const res = await sendDatingMessageAction(matchId, msg);
      if (!res.ok) setError(res.error);
      else setBody("");
    });
  }

  function sendVoice(file: File) {
    startSend(async () => {
      setError("");
      const fd = new FormData();
      fd.set("voiceNote", file);
      const res = await sendChatVoiceNoteAction(matchId, fd);
      if (!res.ok) setError(res.error);
    });
  }

  function proposeDate(e: React.FormEvent) {
    e.preventDefault();
    const [proposedDate, proposedTime] = dateForm.slot.split("|");
    if (!proposedDate || !proposedTime) {
      setError("Wybierz termin.");
      return;
    }
    const selected = restaurants.find((r) => r.slug === dateForm.restaurantSlug);
    const place = selected ? `${selected.name} (${selected.orderUrl})` : dateForm.place;

    startSend(async () => {
      setError("");
      const fd = new FormData();
      fd.set("proposedDate", proposedDate);
      fd.set("proposedTime", proposedTime);
      fd.set("place", place);
      fd.set("note", dateForm.note);
      const res = await proposeDatingDateAction(matchId, fd);
      if (!res.ok) setError(res.error);
      else {
        setShowDateForm(false);
        setDateForm({ slot: "", place: "", restaurantSlug: "", note: "" });
      }
    });
  }

  function respond(proposalId: string, accept: boolean) {
    startRespond(async () => {
      const res = await respondDatingDateAction(proposalId, accept);
      if (!res.ok) setError(res.error);
    });
  }

  async function blockOther() {
    const res = await blockDatingUserAction(otherAccountId);
    if (!res.ok) setError(res.error);
    else router.push(randkiPublicHref("/dopasowania"));
  }

  async function unmatch() {
    if (!confirm("Usunąć dopasowanie?")) return;
    const res = await unmatchDatingMatchAction(matchId);
    if (!res.ok) setError(res.error);
    else router.push(randkiPublicHref("/dopasowania"));
  }

  async function reportOther() {
    const reason = window.prompt("Powód zgłoszenia:");
    if (!reason?.trim()) return;
    const res = await reportDatingUserAction(otherAccountId, reason.trim());
    if (!res.ok) setError(res.error);
    else router.push(randkiPublicHref("/dopasowania"));
  }

  const pendingForMe = proposals.filter((p) => p.status === "pending" && p.proposerAccountId !== myAccountId);
  const canShowHints = messages.length === 0 && icebreakers.length > 0;

  return (
    <div className="randki-chat-corridor flex min-h-[70vh] flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link href={randkiPublicHref("/dopasowania")} className="text-[13px] text-white/45 hover:text-white/70">
          ← {INTERACTION_COPY.matchesNav}
        </Link>
        <Link
          href={randkiPublicHref(`/przestrzen/${matchId}`)}
          className="text-[12px] text-violet-300/90 underline-offset-2 hover:underline"
        >
          {INTERACTION_COPY.chatBackToSpace}
        </Link>
      </div>

      <header className="mt-4 border-b border-white/10 pb-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/35">{INTERACTION_COPY.chatCorridor}</p>
        <div className="mt-1 flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-white">{otherName}</h1>
            <p className="mt-1 text-[12px] text-white/45">{INTERACTION_COPY.noReadReceipts}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-white/40">
            <button type="button" onClick={unmatch} className="hover:text-white/65">
              Usuń
            </button>
            <button type="button" onClick={blockOther} className="hover:text-white/65">
              Zablokuj
            </button>
            <button type="button" onClick={reportOther} className="hover:text-white/65">
              Zgłoś
            </button>
          </div>
        </div>
        {compatibilityNote && (
          <p className="mt-3 text-[13px] italic text-violet-200/80">&ldquo;{compatibilityNote}&rdquo;</p>
        )}
      </header>

      <Link
        href={randkiPublicHref(`/przestrzen/${matchId}`)}
        className="mt-4 block rounded-xl border border-violet-400/20 bg-violet-950/25 px-4 py-3 transition hover:border-violet-400/35"
      >
        <p className="text-[12px] text-violet-100/90">{INTERACTION_COPY.openSpace}</p>
        <p className="mt-0.5 text-[11px] text-white/40">
          {firstName} · wspólne słuchanie i ślady obecności — bez konieczności pisania
        </p>
      </Link>

      {otherRoom && (
        <div className="mt-4 max-h-[220px] overflow-hidden rounded-xl border border-white/10 opacity-90">
          <RandkiMatchedRoom room={otherRoom} ownerName={otherName} />
        </div>
      )}

      {pendingForMe.length > 0 && (
        <div className="mt-4 space-y-2 rounded-xl border border-rose-400/20 bg-rose-950/20 p-4">
          <p className="text-[12px] font-medium uppercase tracking-wide text-rose-200/90">Propozycja randki</p>
          {pendingForMe.map((p) => (
            <div key={p.id} className="text-[14px] text-white/85">
              <p>
                {p.proposedDate} o {p.proposedTime}
                {p.place ? ` · ${p.place}` : ""}
              </p>
              <div className="mt-2 flex gap-2">
                <button type="button" disabled={responding} onClick={() => respond(p.id, true)} className="randki-btn-primary text-[12px]">
                  Akceptuj
                </button>
                <button type="button" disabled={responding} onClick={() => respond(p.id, false)} className="randki-btn-outline text-[12px]">
                  Odrzuć
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="randki-chat-corridor-feed mt-4 flex flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-black/20">
        <ul className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
          {messages.length === 0 && (
            <li className="py-8 text-center">
              <p className="text-[14px] text-white/50">Cisza między słowami — to też rozmowa.</p>
              <p className="mt-2 text-[12px] text-white/35">Zacznij od głosu albo wróć do wspólnej przestrzeni.</p>
            </li>
          )}
          {messages.map((m) => {
            const mine = m.senderAccountId === myAccountId;
            const voiceUrl = voiceUrlFromChatMessage(m.body);
            return (
              <li key={m.id} className={`flex flex-col gap-1 ${mine ? "items-end" : "items-start"}`}>
                <span className="text-[10px] text-white/30">{formatTime(m.createdAt)}</span>
                {voiceUrl ? (
                  <div
                    className={`max-w-[min(100%,320px)] rounded-2xl border px-3 py-2.5 ${
                      mine ? "border-rose-400/25 bg-rose-950/35" : "border-white/10 bg-white/[0.05]"
                    }`}
                  >
                    <p className="mb-1.5 text-[10px] uppercase tracking-wide text-white/45">{INTERACTION_COPY.chatVoiceNote}</p>
                    <audio controls preload="none" src={resolveMedia(voiceUrl)} className="w-full max-w-[280px]" />
                  </div>
                ) : (
                  <p
                    className={`max-w-[min(100%,420px)] whitespace-pre-wrap text-[15px] leading-relaxed ${
                      mine ? "text-right text-rose-100/95" : "text-left text-white/85"
                    }`}
                  >
                    {m.body}
                  </p>
                )}
              </li>
            );
          })}
        </ul>

        <div className="border-t border-white/10 bg-black/30 p-3 space-y-2">
          {canShowHints && (
            <div>
              {!showHints ? (
                <button
                  type="button"
                  onClick={() => setShowHints(true)}
                  className="text-[12px] text-white/40 underline-offset-2 hover:text-violet-300 hover:underline"
                >
                  {INTERACTION_COPY.chatHints}
                </button>
              ) : (
                <ul className="space-y-1.5 pb-1">
                  {icebreakers.map((ib) => (
                    <li key={ib}>
                      <button
                        type="button"
                        onClick={() => send(ib)}
                        className="w-full rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-left text-[12px] text-white/70 hover:bg-white/[0.06]"
                      >
                        {ib}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {showDateForm ? (
            <form onSubmit={proposeDate} className="space-y-2">
              {aiDateIdeas.length > 0 && (
                <div className="rounded-lg bg-violet-500/10 p-2 text-[11px] text-violet-200/90">
                  <p className="font-medium">Pomysły na spotkanie:</p>
                  <ul className="mt-1 list-inside list-disc">{aiDateIdeas.map((s) => <li key={s}>{s}</li>)}</ul>
                </div>
              )}
              <select className="randki-input" value={dateForm.slot} onChange={(e) => setDateForm((p) => ({ ...p, slot: e.target.value }))} required>
                <option value="">Wybierz termin…</option>
                {dateSlots.map((s) => (
                  <option key={s.label} value={`${s.date}|${s.time}`}>
                    {s.label}
                  </option>
                ))}
              </select>
              {restaurants.length > 0 && (
                <select className="randki-input" value={dateForm.restaurantSlug} onChange={(e) => setDateForm((p) => ({ ...p, restaurantSlug: e.target.value }))}>
                  <option value="">Restauracja z Zamów</option>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.slug}>
                      {r.name}
                    </option>
                  ))}
                </select>
              )}
              <input className="randki-input" placeholder="Miejsce" value={dateForm.place} onChange={(e) => setDateForm((p) => ({ ...p, place: e.target.value }))} />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowDateForm(false)} className="randki-btn-outline flex-1 text-[13px]">
                  Anuluj
                </button>
                <button type="submit" disabled={sending} className="randki-btn-primary flex-1 text-[13px]">
                  Wyślij
                </button>
              </div>
            </form>
          ) : (
            <>
              <button type="button" onClick={() => setShowDateForm(true)} className="text-[12px] text-rose-300/80 hover:underline">
                Zaproponuj randkę
              </button>
              {error && <p className="text-[12px] text-rose-300">{error}</p>}
              <div className="flex items-end gap-2">
                <label className="shrink-0 cursor-pointer rounded-full border border-white/15 px-3 py-2 text-[11px] text-white/55 transition hover:border-violet-400/35 hover:text-violet-200">
                  <input
                    ref={voiceInputRef}
                    type="file"
                    accept="audio/*"
                    capture="user"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) sendVoice(f);
                      e.target.value = "";
                    }}
                  />
                  🎙
                </label>
                <textarea
                  className="randki-input min-h-[44px] flex-1 resize-none py-2.5 text-[14px]"
                  rows={1}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={`${INTERACTION_COPY.writeQuietly}…`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                />
                <button type="button" onClick={() => send()} disabled={sending || !body.trim()} className="randki-btn-primary shrink-0 px-4">
                  →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
