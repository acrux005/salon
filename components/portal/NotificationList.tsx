"use client";

import { useState } from "react";
import Link from "next/link";
import { markNotificationReadAction } from "@/app/actions/notifications";
import type { NotificationItem } from "@/app/actions/notifications";

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function NotificationList({ initialList }: { initialList: NotificationItem[] }) {
  const [list, setList] = useState(initialList);

  const handleMarkRead = async (id: string) => {
    await markNotificationReadAction(id);
    setList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date() } : n))
    );
  };

  if (list.length === 0) {
    return (
      <p className="rounded-xl border border-neutral-200 bg-neutral-50/50 px-6 py-8 text-center font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
        Brak powiadomień.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {list.map((n) => (
        <li
          key={n.id}
          className={`rounded-xl border px-4 py-4 ${
            n.readAt ? "border-neutral-200 bg-white" : "border-pink-200 bg-pink-50/30"
          }`}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between gap-3">
              <span className="font-[var(--font-sans)] text-[15px] font-semibold text-[#1F1A1C]">
                {n.title}
              </span>
              {!n.readAt && (
                <button
                  type="button"
                  onClick={() => handleMarkRead(n.id)}
                  className="shrink-0 text-[13px] font-medium text-pink-600 hover:underline"
                >
                  Oznacz jako przeczytane
                </button>
              )}
            </div>
            {n.body && (
              <p className="font-[var(--font-sans)] text-[14px] text-[#6F5E64]">{n.body}</p>
            )}
            <span className="text-[13px] text-neutral-500">{formatDate(n.createdAt)}</span>
            {n.link && (
              <Link
                href={n.link ?? "#"}
                className="mt-1 font-[var(--font-sans)] text-[14px] font-medium text-pink-600 hover:underline"
              >
                Zobacz →
              </Link>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
