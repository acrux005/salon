"use client";

import type { VibeMaterialRow } from "@/lib/randki/vibeMaterialTypes";
import { getVibeMaterialKindConfig, kindLabel } from "@/lib/randki/vibeMaterialSlots";

type Props = {
  materials: VibeMaterialRow[];
  compact?: boolean;
  discovery?: boolean;
  /** Elegancka karta klimatu na profilu */
  moodCard?: boolean;
};

function platformLabel(platform: VibeMaterialRow["platform"]): string {
  if (platform === "youtube") return "YouTube";
  if (platform === "spotify") return "Spotify";
  if (platform === "tmdb") return "Film";
  if (platform === "text") return "Cytat";
  return "Link";
}

function MaterialCard({
  item,
  compact,
  discovery,
  moodCard,
}: {
  item: VibeMaterialRow;
  compact?: boolean;
  discovery?: boolean;
  moodCard?: boolean;
}) {
  const cfg = getVibeMaterialKindConfig(item.slotType);
  const header = cfg ? `${cfg.emoji} ${cfg.label}` : kindLabel(item.slotType);
  const titleLine = item.title || null;

  if (moodCard || discovery) {
    return (
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-black/20 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">{header}</p>
        {titleLine && <p className="mt-2 text-[15px] font-medium leading-snug text-white">{titleLine}</p>}
        {item.caption && (
          <p className="mt-2 text-[13px] italic leading-relaxed text-white/70">&ldquo;{item.caption}&rdquo;</p>
        )}

        {item.platform === "text" && !titleLine && (
          <blockquote className="mt-2 border-l-2 border-violet-400/60 pl-3 text-[14px] text-white/90">{item.title}</blockquote>
        )}

        {item.thumbnailUrl && (item.platform === "tmdb" || item.platform === "link" || (!item.embedUrl && (item.platform === "spotify" || item.platform === "youtube"))) && (
          <div className="mt-3 flex items-start gap-3">
            <img src={item.thumbnailUrl} alt="" className="h-16 w-12 shrink-0 rounded-md object-cover shadow-lg" />
            <span className="pt-1 text-[11px] text-white/45">{platformLabel(item.platform)}</span>
          </div>
        )}

        {item.embedUrl && (item.platform === "youtube" || item.platform === "spotify") && !discovery && (
          <div className="mt-3 overflow-hidden rounded-lg bg-black/30">
            <iframe
              src={item.embedUrl}
              title={item.title}
              className={item.platform === "spotify" ? "h-[80px] w-full" : "aspect-video w-full max-h-[120px]"}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {discovery && item.embedUrl && (item.platform === "spotify" || item.platform === "youtube") && (
          <div className="mt-2 overflow-hidden rounded-lg bg-black/30">
            <iframe
              src={item.embedUrl}
              title={item.title}
              className={item.platform === "spotify" ? "h-[72px] w-full" : "aspect-video w-full max-h-[120px]"}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {item.url && (item.platform === "link" || item.platform === "tmdb") && cfg?.kind === "book" && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[11px] text-violet-300/80 underline">
            Goodreads / link
          </a>
        )}

        {item.url && item.platform === "tmdb" && cfg?.kind !== "book" && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[11px] text-violet-300/80 underline">
            TMDB
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-300">
        {header}
        {!compact && titleLine ? ` · ${item.title}` : ""}
      </p>
      {compact && titleLine && <p className="mt-1 text-[13px] font-medium text-white">{item.title}</p>}
      {item.caption && <p className="mt-1 text-[13px] italic text-white/75">&ldquo;{item.caption}&rdquo;</p>}

      {item.platform === "text" && (
        <blockquote className="mt-2 border-l-2 border-violet-400/60 pl-3 text-[14px] text-white/90">{item.title}</blockquote>
      )}

      {item.embedUrl && (item.platform === "youtube" || item.platform === "spotify") && (
        <div className="mt-3 overflow-hidden rounded-lg bg-black/30">
          <iframe
            src={item.embedUrl}
            title={item.title}
            className={item.platform === "spotify" ? "h-[152px] w-full" : "aspect-video w-full"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {item.thumbnailUrl && item.platform === "tmdb" && (
        <img src={item.thumbnailUrl} alt="" className="mt-3 h-32 w-auto rounded-lg object-cover" />
      )}

      {item.platform === "link" && item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-3 rounded-lg bg-black/20 p-2 transition hover:bg-black/30"
        >
          {item.thumbnailUrl && (
            <img src={item.thumbnailUrl} alt="" className="h-14 w-14 shrink-0 rounded-md object-cover" />
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium text-white">{item.title}</span>
            <span className="block truncate text-[11px] text-white/50">{item.url.replace(/^https?:\/\//, "")}</span>
          </span>
        </a>
      )}
    </div>
  );
}

export function RandkiVibeMaterialDisplay({ materials, compact, discovery, moodCard }: Props) {
  if (materials.length === 0) return null;

  return (
    <div className={compact ? "space-y-2.5" : "space-y-4"}>
      {materials.map((item) => (
        <MaterialCard key={item.id} item={item} compact={compact} discovery={discovery} moodCard={moodCard} />
      ))}
    </div>
  );
}

export function RandkiVibeMaterialDiscovery({ materials }: { materials: VibeMaterialRow[] }) {
  if (materials.length === 0) return null;

  return (
    <div className="border-b border-white/10 bg-gradient-to-b from-violet-500/10 to-transparent px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-wider text-violet-200/80">Klimat</p>
      <div className="mt-2 space-y-2">
        <RandkiVibeMaterialDisplay materials={materials.slice(0, 3)} discovery moodCard />
      </div>
    </div>
  );
}
