"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { CalendarClock, MessageSquare, Users } from "lucide-react";

const BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";

type Thread = {
  id: string;
  subject: string | null;
  otherType: string;
  otherId: string;
  otherName: string;
  lastMessageAt: string;
  lastBody: string | null;
  unreadCount: number;
};

type Message = {
  id: string;
  senderType: string;
  senderId: string;
  body: string;
  readAt: string | null;
  createdAt: string;
};

type ThreadDetail = {
  id: string;
  subject: string | null;
  typeA: string;
  idA: string;
  typeB: string;
  idB: string;
};

const DEMO_MESSAGES = [
  {
    from: "client" as const,
    body: "Dzień dobry, czy możemy przełożyć szczepienie Bureka na piątek?",
    time: "09:12",
  },
  {
    from: "clinic" as const,
    body: "Oczywiście — mamy wolny termin o 14:30. Pasuje?",
    time: "09:18",
  },
  {
    from: "client" as const,
    body: "Super, dziękuję! Do zobaczenia 😊",
    time: "09:21",
  },
];

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return "przed chwilą";
  if (diff < 3600) return `${Math.floor(diff / 60)} min temu`;
  if (diff < 86400) return d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
}

function DemoConversation() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-wet-teal-100 bg-wet-teal-50/60 px-4 py-2.5">
        <p className="text-center text-[12px] font-medium text-wet-teal-800">
          Przykładowa rozmowa — tak będzie wyglądał Twój inbox
        </p>
      </div>

      <div className="flex items-center gap-3 border-b border-wet-teal-50 px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wet-teal/15 text-sm font-semibold text-wet-teal-800">
          AK
        </span>
        <div>
          <p className="text-[14px] font-semibold text-wet-navy">Anna Kowalska</p>
          <p className="text-[12px] text-wet-navy-muted">Szczepienie · Burek</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-slate-50/80 to-white px-4 py-5">
        {DEMO_MESSAGES.map((m, i) => {
          const isClinic = m.from === "clinic";
          return (
            <div key={i} className={`flex ${isClinic ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${
                  isClinic
                    ? "rounded-br-md bg-wet-teal text-white"
                    : "rounded-bl-md border border-wet-teal-100 bg-white text-wet-navy"
                }`}
              >
                <p className="whitespace-pre-wrap text-[14px] leading-relaxed">{m.body}</p>
                <p className={`mt-1 text-[11px] ${isClinic ? "text-teal-100" : "text-wet-navy-muted"}`}>
                  {m.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-wet-teal-100 bg-white px-4 py-3">
        <div className="flex gap-2 opacity-60">
          <div className="flex-1 rounded-xl border border-dashed border-wet-teal-200 bg-wet-teal-50/30 px-3 py-2.5 text-[13px] text-wet-navy-muted">
            Tu wpiszesz odpowiedź klientowi…
          </div>
          <div className="self-end rounded-xl bg-wet-teal/40 px-4 py-2 text-[14px] font-medium text-white">
            Wyślij
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptySidebar() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="px-5 py-8 text-center">
        <span className="text-4xl" aria-hidden>
          📩
        </span>
        <p className="mt-4 text-[15px] font-medium leading-snug text-wet-navy">
          Tu pojawią się wiadomości od właścicieli zwierząt.
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-wet-navy-muted">
          Odpowiedzi na SMS-y, pytania o wizyty i przypomnienia o szczepieniach — w jednym miejscu.
        </p>
      </div>

      <div className="mt-auto space-y-2 border-t border-wet-teal-50 px-4 py-4">
        <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-wet-navy-muted">
          Jak zacząć
        </p>
        <Link
          href="/wet/panel/klienci/lista"
          className="flex items-start gap-3 rounded-xl border border-wet-teal-100 bg-wet-teal-50/40 p-3 transition hover:border-wet-teal-200 hover:bg-wet-teal-50"
        >
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-wet-teal" aria-hidden />
          <span>
            <span className="block text-[13px] font-medium text-wet-navy">Wyślij SMS do klienta</span>
            <span className="mt-0.5 block text-[12px] text-wet-navy-muted">Z listy klientów lub po wizycie</span>
          </span>
        </Link>
        <Link
          href="/wet/panel/klienci/wiadomosci-zaplanowane"
          className="flex items-start gap-3 rounded-xl border border-wet-teal-100 bg-white p-3 transition hover:border-wet-teal-200 hover:bg-wet-mint/30"
        >
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-wet-teal" aria-hidden />
          <span>
            <span className="block text-[13px] font-medium text-wet-navy">Automatyczne przypomnienia</span>
            <span className="mt-0.5 block text-[12px] text-wet-navy-muted">
              SMS o szczepieniach wysyłają się same
            </span>
          </span>
        </Link>
        <Link
          href="/wet/panel/szczepienia"
          className="flex items-start gap-3 rounded-xl border border-wet-teal-100 bg-white p-3 transition hover:border-wet-teal-200 hover:bg-wet-mint/30"
        >
          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-wet-teal" aria-hidden />
          <span>
            <span className="block text-[13px] font-medium text-wet-navy">Szczepienia → SMS</span>
            <span className="mt-0.5 block text-[12px] text-wet-navy-muted">
              Po zapisaniu szczepu system planuje przypomnienia
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}

export function WetMessagesInbox({
  myType,
  myId,
}: {
  myType: string;
  myId: string;
}) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeThread, setActiveThread] = useState<ThreadDetail | null>(null);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchThreads = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/api/messages`);
      if (res.ok) {
        const j = await res.json();
        setThreads(j.threads ?? []);
      }
    } finally {
      setLoadingThreads(false);
    }
  }, []);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  useEffect(() => {
    const id = setInterval(fetchThreads, 15000);
    return () => clearInterval(id);
  }, [fetchThreads]);

  const openThread = useCallback(async (threadId: string) => {
    setActiveThreadId(threadId);
    setMobileView("thread");
    setLoadingMsgs(true);
    setSendError(null);
    try {
      const res = await fetch(`${BASE}/api/messages/${threadId}`);
      if (res.ok) {
        const j = await res.json();
        setMessages(j.messages ?? []);
        setActiveThread(j.thread ?? null);
        setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t)));
      }
    } finally {
      setLoadingMsgs(false);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!activeThreadId) return;
    const id = setInterval(async () => {
      const res = await fetch(`${BASE}/api/messages/${activeThreadId}`);
      if (res.ok) {
        const j = await res.json();
        setMessages(j.messages ?? []);
      }
    }, 8000);
    return () => clearInterval(id);
  }, [activeThreadId]);

  const sendReply = async () => {
    if (!reply.trim() || !activeThreadId) return;
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch(`${BASE}/api/messages/${activeThreadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: reply.trim() }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setSendError((j as { error?: string }).error ?? "Błąd wysyłania.");
        return;
      }
      setReply("");
      const r2 = await fetch(`${BASE}/api/messages/${activeThreadId}`);
      if (r2.ok) {
        const j = await r2.json();
        setMessages(j.messages ?? []);
      }
      fetchThreads();
    } finally {
      setSending(false);
    }
  };

  const isEmpty = !loadingThreads && threads.length === 0;
  const otherName = activeThread
    ? (threads.find((t) => t.id === activeThreadId)?.otherName ?? "Rozmówca")
    : null;
  const subject = activeThread?.subject;

  return (
    <div className="mx-4 mb-6 overflow-hidden rounded-2xl border border-wet-teal-200/80 bg-white shadow-sm shadow-wet-teal/5 lg:mx-8">
      <div className="flex h-[min(640px,calc(100dvh-15rem))] min-h-[420px]">
        {/* Lista wątków */}
        <aside
          className={`w-full shrink-0 border-r border-wet-teal-100 sm:w-72 lg:w-80 ${
            mobileView === "thread" && !isEmpty ? "hidden sm:flex" : "flex"
          } flex-col bg-gradient-to-b from-wet-teal-50/30 to-white`}
        >
          <div className="border-b border-wet-teal-100 px-4 py-3.5">
            <h2 className="text-[14px] font-semibold text-wet-navy">Rozmowy</h2>
            {!isEmpty && (
              <p className="mt-0.5 text-[12px] text-wet-navy-muted">{threads.length} aktywnych</p>
            )}
          </div>

          {loadingThreads ? (
            <div className="flex flex-1 items-center justify-center text-[13px] text-wet-navy-muted">
              Ładowanie…
            </div>
          ) : isEmpty ? (
            <EmptySidebar />
          ) : (
            <ul className="flex-1 divide-y divide-wet-teal-50 overflow-y-auto">
              {threads.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => openThread(t.id)}
                    className={`w-full px-4 py-3.5 text-left transition hover:bg-wet-mint/50 ${
                      activeThreadId === t.id ? "bg-wet-teal-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="truncate text-[14px] font-semibold text-wet-navy">{t.otherName}</span>
                      <span className="shrink-0 text-[11px] text-wet-navy-muted">{formatTime(t.lastMessageAt)}</span>
                    </div>
                    {t.subject && (
                      <p className="mt-0.5 truncate text-[12px] font-medium text-wet-teal">{t.subject}</p>
                    )}
                    <p className="mt-0.5 truncate text-[13px] text-wet-navy-muted">{t.lastBody ?? "—"}</p>
                    {t.unreadCount > 0 && (
                      <span className="mt-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-wet-teal px-1.5 text-[11px] font-bold text-white">
                        {t.unreadCount}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Konwersacja */}
        <div
          className={`min-w-0 flex-1 flex-col ${
            mobileView === "list" && !isEmpty ? "hidden sm:flex" : "flex"
          } ${isEmpty ? "flex" : ""}`}
        >
          {isEmpty ? (
            <DemoConversation />
          ) : !activeThreadId ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-50/50 to-wet-teal-50/20 px-6 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-wet-teal/10 text-2xl">
                💬
              </span>
              <p className="text-[15px] font-medium text-wet-navy">Wybierz rozmowę po lewej</p>
              <p className="max-w-xs text-[13px] text-wet-navy-muted">
                Kliknij wątek, żeby zobaczyć historię i odpowiedzieć klientowi.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b border-wet-teal-50 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setMobileView("list")}
                  className="rounded-lg p-1.5 text-wet-navy-muted hover:bg-wet-teal-50 sm:hidden"
                  aria-label="Wróć do listy"
                >
                  ←
                </button>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wet-teal/15 text-sm font-semibold text-wet-teal-800">
                  {(otherName ?? "?").slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-wet-navy">{otherName}</p>
                  {subject && <p className="text-[12px] text-wet-navy-muted">{subject}</p>}
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-slate-50/50 to-white px-4 py-4">
                {loadingMsgs ? (
                  <div className="flex h-full items-center justify-center text-[13px] text-wet-navy-muted">
                    Ładowanie…
                  </div>
                ) : messages.length === 0 ? (
                  <p className="py-8 text-center text-[13px] text-wet-navy-muted">Brak wiadomości w tym wątku.</p>
                ) : (
                  messages.map((m) => {
                    const isMe = m.senderType === myType && m.senderId === myId;
                    return (
                      <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                            isMe
                              ? "rounded-br-md bg-wet-teal text-white shadow-sm shadow-wet-teal/20"
                              : "rounded-bl-md border border-wet-teal-100 bg-white text-wet-navy shadow-sm"
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-[14px] leading-relaxed">{m.body}</p>
                          <p className={`mt-1 text-[11px] ${isMe ? "text-teal-100" : "text-wet-navy-muted"}`}>
                            {formatTime(m.createdAt)}
                            {isMe && m.readAt && " · przeczytano"}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-wet-teal-100 bg-white px-4 py-3">
                {sendError && (
                  <p className="mb-2 text-[13px] text-red-600" role="alert">
                    {sendError}
                  </p>
                )}
                <div className="flex gap-2">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendReply();
                      }
                    }}
                    placeholder="Napisz wiadomość…"
                    rows={2}
                    className="flex-1 resize-none rounded-xl border border-wet-teal-200 px-3 py-2.5 text-[14px] text-wet-navy placeholder:text-wet-navy-muted/60 focus:border-wet-teal focus:outline-none focus:ring-2 focus:ring-wet-teal/20"
                  />
                  <button
                    type="button"
                    onClick={sendReply}
                    disabled={sending || !reply.trim()}
                    className="self-end rounded-xl bg-wet-teal px-4 py-2.5 text-[14px] font-medium text-white transition hover:bg-teal-600 disabled:opacity-40"
                  >
                    {sending ? "…" : "Wyślij"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
