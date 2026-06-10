"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { getUnreadMessagesCountAction } from "@/app/actions/messages";

type Props = {
  messagesHref: string;
};

export function MessagesBell({ messagesHref }: Props) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    getUnreadMessagesCountAction().then(setUnread).catch(() => {});
    // Odśwież co 60 sekund
    const id = setInterval(() => {
      getUnreadMessagesCountAction().then(setUnread).catch(() => {});
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <Link
      href={messagesHref}
      className="relative rounded-full p-2 text-[#6F5E64] transition-colors hover:bg-neutral-100 hover:text-[#1F1A1C]"
      aria-label="Wiadomości"
      title="Wiadomości"
    >
      <Mail className="h-5 w-5" />
      {unread > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-medium text-white">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </Link>
  );
}
