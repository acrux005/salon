"use client";

import { useEffect, useRef } from "react";
import type { LiveFeedItem } from "@/lib/randki/liveFeed";

const TONE_BORDER: Record<LiveFeedItem["tone"], string> = {
  rose: "border-rose-500/15 bg-rose-500/[0.04]",
  violet: "border-violet-500/20 bg-violet-500/[0.06]",
  amber: "border-amber-500/15 bg-amber-500/[0.04]",
  emerald: "border-emerald-500/15 bg-emerald-500/[0.04]",
};

function FeedRow({ item }: { item: LiveFeedItem }) {
  return (
    <li className={`randki-live-feed-row flex items-start gap-2 rounded-lg border px-2 py-1.5 ${TONE_BORDER[item.tone]}`}>
      <span className="shrink-0 text-[11px] leading-none">{item.emoji}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] leading-tight text-white/80">{item.text}</p>
        <p className="text-[9px] text-white/30">{item.ago}</p>
      </div>
    </li>
  );
}

export function RandkiLiveFeedTicker({
  items,
  compact = false,
  fill = false,
}: {
  items: LiveFeedItem[];
  compact?: boolean;
  fill?: boolean;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const doubled = items.length > 0 ? [...items, ...items] : items;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let y = 0;
    const speed = compact ? 0.22 : 0.18;
    const step = () => {
      y += speed;
      const half = track.scrollHeight / 2;
      if (half > 0 && y >= half) y = 0;
      track.style.transform = `translate3d(0, -${y}px, 0)`;
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [items, compact, fill]);

  if (items.length === 0) return null;

  return (
    <div
      className={`randki-live-feed-ticker relative overflow-hidden ${
        fill ? "min-h-[140px] flex-1" : compact ? "h-[108px]" : "h-[128px]"
      }`}
      aria-live="polite"
    >
      <ul ref={trackRef} className="randki-live-feed-ticker-track space-y-1.5 will-change-transform">
        {doubled.map((item, idx) => (
          <FeedRow key={`${item.id}-${idx}`} item={item} />
        ))}
      </ul>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-[rgba(12,8,20,0.95)] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-[rgba(12,8,20,0.95)] to-transparent" />
    </div>
  );
}
