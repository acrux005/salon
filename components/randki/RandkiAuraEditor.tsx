"use client";

import { useRef, useState, useTransition } from "react";
import { deleteDatingAuraAction, saveDatingAuraAction } from "@/app/actions/randki";
import { RandkiAuraDisplay } from "@/components/randki/RandkiAuraDisplay";
import { AURA_PLANES, AURA_RULES_HINT, hasAnyAuraPlaneImage, normalizeAuraPlaneImages } from "@/lib/randki/auraSilhouettes";
import { prepareImageForUpload } from "@/lib/randki/prepareClientImage";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type AuraState = {
  imageUrls: [string | null, string | null, string | null];
  caption: string;
  prompt: string;
};

type Props = {
  gender: string;
  initialImageUrl: string | null;
  initialImageUrl2?: string | null;
  initialImageUrl3?: string | null;
  initialCaption: string;
  initialPrompt: string;
  onChange?: (data: AuraState & { imageUrl: string | null }) => void;
};

export function RandkiAuraEditor({
  gender,
  initialImageUrl,
  initialImageUrl2 = null,
  initialImageUrl3 = null,
  initialCaption,
  initialPrompt,
  onChange,
}: Props) {
  const fileRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const [imageUrls, setImageUrls] = useState(normalizeAuraPlaneImages(initialImageUrl, initialImageUrl2, initialImageUrl3));
  const [caption, setCaption] = useState(initialCaption);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function resolveUrl(url: string | null) {
    if (!url) return "";
    return url.startsWith("http") ? url : `${BASE_PATH}${url}`;
  }

  function notify(urls: [string | null, string | null, string | null], cap: string, pr: string) {
    onChange?.({ imageUrls: urls, imageUrl: urls.find(Boolean) ?? null, caption: cap, prompt: pr });
  }

  function save() {
    start(async () => {
      setError("");
      setMessage("");
      try {
        const fd = new FormData();
        fd.set("caption", caption);
        fd.set("prompt", prompt);
        for (let idx = 0; idx < AURA_PLANES.length; idx++) {
          const file = fileRefs[idx].current?.files?.[0];
          if (file) {
            const prepared = await prepareImageForUpload(file);
            fd.set(`aura_${AURA_PLANES[idx].id}`, prepared);
          }
        }
        const res = await saveDatingAuraAction(fd);
        if (!res.ok) {
          setError(res.error);
          return;
        }
        const next = normalizeAuraPlaneImages(res.imageUrl, res.imageUrl2, res.imageUrl3);
        setImageUrls(next);
        setMessage("Aura zapisana.");
        notify(next, caption, prompt);
        fileRefs.forEach((ref) => {
          if (ref.current) ref.current.value = "";
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Nie udało się przygotować zdjęcia.");
      }
    });
  }

  function remove() {
    if (!confirm("Usunąć aurę — głowę, serce i korzenie?")) return;
    start(async () => {
      setError("");
      const res = await deleteDatingAuraAction();
      if (!res.ok) {
        setError(res.error);
        return;
      }
      const empty: [null, null, null] = [null, null, null];
      setImageUrls(empty);
      setMessage("Aura usunięta.");
      notify(empty, caption, prompt);
    });
  }

  const hasAura = hasAnyAuraPlaneImage(imageUrls);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 text-[12px] leading-relaxed text-amber-100/90">
        {AURA_RULES_HINT}
        <span className="mt-1 block text-amber-200/60">
          Jeden obraz albo trzy — każdy inny nastrój.
        </span>
      </div>

      {hasAura && (
        <RandkiAuraDisplay
          imageUrls={imageUrls}
          caption={caption}
          gender={gender}
          resolveUrl={resolveUrl}
          showHint={false}
          legacyFill={false}
        />
      )}

      <div>
        <label className="text-[13px] font-medium text-white/80">Podpis pod aurą</label>
        <input
          className="randki-input mt-1"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="np. góry we mnie, spokój po burzy"
          maxLength={200}
        />
      </div>

      <div>
        <label className="text-[13px] font-medium text-white/80">
          Notatka <span className="font-normal text-white/40">(opcjonalnie)</span>
        </label>
        <textarea
          className="randki-input mt-1"
          rows={2}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Jedno zdanie — np. nocne miasto po deszczu"
          maxLength={320}
        />
      </div>

      <div className="space-y-3">
        <p className="text-[13px] font-medium text-white/80">Głowa · serce · korzenie</p>
        {AURA_PLANES.map((plane, idx) => (
          <div key={plane.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[12px] font-semibold text-teal-200/90">{plane.label}</p>
            <p className="mt-0.5 text-[11px] text-white/45">{plane.hint}</p>
            {imageUrls[idx] && (
              <p className="mt-1 text-[11px] text-emerald-400/80">✓ wgrane — wybierz plik, żeby podmienić</p>
            )}
            <input
              ref={fileRefs[idx]}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
              capture="environment"
              className="mt-2 w-full text-[13px]"
            />
          </div>
        ))}
        <p className="text-[11px] text-white/40">Z aparatu lub galerii — HEIC z iPhone też OK.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={pending} onClick={save} className="randki-btn-primary text-[13px]">
          {pending ? "Zapisywanie…" : hasAura ? "Zapisz aurę" : "Wgraj aurę"}
        </button>
        {hasAura && (
          <button type="button" disabled={pending} onClick={remove} className="randki-btn-outline text-[13px]">
            Usuń wszystko
          </button>
        )}
      </div>

      {message && <p className="text-[13px] text-green-400">{message}</p>}
      {error && <p className="text-[13px] text-red-400">{error}</p>}
    </div>
  );
}
