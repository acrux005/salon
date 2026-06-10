"use client";

import { useRef, useState, useTransition } from "react";
import type { ClinicAboutSectionConfig } from "@/lib/skinmatch/schema";
import {
  updateClinicAboutSectionAction,
  uploadClinicAboutImageAction,
} from "@/app/actions/clinic";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80";
const DEFAULT_PARAGRAPHS = [
  "Kosmetolog z wieloletnim doświadczeniem w kosmetologii estetycznej.",
  "Pracuję na certyfikowanych preparatach i sprawdzonych protokołach. Pierwsza wizyta to konsultacja — diagnoza i plan terapii, bez zobowiązań.",
  "Specjalizuję się w trądziku, anti-aging i przebarwieniach. Efekty są realne po serii zabiegów, bez obietnic cudów.",
];

function normalizeParagraphs(paragraphs?: string[]): string[] {
  const out = Array.isArray(paragraphs) ? paragraphs.slice(0, 3) : [];
  while (out.length < 3) out.push(DEFAULT_PARAGRAPHS[out.length]);
  return out;
}

export function AboutSectionForm({
  initial,
}: {
  initial?: ClinicAboutSectionConfig;
}) {
  const [saving, startTransition] = useTransition();
  const [uploading, startUploadTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    enabled: initial?.enabled !== false,
    title: initial?.title ?? "O mnie",
    imageAlt: initial?.imageAlt ?? "Specjalista kosmetologii estetycznej",
    imageUrl: initial?.imageUrl ?? "",
    paragraphs: normalizeParagraphs(initial?.paragraphs),
  });

  const imageSrc = form.imageUrl
    ? (form.imageUrl.startsWith("http") ? form.imageUrl : `${BASE_PATH}${form.imageUrl}`)
    : DEFAULT_IMAGE;

  const setParagraph = (idx: number, value: string) => {
    setForm((prev) => {
      const paragraphs = [...prev.paragraphs];
      paragraphs[idx] = value;
      return { ...prev, paragraphs };
    });
    setMessage(null);
  };

  const save = () => {
    startTransition(async () => {
      const result = await updateClinicAboutSectionAction({
        enabled: form.enabled,
        title: form.title.trim(),
        imageAlt: form.imageAlt.trim(),
        paragraphs: form.paragraphs.map((p) => p.trim()),
      });
      if (result.ok) {
        setMessage({ type: "ok", text: "Zapisano sekcję „O mnie”." });
      } else {
        setMessage({ type: "err", text: result.error });
      }
    });
  };

  const uploadImage = () => {
    const input = imageInputRef.current;
    if (!input?.files?.length) {
      setMessage({ type: "err", text: "Wybierz zdjęcie (JPG, PNG lub WebP)." });
      return;
    }
    startUploadTransition(async () => {
      const fd = new FormData();
      fd.set("aboutImage", input.files![0]);
      const result = await uploadClinicAboutImageAction(fd);
      if (result.ok) {
        setForm((prev) => ({ ...prev, imageUrl: result.imageUrl }));
        setMessage({ type: "ok", text: "Zdjęcie sekcji „O mnie” zapisane." });
        input.value = "";
      } else {
        setMessage({ type: "err", text: result.error });
      }
    });
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
      <h2 className="font-[var(--font-serif)] text-lg font-normal text-[#1F1A1C]">Sekcja „O mnie”</h2>
      <p className="mt-1 text-[14px] text-[#6F5E64]">
        Tu edytujesz teksty i zdjęcie, które pojawiają się na publicznym profilu gabinetu.
      </p>

      <label className="mt-4 flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={form.enabled}
          onChange={(e) => setForm((p) => ({ ...p, enabled: e.target.checked }))}
          className="rounded border-neutral-300 text-pink-500 focus:ring-pink-500"
        />
        <span className="text-[14px] text-[#1F1A1C]">Pokaż sekcję „O mnie” na stronie gabinetu</span>
      </label>

      <div className="mt-4 grid gap-3">
        <div>
          <label className="block text-[13px] font-medium text-[#1F1A1C]">Tytuł sekcji</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-[14px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#1F1A1C]">Alt zdjęcia</label>
          <input
            type="text"
            value={form.imageAlt}
            onChange={(e) => setForm((p) => ({ ...p, imageAlt: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-[14px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[13px] font-medium text-[#1F1A1C]">Zdjęcie sekcji</p>
        <div className="mt-2 flex flex-wrap items-end gap-4">
          <div className="h-32 w-24 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
            <img src={imageSrc} alt={form.imageAlt} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="text-[14px] text-[#6F5E64]"
            />
            <button
              type="button"
              onClick={uploadImage}
              disabled={uploading}
              className="w-fit rounded-full bg-neutral-100 px-4 py-2 text-[14px] font-medium text-[#1F1A1C] hover:bg-neutral-200 disabled:opacity-60"
            >
              {uploading ? "Wgrywanie…" : "Wgraj zdjęcie"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {form.paragraphs.map((paragraph, idx) => (
          <div key={idx}>
            <label className="block text-[13px] font-medium text-[#1F1A1C]">Akapit {idx + 1}</label>
            <textarea
              rows={3}
              value={paragraph}
              onChange={(e) => setParagraph(idx, e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-[14px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>
        ))}
      </div>

      {message && (
        <p className={`mt-4 text-[14px] ${message.type === "ok" ? "text-green-700" : "text-red-600"}`}>
          {message.text}
        </p>
      )}

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-4 rounded-lg bg-[#1F1A1C] px-4 py-2 text-[14px] font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
      >
        {saving ? "Zapisywanie…" : "Zapisz sekcję O mnie"}
      </button>
    </div>
  );
}
