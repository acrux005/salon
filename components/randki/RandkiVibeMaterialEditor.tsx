"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { addVibeMaterialAction, deleteVibeMaterialAction, pickSpotifySearchAction, pickTmdbSearchAction, pickVibeCatalogAction, pickYoutubeSearchAction } from "@/app/actions/randki";
import type { VibeMaterialKind, VibeMaterialRow } from "@/lib/randki/vibeMaterialTypes";
import { MAX_VIBE_MATERIALS, VIBE_MATERIAL_KINDS } from "@/lib/randki/vibeMaterialTypes";
import type { VibeCatalogRow } from "@/lib/randki/vibeCatalogTypes";
import type { SpotifySearchHit } from "@/lib/randki/spotifySearch";
import type { TmdbSearchHit } from "@/lib/randki/tmdbSearch";
import type { YoutubeSearchHit } from "@/lib/randki/youtubeSearch";
import { VIBE_MATERIAL_KIND_CONFIG, getVibeMaterialKindConfig, normalizeVibeMaterialKind, filterCatalogForKind } from "@/lib/randki/vibeMaterialSlots";
import { RandkiVibeMaterialDisplay } from "@/components/randki/RandkiVibeMaterialDisplay";
import { RandkiVibeCatalogPicker } from "@/components/randki/RandkiVibeCatalogPicker";
import { RandkiSpotifySearchPicker } from "@/components/randki/RandkiSpotifySearchPicker";
import { RandkiTmdbSearchPicker } from "@/components/randki/RandkiTmdbSearchPicker";
import { RandkiYoutubeSearchPicker } from "@/components/randki/RandkiYoutubeSearchPicker";
import { RandkiVibeCaptionHelper } from "@/components/randki/RandkiVibeCaptionHelper";

type SourceTab = "search" | "tmdb-search" | "youtube-search" | "catalog" | "link" | "text";

type Props = {
  initialMaterials: VibeMaterialRow[];
  catalog: VibeCatalogRow[];
  userMood: string | null;
  onMaterialsChange?: (materials: VibeMaterialRow[]) => void;
};

type AddStep = "kind" | "source" | "form";

function MoodCardForm({
  kind,
  catalog,
  userMood,
  materialId,
  onSaved,
  onCancel,
}: {
  kind: VibeMaterialKind;
  catalog: VibeCatalogRow[];
  userMood: string | null;
  materialId?: string;
  onSaved: (row: VibeMaterialRow) => void;
  onCancel: () => void;
}) {
  const cfg = getVibeMaterialKindConfig(kind)!;
  const filteredCatalog = useMemo(() => filterCatalogForKind(catalog, kind), [catalog, kind]);
  const hasCatalog = filteredCatalog.length > 0 && cfg.catalog !== null;

  const supportsSpotifySearch = kind === "music";
  const supportsTmdbSearch = kind === "film";
  const supportsYoutubeSearch = kind === "youtube";
  const [source, setSource] = useState<SourceTab>(
    kind === "book"
      ? "text"
      : supportsSpotifySearch
        ? "search"
        : supportsTmdbSearch
          ? "tmdb-search"
          : supportsYoutubeSearch
            ? "youtube-search"
            : hasCatalog
              ? "catalog"
              : cfg.allowsQuote && !cfg.allowsLink
                ? "text"
                : "link"
  );
  const [catalogId, setCatalogId] = useState<string | null>(null);
  const [spotifyHit, setSpotifyHit] = useState<SpotifySearchHit | null>(null);
  const [tmdbHit, setTmdbHit] = useState<TmdbSearchHit | null>(null);
  const [youtubeHit, setYoutubeHit] = useState<YoutubeSearchHit | null>(null);
  const [url, setUrl] = useState("");
  const [textQuote, setTextQuote] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const isMoodOnly = kind === "mood";
  const isQuoteKind = kind === "quote";

  function save() {
    startTransition(async () => {
      setError("");
      const finalCaption = isMoodOnly ? textQuote : caption;

      if (source === "search") {
        if (!spotifyHit) {
          setError("Wybierz wynik wyszukiwania Spotify.");
          return;
        }
        const res = await pickSpotifySearchAction(kind, spotifyHit, finalCaption, materialId);
        if (res.ok) onSaved(res.material);
        else setError(res.error);
        return;
      }

      if (source === "tmdb-search") {
        if (!tmdbHit) {
          setError("Wybierz film z wyników TMDB.");
          return;
        }
        const res = await pickTmdbSearchAction(kind, tmdbHit, finalCaption, materialId);
        if (res.ok) onSaved(res.material);
        else setError(res.error);
        return;
      }

      if (source === "youtube-search") {
        if (!youtubeHit) {
          setError("Wybierz wideo z YouTube.");
          return;
        }
        const res = await pickYoutubeSearchAction(kind, youtubeHit, finalCaption, materialId);
        if (res.ok) onSaved(res.material);
        else setError(res.error);
        return;
      }

      if (source === "catalog") {
        if (!catalogId) {
          setError("Wybierz coś z katalogu.");
          return;
        }
        const res = await pickVibeCatalogAction(kind, catalogId, finalCaption, materialId);
        if (res.ok) onSaved(res.material);
        else setError(res.error);
        return;
      }

      const fd = new FormData();
      fd.set("kind", kind);
      if (materialId) fd.set("materialId", materialId);
      if (kind === "book") {
        fd.set("textQuote", textQuote);
        if (url.trim()) fd.set("url", url);
      } else if (source === "link") fd.set("url", url);
      else fd.set("textQuote", textQuote);
      fd.set("caption", isMoodOnly ? "" : caption);
      const res = await addVibeMaterialAction(fd);
      if (res.ok) onSaved(res.material);
      else setError(res.error);
    });
  }

  return (
    <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 p-4">
      <p className="font-medium text-white">
        {cfg.emoji} {cfg.label}
      </p>
      <p className="mt-0.5 text-[12px] text-white/45">{cfg.hint}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {supportsSpotifySearch && (
          <button
            type="button"
            onClick={() => setSource("search")}
            className={`rounded-full px-3 py-1 text-[12px] ${source === "search" ? "bg-violet-500 text-white" : "bg-white/10 text-white/70"}`}
          >
            Szukaj Spotify
          </button>
        )}
        {supportsTmdbSearch && (
          <button
            type="button"
            onClick={() => setSource("tmdb-search")}
            className={`rounded-full px-3 py-1 text-[12px] ${source === "tmdb-search" ? "bg-violet-500 text-white" : "bg-white/10 text-white/70"}`}
          >
            Szukaj TMDB
          </button>
        )}
        {supportsYoutubeSearch && (
          <button
            type="button"
            onClick={() => setSource("youtube-search")}
            className={`rounded-full px-3 py-1 text-[12px] ${source === "youtube-search" ? "bg-violet-500 text-white" : "bg-white/10 text-white/70"}`}
          >
            Szukaj YouTube
          </button>
        )}
        {hasCatalog && (
          <button
            type="button"
            onClick={() => setSource("catalog")}
            className={`rounded-full px-3 py-1 text-[12px] ${source === "catalog" ? "bg-violet-500 text-white" : "bg-white/10 text-white/70"}`}
          >
            Propozycje
          </button>
        )}
        {cfg.allowsLink && kind !== "book" && (
          <button
            type="button"
            onClick={() => setSource("link")}
            className={`rounded-full px-3 py-1 text-[12px] ${source === "link" ? "bg-violet-500 text-white" : "bg-white/10 text-white/70"}`}
          >
            Link
          </button>
        )}
        {cfg.allowsQuote && (
          <button
            type="button"
            onClick={() => setSource("text")}
            className={`rounded-full px-3 py-1 text-[12px] ${source === "text" || kind === "book" ? "bg-violet-500 text-white" : "bg-white/10 text-white/70"}`}
          >
            {kind === "book" ? "Tytuł" : kind === "quote" ? "Cytat" : "Tekst"}
          </button>
        )}
      </div>

      <div className="mt-3 space-y-3">
        {source === "search" && (
          <RandkiSpotifySearchPicker
            selected={spotifyHit}
            onSelect={setSpotifyHit}
            defaultSearchType="track"
          />
        )}
        {source === "tmdb-search" && <RandkiTmdbSearchPicker selected={tmdbHit} onSelect={setTmdbHit} />}
        {source === "youtube-search" && <RandkiYoutubeSearchPicker selected={youtubeHit} onSelect={setYoutubeHit} />}
        {source === "catalog" && (
          <RandkiVibeCatalogPicker
            catalog={filteredCatalog}
            userMood={userMood}
            selectedId={catalogId}
            onSelect={setCatalogId}
          />
        )}
        {source === "link" && kind !== "book" && (
          <input
            className="randki-input w-full"
            placeholder={cfg.urlPlaceholder}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        )}
        {(source === "text" && isQuoteKind) && (
          <RandkiVibeCaptionHelper
            kind={kind}
            field="quote"
            value={textQuote}
            onChange={setTextQuote}
          />
        )}
        {kind === "book" && (
          <>
            <input
              className="randki-input w-full"
              placeholder="np. Mały Książę — Saint-Exupéry"
              value={textQuote}
              onChange={(e) => setTextQuote(e.target.value)}
            />
            <input
              className="randki-input w-full"
              placeholder={cfg.urlPlaceholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </>
        )}
        {isMoodOnly && (
          <RandkiVibeCaptionHelper
            kind={kind}
            field="fragment"
            value={textQuote}
            onChange={setTextQuote}
          />
        )}
        {!isMoodOnly && !isQuoteKind && (
          <RandkiVibeCaptionHelper
            kind={kind}
            field="caption"
            value={caption}
            onChange={setCaption}
          />
        )}
        {isQuoteKind && (
          <div>
            <p className="text-[12px] text-white/50">Opcjonalnie — jedno zdanie kontekstu</p>
            <textarea
              className="randki-input mt-1 w-full"
              rows={2}
              placeholder="np. wracam do tego po trudnym dniu"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <button type="button" disabled={pending} onClick={save} className="randki-btn-primary text-[13px]">
          {pending ? "Zapisywanie…" : "Zapisz klimat"}
        </button>
        <button type="button" onClick={onCancel} className="text-[12px] text-white/50 underline">
          Anuluj
        </button>
      </div>
      {error && <p className="mt-2 text-[12px] text-rose-300">{error}</p>}
    </div>
  );
}

export function RandkiVibeMaterialEditor({ initialMaterials, catalog, userMood, onMaterialsChange }: Props) {
  const [materials, setMaterials] = useState(initialMaterials);
  const [message, setMessage] = useState("");
  const [addStep, setAddStep] = useState<AddStep | null>(null);
  const [selectedKind, setSelectedKind] = useState<VibeMaterialKind | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const usedKinds = useMemo(
    () => new Set(materials.map((m) => normalizeVibeMaterialKind(m.slotType)).filter(Boolean) as VibeMaterialKind[]),
    [materials]
  );
  const availableKinds = VIBE_MATERIAL_KINDS.filter((k) => !usedKinds.has(k));
  const canAdd = materials.length < MAX_VIBE_MATERIALS && availableKinds.length > 0;

  useEffect(() => {
    onMaterialsChange?.(materials);
  }, [materials, onMaterialsChange]);

  function handleSaved(row: VibeMaterialRow) {
    setMaterials((prev) => {
      const next = prev.filter((m) => m.id !== row.id && m.slotType !== row.slotType);
      next.push(row);
      return next.sort((a, b) => a.sortOrder - b.sortOrder);
    });
    setMessage("Zapisano.");
    setAddStep(null);
    setSelectedKind(null);
    setEditingId(null);
  }

  function remove(id: string) {
    startTransition(async () => {
      const res = await deleteVibeMaterialAction(id);
      if (res.ok) {
        setMaterials((prev) => prev.filter((m) => m.id !== id));
        setMessage("Usunięto.");
      }
    });
  }

  const editingMaterial = editingId ? materials.find((m) => m.id === editingId) : null;

  return (
    <section className="p-0">
      <h2 className="sr-only">Klimat</h2>

      {materials.length > 0 && (
        <div className="mt-4 space-y-3">
          {materials.map((item) =>
            editingId === item.id ? (
              <MoodCardForm
                key={item.id}
                kind={item.slotType as VibeMaterialKind}
                catalog={catalog}
                userMood={userMood}
                materialId={item.id}
                onSaved={handleSaved}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div key={item.id} className="group relative">
                <RandkiVibeMaterialDisplay materials={[item]} compact moodCard />
                <div className="mt-2 flex gap-3">
                  <button type="button" onClick={() => setEditingId(item.id)} className="text-[11px] text-violet-300 underline">
                    Edytuj
                  </button>
                  <button type="button" disabled={pending} onClick={() => remove(item.id)} className="text-[11px] text-rose-400 underline">
                    Usuń
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {canAdd && !editingId && (
        <div className="mt-4">
          {!addStep && (
            <button
              type="button"
              onClick={() => setAddStep("kind")}
              className="randki-btn-outline w-full border-dashed text-[14px]"
            >
              + Dodaj klimat
            </button>
          )}

          {addStep === "kind" && (
            <div className="space-y-2">
              <p className="text-[12px] text-white/55">Wybierz, co chcesz dodać:</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {availableKinds.map((kind) => {
                  const cfg = VIBE_MATERIAL_KIND_CONFIG.find((c) => c.kind === kind)!;
                  return (
                    <button
                      key={kind}
                      type="button"
                      onClick={() => {
                        setSelectedKind(kind);
                        setAddStep("form");
                      }}
                      className="rounded-xl border border-white/10 bg-black/20 p-3 text-left transition hover:border-violet-400/40 hover:bg-violet-500/10"
                    >
                      <span className="text-lg">{cfg.emoji}</span>
                      <p className="mt-1 text-[13px] font-medium text-white">{cfg.label}</p>
                      <p className="mt-0.5 text-[10px] text-white/40 line-clamp-2">{cfg.hint}</p>
                    </button>
                  );
                })}
              </div>
              <button type="button" onClick={() => setAddStep(null)} className="text-[12px] text-white/50 underline">
                Anuluj
              </button>
            </div>
          )}

          {addStep === "form" && selectedKind && (
            <MoodCardForm
              kind={selectedKind}
              catalog={catalog}
              userMood={userMood}
              onSaved={handleSaved}
              onCancel={() => {
                setAddStep(null);
                setSelectedKind(null);
              }}
            />
          )}
        </div>
      )}

      {materials.length === 0 && !addStep && (
        <p className="mt-4 text-[13px] text-white/40">
          Dodaj jeden moment który dziś jest Tobą — piosenka, film, ułamek wspomnienia. Jedno zdanie wystarczy.
        </p>
      )}

      {message && <p className="mt-3 text-[13px] text-emerald-300">{message}</p>}
    </section>
  );
}
