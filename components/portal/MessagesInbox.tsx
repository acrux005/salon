"use client";

import { useState, useEffect, useRef, useCallback } from "react";

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
  typeA: string; idA: string;
  typeB: string; idB: string;
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return "przed chwilą";
  if (diff < 3600) return `${Math.floor(diff / 60)} min temu`;
  if (diff < 86400) return d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
}

export function MessagesInbox({
  myType,
  myId,
  myName,
}: {
  myType: string;
  myId: string;
  myName?: string;
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

  useEffect(() => { fetchThreads(); }, [fetchThreads]);

  // Polling co 15s
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
        setThreads((prev) =>
          prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t))
        );
      }
    } finally {
      setLoadingMsgs(false);
    }
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Polling aktywnego wątku co 8s
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
      // Odśwież wiadomości
      const r2 = await fetch(`${BASE}/api/messages/${activeThreadId}`);
      if (r2.ok) { const j = await r2.json(); setMessages(j.messages ?? []); }
      fetchThreads();
    } finally {
      setSending(false);
    }
  };

  const otherName = activeThread
    ? threads.find((t) => t.id === activeThreadId)?.otherName ?? "Rozmówca"
    : null;

  const subject = activeThread?.subject;

  return (
    <div className="flex h-[calc(100vh-160px)] min-h-[500px] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* ── LISTA WĄTKÓW ── */}
      <aside
        className={`w-full flex-shrink-0 border-r border-neutral-200 sm:w-72 lg:w-80 ${
          mobileView === "thread" ? "hidden sm:flex" : "flex"
        } flex-col`}
      >
        <div className="border-b border-neutral-100 px-4 py-4">
          <h2 className="font-[var(--font-sans)] text-[15px] font-semibold text-[#1F1A1C]">
            Wiadomości
          </h2>
        </div>

        {loadingThreads ? (
          <div className="flex flex-1 items-center justify-center text-[13px] text-neutral-400">
            Ładowanie…
          </div>
        ) : threads.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-12 text-center">
            <span className="text-3xl">💬</span>
            <p className="font-[var(--font-sans)] text-[14px] text-neutral-400">
              Brak wiadomości
            </p>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto divide-y divide-neutral-100">
            {threads.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => openThread(t.id)}
                  className={`w-full px-4 py-3.5 text-left transition-colors hover:bg-pink-50/60 ${
                    activeThreadId === t.id ? "bg-pink-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="truncate font-[var(--font-sans)] text-[14px] font-semibold text-[#1F1A1C]">
                      {t.otherName}
                    </span>
                    <span className="shrink-0 font-[var(--font-sans)] text-[11px] text-neutral-400">
                      {formatTime(t.lastMessageAt)}
                    </span>
                  </div>
                  {t.subject && (
                    <p className="mt-0.5 truncate font-[var(--font-sans)] text-[12px] font-medium text-pink-600">
                      {t.subject}
                    </p>
                  )}
                  <p className="mt-0.5 truncate font-[var(--font-sans)] text-[13px] text-neutral-500">
                    {t.lastBody ?? "—"}
                  </p>
                  {t.unreadCount > 0 && (
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 font-[var(--font-sans)] text-[11px] font-bold text-white">
                      {t.unreadCount}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* ── WIDOK KONWERSACJI ── */}
      <div
        className={`flex flex-1 flex-col ${
          mobileView === "list" ? "hidden sm:flex" : "flex"
        }`}
      >
        {!activeThreadId ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <span className="text-4xl">✉️</span>
            <p className="font-[var(--font-sans)] text-[15px] text-neutral-400">
              Wybierz wątek z listy
            </p>
          </div>
        ) : (
          <>
            {/* Nagłówek */}
            <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3">
              <button
                onClick={() => setMobileView("list")}
                className="rounded p-1 text-neutral-400 hover:text-neutral-700 sm:hidden"
                aria-label="Wróć"
              >
                ←
              </button>
              <div>
                <p className="font-[var(--font-sans)] text-[14px] font-semibold text-[#1F1A1C]">
                  {otherName}
                </p>
                {subject && (
                  <p className="font-[var(--font-sans)] text-[12px] text-neutral-400">{subject}</p>
                )}
              </div>
            </div>

            {/* Wiadomości */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {loadingMsgs ? (
                <div className="flex h-full items-center justify-center text-[13px] text-neutral-400">
                  Ładowanie…
                </div>
              ) : messages.length === 0 ? (
                <p className="text-center font-[var(--font-sans)] text-[13px] text-neutral-400">
                  Brak wiadomości w tym wątku.
                </p>
              ) : (
                messages.map((m) => {
                  const isMe = m.senderType === myType && m.senderId === myId;
                  return (
                    <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          isMe
                            ? "rounded-br-sm bg-pink-500 text-white"
                            : "rounded-bl-sm bg-neutral-100 text-[#1F1A1C]"
                        }`}
                      >
                        <p className="whitespace-pre-wrap font-[var(--font-sans)] text-[14px] leading-relaxed">
                          {m.body}
                        </p>
                        <p
                          className={`mt-1 font-[var(--font-sans)] text-[11px] ${
                            isMe ? "text-pink-200" : "text-neutral-400"
                          }`}
                        >
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

            {/* Pole odpowiedzi */}
            <div className="border-t border-neutral-100 px-4 py-3">
              {sendError && (
                <p className="mb-2 font-[var(--font-sans)] text-[13px] text-red-500">{sendError}</p>
              )}
              <div className="flex gap-2">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); }
                  }}
                  placeholder="Napisz wiadomość… (Enter = wyślij, Shift+Enter = nowa linia)"
                  rows={2}
                  className="flex-1 resize-none rounded-xl border border-neutral-200 px-3 py-2 font-[var(--font-sans)] text-[14px] text-[#1F1A1C] placeholder-neutral-400 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                />
                <button
                  onClick={sendReply}
                  disabled={sending || !reply.trim()}
                  className="self-end rounded-xl bg-pink-500 px-4 py-2 font-[var(--font-sans)] text-[14px] font-medium text-white transition-colors hover:bg-pink-600 disabled:opacity-40"
                >
                  {sending ? "…" : "Wyślij"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
