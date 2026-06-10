"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { getNotificationsAction, markNotificationReadAction } from "@/app/actions/notifications";
import type { NotificationItem } from "@/app/actions/notifications";

function formatDate(d: Date) {
  const date = new Date(d);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60_000) return "przed chwilą";
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)} min temu`;
  if (diff < 86400_000) return date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  return date.toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
}

type NotificationBellProps = {
  /** Link do strony „Wszystkie powiadomienia” (np. /portal/panel/powiadomienia lub /portal/admin/powiadomienia). */
  notificationsHref?: string;
};

export function NotificationBell({ notificationsHref }: NotificationBellProps) {
  const [list, setList] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const res = await getNotificationsAction();
    if (res.ok) {
      setList(res.list);
      setUnreadCount(res.unreadCount);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  const handleMarkRead = async (id: string) => {
    await markNotificationReadAction(id);
    setList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date() } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  // Next.js Link automatycznie dodaje basePath – nie dopisuj go, żeby uniknąć /oferta/oferta/...
  const notificationsLink =
    notificationsHref != null && notificationsHref !== ""
      ? notificationsHref
      : "/portal/panel/powiadomienia";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) load();
        }}
        className="relative rounded-full p-2 text-[#6F5E64] transition-colors hover:bg-neutral-100 hover:text-[#1F1A1C]"
        aria-label="Powiadomienia"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-medium text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="fixed inset-x-2 top-16 z-50 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-1 sm:w-80">
          <div className="border-b border-neutral-100 px-4 py-3">
            <h3 className="font-[var(--font-sans)] text-sm font-semibold text-[#1F1A1C]">
              Powiadomienia
            </h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="p-4 text-center text-[14px] text-[#6F5E64]">Ładowanie…</p>
            ) : list.length === 0 ? (
              <p className="p-4 text-center text-[14px] text-[#6F5E64]">Brak powiadomień.</p>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {list.slice(0, 10).map((n) => (
                  <li key={n.id} className={n.readAt ? "bg-white" : "bg-pink-50/30"}>
                    <div className="flex flex-col gap-0.5 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-[var(--font-sans)] text-[13px] font-medium text-[#1F1A1C]">
                          {n.title}
                        </span>
                        {!n.readAt && (
                          <button
                            type="button"
                            onClick={() => handleMarkRead(n.id)}
                            className="shrink-0 text-[11px] font-medium text-pink-600 hover:underline"
                          >
                            Przeczytane
                          </button>
                        )}
                      </div>
                      {n.body && (
                        <p className="text-[12px] text-[#6F5E64] line-clamp-2">{n.body}</p>
                      )}
                      <span className="text-[11px] text-neutral-500">
                        {formatDate(n.createdAt)}
                      </span>
                      {n.link && (
                        <Link
                          href={n.link ?? "#"}
                          onClick={() => setOpen(false)}
                          className="mt-1 text-[12px] font-medium text-pink-600 hover:underline"
                        >
                          Zobacz →
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="border-t border-neutral-100 px-4 py-2">
            <Link
              href={notificationsLink}
              onClick={() => setOpen(false)}
              className="block text-center text-[13px] font-medium text-pink-600 hover:underline"
            >
              Wszystkie powiadomienia
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
